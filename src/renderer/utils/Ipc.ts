import { IpcRenderer, ipcRenderer } from 'electron';
import { Disposable } from '../interfaces/Disposable';

type ListenerCallback = (...args: any[]) => void;

interface ListenerInfo {
  event: string,
  cb: ListenerCallback
}

export class Ipc implements Disposable {
  private listeners: ListenerInfo[] = [];

  public dispose() {
    for (const listener of this.listeners) {
      ipcRenderer.removeListener(listener.event, listener.cb);
    }
  }

  public on(event: string, cb: ListenerCallback): void {
    ipcRenderer.on(event, cb);
    this.listeners.push({ event, cb });
  }

  public once(event: string, cb: ListenerCallback): void {
    ipcRenderer.once(event, cb);
    this.listeners.push({ event, cb });
  }

  public send(event: string, ...args: any[]): void {
    ipcRenderer.send(event, args); 
  }

  public invoke(event: string, ...args: any[]): Promise<any> {
    return ipcRenderer.invoke(event, args); 
  }
}