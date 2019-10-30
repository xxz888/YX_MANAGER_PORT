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
                <el-table-column prop="photo" label="展示图" align="center" width="150">
                    <!-- 图片的显示 -->
                    <template  slot-scope="scope">
                        <img :src="getImgUrl(scope.row.photo)"  width="200" height="100" class="pre-img"/>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="分类(商品)名"  width="250" align="center">
                </el-table-column>
                <el-table-column prop="label" label="标签"  width="100" align="center">
                </el-table-column>
                <el-table-column prop="weight" label="权重"  width="100" align="center">
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
                <el-form-item style="width: 50%;" label="商品名称">
                    <el-input placeholder="请输入名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item style="width: 50%;" label="标签">
                    <el-input placeholder="请输入标签" v-model="form.label"></el-input>
                </el-form-item>
                <el-form-item style="width: 50%;" label="权重">
                    <el-input placeholder="请输入权重" v-model="form.weight"></el-input>
                </el-form-item>
                <el-form-item style="width: 50%;" label="显示图">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="getImgUrl(form.photo)"  class="pre-img" width="70" height="70" >
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

    export default {
        name: 'HomeTools',

        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                editVisible: false,
                delVisible: false,
                dialogVisible: false,
                dialogTitle:'',
                currentPage:1,
                form : {
                'type':'1',
                'name':'',
                'label':'',
                'photo':'',
                'weight':'',
                'commodify_id':'',
                }
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
            getImgUrl(key){
                if (key && key!='' && key.indexOf('base64')==-1 && key.indexOf(this.$QiNiuUrl)==-1){
                    return this.$QiNiuUrl + key;
                }
                return key;
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
                this.editVisible=true;
            },
            //增加按钮，弹出框
            addnews(){
                this.form = {
                    'type':'1',
                    'name':'',
                    'label':'',
                    'photo':'',
                    'weight':'',
                    'commodify_id':'0',
                }
                this.dialogTitle = '新增';
                this.editVisible=true;
            },
            saveEdit(){
                var self = this;
                if (this.form.photo.indexOf(this.$QiNiuUrl) == -1 && this.form.photo.indexOf("_image_") == -1){
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
                var id =  this.form.id;
                if (id && id.length!=0){
                    dic = {
                        'type':'3',
                        'classify_id':this.form.id,
                        'name':this.form.name,
                        'label':this.form.label,
                        'photo':this.form.photo.indexOf(this.$QiNiuUrl)==-1?this.form.photo:this.form.photo.split(this.$QiNiuUrl)[1],
                        'weight':this.form.weight,
                        'commodify_id':this.form.commodify_id,
                    };
                }else{
                    dic = {
                        'type':'1',
                        'name':this.form.name,
                        'label':this.form.label,
                        'photo':this.form.photo.indexOf(this.$QiNiuUrl)==-1?this.form.photo:this.form.photo.split(this.$QiNiuUrl)[1],
                        'weight':this.form.weight,
                        'commodify_id':'0',
                    };
                }

                var self = this;
                this.$axios.post("/api/shop/integral_classify/",dic,{headers:{
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
                        'type':'2',
                        'classify_id':item.id,
                    };
                    self.$axios.post("/api/shop/integral_classify/",dic,{headers:{
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
                this.$router.push({
                    path:'/JiFenShopDetail',
                    query:{
                        'id':item.id,
                    }
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
                this.$axios.get("/api/shop/integral_classify/",{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.tableData = res.data.data;
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },



        },
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
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

    .pre-img1{
        width: 250px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
</style>
