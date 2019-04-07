<template>
    <div>
            <el-form ref="form" :model="form" label-width="100px" label-height = auto>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="文章内容">
                    <vue-ueditor-wrap id="ud1" v-model="content" :config="myConfig"></vue-ueditor-wrap>
                    <input @change="fileImage" type="file" accept="image/jpeg,image/x-png,image/gif" id="" value="选择图片" />
                </el-form-item>

                <el-form-item label="展示图">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="imgSrc" class="pre-img" width="100" height="70">
                            <div class="crop-demo-btn">选择图片
                                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                            </div>
                        </div>
                    </template>
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
        name: "CigarAccessories_Edit",
        components: {
            VueUeditorWrap
        },
        data(){
            return{
                form:{},
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
            }
        },
        created(){
            this.getParams();

        },
        watch:{
            '$route':'getParams'
        },
        methods:{
            getParams(){
                this.form = this.$route.query.form;
                this.imgSrc = this.form.picture;
                this.content = this.form.essay;
                this.title = this.form.title;
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
                });
                t.cancleBtn();
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
            //取消按钮方法
            cancleBtn(){
                this.$router.go(-1);
            },
        }
    }
</script>

<style scoped>

</style>
