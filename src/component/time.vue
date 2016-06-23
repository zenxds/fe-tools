<template>
    <div class="page-time">

        <div class="section">
            当前的时间戳为：{{ now | moment "X" }}
            <span class="btn btn-success" data-t='{{ now | moment "X" }}' v-on:click="copy($event)">复制</span>
        </div>
        <div class="section">
            当前本地时间为：{{ now | moment "YYYY-MM-DD HH:mm:ss" }}
            <span class="btn btn-success" data-t='{{ now | moment "YYYY-MM-DD HH:mm:ss" }}' v-on:click="copy($event)">复制</span>
        </div>

        <div class="section section-leading">
            <h3 class="section-title">时间戳 → 本地时间</h3>
            <div class="row">
                <input type="text" v-model="input1" class="text row-item" placeholder="">
                <span class="btn" v-on:click="transform1">转换</span>
                <div class="result row-item">{{ output1 }}</div>
            </div>
        </div>

        <div class="section section-leading">
            <h3 class="section-title">本地时间 → 时间戳</h3>
            <div class="row">
                <input type="text" v-model="input2" class="text row-item" placeholder="">
                <span class="btn" v-on:click="transform2">转换</span>
                <div class="result row-item">{{ output2 }}</div>
            </div>
        </div>
    </div>
</template>

<script>
const { clipboard } = require('electron')
const moment = _require('moment')

export default {
    data: function() {
        return {
            now: null,
            input1: '',
            input2: '',
            output1: '',
            output2: ''
        }
    },
    methods: {

        copy: function(event) {
            let target = event.target
            let text = target.dataset.t
            clipboard.writeText(text)
            toastr.success(g_config.copySuccessMsg)
        },

        transform1: function() {
            let input = this.input1.trim()
            if (!input) {
                return
            }
            let time = moment(input, 'X')
            if (!time.isValid()) {
                toastr.error('invalid time')
                return
            }

            this.output1 = time.format('YYYY-MM-DD HH:mm:ss')

            clipboard.writeText(this.output1)
            toastr.success(g_config.copySuccessMsg)
        },

        transform2: function() {
            let input = this.input2.trim()
            if (!input) {
                return
            }

            let time = moment(input)
            if (!time.isValid()) {
                toastr.error('invalid time')
                return
            }

            this.output2 = time.format('X')
            clipboard.writeText(this.output2)
            toastr.success(g_config.copySuccessMsg)
        }
    },

    ready: function() {
        this.now = new Date()
        setInterval(() => {
            this.now = new Date()
        }, 1000)
    }
}
</script>

<style lang="stylus">

.page-time

    .row
        margin-top: 0.1rem

    .btn
        margin: 0 0.1rem
</style>