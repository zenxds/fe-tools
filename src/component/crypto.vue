<template>
    <div class="page-crypto">
        <textarea v-model="input"></textarea>

        <div class="section">
            <div class="action-item">
                <input type="radio" name="type" id="md5" value="md5" v-model="type" checked>
                <label for="md5">md5加密</label>
            </div>
            <div class="action-item">
                <input type="radio" name="type" id="sha1" value="sha1" v-model="type">
                <label for="sha1">sha1加密</label>
            </div>
        </div>
        <div class="section">
            <span class="btn" v-on:click="encrypt">加密</span>
            <span class="btn btn-cancel" v-on:click="empty">清空</span>
        </div>
    </div>
</template>

<script>
const crypto = require('crypto')
const { clipboard } = require('electron')

let transformers = {
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
        // type: function(val) {
        //     this.transform()
        // }
    },
    methods: {
        encrypt: function() {
            let type = this.type
            let input = this.input.trim()
            if (!type || !input) {
                return
            }

            if (transformers[type]) {
                try {
                    this.input = transformers[type](input)
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
.page-crypto

    .action-item
        display: inline-flex
        align-items: baseline
        margin-right: 0.1rem
        font-size: 0.16rem
        cursor: default

    .action-item label
        margin-left: 0.03rem

</style>