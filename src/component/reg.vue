<template>
    <div>
        <input type="text" class="text" v-model="input">

        <div class="section">

        </div>
    </div>
</template>

<script>
const { clipboard } = require('electron')

export default {
    data: function() {
        return {
            input: ''
        }
    },
    methods: {
    }
}
</script>

<style>
</style>