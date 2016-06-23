<template>
    <div class="page-encode">
        <textarea v-model="input"></textarea>

        <div class="section">
            <div class="action-item">
                <input type="radio" name="type" id="base64" value="base64" v-model="type" checked>
                <label for="base64">base64</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="URI" value="URI" v-model="type">
                <label for="URI">URI</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="URIComponent" value="URIComponent" v-model="type">
                <label for="URIComponent">URIComponent</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="unicode" value="unicode" v-model="type">
                <label for="unicode">unicode</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="gbk" value="gbk" v-model="type">
                <label for="gbk">gbk</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="utf8" value="utf8" v-model="type">
                <label for="utf8">utf8</label>
            </div>
        </div>
        <div class="section">
            <span class="btn" v-on:click="transform('encode')">编码</span>
            <span class="btn" v-on:click="transform('decode')">解码</span>
            <span class="btn btn-cancel" v-on:click="empty">清空</span>
        </div>
    </div>
</template>

<script>
const UTF8 = require('../lib/utf8.js')
const Unicode = require('../lib/unicode.js')
const { clipboard } = require('electron')
const iconv = _require('iconv-lite')

let transformers = {
    base64: {
        encode: function(v) {
            return btoa(v)
        },
        decode: function(v) {
            return atob(v)
        }
    },

    URI: {
        encode: function(v) {
            return encodeURI(v)
        },
        decode: function(v) {
            return decodeURI(v)
        }
    },

    URIComponent: {
        encode: function(v) {
            return encodeURIComponent(v)
        },
        decode: function(v) {
            return decodeURIComponent(v.replace(/\+/g, ' '))
        }
    },

    utf8: UTF8,
    unicode: Unicode,

    gbk: {
        encode: function(v) {
            let buffer = iconv.encode(v, 'gbk')
            return buffer.toString('binary')
        },
        // 对于url是以gbk编码encode的情况
        // str = str.replace(/%([a-zA-Z0-9]{2})/g,function(_,code){
        //     return String.fromCharCode(parseInt(code,16));
        // });
        // 然后再用gbk的decode
        decode: function(v) {
            v = v.replace(/\\x([a-fA-F0-9]{2})/g, function(match, p1){
                return String.fromCharCode(parseInt(p1, 16))
            })

            let buffer = new Buffer(v, 'binary')
            return iconv.decode(buffer, 'gbk')
        }
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
        // type: function(val) {
        //     this.transform()
        // }
    },
    methods: {
        transform: function(method) {
            let type = this.type
            let input = this.input.trim()
            if (!type || !input) {
                return
            }

            var transformer = transformers[type]
            if (transformer[method]) {
                try {
                    this.input = transformer[method](input)
                    clipboard.writeText(this.input)
                    toastr.success(g_config.copySuccessMsg)
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
.page-encode

    .action-item
        display: inline-flex
        align-items: baseline
        margin-right: 0.1rem
        font-size: 0.16rem
        cursor: default

    .action-item label
        margin-left: 0.03rem

</style>