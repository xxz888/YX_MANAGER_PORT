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
                this.$axios.get("/api/users/find_tag/",{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                        this.dynamicTags = res.data;
                        console.log(this.dynamicTags);
                })
            },
            handleClose(item) {
                this.$alert( '是否删除标签'+ '【'+item.type + '】', {
                    confirmButtonText: '确定',
                    callback: action => {
                        var dic = {'tag_id':item.id,'tag':'','type':'3','weight':item.weight};
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
                this.$prompt('请输入新的标签名和权重，以空格分割', '编辑'+ '【'+item.type + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:item.type+' '+item.weight,
                }).then(({ value }) => {
                    if (value.length == 0) return;
                    var array = value.split(' ');
                    if (value.indexOf(' ') == -1 || array[1].length == 0){
                        this.$message.warning('请输入权重，以空格分割');
                        return;
                    }
                    var dic = {'tag_id':item.id,'tag':array[0],'type':'1','weight':array[1]};
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
                });
            },
            //新增
            handleInputConfirm() {
                let inputValue = this.inputValue;
                var array = inputValue.split(' ');
                if (inputValue.length == 0) return;
                if (inputValue.indexOf(' ') == -1 || array[1].length == 0){
                    this.$message.warning('请输入权重，以空格分割');
                    return;
                }
                if (inputValue) {
                    var dic = {'tag_id':'','tag':array[0],'type':'2','weight':array[1]};
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
