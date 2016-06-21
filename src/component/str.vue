<template>
    <div class="page-str">
        <textarea v-model="input"></textarea>

        <div class="section">
            <div class="action-item">
                <input type="radio" name="type" id="base64-encode" value="base64-encode" v-model="type" checked>
                <label for="base64-encode">base64编码</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="base64-decode" value="base64-decode" v-model="type">
                <label for="base64-decode">base64解码</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="encodeURI" value="encodeURI" v-model="type">
                <label for="encodeURI">encodeURI</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="decodeURI" value="decodeURI" v-model="type">
                <label for="decodeURI">decodeURI</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="encodeURIComponent" value="encodeURIComponent" v-model="type">
                <label for="encodeURIComponent">encodeURIComponent</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="decodeURIComponent" value="decodeURIComponent" v-model="type">
                <label for="decodeURIComponent">decodeURIComponent</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="unicode-encode" value="unicode-encode" v-model="type">
                <label for="unicode-encode">unicode编码</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="unicode-decode" value="unicode-decode" v-model="type">
                <label for="unicode-decode">unicode解码</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="utf8-encode" value="utf8-encode" v-model="type">
                <label for="utf8-encode">utf8编码</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="utf8-decode" value="utf8-decode" v-model="type">
                <label for="utf8-decode">utf8解码</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="md5" value="md5" v-model="type">
                <label for="md5">md5加密</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="sha1" value="sha1" v-model="type">
                <label for="sha1">sha1加密</label>
            </div>
        </div>
        <div class="section">
            <span class="btn" v-on:click="transform">转换</span>
            <span class="btn btn-cancel" v-on:click="empty">清空</span>
        </div>
    </div>
</template>

<script>
const UTF8 = require('../lib/utf8.js')
const Unicode = require('../lib/unicode.js')
const crypto = require('crypto')
const { clipboard } = require('electron')

let transformers = {
    'base64-encode': function(v) {
        return btoa(v)
    },
    'base64-decode': function(v) {
        return atob(v)
    },
    'encodeURI': function(v) {
        return encodeURI(v)
    },
    'decodeURI': function(v) {
        return decodeURI(v)
    },
    'encodeURIComponent': function(v) {
        return encodeURIComponent(v)
    },
    'decodeURIComponent': function(v) {
        return decodeURIComponent(v.replace(/\+/g, ' '))
    },
    'utf8-encode': UTF8.encode,
    'utf8-decode': UTF8.decode,
    'unicode-encode': Unicode.encode,
    'unicode-decode': Unicode.decode,

    md5: function(v) {
        let md5 = crypto.createHash('md5')
        md5.update(v)
        return md5.digest('hex')
    },

    sha1: function(v) {
        let sha1 = crypto.createHash('sha1')
        sha1.update(v)
        return sha1.digest('hex')
    }
}

export default {
    data: function() {
        return {
            type: '',
            input: ''
        }
    },
    watch: {
        type: function(val) {
            this.transform()
        }
    },
    methods: {
        transform: function() {
            let type = this.type
            let input = this.input.trim()
            if (!type || !input) {
                return
            }

            if (transformers[type]) {
                try {
                    this.input = transformers[type](input)
                    clipboard.writeText(this.input)
                    toastr.success('已复制到剪切板')
                } catch (e) {
                    toastr.error(e.toString())
                }
            }
        },
        empty: function() {
            this.input = ''
        }
    }
}
</script>

<style lang="stylus">
.page-str

    .action-item
        display: inline-flex
        align-items: baseline
        margin-right: 0.05rem
        font-size: 0.16rem
        cursor: default

    .action-item label
        margin-left: 0.03rem

</style>