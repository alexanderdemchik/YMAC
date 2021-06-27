import 'source-map-support/register';
import { app, BrowserWindow, protocol, session, ipcMain } from 'electron';
import logger from '../common/logger';
import path from 'path';
import { EXTENSIONS_FOLDER, REACT_DEV_TOOLS_FOLDER, REDUX_DEV_TOOLS_FOLDER } from './constants';
import * as db from '../common/database';
import { getUserDataPath } from '../common/utils';

const IS_DEV = process.env.NODE_ENV === 'development';

app.allowRendererProcessReuse = false
const lock = app.requestSingleInstanceLock()

// allow only one instance
if (!lock) {
  app.quit();
} else {
  app.on('ready', onReady);
}

process.on('unhandledRejection', function (error) {
  logger.error('%o', error);
});

process.on('uncaughtException', function (error) {
  logger.error('%o', error);
});

async function onReady() {
  await db.init();
 
  protocol.registerFileProtocol('file', (request, cb) => {
    const url = request.url.replace('file:///', '');
    const decodedUrl = decodeURI(url)
    try {
      return cb(decodedUrl);
    } catch (error) {
      console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error);
    }
  })

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    frame: false,
    resizable: true,
    backgroundColor: '#fff',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      webviewTag: true,
    }
  })
 
  setupMainWindowControlIPC(win);

  ipcMain.handle('getCookies', async (event, url) => {
    return await session.defaultSession.cookies.get({ url });
  });

  ipcMain.handle('getUserDataPath', async () => {
    return getUserDataPath();
  });


  if (IS_DEV) {
    await registerExtensions();
    win.loadURL(`http://localhost:${process.env.PORT}`);

    // dev tools should be opened on this event to make react dev tools work
    win.webContents.on('did-frame-finish-load', () => {
      win.webContents.openDevTools();
    });
  }
}

/**
 * function to register window extensions (like react dev tools)
 */
const registerExtensions = async () => {
  const extensionsDir = path.join(__dirname, '..', EXTENSIONS_FOLDER);
  const reactDevToolsPath = path.join(extensionsDir, REACT_DEV_TOOLS_FOLDER);
  const reduxDevToolsPath = path.join(extensionsDir, REDUX_DEV_TOOLS_FOLDER);

  // await session.defaultSession.loadExtension(reactDevToolsPath, {allowFileAccess: true});
  await session.defaultSession.loadExtension(reduxDevToolsPath);
}

/**
 * handle ipc messages from renderer to maximize, minimize and close window
 * @param win 
 */
const setupMainWindowControlIPC = (win: BrowserWindow) => {
  ipcMain.on('main:close', () => {
    win.close();
    app.exit();
  });

  ipcMain.on('main:minimize', () => {
    win.minimize();
  });

  ipcMain.on('main:maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
      win.webContents.send('main:unmaximized');
    } else {
      win.maximize();
      win.webContents.send('main:maximized');
    }
  });

  ipcMain.handle('main:isMaximized', () => {
    return win.isMaximized();
  });
}