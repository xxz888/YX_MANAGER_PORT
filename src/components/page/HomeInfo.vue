<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 资讯列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="推荐" name="first"></el-tab-pane>
                <el-tab-pane label="雪茄" name="second"></el-tab-pane>
                <el-tab-pane label="红酒" name="third"></el-tab-pane>
                <el-tab-pane label="高尔夫" name="forth"></el-tab-pane>
            </el-tabs>
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="success" icon="search" @click="addnews">新增</el-button>
            </div>
            <el-table :data="data"  tooltip-effect="dark"
                      border  class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID"  width="50" align="center">
                </el-table-column>
                <el-table-column prop="type" label="类型" width="80" align="center" :formatter = 'type_formatter'>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="150" align="center">
                </el-table-column>
                <el-table-column prop="author" label="作者" width="80" align="center">
                </el-table-column>
                <el-table-column prop="date" label="时间" width="100" align="center":formatter = 'data_formatter'>
                </el-table-column>
                <el-table-column prop="details" show-overflow-tooltip  align="center" label="详情"  >
                </el-table-column>
                <el-table-column prop="photo" label="展示图" align="center" width="150">
                    <template  slot-scope="scope">
                        <img :src="scope.row.photo"  width="120" height="70" class="pre-img"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :close-on-click-modal="false" :visible.sync="editVisible" width="80%">
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
                <el-form-item label="作者">
                    <el-input v-model="form.author"></el-input>
                </el-form-item>
                <el-form-item label="详情">
                    <vue-ueditor-wrap id="ud1" v-model="content" :config="myConfig"></vue-ueditor-wrap>
                    <input @change="fileImage" type="file" accept="image/jpeg,image/x-png,image/gif" id="" value="" />
                    <span>{{count}}</span>
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
                <el-button @click="cancleBtn">取 消</el-button>
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
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
    export default {

        name: 'HomeInfo',
        components: {
            VueUeditorWrap
        },
        data() {
            return {
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
                    id: '',
                    photo: '',
                    title: '',
                    type:'',
                    author:'',
                    date:'',
                    details:''
                },
                idx: -1,
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                item:'',
                base64Array:[],
                tag:'0',
                count:'0',
                activeName: 'second',
                tab_index:'1',
                content:''
            }
        },
        created() {
            this.tab_index = '1';
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    return d;
                })
            }
        },
        methods: {
            //内容改变实时更新
            onContentChange (val) {
                this.content = val;
                this.count = this.content.length;
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
                this.imgSrc = item.photo;
                this.content =  item.details;
                this.editVisible = true;
                this.count = item.details.length;
            },
            //增加按钮，弹出框
            addnews(){
                this.form = {
                    id: '',
                    photo: '',
                    title: '',
                    type: this.tab_index == 0 ? '推荐' : this.tab_index == 1 ? '雪茄' : this.tab_index == 2 ? '红酒' : '高尔夫',
                    author: '',
                    date: new Date(),
                    details: '',
                }
                this.content = '';
                this.imgSrc = '';
                this.editVisible = true;
            },
            // 新增和保存编辑，请求
            saveEdit() {
                var t = this;
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
            saveAndEditCommon(res,key) {
                var t = this;
                var dic = {
                    'information_id':t.form.id,             //资讯id(修改/删除传,新增不传)
                    'photo':res,                            //资讯展示图片
                    'title':t.form.title,                   //资讯标题
                    'type_information':t.form.type =='推荐' ? '0' : t.form.type =='雪茄' ? '1' : t.form.type =='红酒' ? '2' : '3',            //(0,推荐)(1,雪茄)(2,红酒)(3,高尔夫)
                    'author':t.form.author,                  //作者
                    'details':t.content,                    //资讯详情
                    'type':t.form.id.length == 0 ? 2 :1,     //操作类型(1/修改，2/新增，3/删除)
                    'qiniu_key':key
                };
                t.$axios.post('/api/pub/information/6/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                    t.getData();
                });
                t.cancleBtn();
            },
            //确定删除,请求
            deleteRow(){
                this.delVisible = false;
                var t = this;
                var dic = {
                    'information_id':t.tableData[t.idx].id,  //资讯id(修改/删除传,新增不传)
                    'photo':'',                              //资讯展示图片
                    'title':'',                              //资讯标题
                    'type_information':t.form.type =='推荐' ? '0' : t.form.type =='雪茄' ? '1' : t.form.type =='红酒' ? '2' : '3',            //(0,推荐)(1,雪茄)(2,红酒)(3,高尔夫)
                    'author':'',                             //作者
                    'details':'',                            //资讯详情
                    'type':'3',                              //操作类型(1/修改，2/新增，3/删除)
                    'qiniu_key':''
                };
                this.$axios.post('/api/pub/information/6/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                    t.getData();
                });
                t.cancleBtn();
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
            //单个删除,弹出框
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            //全部删除
            delAll() {
                this.$message.info('功能开发中');
            },


            //tab切换
            handleClick(tab, event) {
                var index =  event.target.getAttribute('id');
                this.tab_index =  index == 'tab-first' ? 0: index == 'tab-second' ? 1: index == 'tab-third' ? 2 : 3;
                this.getData();
            },
            //请求
            getData() {
                this.$axios.get('/api/pub/information/'+this.tab_index+'/', {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data;
                    console.log(this.tableData);
                })
            },
            //取消按钮方法
            cancleBtn(){
                this.editVisible = false;

            },
            //以下方法备用
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search() {
                this.is_search = true;
                this.$message.info('功能开发中');

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
