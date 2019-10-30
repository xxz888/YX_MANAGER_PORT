
<template>
    <div>
        <el-form ref="form" :model="form" label-width="100px" label-height = auto>
            <el-form-item label="标题">
                <el-input type="textarea" v-model="title"></el-input>
            </el-form-item>



            <el-form-item  label="正文">
                <div class="container">
                    <quill-editor :options="editorOption" @change="onEditorChange($event)" ref="customQuillEditor" v-model="content" ></quill-editor>
                    <div class="crop-demo-btn1">插入图片
                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImageContent"/>
                    </div>
                </div>


                <!--<vue-ueditor-wrap id="ud1" v-model="content" :config="myConfig"></vue-ueditor-wrap>-->
                <!--<input @change="fileImage" type="file" accept="image/jpeg,image/x-png,image/gif" id="" value="" />-->
            </el-form-item>
            <el-form-item label="封面图片">
                <template  slot-scope="scope">
                    <div class="crop-demo">
                        <img :src="imgSrc" class="pre-img" width="100" height="70" >
                        <div class="crop-demo-btn">封面图片
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
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';


    //自定义编辑器的工作条
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote'],
        [{'header': 1}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
    ];
    export default {
        name: "UserAdminShaiTuWenZhang",
        components: {
            quillEditor
        },
        data(){
            return{
                form:{

                },
                content: '',
                editorOption:{
                    placeholder:'请填写正文',
                    modules: {
                        toolbar: {
                            container: toolbarOptions,  // 工具栏
                        }
                    }
                },
                idx: -1,
                fileList: [],
                imgSrc: '',
                cropImg: '',
                content:'',
                title:'',
                checked:true,
                disabled:false,
                showChecked:true,
                insertImg:''

            }
        },


        methods: {
            onEditorChange(event) {
                // alert(event);
                console.log(event);

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
                    cover : self.imgSrc.split(this.$QiNiuUrl)[1],
                };
                self.$axios.post('/api/users/post/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    self.$message.success(res.data.message);
                });
                self.cancleBtn();
            },
            //富文本插入图片替换
            setImageContent(e) {
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.dialogVisible = true;
                    t.$uploadQiNiuYun.uploadqiniuyun(event.target.result,function (res,key) {
                        // 获取富文本组件实例
                        let quill = t.$refs.customQuillEditor.quill;
                        // 获取光标所在位置
                        let length = quill.getSelection().index;
                        // 插入图片  res.info为服务器返回的图片地址
                        quill.insertEmbed(length, 'image', res)
                        // 调整光标到最后
                        quill.setSelection(length + 1)
                    })

                };
                reader.readAsDataURL(file);
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
    .editor-btn{
        margin-top: 20px;
    }
    .pre-img{
        width: 200px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 0px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-demo-btn1{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 0px;
        margin-top: 20px;
        background-color: green;
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
</style>
