import { app, ipcRenderer } from 'electron';

export function isElectron() {
  try {
    return !window;
  } catch (e) {
    return true;
  }
}

export async function getUserDataPath() {
  if (isElectron()) {
    if (process.env.NODE_ENV === 'development') {
      return __dirname;
    } else {
      return app.getPath('userData');
    }
  } else {
    return await ipcRenderer.invoke('getUserDataPath');
  }
}