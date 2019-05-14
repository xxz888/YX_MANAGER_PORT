<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 更多标签</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName"  @tab-click="handleClick">
                <el-tab-pane v-for = 'item in todo' :label="item.type" :name="item.type"></el-tab-pane>
            </el-tabs>
            <div style="margin: 20px;"></div>
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="success" icon="search" @click="addnews">新增</el-button>
            </div>
            <el-table :data="data"  tooltip-effect="dark"
                      border  class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID"  width="50" align="center">
                </el-table-column>
                <el-table-column prop="tag" label="TAG"  width="200" align="center">
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
                style="margin: 50px auto;"
                align="center"
                background
                layout="prev, pager, next"
                :total="100"
                :current-page = 'currentPage'
                @current-change="handleCurrentChange"
        >
        </el-pagination>
    </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

    export default {
        name: 'MoreTagList',
        components: {
            VueUeditorWrap
        },
        data() {
            return {
                myConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 240,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    serverUrl: 'http://35.201.165.105:8000/controller.php',
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    UEDITOR_HOME_URL: "/UEditor/"
                },
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    id: '',
                    cigar_brand: '',
                    photo: '',
                    intro: '',
                    concern_number: '',
                    sort: '',
                    is_concern: '',
                    activeName:''
                },
                idx: -1,
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                checked:'',
                base64Array:[],
                activeName: '',
                tab_index:'',
                count:'',
                content:'',
                todo:[],
                currentPage:1,
                type:'',
            }
        },
        created() {
            var self = this;
            this.$axios.get("/api/users/find_tag/",{headers:{
                    "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                var dic = {'id':0,'type':'用户添加','weight':1};
                res.data.unshift(dic);
                self.todo = res.data;
                self.activeName = self.todo[0].type;
                self.type = self.todo[0].id;
                self.getData();
            });
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    return d;
                })
            }
        },
        methods: {
            //分页切换取值
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //编辑按钮,弹出框
            handleEdit(index, row) {
                this.idx = index;
                var self = this;
                const item = this.tableData[index];
                this.$prompt('请输入新的标签名', '编辑'+ '【'+item.tag + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:item.tag,
                }).then(({ value }) => {
                    if (value.length == 0) return;
                    var dic = {
                        'tag':value,
                        'tag_type':item.type,
                        'tag_id':item.id,
                        'type':'2',
                    };
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
            //增加按钮，弹出框
            addnews(){
                var self = this;
                this.$prompt('请输入新的标签名', '新增', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    if (value.length == 0) return;
                    var dic = {
                        'tag':value,
                        'tag_type':self.type,
                        'tag_id':'',
                        'type':'1',
                    };
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

            //确定删除,请求
            handleDelete(index, row){
                this.idx = index;
                const item = this.tableData[index];
                var self = this;
                this.$confirm('是否删除标签' + '【'+item.tag + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var dic = {
                        'tag':item.tag,
                        'tag_type':item.type,
                        'tag_id':item.id,
                        'type':'3',
                    };
                    self.$axios.post("/api/users/iu_tag/",dic,{headers:{
                            "Authorization":"JWT " + localStorage.getItem('token')
                        }}).then((res)=>{
                        if (res.data.status == 1){
                            self.$message.success(res.data.message);
                            self.getData();
                        } else {
                            self.$message.warning(res.data.message);
                        }
                    })
                }).catch(() => {});
            },
            //全部删除
            delAll() {
                this.$message.info('功能开发中');
            },
            //请求
            getData() {
                this.$axios.get("/api/users/tag/" + this.type + '/' + this.currentPage+'/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    this.tableData = res.data;
                })
            },
            //tab切换
            handleClick(tab, event) {
                var string = event.target.getAttribute('id').split('-')[1];
                for (var i = 0 ; i < this.todo.length ; i ++){
                    if (string == this.todo[i].type){
                        this.type = this.todo[i].id;
                    }
                }


                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search() {
                this.is_search = true;
                this.$message.info('功能开发中');
            },

            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            data_formatter(value){
                return this.getLocalTime(value.date);
            },

        },
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;

    }
    .red{
        color: #ff0000;
    }
    .green{
        color: #58B92D;
    }
    .mr10{
        margin-right: 10px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }

    .pre-img{
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
</style>
