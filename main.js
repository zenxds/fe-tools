const path = require('path')
// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, ipcMain, dialog } = require('electron')

require('./update')

// 必须保持tray的引用，否则会被垃圾回收
let tray = null

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icons/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadFile('index.html')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function getMainWindow() {
  return BrowserWindow.getAllWindows()[0]
}

function toggleWindow() {
  const mainWindow = getMainWindow()
  if (!mainWindow) {
    return
  }

  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'icons/png/16x16.png'))

  tray.on('click', toggleWindow)
}

async function setProxy(proxy) {
  const mainWindow = getMainWindow()
  if (!mainWindow) {
    return
  }

  await mainWindow.webContents.session.setProxy(proxy ? {
    proxyRules: proxy,
  } : {})
}

app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else {
      toggleWindow()
    }
  })

  ipcMain.on('getPath', (event, arg) => {
    event.returnValue = app.getPath(arg)
  })

  ipcMain.on('showSaveDialog', (event, arg) => {
    event.returnValue = dialog.showSaveDialogSync(arg)
  })

  ipcMain.on('showOpenDialog', (event, arg) => {
    event.returnValue = dialog.showOpenDialogSync(arg)
  })

  ipcMain.on('setProxy', async(event, arg) => {
    await setProxy(arg)
    event.reply('proxyChanged')
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
