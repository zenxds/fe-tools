require('./styl/app.styl')

let Vue = _require('vue')
let Router = _require('vue-router')
Vue.use(Router)

require('./filter/time.js')

/**
 * components
 */
import App from './app.vue'

import Home from './component/home.vue'
import Str from './component/str.vue'
import JSON from './component/json.vue'
import IMG from './component/img.vue'
import Text from './component/text.vue'
import JS from './component/js.vue'
import CSS from './component/css.vue'
import Time from './component/time.vue'
import REG from './component/reg.vue'

let router = new Router()

router.map({
    '/home': {
        component: Home
    },
    '/str': {
        component: Str
    },
    '/json': {
        component: JSON
    },
    '/img': {
        component: IMG
    },
    '/text': {
        component: Text
    },
    '/js': {
        component: JS
    },
    '/css': {
        component: CSS
    },
    '/time': {
        component: Time
    },
    '/regexp': {
        component: REG
    }
})
router.redirect({
    '*': '/home'
})
router.start(App, '#app')