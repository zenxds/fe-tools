<template>
    <div>
        <textarea v-model="input"></textarea>

        <div class="section">
            <span class="btn" v-on:click="compress">压缩</span>
            <span class="btn" v-on:click="pretty">格式化</span>
        </div>
    </div>
</template>

<script>
const { clipboard } = require('electron')
const CleanCSS = _require('clean-css')
const css = _require('css')

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
                this.input = new CleanCSS({
                    // 禁用选择器跟属性合并等高级功能，只做最纯粹的压缩
                    advanced: false,
                    aggressiveMerging: false
                }).minify(input).styles
                toastr.success('已复制到剪切板')
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
                let ast = css.parse(input)
                this.input = css.stringify(ast, {
                    indent: "    "
                })
                toastr.success('已复制到剪切板')
            } catch (e) {
                toastr.error(e.toString())
            }
        }
    }
}
</script>

<style>
</style>