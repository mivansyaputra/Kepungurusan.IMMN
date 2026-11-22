const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// Mode portable: data (localStorage) disimpan di folder di samping file .exe
if (process.env.PORTABLE_EXECUTABLE_DIR) {
  app.setPath('userData', path.join(process.env.PORTABLE_EXECUTABLE_DIR, 'IMMAMANNA-data'));
}

if (!app.requestSingleInstanceLock()) app.quit();

let win;
function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#12051f',
    icon: path.join(__dirname, 'icon.ico'),
    title: 'IMMAMANNA',
    autoHideMenuBar: true,
    webPreferences: { autoplayPolicy: 'no-user-gesture-required', contextIsolation: true, sandbox: true }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  // tautan http(s) (mis. WhatsApp) dibuka di browser bawaan
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (/^https?:/i.test(url)) { e.preventDefault(); shell.openExternal(url); }
  });
}

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
