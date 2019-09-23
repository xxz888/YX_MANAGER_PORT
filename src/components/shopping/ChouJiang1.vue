
<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="success" icon="search" @click="addnews">新增</el-button>
            </div>
            <el-table
                    row-key="id"

                    :data="tableData"
                    tooltip-effect="dark"
                    border
                    class="table"
                    ref="multipleTable">
                <el-table-column prop="id" label="ID"  width="50" align="center">
                </el-table-column>
                <el-table-column prop="name" label="名称"  width="150" align="center">
                </el-table-column>

                <el-table-column prop="photo" label="图片" align="center" width="200">
                    <!-- 图片的显示 -->
                    <template  slot-scope="scope">
                        <img :src="getImgUrl(scope.row.photo)"  class="pre-img"/>
                    </template>
                </el-table-column>
                <el-table-column prop="odds" label="概率"  width="150" align="center">
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="editVisible" width="70%">
            <el-form label-width="100px" label-height = auto :model="form">
                <el-form-item style="width: 50%;" label="名称">
                    <el-input placeholder="请输入名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item style="width: 50%;" label="概率">
                    <el-input placeholder="请输入概率" v-model="form.odds"></el-input>
                </el-form-item>

                <!--<el-form-item label="显示">-->
                    <!--<el-checkbox v-model="form.is_show" >显示</el-checkbox>-->
                <!--</el-form-item>-->

                <el-form-item style="width: 50%;" label="图片">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="getImgUrl(form.photo)"  class="pre-img"  >
                            <div class="crop-demo-btn">选择图片
                                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="hiddenDialog">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'ChouJiang1',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                editVisible: false,
                delVisible: false,
                dialogTitle:'',
                form: {
                    name: '',
                    photo: '',
                    type:'',
                    odds:'',
                    is_show:true,
                    ratio:''
                },
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
            },
        },
        mounted() {

        },
        methods: {

            getImgUrl(key){
                if (key && key!='' && key.indexOf('base64')==-1 && key.indexOf(this.$QiNiuUrl)==-1){
                    return this.$QiNiuUrl + key;
                }
                return key;
            },
            delCommontAction(item){
                var self = this;
                var dic = {'type':2,'prize_id':item.id,};
                this.$axios.post("/api/pub/prize/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    if (res.data.status == 1){
                        self.$message.success(res.data.message);
                        self.getData();
                    } else {
                        self.$message.warning(res.data.message);
                    }
                })
            },
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
                this.form.type = 3;
                this.form.prize_id = item.id;
                this.dialogTitle = '编辑';
                this.editVisible=true;
            },
            //增加按钮，弹出框
            addnews(){
                this.form= {
                    name: '',
                    photo: '',
                    type:1,
                    odds:'',
                    is_show:true,
                    ratio:'',
                }
                this.dialogTitle = '新增';
                this.editVisible=true;
            },
            saveEdit(){
                var self = this;
                if (this.form.photo == '' ){
                    self.saveEditAndAdd();
                    return;
                }
                var boll1 =  this.form.photo.indexOf(this.$QiNiuUrl) == -1 && this.form.photo.indexOf('_image_') == -1 ;


                if (boll1){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.form.photo,function (res,key) {
                        self.form.photo = res;
                        self.saveEditAndAdd();
                    })
                }else{
                    self.saveEditAndAdd();
                }

            },
            hiddenDialog(){
              this.getData();
              this.editVisible = false;
            },
            saveEditAndAdd(){
                var self = this;
                var img = new Image();
                if (this.form.photo.indexOf(this.$QiNiuUrl)==-1){
                    img.src = this.$QiNiuUrl  + this.form.photo ;
                }else{
                    img.src = this.form.photo;
                }
                img.onload = function(){
                    self.form.is_show = 1;//self.form.is_show  ? 1 :0;
                    self.form.ratio = img.height/img.width;
                    self.form.photo = self.form.photo.indexOf(self.$QiNiuUrl)==-1 ? self.form.photo : self.form.photo.split(self.$QiNiuUrl)[1];
                    delete  self.form.id;
                    self.$axios.post("/api/pub/prize/",self.form,{headers:{
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
                };

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
                    self.delCommontAction(item);
                }).catch(() => {});
            },
            //封面图片和详情图片
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
                this.$axios.get("/api/pub/prize/",{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.tableData = res.data.prize;
                });
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

    .table{
        width: 100%;
        font-size: 14px;

    }
    .red{
        color: #ff0000;
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
        border-radius: 10px;
    }
    .el-tag + .el-tag {
        margin-left: 10px
    }

</style>
