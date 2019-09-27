<template>
        <div>
            <el-form ref="form" :model="form" label-width="100px" label-height = auto>
                <el-form-item label="配件名">
                    <el-input v-model="form.brand_name"></el-input>
                </el-form-item>
                <el-form-item label="热门">
                    <el-checkbox v-model="checked">热门</el-checkbox>
                </el-form-item>
                <el-form-item label="显示">
                    <el-checkbox v-model="showChecked">显示</el-checkbox>
                </el-form-item>
                <el-form-item label="商品简介">
                    <vue-ueditor-wrap id="ud1" v-model="content" :config="myConfig"></vue-ueditor-wrap>
                    <input @change="fileImage" type="file" accept="image/jpeg,image/x-png,image/gif" id="" value="" />
                </el-form-item>
                <el-form-item label="配件logo">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="imgSrc" class="pre-img" width="100" height="70" >
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
        name: "CigarShop_Edit",

        data(){
            return{
                form:{},

                idx: -1,
                fileList: [],
                imgSrc: '',
                cropImg: '',
                content:'',
                checked:true,
                disabled:false,
                showChecked:true

            }
        },
        created(){
            this.getParams();

        },
        watch:{
            '$route':'getParams'
        },
        methods: {
            getParams() {
                this.form = this.$route.query.form;
                this.imgSrc = this.form.brand_logo;
                this.content = this.form.intro;
                this.checked = this.form.is_got;
                this.type = this.form.type;
                this.showChecked = this.form.is_show;

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
                    t.$uploadQiNiuYun.uploadqiniuyun(event.target.result, function (res, key) {
                        var img = '<img src="' + res + '" alt="" />'
                        t.content = t.content + img;
                    });
                };
                reader.readAsDataURL(file);
            },
            // 新增和保存编辑，请求
            saveEdit() {
                var t = this;
                t.Loading = true;
                if (this.imgSrc.length == 0) {
                    t.$message.warning('请上传图片');
                    return;
                } else if (this.content.length > 2000) {
                    t.$message.warning('内容字符超过2000');
                    return;
                }
                if (this.imgSrc.indexOf('http://photo.lpszn.com') == -1) {
                    this.$uploadQiNiuYun.uploadqiniuyun(this.imgSrc, function (res, key) {
                        t.saveAndEditCommon(res, key);
                    })
                } else {
                    t.saveAndEditCommon(this.imgSrc, t.imgSrc.split('http://photo.lpszn.com/')[1]);

                }
            },
            //新增和储存公共方法
            saveAndEditCommon(res,key) {
                var t = this;
                var dic = {
                    'brand_name': t.form.brand_name,
                    'brand_logo': res,
                    'is_got': t.checked?'1':'0',
                    'intro':t.content,
                    'brand_id':t.form.brand_id,
                    'type':t.form.type,
                    'qiniu_key':key,                      //七牛key
                    'is_show': t.showChecked?'1':'0',
                };
                t.$axios.post('/api/cigar/cigar_accessories_brand/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                });
                t.cancleBtn();
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
                    t.imgSrc = event.target.result;
                    t.$refs.cropper && this.$refs.cropper.replace(event.target.result);
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
