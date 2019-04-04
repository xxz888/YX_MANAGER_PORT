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
        <el-dialog title="编辑" :close-on-click-modal="false" :visible.sync="editVisible" width="80%">
            <el-form ref="form" :model="form" label-width="100px" label-height = auto>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="文章内容">
                    <vue-ueditor-wrap id="ud1" v-model="content" :config="myConfig"></vue-ueditor-wrap>

                    <input @change="fileImage" type="file" accept="image/jpeg,image/x-png,image/gif" id="" value="选择图片" />
                    <span>{{count}}/5000</span>
                </el-form-item>

                <el-form-item label="展示图">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="imgSrc" class="pre-img" width="100" height="70" :formatter = 'photo_formatter'>
                            <div class="crop-demo-btn">选择图片
                                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancleBtn">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
        </el-dialog>
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
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

    export default {
        name: 'CigarAccessories',
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
            //分页切换取值
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //内容改变实时更新
            onContentChange (val) {
                this.content = val;
                this.count = this.content.length;
                if (this.count > 5000){
                    this.$message.warning('内容字符超过5000');
                }
            },
            //内容上传图片
            fileImage(e) {
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.dialogVisible = true;
                    t.$uploadQiNiuYun.uploadqiniuyun(event.target.result,function(res,key){
                        var img  = '<img src="'+ res  + '" alt="" />'
                        t.content = t.content + img;
                    });
                };
                reader.readAsDataURL(file);
            },
            // 新增和保存编辑，请求
            saveEdit(){
                var t = this;
                if (this.imgSrc.length == 0){
                    t.$message.warning('请上传图片');
                    return;
                }else if(this.content.length > 5000){
                    t.$message.warning('内容字符超过5000');
                    return;
                }
                if (this.imgSrc.indexOf('http://photo.thegdlife.com') == -1){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.imgSrc,function (res,key) {
                        t.saveAndEditCommon(res,key);
                    })
                }else{
                    t.saveAndEditCommon(this.imgSrc,t.imgSrc.split('http://photo.thegdlife.com/')[1]);
                }
            },
            //新增和储存公共方法
            saveAndEditCommon(photo_res,key){
                var t = this;
                var dic = {
                    'culture_id':t.form.culture_id,
                    'picture':photo_res,
                    'essay':t.content,
                    'type':t.form.culture_id.length == 0 ? 2 :1, //操作类型(1/修改，2/新增，3/删除)
                    'qiniu_key':key,                     //七牛key
                    'title':t.form.title
                };
                t.$axios.post('/api/cigar/cigar_culture/6/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                    t.getData();
                });
                t.cancleBtn();
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
                this.content = '';
                this.imgSrc = '';
                this.title = '';
                this.editVisible = true;
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
                this.imgSrc = item.picture;
                this.content = item.essay;
                this.title = item.title;
                this.editVisible = true;

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
            //封面图片
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.dialogVisible = true;
                    t.imgSrc = event.target.result;
                    t.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
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
