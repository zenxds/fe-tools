import Vue from 'vue'
import moment from 'moment'

Vue.filter('moment', function(time, format) {
    time = moment(time)
    if (!time.isValid()) {
        return ''
    }

    return time.format(format)
})
