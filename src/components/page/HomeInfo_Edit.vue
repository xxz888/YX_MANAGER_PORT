<template>
    <div>
        <el-form ref="form" :model="form" label-width="100px" label-height = auto>
            <el-form-item label="类型">
                <el-input type="text" v-model="form.type_information"></el-input>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="form.author"></el-input>
            </el-form-item>
            <el-form-item label="转载">
                <el-checkbox @change="handleCheckedChange" v-model="zz_checked">是否为转载</el-checkbox>
            </el-form-item>
            <el-form-item v-if="visible1" label="转载URL">
                <el-input v-model="form.reprint_url"></el-input>
            </el-form-item>
            <el-form-item v-if="visible2" label="详情">
                <vue-ueditor-wrap id="ud1" v-model="content" :config="myConfig"></vue-ueditor-wrap>
                <input @change="fileImage" type="file" accept="image/jpeg,image/x-png,image/gif" id="" value="" />
            </el-form-item>
            <el-form-item label="展示图">
                <template  slot-scope="scope">
                    <div class="crop-demo">
                        <img :src="imgSrc" v-model="form.photo" class="pre-img" width="100" height="70">
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
        name: "HomeInfo_Edit",
        components: {
            VueUeditorWrap
        },
        data(){
            return{
                form:{},
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
                idx: -1,
                fileList: [],
                imgSrc: '',
                cropImg: '',
                content:'',
                zz_checked:'',
                visible1:false,
                visible2:true
            }
        },
        created(){
            this.getParams();

        },
        watch:{
            '$route':'getParams'
        },
        methods:{
            handleCheckedChange(val){
                this.visible1 = val;
                this.visible2 = !val;
            },
            getParams(){
                this.form = this.$route.query.form;
                this.imgSrc = this.form .photo;
                this.content = this.form .details;
                this.title = this.form .title;

                if (this.form.id.length == 0){
                    this.visible1 = false;
                    this.visible2 = true;//!this.form.is_reprint;
                } else {
                    this.visible1 = this.form.is_reprint;
                    this.visible2 = !this.form.is_reprint;
                }
                this.zz_checked = this.form.is_reprint;

            },
            // 新增和保存编辑，请求
            saveEdit() {
                var t = this;
                if (this.imgSrc.length == 0){
                    t.$message.warning('请上传图片');
                    return;
                }
                if (this.imgSrc.indexOf('http://photo.lpszn.com') == -1){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.imgSrc,function (res,key) {
                        t.saveAndEditCommon(res,key);
                    })
                }else{
                    t.saveAndEditCommon(this.imgSrc,t.imgSrc.split('http://photo.lpszn.com/')[1]);

                }
            },
            //新增和储存公共方法
            saveAndEditCommon(res,key) {
                var t = this;
                var dic = {
                    'information_id':t.form.id,             //资讯id(修改/删除传,新增不传)
                    'photo':res,                            //资讯展示图片
                    'title':t.form.title,                   //资讯标题
                    'type_information':t.form.type_information =='推荐' ? '0' : t.form.type_information =='雪茄' ? '1' : t.form.type_information =='红酒' ? '2' : '3',            //(0,推荐)(1,雪茄)(2,红酒)(3,高尔夫)
                    'author':t.form.author,                  //作者
                    'details':t.content,                    //资讯详情
                    'type':t.form.id.length == 0 ? 2 :1,     //操作类型(1/修改，2/新增，3/删除)
                    'qiniu_key':key,
                    'is_reprint':t.zz_checked ? '1' : '0',
                    'reprint_url':t.form.reprint_url,
                };
                t.$axios.post('/api/pub/information/6/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                });
                t.cancleBtn();
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
                    t.$refs.cropper && t.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
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
