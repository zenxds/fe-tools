const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 1000, height: 600 });

    // and load the index.html of the app.
    win.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    // win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

function createMenu() {
    const template = [{
        label: 'Edit',
        submenu: [{
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
        }, {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
        }, {
            type: 'separator'
        }, {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        }, {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        }, {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        }, {
            label: 'Delete',
            role: 'delete'
        }, {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
        }]
    }, {
        label: 'View',
        submenu: [{
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click(item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.reload();
                }
            }
        }, {
            label: 'Toggle Full Screen',
            accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
            click(item, focusedWindow) {
                if (focusedWindow)
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
        }, {
            label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click(item, focusedWindow) {
                if (focusedWindow)
                    focusedWindow.webContents.toggleDevTools();
            }
        }]
    }, {
        label: 'Window',
        role: 'window',
        submenu: [{
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }]
    }];

    if (process.platform === 'darwin') {
        let name = app.getName();
        template.unshift({
            label: name,
            submenu: [{
                label: 'About ' + name,
                role: 'about'
            }, {
                type: 'separator'
            }, {
                label: 'Services',
                role: 'services',
                submenu: []
            }, {
                type: 'separator'
            }, {
                label: 'Hide ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            }, {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            }, {
                label: 'Show All',
                role: 'unhide'
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() { app.quit(); }
            }]
        });
        // Window menu.
        template[3].submenu = [{
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }, {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: 'Zoom',
            role: 'zoom'
        }, {
            type: 'separator'
        }, {
            label: 'Bring All to Front',
            role: 'front'
        }];
    }

    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    createWindow()
    createMenu()
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
