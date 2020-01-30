import { app, BrowserWindow, Menu, MenuItem, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

let browserWindow: BrowserWindow, shouldServe: boolean, isMac: boolean;
const args = process.argv.slice(1);
shouldServe = args.some(val => val === '--serve');
isMac = process.platform === 'darwin';

const template: MenuItem[] = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        new MenuItem({
          label: app.getName(),
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        })
      ]
    : []),
  // { role: 'fileMenu' }
  new MenuItem({
    label: 'File',
    submenu: [
      { label: 'New...', accelerator: 'CmdOrCtrl+N' },
      { label: 'Open...', accelerator: 'CmdOrCtrl+O' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }),
  // { role: 'editMenu' }
  new MenuItem({
    label: 'Edit',
    submenu: Menu.buildFromTemplate([
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      // ...(isMac
      //   ? [
      //       { role: 'pasteAndMatchStyle' },
      //       { role: 'delete' },
      //       { role: 'selectAll' },
      //       { type: 'separator' },
      //       {
      //         label: 'Speech',
      //         submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
      //       }
      //     ]
      //   : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
    ])
  }),
  // { role: 'viewMenu' }
  new MenuItem({
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }),
  // { role: 'windowMenu' }
  new MenuItem({
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      // ...(isMac
      //   ? [
      //       { type: 'separator' },
      //       { role: 'front' },
      //       { type: 'separator' },
      //       { role: 'window' }
      //     ]
      //   : [{ role: 'close' }])
    ]
  }),
  // Menu.buildFromTemplate([{
  //   role: 'help',
  //   submenu: [
  //     {
  //       label: 'Learn More',
  //       click: async () => {
  //         const { shell } = require('electron');
  //         await shell.openExternal('https://electronjs.org');
  //       }
  //     }
  //   ]
  // }])
];

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  browserWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (shouldServe) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    browserWindow.loadURL('http://localhost:4200');
  } else {
    browserWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  if (shouldServe) {
    browserWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  browserWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    browserWindow = null;
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (!isMac) {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (browserWindow === null) {
      createWindow();
    }
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
} catch (e) {
  // Catch Error
  // throw e;
}
