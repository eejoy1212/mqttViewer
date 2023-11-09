const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs').promises;
const remote = require('@electron/remote/main');
const path = require('path');
const { url } = require('inspector');

// remote.initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 2000,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Worker에서 Node.js 모듈 사용을 허용
      enableRemoteModule: true,
      webSecurity: true,
      preload: `${__dirname}/public/preload.js`,
    },
  });
  // win.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, 'index.html'),
  //     protocol: 'file:',
  //     slashes: true,
  //   })
  // );

  win.loadURL('http://localhost:3001');
  // win.loadFile('index.html');
  //  connect();
  win.webContents.openDevTools();
  // remote.enable(win.webContents);
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
ipcMain.handle('write-file', async (event, path, data) => {
  console.log('write-file', path, data);
  return await fs
    .access(path, 0)
    .then(async () => {
      //파일이 있으면 writeFile
      return await fs
        .writeFile(path, data)
        .then(() => true)
        .catch(() => false);
    })
    .catch(async () => {
      //파일이 없다면 경로 생성 후 writeFile
      const idx = path.lastIndexOf('\\');
      const dir = path.slice(0, idx);
      return await fs.mkdir(dir, { recursive: true }).then(async () => {
        return await fs
          .writeFile(path, data)
          .then(() => true)
          .catch(() => false);
      });
    });
});
ipcMain.handle('read-file', async (event, path) => {
  return await fs
    .access(path, 0)
    .then(async () => {
      //파일이 있으면 readFile
      return await fs
        .readFile(path)
        .then((data) => {
          return data.toString();
        })
        .catch(() => {
          return '';
        });
    })
    .catch(() => {
      //파일 없으면 return
      return '';
    });
});
