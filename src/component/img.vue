<template>
    <div class="page-img">
        <div class="drag-img" v-on:click="select" v-el:input>
            <img v-show="output" v-bind:src="output" alt="">
            <span v-else>拖入/选择 图片</span>
        </div>

        <textarea v-model="output" v-show="output"></textarea>
    </div>
</template>

<script>
const { remote, clipboard, nativeImage } = require('electron')
const fs = require('fs')
const mime = _require('mime')

function toDataURL(files) {
    return files.map(function(file) {
        // 统一成对象的形式
        if (typeof file === 'string') {
            file = {
                path: file
            }
        }

        try {
            let data = fs.readFileSync(file.path).toString('base64')
            return `data:${mime.lookup(file.path)};base64,${data}`
        } catch (e) {
            toastr.error(e.toString())
        }

        // 原生的太坑爹，转出来的全是png
        // return nativeImage.createFromPath(file.path).toDataURL()
    }).join('\n\n\n')
}

export default {
    data: function() {
        return {
            output: ''
        }
    },

    watch: {
        output: function(val) {
            if (val) {
                clipboard.writeText(val)
                toastr.success('已复制到剪切板')
            }
        }
    },

    methods: {
        select: function() {
            let files = remote.dialog.showOpenDialog({
                filters: [
                    { name: 'ALL Files', extensions: ['*'] }
                ],
                properties: ['openFile', 'multiSelections']
            })
            if (files && files.length) {
                this.output = toDataURL(files)
            }
        }
    },

    ready: function() {
        let input = this.$els.input

        input.ondragover = () => {
            return false
        }
        input.ondragleave = input.ondragend = () => {
            return false
        }

        input.ondrop = (e) => {
            e.preventDefault()

            // name, path, type, lastModified
            let files = e.dataTransfer.files
            if (files && files.length) {
                // files是FileList对象的实例，不是真正的数组
                files = [].slice.call(files)
                this.output = toDataURL(files)
            }

            return false
        }

        // 粘贴图片坑太多，暂时不做
        // let onpaste = function(e) {
        //     let image = clipboard.readImage()
        //     if (image.isEmpty()) {
        //         return
        //     }
        // }
        // document.addEventListener('paste', onpaste, false)

        // this.removePasteListener = function() {
        //     document.removeEventListener('paste', onpaste)
        // }
    },

    beforeDestroy: function() {
        let input = this.$els.input
        input.ondragover = input.ondragleave = input.ondragend = input.ondrop = null

        // this.removePasteListener()
    }
}
</script>

<style lang="stylus">
.page-img

    .drag-img
        display: flex
        align-items: center
        justify-content: center
        width: 6rem
        height: 3.5rem
        padding: 0.1rem
        margin: 0 auto 0.3rem
        cursor: pointer
        color: #40444F
        font-size: 0.3rem
        border: 5px dashed #616778
        border-radius: 10px

    .drag-img img
        max-height: 100%
        max-width: 100%
</style>