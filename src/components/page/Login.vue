<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password" align="right">
                        <el-button type="success"  @click="sendPhoneCode">获取验证码</el-button>
                </el-form-item>

                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '13383773800',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            //发送验证码
            sendPhoneCode() {
                this.$axios.get('/api/pub/smscode/'+this.ruleForm.username+'/').then(res=>{
                    this.$message({
                        message: '验证码已发送',
                        type: 'success'
                    });
                    this.ruleForm.password = '666666';
                })
            },
            //提交
            submitForm(formName) {
                this.$axios.post('/api/users/register/',
                    {'mobile':this.ruleForm.username,'sms_code':this.ruleForm.password})
                    .then(res=>{
                        if (res.data.id){
                            localStorage.setItem('id',res.data.id);
                            localStorage.setItem('token',res.data.token);
                            localStorage.setItem('ms_username',this.ruleForm.username);
                            this.$router.push('/');
                        }else {
                            this.$message.warning(res.data.message);
                        }

                })
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>
