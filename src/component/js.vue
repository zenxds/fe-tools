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
                let ast = UglifyJS.parse(input)
                ast.figure_out_scope()

                this.input = ast.print_to_string({
                    beautify: true
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