<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 广告列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
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
                <el-table-column prop="title" width="150" show-overflow-tooltip label="标题"  align="center">
                </el-table-column>
                <el-table-column prop="essay"  show-overflow-tooltip label="文章内容"  align="center">
                </el-table-column>
                <el-table-column prop="publish_time" label="时间" width="100" align="center":formatter = 'data_formatter'>
                </el-table-column>
                <el-table-column prop="picture" label="展示图" width="150" align="center">
                    <template  slot-scope="scope">
                        <img :src="scope.row.picture"  width="120" height="70" class="pre-img"/>
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
        <!-- 编辑弹出框 -->
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
        name: 'CigarAccessories',
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
                    culture_id: '',
                    picture: '',
                    essay: '',
                    type:'',
                    title:'',
                    qiniu_key:''
                },
                idx: -1,
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                content:'',
                base64Array:[],
                key:'',
                capture:'',
                tag:'0',
                count:'0',
                currentPage:1,

            }
        },
        created() {
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
            //分页切换取值
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },



            //确定删除,请求
            deleteRow(){
                this.delVisible = false;
                var t = this;
                var dic = {
                    'culture_id':this.tableData[this.idx].id,
                    'picture':'',
                    'essay':'',
                    'type':3, //操作类型(1/修改，2/新增，3/删除)
                    'qiniu_key':'',
                    'title':t.form.title
                };
                this.$axios.post('/api/cigar/cigar_culture/6/',dic,{headers:{
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
                    culture_id: "",
                    type:3,
                    essay: "",
                    picture: "",
                    title:''
                }
                var t = this;
                this.$router.push({
                    path:'/CigarAccessories_Edit',
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
                    culture_id: item.id,
                    essay: item.essay,
                    picture: item.picture,
                    title:item.title,
                    type:'1'
                }
                var t = this;
                this.$router.push({
                    path:'/CigarAccessories_Edit',
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
                this.$axios.get('/api/cigar/cigar_culture'+'/1/'+t.currentPage + '/',{
                    page: this.cur_page
                }).then((res) => {
                    t.tableData = res.data;
                })
            },
            //取消按钮方法
            cancleBtn(){
                this.editVisible = false;
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
            imageuploaded(res) {
                console.log(res)
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            data_formatter(value){
                return this.getLocalTime(value.publish_time);
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
