<template>
    <div>

        <br>
        <el-tag size="medium"
                :key="item.id"
                v-for="item in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(item)"
                @click="changeEdit(item)">
            {{item.type}}
        </el-tag>
        <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
        >
        </el-input>

        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        <br>  <br>
        <el-tag
                type="danger"
                size="medium"
                :key="item.type"
                v-for="item in dynamicTags"
                :disable-transitions="true"
                @click="jumpDetail(item)">
            {{'【'+item.type+'】' + ' 详情'}}
        </el-tag>
    </div>

</template>

<script>
    export default {
        name: "UsersFindTag",
        data() {
            return {
                dynamicTags: [],
                inputVisible: false,
                inputValue: ''
            };
        },
        created(){
            this.getData();
        },
        methods: {
            jumpDetail(item){
                var t = this;
                this.$router.push({
                    path:'/UsersTagList',
                    query:{
                        'id':item.id
                    }
                })
            },
            getData(){
                this.$axios.get("/api/users/find_tag/",).then((res)=>{
                        this.dynamicTags = res.data;
                        console.log(this.dynamicTags);
                })
            },
            handleClose(item) {
                this.$alert( '是否删除标签'+ '【'+item.type + '】', {
                    confirmButtonText: '确定',
                    callback: action => {
                        var dic = {'tag_id':item.id,'tag':'','type':'3'};
                        this.$axios.post("/api/users/find_tag/",dic,{headers:{
                                "Authorization":"JWT " + localStorage.getItem('token')
                            }}).then((res)=>{
                            if (res.data.status == 1){
                                this.$message.success(res.data.message);
                                this.getData();
                            } else {
                                this.$message.warning(res.data.message);
                            }
                        })
                    }
                });
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //编辑
            changeEdit(item) {
                this.$prompt('请输入新的标签名', '编辑'+ '【'+item.type + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    var dic = {'tag_id':item.id,'tag':value,'type':'1'};
                    this.$axios.post("/api/users/find_tag/",dic,{headers:{
                            "Authorization":"JWT " + localStorage.getItem('token')
                        }}).then((res)=>{
                        if (res.data.status == 1){
                            this.$message.success(res.data.message);
                            this.getData();
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            //新增
            handleInputConfirm() {
                let inputValue = this.inputValue;

                if (inputValue) {
                    var dic = {'tag_id':'','tag':inputValue,'type':'2'};
                    this.$axios.post("/api/users/find_tag/",dic,{headers:{
                            "Authorization":"JWT " + localStorage.getItem('token')
                        }}).then((res)=>{
                        if (res.data.status == 1){
                            this.$message.success(res.data.message);
                            this.getData();
                            this.inputVisible = false;
                            this.inputValue = '';
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    })
                }





            }
        }
    }
</script>
<style scoped>
    .el-tag + .el-tag {
        margin-left: 10px
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;

        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
