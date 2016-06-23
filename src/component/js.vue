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
const UglifyJS = require('../lib/uglify-js.js')

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
                let ast = UglifyJS.parse(input)
                ast.figure_out_scope()
                let compressor = UglifyJS.Compressor({})
                ast = ast.transform(compressor)

                ast.figure_out_scope()
                ast.compute_char_frequency()
                ast.mangle_names()

                this.input = ast.print_to_string({
                    // 必选，不然在不同编码下会有问题
                    ascii_only: true
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
                let ast = UglifyJS.parse(input)
                ast.figure_out_scope()

                this.input = ast.print_to_string({
                    beautify: true
                })

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