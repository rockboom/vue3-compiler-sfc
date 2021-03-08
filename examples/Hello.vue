<template>
    <div id="hello-vue" class="demo">
        {{ message }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'Hello Vue!!',
        }
    },
}
</script>

<style>
#hello-vue{
    color: red;
    background-color: aqua;
    color: 24px;
}
</style>