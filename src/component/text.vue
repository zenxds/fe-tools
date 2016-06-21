<template>
    <div>
        <input type="text" class="text" v-model="input">
        <div class="section">
            <span class="btn" v-on:click="transform">转换</span>
        </div>

        <div class="section" v-show="output">
            <div v-el:output id="output"></div>
            <span class="btn btn-success" v-on:click="save">保存</span>
        </div>
    </div>
</template>

<script>
const AraleQRCode = require('../lib/qrcode/index.js')
const { remote, clipboard } = require('electron')
const fs = require('fs')

export default {
    data: function() {
        return {
            input: '',
            output: null
        }
    },
    methods: {
        transform: function() {
            let input = this.input.trim()
            if (!input) {
                return
            }

            let output = this.$els.output
            let qrcode = new AraleQRCode({
                text: input
            })

            output.innerHTML = ''
            output.appendChild(qrcode)
            this.output = qrcode
        },

        save: function() {
            remote.dialog.showSaveDialog({
                title: "保存二维码到本地",
                filters: [
                    { name: 'image', extensions: ['png'] }
                ],
            }, (file) => {
                let data = this.output.toDataURL().replace(/^data:image\/\w+;base64,/, '')

                fs.writeFile(file, data, 'base64', function(err) {
                    if (err) {
                        toastr.error(err.toString())
                    } else {
                        toastr.success('保存成功')
                    }
                })
            })
        }
    }
}
</script>

<style>
</style>