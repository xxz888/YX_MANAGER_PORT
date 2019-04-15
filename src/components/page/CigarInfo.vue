<template>
    <div class="table">
        <div class="crumbs">

            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 雪茄品牌</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName"  @tab-click="handleClick">
                <el-tab-pane v-for = 'item in todo' :label="item.site" :name="item.site"></el-tab-pane>
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
                <el-table-column prop="photo" label="展示图" align="center" width="120">
                    <!-- 图片的显示 -->
                    <template  slot-scope="scope">
                        <img :src="scope.row.photo"  width="80" height="30" class="pre-img"/>
                    </template>
                </el-table-column>
                <el-table-column prop="cigar_brand" label="雪茄品牌" width="120" align="center">
                </el-table-column>
                <el-table-column prop="concern_number" label="关注人数" width="100" align="center" >
                </el-table-column>
                <el-table-column prop="intro" show-overflow-tooltip  align="center" label="详情"  >
                </el-table-column>
                <el-table-column prop="is_hot" label="热门" width="80" align="center" >
                </el-table-column>
                <el-table-column prop="is_show" label="显示" width="80" align="center" :formatter="isShowFormatter">
                </el-table-column>
                <el-table-column  label="详情" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" round @click="handleDetails(scope.$index, scope.row)">详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 编辑弹出框 -->
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleBtn">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

    export default {
        name: 'CigarInfo',
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
                todo:[]
            }
        },
        created() {
            var self = this;
            this.$axios.get('/api/cigar/cigar_brand_site/',{headers:{
                    "Authorization":"JWT " + localStorage.getItem('token')
                }}).then(res=>{
                self.todo = res.data;
                self.activeName = self.todo[0]['site'];
                self.tab_index = self.todo[0]['id'];
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
            isShowFormatter: function (row, column) {
                return row.is_show? '是' : '否';
            },
            //编辑按钮,弹出框
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    cigar_brand_id: item.id,
                    cigar_brand:item.cigar_brand,
                    photo: item.photo,
                    type_cigar_brand:this.tab_index,
                    is_hot: item.is_hot == '是' ? true : false,
                    is_show:item.is_show,
                    intro:item.intro,
                    concern_number:item.concern_number,
                    type:  '1',
                    qiniu_key:'',
                    activeName:this.activeName
                }

                var t = this;
                this.$router.push({
                    path:'/CigarInfo_Edit',
                    query:{
                        'form':t.form,
                    }
                })

            },
            //增加按钮，弹出框
            addnews(){
                this.form = {
                    cigar_brand_id:'',
                    cigar_brand:'',
                    photo: '',
                    type_cigar_brand:this.tab_index,
                    is_hot:true,
                    is_show:true,
                    intro:'',
                    concern_number:'',
                    qiniu_key:'',
                    type:'2',
                    activeName:this.activeName
                }
                var t = this;
                this.$router.push({
                    path:'/CigarInfo_Edit',
                    query:{
                        'form':t.form,
                    }
                })
            },

            //确定删除,请求
            deleteRow(){
                this.delVisible = false;
                var t = this;
                t.Loading = true;
                var dic = {
                    'cigar_brand_id':this.tableData[this.idx].id,   //广告id(修改/删除传,新增不传)
                    'cigar_brand':'',
                    'photo':'',                         //广告展示图片
                    'type_cigar_brand':this.tab_index,
                    'is_hot':'',
                    'is_show':'',
                    'intro':'',               //广告内容
                    'type':'3', //操作类型(1/修改，2/新增，3/删除)
                    'qiniu_key':t.tableData[t.idx].photo.split('http://photo.thegdlife.com/')[1]                          //七牛key
                };
                this.$axios.post('/api/cigar/ad_cigar_brand/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                    t.getData();
                });
                t.cancleBtn();
            },
            //跳转详情页面
            handleDetails(index,row){
                var t = this;
                this.$router.push({
                    path:'/CigarDetails',
                    query:{
                        'id':t.tableData[index].id,
                        'cigar_name':t.tableData[index].cigar_brand
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
            //取消按钮方法
            cancleBtn(){
                this.delVisible = false;
            },
            //请求
            getData() {

                this.$axios.get('/api/cigar/admin_cigar_brand/'+this.tab_index+'/', {
                    page: this.cur_page
                }).then((res) => {
                    var arr1 = res.data.brand_list;
                    var arr2 = res.data.hot_brand_list;
                    for (var i =0;i<arr1.length;i++){
                        arr1[i].is_hot = "否";
                        for (var k =0;k<arr2.length;k++){
                            if (arr1[i].id == arr2[k].id){
                                arr1[i].is_hot = "是";
                            }
                        }
                    }
                    this.tableData = arr1;
                })
            },
            //tab切换
            handleClick(tab, event) {
                console.log(tab, event);
                var string = event.target.getAttribute('id').split('-')[1];
                for (var i = 0 ; i < this.todo.length ; i ++){
                    if (string == this.todo[i].site){
                        this.tab_index = this.todo[i].id;
                        this.activeName = this.todo[i].site;
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
