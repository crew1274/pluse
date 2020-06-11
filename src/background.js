'use strict'

import { app, protocol, BrowserWindow, dialog } from 'electron'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

if (process.platform != "browser")
{
  const isPortReachable = require('is-port-reachable');
  ( async () => {
    if (await isPortReachable(6379))
    {
      const redis = require("redis")
      const subscriber = redis.createClient()
      subscriber.subscribe("RFID")
      subscriber.on("message", function (channel, message)
      {
        if (channel == "RFID")
        {
          redis.createClient().hgetall('RFID_PAYLOAD', function (err, object)
          {
            win.webContents.send('RFID', object)
          })
        }
      })
    }
  }) ()
}

const axios = require('axios')

async function DownLoad(flavor, verison, filename) 
{
  // console.log('http://10.11.0.156:9666/download/flavor/' + flavor + '/' + verison + '/linux_32/' + filename)
  var options
  var os = require('os')
  if (os.platform() != "win32") {
    options = {
      directory: "/home/pi/Desktop/old_version/",
      filename: filename
    }
  } else {
    options = {
      directory: "./",
      filename: filename
    }
  }
  var download = require('download-file')
  var fs = require('fs')

  await download('http://10.11.0.156:9666/download/flavor/' + flavor + '/' + verison + '/linux_32/' + filename,
    options, () => {
      fs.chmodSync(options["directory"] + filename, '777')
      const {
        exec
      } = require('child_process')
      if (os.platform() != "win32") {
        exec("ln -f -s " + options["directory"] + filename + " " + "/home/pi/Desktop/App.AppImage ")
      }
      // app.quit()
      options = {
        type: 'info',
        title: '更新成功',
        message: "程式將自動關閉，請重新執行程式",
        buttons: ['關閉程式']
      }
      if (dialog.showMessageBoxSync(options) == 0) {
        app.quit()
      }
    })

}

async function checkUpdate()
{
  let options =
  {
    type: 'info',
    title: '發現新的版本',
    message: "是否進行更新?",
    buttons: ['現在更新', '等等']
  }
  await axios.get('http://10.11.0.156:9666/api/version')
    .then(response =>
    {
      let a = response.data.reverse()
      for (let i = 0; i < a.length; i++) {
        if (a[i]["flavor"]["name"]) {
          if (app.getName() == a[i]["flavor"]["name"])
          {
            if (app.getVersion() != a[i]["name"])
            {
              if (dialog.showMessageBoxSync(options) == 0)
              {
                DownLoad(a[i]["flavor"]["name"], a[i]["name"], a[i]["assets"][0]['name'])
              }
            } 
            else
            {
              console.log("軟體已是最新")
            }
            return
          }
        }
      }
    })
    .catch(error => {
      console.log(error)
    })

}


function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      fullscreenable: true
    }
  })
  win.setFullScreen(true)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
  checkUpdate()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
