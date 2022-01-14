import React from 'react'
import { ipcRenderer } from "electron"
import { UpdateInfo } from 'electron-updater'
import { ProgressInfo } from 'builder-util-runtime'
import { notification, Button } from 'antd'

ipcRenderer.on("update:error", (event, error) => {
  notification.error({
    message: '更新失败',
    description: error.message
  })
})

ipcRenderer.on("update:available", (event, message: UpdateInfo) => {
  const key = `open${Date.now()}`
  const btn = (
    <Button
      type="primary"
      size="small"
      onClick={() => {
        notification.close(key)
        ipcRenderer.send('downloadUpdate')
      }}>
      立即下载
    </Button>
  )

  notification.info({
    message: '版本更新提醒',
    description: `系统检测到了新版本${message.version}，是否下载更新`,
    btn,
    key,
    duration: null,
  })
})


ipcRenderer.on("update:downloaded", (event, message: UpdateInfo) => {
  const key = `open${Date.now()}`
  const btn = (
    <Button
      type="primary"
      size="small"
      onClick={() => {
        notification.close(key)
        ipcRenderer.send('updateNow')
      }}>
      立即更新
    </Button>
  )

  notification.success({
    message: '新版本下载完成',
    description: '是否退出并立即更新',
    btn,
    key,
    duration: null,
  })
})

ipcRenderer.on('update:progress', (event, message: ProgressInfo) => {
  console.log(message.percent)
})
