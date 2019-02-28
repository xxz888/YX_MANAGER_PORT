<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 资讯列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="success" icon="search" @click="addnews">新增</el-button>

            </div>
            <el-table :data="data"  tooltip-effect="dark"
                      border  class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="资讯ID"  width="80">
                </el-table-column>
                <el-table-column prop="type" label="资讯类型" width="100" :formatter = 'type_formatter'>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="100">
                </el-table-column>
                <el-table-column prop="author" label="作者" width="100">
                </el-table-column>
                <el-table-column prop="date" label="发布时间戳" width="100" :formatter = 'data_formatter'>
                </el-table-column>
                <el-table-column prop="details" show-overflow-tooltip label="详情" width="200" >
                </el-table-column>
                <el-table-column prop="photo" label="展示图" >
                    <!-- 图片的显示 -->
                    <template  slot-scope="scope">
                        <img :src="scope.row.photo"  width="120" height="70" class="pre-img"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="60%">
            <el-form ref="form" :model="form" label-width="100px" label-height = auto>
                <el-form-item label="类型">
                    <el-select v-model="form.type" placeholder="form.type">
                        <el-option key="0" label="推荐" value="0"></el-option>
                        <el-option key="1" label="雪茄" value="1"></el-option>
                        <el-option key="2" label="红酒" value="2"></el-option>
                        <el-option key="3" label="高尔夫" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="form.author"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date"  value-format="yyyy/MM/dd hh:mm:ss" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="详情" >
                    <quill-editor   ref="myTextEditor" v-model="form.details" :options="editorOption"></quill-editor>
                </el-form-item>
                <el-form-item label="展示图">
                    <template  slot-scope="scope">
                        <div class="crop-demo">
                            <img :src="imgSrc" v-model="form.photo" class="pre-img" width="100" height="70" :formatter = 'photo_formatter'>
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

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import p_img from '../../assets/img/img.jpg'
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

    export default {
        name: 'basetable',
        data() {
            return {
                url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1,
                fileList: [],
                imgSrc: p_img,
                cropImg: '',
                dialogVisible: false,
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        return d;
                    }
                })
            }
        },
        components: {
            quillEditor
        },
        methods: {
            getData() {
                this.$axios.get('/api/pub/information/1/', {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data;
                })
            },
            //编辑按钮,弹出框
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    photo: item.photo,
                    title: item.title,
                    type: item.type == 0 ? '推荐' : item.type == 1 ? '雪茄' : item.type == 2 ? '红酒' :'高尔夫',
                    author: item.author,
                    date: this.getLocalTime(item.date),
                    details: item.details,
                }
                this.editVisible = true;
            },
            //增加按钮，弹出框
            addnews(){
                this.form = {
                    id: '',
                    photo: p_img,
                    title: '',
                    type:  '雪茄',
                    author: '',
                    date: new Date(),
                    details: '',

                }
                this.editVisible = true;
            },

            // 新增和保存编辑，请求
            saveEdit() {
                this.$uploadQiNiuYun.uploadqiniuyun(this.imgSrc,function (res) {
                    var dic = {
                        'information_id':this.form.id,          //资讯id(修改/删除传,新增不传)
                        'photo':res,                            //资讯展示图片
                        'title':this.form.title,                //资讯标题
                        'type_information':'1',                 //(0,推荐)(1,雪茄)(2,红酒)(3,高尔夫)
                        'author':this.form.title,               //作者
                        'details':this.form.details,            //资讯详情
                        'type':this.form.id.length == 0 ? 2 :1  //操作类型(1/修改，2/新增，3/删除)
                    };
                    this.$axios.post('/api/pub/information/6/',dic,{headers:{
                            "Authorization":"JWT " + localStorage.getItem('token')
                        }}).then(res=>{
                        this.$message.success(res.msg);
                        this.getData();
                    });
                    this.editVisible = false;
                })
            },
            //确定删除,请求
            deleteRow(){
                var dic = {
                    'advertising_id':this.form.adver_id,
                    'photo':'',
                    'character':'',
                    'type_advertising':'',
                    'type':3
                };
                this.$axios.post('/api/pub/advertising/6/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    this.$message.success('删除成功');
                    this.getData();
                });
                this.delVisible = false;
            },









            //单个删除,弹出框
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            //全部删除
            delAll() {
                this.$message.info('功能开发中');
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search() {
                this.is_search = true;
            },
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            imageuploaded(res) {
                console.log(res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            type_formatter(value){
                value = value.type;
                return value == 0 ? '推荐' : value == 1 ? '雪茄' : value == 2 ? '红酒' :'高尔夫';
            },
            photo_formatter(value){
                console.log(value);
                value = value.type;
                return value == 0 ? '推荐' : value == 1 ? '雪茄' : value == 2 ? '红酒' :'高尔夫';
            },
            data_formatter(value){
                return this.getLocalTime(value.date);
            },

        },
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;

    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
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
