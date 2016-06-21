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