
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>指南详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName"  @tab-click="handleClick">
                <el-tab-pane v-for = 'item in todo' :label="item.name" :name="item.name"></el-tab-pane>
            </el-tabs>
            <div style="margin: 20px;"></div>
            <div class="handle-box">
                <el-button type="success" icon="search" @click="addnews">新增</el-button>
            </div>
            <el-table :data="data"  tooltip-effect="dark"
                      border  class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="ID"  width="50" align="center">
                </el-table-column>
                <el-table-column prop="name" label="NAME"  width="150" align="center">
                </el-table-column>
                <el-table-column prop="photo" label="展示图" align="center" width="200">
                    <!-- 图片的显示 -->
                    <template  slot-scope="scope">
                        <img :src="scope.row.photo"  class="pre-img"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="详情图片" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleDetail(scope.$index, scope.row)">{{scope.row.photo.length>0?'编辑详情图片':'新增详情图片'}}</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>


        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="editVisible" width="70%">
            <el-form label-width="100px" label-height = auto :model="form">
                <el-form-item style="width: 50%;" label="NAME">
                    <el-input placeholder="请输入名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item style="width: 50%;" label="头像">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="form.photo"  class="pre-img"  >
                            <div class="crop-demo-btn">选择图片
                                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
        </el-dialog>


        <!-- 详情编辑弹出框 -->
        <el-dialog title="详情图片" :close-on-click-modal="false" :visible.sync="detailVisible" width="70%">
            <el-form label-width="100px" label-height = auto>
                <el-form-item style="width: 50%;" label="详情图片">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="detailPhoto"  class="pre-img-Detail"  >
                            <div class="crop-demo-btn">选择图片
                                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImageDetail"/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="detailVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveDetail">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

    export default {
        name: 'HomeToolsDetail',
        components: {
            VueUeditorWrap
        },
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
                    name: '',
                    photo: '',
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
                fatherId:'',
                startId:'',
                dialogTitle:'',
                detailPhoto:'',
                detailVisible:false,
                detailId:'',
                detailDetailId:'',
                isDetailEditOrAdd:false //false为新增 true为编辑
            }
        },
        created() {
            this.getParmters();
        },
        watch:{
            '$route':'getParmters'
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    return d;
                })
            }
        },
        methods: {
            getParmters(){
                this.startId = localStorage.getItem('xxzTools');
                if (this.startId){
                    this.getData();
                }
            },
            //分页切换取值
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //编辑按钮,弹出框
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = item;
                this.form.action = 3;
                this.form.option_id = item.id;
                this.dialogTitle = '编辑';
                this.fatherId = null;
                this.editVisible=true;
            },
            //增加按钮，弹出框
            addnews(){
                this.form = {
                    'id':'',
                    'name':'',
                    'photo':'',
                    'action':1,
                    'father_id':this.father_id,
                    'is_next':1
                }
                this.dialogTitle = '新增';
                this.editVisible=true;
            },
            saveEdit(){
                var self = this;
                if (this.form.photo.indexOf('http://photo.thegdlife.com') == -1){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.form.photo,function (res,key) {
                        self.form.photo = res;
                        self.saveEditAndAdd();
                    })
                }else{
                    self.saveEditAndAdd();
                }

            },
            saveEditAndAdd(){
                var dic;
                if (this.fatherId){
                    dic = {
                        'action':this.form.action,
                        'father_id':this.fatherId,
                        'name':this.form.name,
                        'photo':this.form.photo,
                        'is_next':1,
                    };
                }else{
                    dic = {
                        'action':this.form.action,
                        'name':this.form.name,
                        'photo':this.form.photo,
                        'is_next':1,
                        'option_id':this.form.option_id
                    };
                }

                var self = this;
                this.$axios.post("/api/pub/option/6/6/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    if (res.data.status == 1){
                        self.$message.success(res.data.message);
                        self.getData();
                    } else {
                        self.$message.warning(res.data.message);
                    }
                    self.editVisible = false;
                })
            },
            //确定删除,请求
            handleDelete(index, row){
                this.idx = index;
                const item = this.tableData[index];
                var self = this;
                this.$confirm('是否删除' + '【'+item.name + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var dic = {
                        'action':2,
                        'option_id':item.id,
                    };
                    self.$axios.post("/api/pub/option/6/6/",dic,{headers:{
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
            handleDetail(index, row){
                this.detailId =  this.tableData[index]['id'];
                var self = this;
                this.$axios.get("/api/pub/option/0/"+this.detailId+'/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                            if (res.data.length>0){//编辑
                                self.isDetailEditOrAdd = true;
                                self.detailPhoto = res.data[0].photo;
                                self.detailDetailId = res.data[0].id;
                            }else {//新增
                                self.isDetailEditOrAdd = false;
                                self.detailPhoto = '';
                                self.detailDetailId = '';
                            }
                            self.detailVisible = true;
                });
            },
            saveDetail(){
                var self = this;
                if (this.detailPhoto.indexOf('http://photo.thegdlife.com') == -1){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.detailPhoto,function (res,key) {
                        self.detailPhoto = res;
                        self.saveEditAndAddDetail();
                    })
                }else{
                    self.saveEditAndAddDetail();
                }
            },
            saveEditAndAddDetail(){
                var dic = {};

                if (this.detailId){
                    if (this.isDetailEditOrAdd){//编辑
                        dic = {
                            'action': '3',
                            'option_detail_id':this.detailDetailId,
                            'option_id':this.detailId,
                            'photo':this.detailPhoto,
                            'weight':'1'
                        };
                    } else{
                        dic = {
                            'action': '1',
                            'option_id':this.detailId,
                            'photo':this.detailPhoto,
                            'weight':'1'

                        };
                    }
                }else{
                    this.$message.warning('非服务器弹出提示:未获取到[option_id]');
                    return;
                }

                var self = this;
                this.$axios.post("/api/pub/option_detail/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    if (res.data.status == 1){
                        self.$message.success(res.data.message);
                        self.getData();
                    } else {
                        self.$message.warning(res.data.message);
                    }
                    self.detailVisible = false;
                    self.detailPhoto = '';
                    self.detailDetailId = '';
                })
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
                    t.form.photo = event.target.result;
                    t.$refs.cropper && t.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            //封面图片
            setImageDetail(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.detailPhoto = event.target.result;
                    t.$refs.cropper && t.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },

            //请求
            getData() {
                var self = this;
                this.$axios.get("/api/pub/option/1/"+this.startId+'/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.todo = res.data;
                    self.activeName = res.data[0]['name'];
                    self.fatherId = res.data[0]['id'];
                    self.getDataDetail();
                });
            },
            getDataDetail(){
                var self = this;
                this.$axios.get("/api/pub/option/1/"+this.fatherId+'/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.tableData = res.data;
                });
            },
            //tab切换
            handleClick(tab, event) {
                var string = event.target.getAttribute('id').split('-')[1];
                for (var i = 0 ; i < this.todo.length ; i ++){
                    if (string == this.todo[i].name){
                        this.fatherId = this.todo[i].id;
                    }
                }
                this.getDataDetail();
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
        border-radius: 50px;
    }
    .pre-img-Detail{
        width: 150px;
        height: 400px;
        background: #f8f8f8;
    }
</style>
