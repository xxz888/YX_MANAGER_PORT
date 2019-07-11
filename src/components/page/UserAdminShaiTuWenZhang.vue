
<template>
    <div>
        <el-form ref="form" :model="form" label-width="100px" label-height = auto>
            <el-form-item label="简介">
                <el-input type="textarea" v-model="title"></el-input>
            </el-form-item>

            <el-form-item label="封面图片">
                <template  slot-scope="scope">
                    <div class="crop-demo">
                        <img :src="imgSrc" class="pre-img" width="100" height="70" >
                        <div class="crop-demo-btn">选择图片
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                    </div>
                </template>
            </el-form-item>

            <el-form-item  label="文章内容">
                <vue-ueditor-wrap id="ud1" v-model="content" :config="myConfig"></vue-ueditor-wrap>
                <input @change="fileImage" type="file" accept="image/jpeg,image/x-png,image/gif" id="" value="" />
            </el-form-item>

        </el-form>
        <div align="center">
            <el-button @click="cancleBtn">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
    export default {
        name: "UserAdminShaiTuWenZhang",
        components: {
            VueUeditorWrap
        },
        data(){
            return{
                form:{

                },
                myConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: true,
                    serverUrl: 'http://35.201.165.105:8000/controller.php',
                    UEDITOR_HOME_URL: "/UEditor/",
                    initialFrameWidth: '100%',
                },
                idx: -1,
                fileList: [],
                imgSrc: '',
                cropImg: '',
                content:'',
                title:'',
                checked:true,
                disabled:false,
                showChecked:true

            }
        },


        methods: {

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
                    t.$uploadQiNiuYun.uploadqiniuyun(event.target.result, function (res, key) {
                        var img = '<img src="' + res + '" alt="" />'
                        t.content = t.content + img;
                    });
                };
                reader.readAsDataURL(file);
            },
            //新增和储存公共方法
            saveEdit() {
                var self = this;
                var dic = {
                    detail:self.content,
                    post_id : "",
                    publish_site : "",
                    obj :"2",
                    title : self.title,
                    tag : "",
                    photo_list : "",
                    cover : self.imgSrc,
                };
                self.$axios.post('/api/users/post/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    self.$message.success(res.data.message);
                });
                self.cancleBtn();
            },
            setImage(e) {
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.dialogVisible = true;
                    t.$uploadQiNiuYun.uploadqiniuyun(event.target.result,function (res,key) {
                        t.imgSrc = res;
                        t.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                    })

                };
                reader.readAsDataURL(file);
            },
            //取消按钮方法
            cancleBtn() {
                this.$router.go(-1);
            },
        }
    }
</script>

<style scoped>

</style>
