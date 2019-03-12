
<template>
    <div>
        <div style="margin: 10px;"></div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="success" icon="search" @click="clearTf">清空搜索框</el-button>

        </div>
        <br>
        <el-tag size="medium"
                :key="item.tag"
                v-for="item in dataArray"
                closable
                :disable-transitions="false"
                @close="handleClose(item)"
                @click="changeEdit(item)">
            {{item.tag}}
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
        <el-button type="danger" @click="loadMore">显示更多</el-button>

    </div>
</template>

<script>
    export default {
        name: "UsersTagList",
        data() {
            return {
                id:'',
                dataArray:[],
                inputVisible: false,
                inputValue: '',
                page:'1',
                select_page:'1',
                select_word:'',
                clickWho:'0',//0是大列表 1是搜索
            };
        },
        created(){
            this.getParams()
        },
        watch:{
            '$route':'getParams'
        },
        methods:{
            clearTf(){
              this.select_page = 1;
              this.page = 1;
              this.clickWho = 0;
              this.select_word = '';
              this.dataArray = [];
              this.getData();
            },
            search() {
                this.clickWho = '1';
                this.select_page = '1';
                if (!this.id){
                    return;
                }
                this.loadMoreRequest();
            },
            loadMoreRequest(){
                var dic = {'type':this.id,'key':this.select_word,'page':this.select_page};
                this.$axios.post("/api/users/tag/1/1/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    if (res.data.length == 0){
                        this.$message.warning('没有更多了');
                    } else {
                        this.dataArray = [];
                        this.dataArray = this.dataArray.concat(res.data);                    }
                })
            },
            getParams(){
                // 取到路由带过来的参数
                this.id = this.$route.query.id;
                this.getData();
            },
            loadMore(){
                if (this.clickWho == '0'){
                    this.page ++;
                    this.getData();

                } else {
                    this.select_page ++;
                    this.loadMoreRequest();
                }
            },
            getData(){
                if (!this.id){
                    return;
                }
                var self = this;
                this.$axios.get("/api/users/tag/"+this.id+'/' + this.page +'/',).then((res)=>{
                    if (res.data.length == 0){
                        this.$message.warning('没有更多了');

                    } else {
                        self.dataArray = self.dataArray.concat(res.data);

                    }
                })
            },
            handleClose(item) {
                var self = this;
                this.$alert( '是否删除标签'+ '【'+item.tag + '】', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if (!self.id){
                            return;
                        }
                        var dic = {'tag_id':item.id,'tag':item.tag,'type':'3','tag_type':self.id};
                        this.$axios.post("/api/users/iu_tag/",dic,{headers:{
                                "Authorization":"JWT " + localStorage.getItem('token')
                            }}).then((res)=>{
                            if (res.data.status == 1){
                                this.$message.success(res.data.message);

                                for (var i = 0 ; i < this.dataArray.length ;i++){
                                    if (item.id == this.dataArray[i].id) {
                                        this.dataArray.splice(i,1);
                                    }
                                }
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
                var self = this;
                this.$prompt('请输入新的标签名', '编辑'+ '【'+item.tag + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    if (!self.id){
                        return;
                    }
                    var dic = {'tag_id':item.id,'tag':value,'type':'2','tag_type':self.id};
                    this.$axios.post("/api/users/iu_tag/",dic,{headers:{
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

                if (inputValue) {
                    var dic = {'tag_id':'','tag':inputValue,'type':'1','tag_type':this.id};
                    this.$axios.post("/api/users/iu_tag/",dic,{headers:{
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
        }}
</script>

<style scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
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
    .handle-box {
        margin-bottom: 20px;
    }


    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
