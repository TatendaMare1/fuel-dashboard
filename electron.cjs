const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900
  });

  win.loadURL(
    'https://fuel-dashboard-beryl.vercel.app'
  );
}

app.whenReady().then(createWindow);