<template>

<div>
    <ul class="box nav">
        <li><a v-link="{path: '/str'}">字符串编解码/加密</a></li>
        <li><a v-link="{path: '/img'}">图片转Base64</a></li>
        <li><a v-link="{path: '/text'}">文本/链接转二维码</a></li>
        <li><a v-link="{path: '/time'}">时间戳转换</a></li>
        <li><a v-link="{path: '/js'}">JS压缩/格式化</a></li>
        <li><a v-link="{path: '/css'}">CSS压缩/格式化</a></li>
        <li><a v-link="{path: '/json'}">JSON格式化</a></li>
    </ul>
    <div class="box content">
        <router-view transition="fade" transition-mode="out-in">
        </router-view>
    </div>
    <div class="footer">
        © 2016 Alibaba神盾局UED
    </div>
</div>

</template>

<script>
export default {
    data: function() {
        return {

        }
    },
    methods: {

    }
}
</script>

<style>
</style>