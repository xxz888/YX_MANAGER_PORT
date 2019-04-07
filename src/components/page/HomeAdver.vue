
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 广告列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="推荐" name="first"></el-tab-pane>
                <el-tab-pane label="雪茄" name="second"></el-tab-pane>
                <el-tab-pane label="红酒" name="third"></el-tab-pane>
                <el-tab-pane label="高尔夫" name="forth"></el-tab-pane>
            </el-tabs>
            <div style="margin: 20px;"></div>
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="success" icon="search" @click="addnews">新增</el-button>
            </div>
            <el-table  :data="data" border tooltip-effect="dark" class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID"  width="50" align="center">
                </el-table-column>
                <el-table-column prop="type" label="类型" width="80"align="center"  :formatter = 'type_formatter'>
                </el-table-column>
                <el-table-column prop="title" width="150" show-overflow-tooltip label="标题"  align="center">
                </el-table-column>
                <el-table-column prop="character"  show-overflow-tooltip label="广告文字"  align="center">
                </el-table-column>
                <el-table-column prop="photo" label="广告图片" width="150" align="center">
                    <template  slot-scope="scope">
                        <img :src="scope.row.photo"  width="120" height="70" class="pre-img"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" >
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'HomeAdver',

        data() {
            return {
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
                    photo: '',
                    character: '',
                    type:'',
                    title:''
                },
                dialogVisible: false,
                base64Array:[],
                key:'',
                capture:'',
                tag:'0',
                activeName: 'second',
                tab_index:'1'
            }
        },
        created() {
            this.tab_index = '1';
            this.getData();

        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    return d;
                })
            }
        },
        methods: {

            //确定删除,请求
            deleteRow(){
                this.delVisible = false;
                var t = this;
                t.Loading = true;
                var dic = {
                    'advertising_id':this.tableData[this.idx].id,          //广告id(修改/删除传,新增不传)
                    'photo':'',                                            //广告展示图片
                    'character':'',                                        //广告内容
                    'type_advertising':t.form.type =='推荐' ? '0' : t.form.type =='雪茄' ? '1' : t.form.type =='红酒' ? '2' : '3',            //(0,推荐)(1,雪茄)(2,红酒)(3,高尔夫)
                    'type':'3',                                            //操作类型(1/修改，2/新增，3/删除)
                    'qiniu_key':'',                                        //七牛key
                    'title':''
                };
                this.$axios.post('/api/pub/advertising/6/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                    t.getData();
                });
                t.cancleBtn();
            },
            //增加按钮，弹出框
            addnews(index, row){

                this.idx = index;
                this.form = {
                    id: "",
                    type: this.tab_index == 0 ? '推荐' : this.tab_index == 1 ? '雪茄' : this.tab_index == 2 ? '红酒' : '高尔夫',
                    character: "",
                    photo: "",
                    title:''
                }
                var t = this;
                this.$router.push({
                    path:'/HomeAdver_Edit',
                    query:{
                        'form':t.form,
                    }
                })
            },
            //编辑按钮,弹出框
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    type: item.type == 0 ? '推荐' : item.type == 1 ? '雪茄' : item.type == 2 ? '红酒' :'高尔夫',
                    character: item.character,
                    photo: item.photo,
                    title:item.title
                }
                var t = this;
                this.$router.push({
                    path:'/HomeAdver_Edit',
                    query:{
                        'form':t.form,
                    }
                })
            },
            //单个删除,弹出框
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            //全部删除
            delAll() {
                this.$message.info('功能开发中');
            },



            //请求
            getData() {
                var t = this;
                this.$axios.get('/api/pub/advertising/'+this.tab_index+'/',{
                    page: this.cur_page
                }).then((res) => {
                    t.Loading = false;
                    t.tableData = res.data;
                })
            },
            //tab切换
            handleClick(tab, event) {
                var index =  event.target.getAttribute('id');
                this.tab_index =  index == 'tab-first' ? 0: index == 'tab-second' ? 1: index == 'tab-third' ? 2 : 3;
                this.getData();
            },

            //以下方法备用
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search() {
                this.is_search = true;
                this.$message.info('功能开发中');
            },
            type_formatter(value){
                value = value.type;
                return value == 0 ? '推荐' : value == 1 ? '雪茄' : value == 2 ? '红酒' :'高尔夫';
            },
            photo_formatter(value){
                console.log(value);
                value = value.type;
                return value == 0 ? '推荐' : value == 1 ? '雪茄' : value == 2 ? '红酒' :'高尔夫';
            },
            imageuploaded(res) {
                console.log(res)
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
        },
    }

</script>

<style scoped>
    .countSpan{
        text-align: right;        display: block;

    }
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
    .editor-btn{
        margin-top: 20px;
    }
</style>
