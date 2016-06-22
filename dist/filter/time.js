let Vue = _require('vue')
let moment = _require('moment')

Vue.filter('moment', function(time, format) {
    time = moment(time)
    if (!time.isValid()) {
        return ''
    }

    return time.format(format)
})
