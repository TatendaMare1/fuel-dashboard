const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title:"Fuel Manager",
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.webContents.openDevTools();

  win.loadURL(
    "https://fuel-dashboard-beryl.vercel.app"
  );

  win.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.log(
        "Load failed:",
        errorCode,
        errorDescription
      );
    }
  );
}

app.whenReady().then(createWindow);