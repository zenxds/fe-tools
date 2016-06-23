require('./styl/app.styl')

const { ipcRenderer, remote, shell } = _require('electron')
const $ = _require('jquery')
const Vue = _require('vue')
const Router = _require('vue-router')
const Package = require('../package.json')
Vue.use(Router)

require('./filter/time.js')

/**
 * components
 */
import App from './app.vue'

import Home from './component/home.vue'
import Encode from './component/encode.vue'
import Crypto from './component/crypto.vue'
import JSON from './component/json.vue'
import IMG from './component/img.vue'
import Qrcode from './component/qrcode.vue'
import JS from './component/js.vue'
import CSS from './component/css.vue'
import HTML from './component/html.vue'
import Time from './component/time.vue'

const router = new Router()
router.map({
    '/home': {
        component: Home
    },
    '/encode': {
        component: Encode
    },
    '/crypto': {
        component: Crypto
    },
    '/img': {
        component: IMG
    },
    '/qrcode': {
        component: Qrcode
    },
    '/js': {
        component: JS
    },
    '/css': {
        component: CSS
    },
    '/html': {
        component: HTML
    },
    '/json': {
        component: JSON
    },
    '/time': {
        component: Time
    }
})
router.redirect({
    '*': '/home'
})
router.start(App, '#app')

function checkUpdate(action) {
    $.ajax({
        url: Package.repository.package,
        dataType: 'json',
        cache: false,
        success: function (data) {
            if (data && data.release > Package.release) {
                showUpdateDialog()
            }
        }
    });
}

function showUpdateDialog() {
    remote.dialog.showMessageBox({
        type: 'info',
        title: '检查更新',
        message: "当前已有新版本",
        defaultId: 0,
        buttons: ['点击下载最新版本', '稍后提醒我']
    }, function (index) {
        if (index === 1) {

        } else {
            shell.openExternal(Package.repository.releases)
        }
    })
}
showUpdateDialog()

// 检查更新
checkUpdate()