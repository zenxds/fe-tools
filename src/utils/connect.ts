import net from 'net'
import url from 'url'
import { exec } from 'child_process'
import axios from 'axios'

import { parseLines } from './parse'
import { setProxy } from './electron'

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

export async function testProxy(
  server: Server,
  proxy: string,
): Promise<TestResult> {
  await setProxy(proxy)

  const start = Date.now()
  const ret: TestResult = {
    hostname: server.hostname,
    port: server.port,
  }

  try {
    await axios.get(server.url, {
      timeout: TEST_TIMEOUT,
    })
    ret.time = Date.now() - start
  } catch (err) {
    ret.error = `${err.message}`
  }

  await setProxy('')
  return ret
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
