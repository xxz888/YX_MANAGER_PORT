<template>
    <div>
        <el-form ref="form" :model="form" label-width="100px" label-height = auto>
            <el-form-item label="类型">
                <el-select v-model="form.type" placeholder="form.type">
                    <el-option key="0" label="推荐" value="0"></el-option>
                    <el-option key="1" label="雪茄" value="1"></el-option>
                    <el-option key="2" label="红酒" value="2"></el-option>
                    <el-option key="3" label="高尔夫" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="转载">
                <el-checkbox @change="handleCheckedChange" v-model="zz_checked">是否为转载</el-checkbox>
            </el-form-item>
            <el-form-item v-if="visible1" label="转载URL">
                <el-input v-model="form.reprint_url"></el-input>
            </el-form-item>
            <el-form-item v-if="visible2" label="广告文字">
                <vue-ueditor-wrap  id="ud1" v-model="content" :config="myConfig"></vue-ueditor-wrap>
                <input @change="fileImage" type="file" accept="image/jpeg,image/x-png,image/gif" id="" value="选择图片" />
            </el-form-item>

            <el-form-item label="广告图片">
                <template  slot-scope="scope">
                    <div class="crop-demo">
                        <img :src="imgSrc"  class="pre-img" width="100" height="70" >
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
        name: "HomeAdver_Edit",
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
                this.content = this.form .character;
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
            // 新增和保存编辑，请求
            saveEdit(){
                var t = this;
                t.Loading = true;
                if (this.imgSrc.length == 0){
                    t.$message.warning('请上传图片');
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
            //新增和储存公共方法
            saveAndEditCommon(photo_res,key){

                var t = this;
                var dic = {
                    'advertising_id':t.form.id,          //广告id(修改/删除传,新增不传)
                    'photo':photo_res,                   //广告展示图片
                    'character':t.content,               //广告内容
                    'type_advertising':t.form.type =='推荐' ? '0' : t.form.type =='雪茄' ? '1' : t.form.type =='红酒' ? '2' : '3',            //(0,推荐)(1,雪茄)(2,红酒)(3,高尔夫)
                    'type':t.form.id.length == 0 ? 2 :1, //操作类型(1/修改，2/新增，3/删除)
                    'qiniu_key':key,                     //七牛key
                    'title':t.form.title,
                    'is_reprint':t.zz_checked ? '1' : '0',
                    'reprint_url':t.form.reprint_url,
                };
                t.$axios.post('/api/pub/advertising/6/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                    t.$router.go(-1);
                });
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
