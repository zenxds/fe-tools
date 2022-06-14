import net from 'net'
import http from 'http'
import https from 'https'
import url from 'url'
import { exec } from 'child_process'
import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

const TEST_TIMEOUT = 3000

type Server = {
  url: string
  hostname: string
  port: number
  dns?: string
}

export interface TestResult {
  hostname: string
  port: number
  time?: number
  error?: string
  proxy?: string
  dns?: string
}

export interface DNSResult {
  dns: string
  hostname: string
  ip: string
  error?: string
}

export function parseLines(input: string): string[] {
  const ret: string[] = []
  input.split('\n').forEach((line: string): void => {
    const val = line.trim()
    if (val) {
      ret.push(val)
    }
  })

  return ret
}

export function parseServer(input: string): Server {
  const match = /(?:\/\/)?([\w\-.]+):(\d+)/.exec(input)

  if (match) {
    return {
      url: input,
      hostname: match[1],
      port: parseInt(match[2], 10),
    }
  }

  const server = url.parse(input)
  const protocol = server.protocol || ''
  const protocolMap: Record<string, number> = {
    'http:': 80,
    'https:': 443,
    'socks:': 1080,
  }

  if (protocolMap[protocol]) {
    return {
      url: input,
      hostname: server.hostname || '',
      port: server.port ? parseInt(server.port) : protocolMap[protocol],
    }
  }

  return {
    url: input,
    hostname: '',
    port: 0,
  }
}

export function parseServers(input: string): Server[] {
  const ret: Server[] = []
  const lines = parseLines(input)

  lines.forEach((line: string): void => {
    const server = parseServer(line)
    if (server.hostname && server.port) {
      ret.push(server)
    }
  })

  return ret
}

export function sortResults(results: TestResult[]): TestResult[] {
  return results.sort((a: TestResult, b: TestResult): number => {
    if (a.time && b.time) {
      return a.time - b.time
    }

    return 0
  })
}

export function formatTime(input?: number): string {
  if (!input) {
    return ''
  }

  return input > 1000 ? `${input / 1000}s` : `${input}ms`
}

export async function testConnect(server: Server): Promise<TestResult> {
  return new Promise(resolve => {
    const start = Date.now()
    const socket = net.connect({
      host: server.hostname,
      port: server.port,
      timeout: TEST_TIMEOUT,
    })
    const ret: TestResult = {
      hostname: server.hostname,
      port: server.port,
    }

    if (server.dns) {
      ret.dns = server.dns
    }

    socket.on('connect', () => {
      ret.time = Date.now() - start
      resolve(ret)
      socket.destroy()
    })

    socket.on('error', err => {
      ret.error = err.message || 'error'
      resolve(ret)
    })

    socket.on('timeout', () => {
      ret.error = 'timeout'
      resolve(ret)
      socket.destroy()
    })
  })
}

function getAgent(proxy: string, target: string): SocksProxyAgent | HttpsProxyAgent | HttpProxyAgent {
  const proxyServer = url.parse(proxy)

  if (/socks/.test(proxy)) {
    return new SocksProxyAgent({
      hostname: proxyServer.hostname,
      port: proxyServer.port,
      timeout: TEST_TIMEOUT,
    })
  }

  if (/https/.test(target)) {
    return new HttpsProxyAgent({
      hostname: proxyServer.hostname,
      port: proxyServer.port,
      timeout: TEST_TIMEOUT,
    })
  }

  return new HttpProxyAgent({
    hostname: proxyServer.hostname,
    port: proxyServer.port,
    timeout: TEST_TIMEOUT,
  })
}

export async function testProxy(
  server: Server,
  proxy: string,
): Promise<TestResult> {
  const agent = getAgent(proxy, server.url)

  return new Promise(resolve => {
    const start = Date.now()
    const ret: TestResult = {
      hostname: server.hostname,
      port: server.port,
    }

    const callback = (res: http.IncomingMessage) => {
      const { statusCode } = res

      if (!statusCode || statusCode >= 400) {
        ret.error = `statusCode: ${statusCode}`
      } else {
        ret.time = Date.now() - start
      }

      resolve(ret)
      res.destroy()
    }

    agent.on('timeout', () => {
      ret.error = 'proxy timeout'
      resolve(ret)
    })

    if (/https/.test(server.url)) {
      https
        .get(
          server.url,
          {
            agent,
          },
          callback,
        )
        .on('error', err => {
          ret.error = err.message || 'error'
          resolve(ret)
        })
    } else {
      http
        .get(
          server.url,
          {
            agent,
          },
          callback,
        )
        .on('error', () => {
          ret.error = 'error'
          resolve(ret)
        })
    }
  })
}

export async function resolveDNS(
  hostname: string,
  dns: string,
): Promise<DNSResult> {
  return new Promise(resolve => {
    exec(`dig @${dns} ${hostname} +short`, (err, stdout, stderr) => {
      if (err) {
        resolve({
          dns,
          hostname,
          ip: '',
          error: stderr,
        })
      } else {
        const ips = stdout
          .split('\n')
          .filter(line => /\d+\.\d+\.\d+\.\d+/.test(line))
        resolve({
          dns,
          hostname,
          ip: ips[0] || '',
        })
      }
    })
  })
}
