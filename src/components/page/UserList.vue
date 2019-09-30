
        <template>
            <div>
                <el-form  :inline="true" :model="formInline" class="demo-form-inline">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item label-width="20px">
                                <el-input v-model="formInline.user_name" placeholder="请输入账号/昵称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item>
                                <el-select v-model="formInline.gender" placeholder="请选择性别">
                                    <el-option label="男" value="1"></el-option>
                                    <el-option label="女" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item>
                                <el-select v-model="formInline.is_superuser" placeholder="是否为超级管理员">
                                    <el-option label="超级管理员" value="1"></el-option>
                                    <el-option label="非超级管理员" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item>
                                <el-select v-model="formInline.is_black" placeholder="状态">
                                    <el-option label="已拉黑" value="1"></el-option>
                                    <el-option label="正常" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-col :span="10">
                                    <el-date-picker value-format="timestamp" type="date" placeholder="选择日期" v-model="formInline.last_login_min" style="width: 100%;"></el-date-picker>
                                </el-col>
                                <el-col class="line" :span="2">-</el-col>
                                <el-col :span="10">
                                    <el-date-picker value-format="timestamp" type="date" placeholder="选择日期" v-model="formInline.last_login_max" style="width: 100%;"></el-date-picker>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item>
                                <el-button type="primary" @click="onSearch">搜索</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button  @click="resetForm">重置</el-button>
                            </el-form-item>
                        </el-col>





                    </el-row>

                </el-form>
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
                    <el-table-column prop="photo" label="头像" align="center" width="80">
                        <!-- 图片的显示 -->
                        <template  slot-scope="scope">
                            <img :src="getImgUrl(scope.row.photo)"
                                 :onerror="defaultImg"
                                 style="width: 50px;height:50px;border-radius:50%" class="pre-img"/>
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
                            :formatter="sexFormatter"
                    >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="birthday"
                            label="生日"
                            width="90"
                            :formatter="birthdayFormatter"

                    >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="mobile"
                            label="手机"
                            width="110">
                    </el-table-column>
                    <!--<el-table-column-->
                            <!--align="center"-->
                            <!--prop="weixin_name"-->
                            <!--label="微信名称"-->
                            <!--width="130">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                            <!--align="center"-->
                            <!--prop="weibo_name"-->
                            <!--label="微博名称"-->
                            <!--width="130">-->
                    <!--</el-table-column>-->
                    <el-table-column
                            align="center"
                            prop="site"
                            label="地址"
                            width="100"
                            >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="is_superuser"
                            label="超管"
                            width="70"
                            :formatter="chaoguanFormatter"
                    >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="is_black"
                            label="状态"
                            width="70"
                            :formatter="statusFormatter"

                    >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            fixed="right"
                            label="操作"
                            width="200"
                            >
                        <template slot-scope="scope">
                            <el-button @click="seeDetailInfo(scope.row)"  type ='primary' size="small">查看</el-button>
                            <el-button @click="blackThisRow(scope.row)" :type="scope.row.is_black ? 'success' : 'danger'" size="small"
                                       v-html="scope.row.is_black ? '恢复' : '拉黑'"></el-button>
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
            </div>
        </template>

        <script>
            export default {
                name: "UserList",
                data() {
                    return {
                        currentPage: 1,
                        defaultImg:'this.src="' + require('../../assets/img_moren.png') + '"',
                        isSearchBool:false,
                        laheiButton:'拉黑',
                        formInline: {
                            user_name: '',
                            gender: '',
                            is_superuser:'',
                            is_black:'',
                            last_login_max:'',
                            last_login_min:'',
                            page:''
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
                        tableData:[]
                    }
                },
                computed: {
                    data() {
                        return this.tableData.filter((d) => {
                            this.laheiButton = '哈哈哈';
                            return d;
                        })
                    }
                },
                created(){
                    this.getData();
                },
                methods: {
                    newYunYingUser(){

                    },
                    getImgUrl(key){
                        if (key && key!='' && key.indexOf('base64')==-1 && key.indexOf(this.$QiNiuUrl)==-1){
                            return this.$QiNiuUrl + key;
                        }
                        return key;
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
                        this.$axios.get("/api/users/user/" + this.currentPage + '/',{headers:{
                                "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                            this.tableData = res.data;
                        })
                    },
                    handleCurrentChange(val) {
                        this.currentPage = val;
                        if (this.isSearchBool){
                            this.postData();
                        } else {
                            this.getData();
                        }
                    },
                    //搜索用户
                    onSearch() {
                        this.currentPage = 1;
                        this.postData();


                    },
                    postData(){
                        var self = this;
                        var dic = {
                            user_name: this.formInline.user_name,
                            gender: this.formInline.gender,
                            is_superuser:this.formInline.is_superuser,
                            is_black:this.formInline.is_black,
                            last_login_max:this.formInline.last_login_max/1000,
                            last_login_min:this.formInline.last_login_min/1000,
                            page:this.currentPage
                        }
                        this.$axios.post('/api/users/user/1/',dic,{headers:{
                                "Authorization":"JWT " + localStorage.getItem('token')
                            }}).then(res=>{
                            self.tableData = res.data;
                        });
                    },
                    resetForm(){
                        this.formInline = {
                            user_name: '',
                            gender: '',
                            is_superuser:'',
                            is_black:'',
                            last_login_max:'',
                            last_login_min:'',
                            page:''
                        }
                    },
                    //拉黑
                    blackThisRow(item){
                        var user_id = item.id;
                        var username = item.username;
                        var self = this;
                        var status = item.is_black ? '恢复' : '拉黑' ;
                        this.$confirm('是否' + status  + '此用户'+ '【'+username+'】',{
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            self.$axios.post('/api/users/user/2/',{'user_id':user_id},{headers:{
                                    "Authorization":"JWT " + localStorage.getItem('token')
                                }}).then(res=>{
                                this.$message.success('操作成功');
                                self.getData();
                            });
                        }).catch(() => {

                        });

                    },
                    //查看用户详细信息
                    seeDetailInfo(item){
                        var user_id = item.id;
                        var self = this;
                        this.$router.push({
                            path:'/UsersFindContent',
                            query:{
                                'user_id':user_id,
                            }
                        })
                    }
                }
            }
        </script>

        <style scoped>
            .pre-img{
                width: 100px;
                height: 100px;
                background: #f8f8f8;
                border: 1px solid #eee;
                border-radius: 5px;
            }
        </style>
