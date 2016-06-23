<template>
    <div>
        <textarea v-model="input"></textarea>

        <div class="section">
            缩进：
            <select v-model="space">
                <option value="2">2个空格</option>
                <option value="4" selected>4个空格</option>
                <option value="8">8个空格</option>
            </select>
            <span class="btn" v-on:click="pretty">格式化</span>
            <span class="btn btn-cancel" v-on:click="empty">清空</span>
        </div>
    </div>
</template>

<script>
const { clipboard } = require('electron')

export default {
    data: function() {
        return {
            input: '',
            space: 4
        }
    },
    methods: {
        pretty: function() {
            let input = this.input.trim()
            if (!input) {
                return
            }
            try {
                this.input = JSON.stringify(JSON.parse(input), null, parseInt(this.space))
                clipboard.writeText(this.input)
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