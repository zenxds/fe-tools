<template>
    <div>
        FE Tools v{{ version }}
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            version: require('../../package.json').version
        }
    },
    methods: {

    }
}
</script>

<style>
</style>