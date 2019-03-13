
<template>
    <div class="container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="推荐" name="1">推荐</el-tab-pane>
            <el-tab-pane label="雪茄剪" name="2">雪茄剪</el-tab-pane>
            <el-tab-pane label="打火机" name="3">打火机</el-tab-pane>
            <el-tab-pane label="保湿盒" name="4">保湿盒</el-tab-pane>
            <el-tab-pane label="雪茄盒" name="5">雪茄盒</el-tab-pane>
            <el-tab-pane label="烟灰缸" name="6">烟灰缸</el-tab-pane>
        </el-tabs>
    </div>

</template>
<script>
    export default {
        name: "CigarShopDetail",
        data() {
            return {
                activeName: '2',
                brand_name:''
            };
        },

        created(){
            this.getParams();
        },
        watch:{
            '$route':'getParams'
        },
        methods: {
            getParams(){
                this.brand_name = this.$route.query.brand_name;
                alert(this.brand_name);
            },
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
<style>
    .table{
        width: 100%;
        font-size: 14px;
    }
</style>
