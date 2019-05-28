<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="success" icon="search" @click="addnews">新增</el-button>
            </div>
            <el-table :data="data"  tooltip-effect="dark"
                      border  class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="ID"  width="50" align="center">
                </el-table-column>
                <el-table-column prop="name" label="NAME"  width="150" align="center">
                </el-table-column>
                <el-table-column prop="photo" label="展示图" align="center" width="300">
                    <!-- 图片的显示 -->
                    <template  slot-scope="scope">
                        <img :src="scope.row.photo"  width="150" height="100" class="pre-img1"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="text" icon="el-icon-tickets" class="green" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
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
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="editVisible" width="70%">
            <el-form label-width="100px" label-height = auto :model="form">
                <el-form-item style="width: 50%;" label="NAME">
                    <el-input placeholder="请输入名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item style="width: 50%;" label="显示图">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="form.photo"  class="pre-img" width="100" height="70" >
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
    </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

    export default {
        name: 'HomeTools',
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
                tab_index:'',
                count:'',
                content:'',
                todo:[],
                currentPage:1,
                type:'',
                dialogTitle:''
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
            //编辑按钮,弹出框
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = item;
                this.form.action = 3;
                this.form.option_id = item.id;
                this.dialogTitle = '编辑';
                this.editVisible=true;
            },
            //增加按钮，弹出框
            addnews(){
                this.form = {
                    'id':'',
                    'name':'',
                    'photo':'',
                    'action':1,
                    'father_id':'0',
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
                if (this.form.father_id){
                    dic = {
                        'action':this.form.action,
                        'father_id':this.form.father_id,
                        'name':this.form.name,
                        'photo':this.form.photo,
                        'is_next':1,
                        'photo_detail':'',
                        'intro':''
                    };
                }else{
                    dic = {
                        'action':this.form.action,
                        'name':this.form.name,
                        'photo':this.form.photo,
                        'is_next':1,
                        'option_id':this.form.option_id,
                        'photo_detail':'',
                        'intro':''
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
                this.idx = index;
                const item = this.tableData[index];
                localStorage.setItem('xxzTools',item.id);
                this.$router.push({
                    path:'/HomeToolsDetail',
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
            //请求
            getData() {
                var self = this;
                this.$axios.get("/api/pub/option/1/0/",{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.tableData = res.data;
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
        width: 200px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }

    .pre-img1{
        width: 250px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
</style>
