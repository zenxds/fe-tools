<template>
    <div>
        <textarea v-model="input"></textarea>

        <div class="section">
            <span class="btn" v-on:click="compress">压缩</span>
            <span class="btn" v-on:click="pretty">格式化</span>
            <span class="btn btn-cancel" v-on:click="empty">清空</span>
        </div>
    </div>
</template>

<script>
const { clipboard } = require('electron')
const beautifyHTML = _require('js-beautify').html
const minify = _require('html-minifier').minify

export default {
    data: function() {
        return {
            input: ''
        }
    },
    methods: {
        compress: function() {
            let input = this.input.trim()
            if (!input) {
                return
            }

            try {
                this.input = minify(input, {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    // 删除值是默认值的属性
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                })
                toastr.success(g_config.copySuccessMsg)
            } catch (e) {
                toastr.error(e.toString())
            }
        },
        pretty: function() {
            let input = this.input.trim()
            if (!input) {
                return
            }

            try {
                this.input = beautifyHTML(input)
                toastr.success(g_config.copySuccessMsg)
            } catch (e) {
                toastr.error(e.toString())
            }
        },

        empty: function() {
            this.input = ''
        }
    }
}
</script>

<style>
</style>