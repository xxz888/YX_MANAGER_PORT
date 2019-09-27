<template>
    <div>
            <el-form ref="form" :model="form" label-width="100px" label-height = auto>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="转载">
                    <el-checkbox @change="handleCheckedChange" v-model="zz_checked">是否为转载</el-checkbox>
                </el-form-item>
                <el-form-item v-if="visible1" label="转载URL">
                    <el-input v-model="form.reprint_url"></el-input>
                </el-form-item>
                <el-form-item v-if="visible2" label="文章内容" >
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

    export default {
        name: "CigarAccessories_Edit",

        data(){
            return{
                form:{},

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
                this.imgSrc = this.form.picture;
                this.content = this.form.essay;
                this.title = this.form.title;
                this.zz_checked = this.form.is_reprint;

                if (this.form.type == 2){
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
            //新增和储存公共方法
            saveAndEditCommon(photo_res,key){
                var t = this;
                var dic = {
                    'title':t.form.title,
                    'picture':photo_res,
                    'essay':t.content,
                    'qiniu_key':key,                     //七牛key
                    'culture_id':t.form.culture_id,
                    'type':t.form.type,
                    'is_reprint':t.zz_checked ? '1' : '0',
                    'reprint_url':t.form.reprint_url,
                    'culture_type':'1'
                };
                t.$axios.post('/api/cigar/cigar_culture/6/6/',dic,{headers:{
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
                if (this.imgSrc.indexOf('http://photo.lpszn.com') == -1){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.imgSrc,function (res,key) {
                        t.saveAndEditCommon(res,key);
                    })
                }else{
                    t.saveAndEditCommon(this.imgSrc,t.imgSrc.split('http://photo.lpszn.com/')[1]);
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
