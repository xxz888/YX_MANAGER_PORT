<template>
    <div>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    fixed
                    prop="id"
                    label="序号"
                    width="50">
            </el-table-column>
            <el-table-column prop="photo" label="头像" align="center" width="50">
                <!-- 图片的显示 -->
                <template  slot-scope="scope">
                    <img :src="scope.row.photo"
                         :onerror="defaultImg"
                         style="width: 35px;height:35px;border-radius:50%" class="pre-img"/>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="username"
                    label="姓名"
                    width="120">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="gender"
                    label="性别"
                    width="50"
                    :formatter="sexFormatter">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="birthday"
                    label="生日"
                    width="110"
                    :formatter="birthdayFormatter" >
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="mobile"
                    label="手机"
                    width="110">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="weixin_name"
                    label="微信名称"
                    width="130">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="site"
                    label="地址"
                    >
            </el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button @click="editAdminUserInfo(scope.row)"  type ='primary' size="small">编辑个人资料</el-button>
                    <!--<el-button @click="seeDetailInfo(scope.row)"  type ='primary' size="small">查看</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    style="margin: 50px auto;"
                    align="center"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="20"
                    layout="prev, pager, next, jumper"
                    :total="1000">
            </el-pagination>
        </div>


        <!-- 编辑弹出框 -->
        <el-dialog title="编辑用户资料" :close-on-click-modal="false" :visible.sync="editVisible" width="70%">
            <el-form label-width="100px" label-height = auto :model="formInline">
                <el-form-item style="width: 50%;" label="用户名称">
                    <el-input placeholder="请输入用户名称" v-model="formInline.username"></el-input>
                </el-form-item>
                <el-form-item  style="width: 50%;" label="性别">
                    <el-select style="width: 100%;" v-model="formInline.gender" placeholder="请选择性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item style="width: 50%;" label="生日">
                    <el-input v-model="formInline.birthday" placeholder="生日"></el-input>
                </el-form-item>

                <el-form-item style="width: 50%;" label="地址">
                    <el-input v-model="formInline.site" placeholder="地址"></el-input>
                </el-form-item>


                <el-form-item style="width: 50%;" label="头像">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="formInline.photo"  class="pre-img" width="100" height="70" >
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
        name: "UserAdminList",
        data() {
            return {
                currentPage: 1,
                defaultImg:'this.src="' + require('../../assets/img_moren.png') + '"',
                isSearchBool:false,
                laheiButton:'拉黑',
                formInline: {
                    user_id:'',
                    username: '',
                    gender: '',
                    photo:'',
                    birthday:'',
                    site:'',
                },
                form: {
                    birthday: '',
                    gender: '',
                    id: '',
                    mobile: '',
                    photo: '',
                    site: '',
                    username: '',
                    weibo_name: '',
                    weixin_name:'',
                    is_black:'',
                    is_superuser:''
                },
                tableData:[],
                editVisible:false,
                imgSrc:''
            }
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    return d;
                })
            }
        },
        created(){
            this.getData();
        },
        methods: {
            //封面图片
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.formInline.photo = event.target.result;
                    t.$refs.cropper && t.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            saveEdit(){
                var self = this;
                if (this.formInline.photo.indexOf('http://photo.lpszn.com') == -1){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.formInline.photo,function (res,key) {
                        self.saveAndEditCommon(res);
                    })
                }else{
                    self.saveAndEditCommon(this.formInline.photo);
                }
            },
            saveAndEditCommon(photo){

                var self = this;
                this.formInline.photo = photo;
                this.formInline.gender =
                    this.formInline.gender == '男' ? '1' :
                    this.formInline.gender == '女' ? '0' : this.formInline.gender;

                            this.$axios.post('/api/users/admin_user/',this.formInline,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{

                    if (this.formInline.mobile == localStorage.getItem('token')) {
                        localStorage.setItem('token',res.data.token);
                    }
                    self.$message.success(res.data.message);
                    self.editVisible= false;
                    self.getData();
                });

            },
            birthdayFormatter(val){
                if (val.birthday == '(null)'){
                    return ''
                } else {
                    return val.birthday;
                }
            },
            sexFormatter(val){
                var sex = val.gender;
                return sex == 0 ? '女' : sex == 1 ? '男' : '不详';
            },
            chaoguanFormatter(val){
                var sex = val.is_superuser;
                return sex ? '是' : '否';
            },
            statusFormatter(val){
                var sex = val.is_black;
                return sex ? '已拉黑' : '正常';
            },
            getData(){
                this.$axios.get("/api/users/admin_user/",{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    this.tableData = res.data;
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //编辑用户信息
            editAdminUserInfo(item){
                this.formInline.user_id = item.id;
                this.formInline.username = item.username;
                this.formInline.photo = item.photo;
                this.formInline.birthday = item.birthday;
                this.formInline.site = item.site;
                this.formInline.gender = item.gender==0?"女":"男";


                this.editVisible = true;
            },
        }
    }
</script>

<style scoped>
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
