const { autoUpdater } = require('electron-updater')
const { app, BrowserWindow, ipcMain } = require('electron')
const debug = require('debug')('electron')

const config = require('./package.json').autoUpdater || {}

if (process.env.ELECTRON_ENV === 'development' && config.enable) {
  autoUpdater.autoDownload = false
  autoUpdater.setFeedURL(config.feedUrl)

  autoUpdater.on('error', function (error) {
    sendUpdateMessage('error', error)
  })

  // message: UpdateInfo
  autoUpdater.on('update-available', function (message) {
    sendUpdateMessage('available', message)
  })

  autoUpdater.on('download-progress', function (message) {
    sendUpdateMessage('progress', message)
  })

  autoUpdater.on(
    'update-downloaded',
    function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
      sendUpdateMessage('downloaded', {
        releaseNotes,
        releaseName,
        releaseDate,
        updateUrl,
      })
    },
  )

  ipcMain.on('downloadUpdate', () => {
    autoUpdater.downloadUpdate()
  })

  ipcMain.on('updateNow', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('checkForUpdate', () => {
    autoUpdater.checkForUpdates()
  })

  app.whenReady().then(() => {
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 2000)
  })
}

function sendUpdateMessage(type, data) {
  debug('%s:%o', type, data)
  const mainWindow = BrowserWindow.getAllWindows()[0]
  if (mainWindow) {
    mainWindow.webContents.send('update:' + type, data)
  }
}
