<template>
    <div class="container" v-loading="xxzloading">
        <div style="width: 100%;text-align: right" >
            <el-button  type="success" icon="search" @click="addnews">新增问答</el-button>
        </div>

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="问答" name="3"></el-tab-pane>
        </el-tabs>
        <el-collapse accordion>
            <el-collapse-item v-for="tab in tableData">
                <template slot="title" >
                    <img   :src="getPhoto(tab)"
                           style="width: 35px;height:35px;border-radius:50%"
                           :onerror="defaultImg"
                    >
                    <p style="margin-left: 10px">{{tab.user_name}}</p>
                    <p style="margin-left: 10px;color: red;">【{{getTypeChinese(tab.type)}}】</p>
                    <p style="margin-left: 20px;color:darkblue;"> {{toChineseWords(tab.describe?tab.describe:tab.title?tab.title:tab.content)}}</p>
                    <p style="margin-left: 10px;color:blue;">{{tab.tag}}</p>
                    <p style="margin-left: 10px">{{getLocalTime(tab.publish_time)}}</p>
                    <p style="margin-left: 10px">{{tab.publish_site}}</p>

                </template>
                <div style="margin: 20px 20px"></div>
                <div>{{tab.question?toChineseWords(tab.question):''}}</div>
                <div>
                    <img   :src="tab.pic1 ? tab.pic1 : tab.pic1"
                           class="image"
                           :onerror="defaultImg"
                    >
                    <img   :src="tab.pic2 ? tab.pic2 : tab.pic2"
                           class="image"
                           :onerror="defaultImg"
                    >
                    <img    :src="tab.pic3 ? tab.pic3 : tab.pic3 "
                            class="image"
                            :onerror="defaultImg"
                    >
                </div>
                <div>评论数:{{tab.comment_number}} 点赞数:{{tab.praise_number?tab.praise_number:tab.answer_number}} </div>
                <div style="color:blue">标签:{{tab.tag}}  </div>
                <div>时间:{{getLocalTime(tab.publish_time)}}</div>
                <div>地点:{{tab.publish_site}}</div>
                <div>{{tab.cigar_info ? tab.cigar_info.brand_name:''}}</div>
                <!--<img   :src="getPingLun1(tab)" style="width: 20px;height:20px;border-radius:50%">-->
                <div>最热评论:</div>
                <div style="margin-left: 10px">
                    <span style="color: gray;">{{getPingLun2(tab)}}</span>
                    &nbsp
                    <span>{{getPingLun3(tab)}}</span>
                </div>



                <div  style="text-align: right;width: 100%">
                    <el-button @click="editAction(tab)" type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="delAction(tab)"type="danger" icon="el-icon-delete" circle></el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-pagination
                style="margin: 50px auto;"
                align="center"
                background
                layout="prev, pager, next"
                :total="1000"
                :current-page = 'currentPage'
                @current-change="handleCurrentChange"
        >
        </el-pagination>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :close-on-click-modal="false" :visible.sync="editVisible" width="80%">
            <el-form label-width="100px" label-height = auto>



                <el-form-item label="推荐">
                    <el-select v-model="selectInput" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
        </el-dialog>





        <!-- 新增弹出框 -->
        <el-dialog title="新增" :close-on-click-modal="false" :visible.sync="addVisible" width="80%">
            <el-form label-width="100px" label-height = auto>
                <el-form-item label="类型">
                    <el-select v-model="selectShaiTuInput" disabled placeholder="问答">
                    </el-select>
                </el-form-item>
                <el-form-item label="用户">
                    <el-select v-model="addForm.username" placeholder="请选择用户" @change="userSelectInputAction">
                        <el-option
                                v-for="item in userTableData"
                                :key="item.username"
                                :value="item.username">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item   label="标签">
                    <el-select   v-model="tagSelectInput1" placeholder="选择分类" @change="tagSelectInput1Action">
                        <el-option
                                v-for="item in tagSelectInputOptions1"
                                :key="item.type"
                                :value="item.type">
                        </el-option>
                    </el-select>
                    <el-select style="margin-left: 20px;width: 70%" v-model="tagSelectInput2" multiple placeholder="请选择标签">
                        <el-option
                                v-for="item in tagSelectInputOptions2"
                                :key="item.id"
                                :label="item.tag"
                                :value="item.tag">
                        </el-option>
                    </el-select>

                </el-form-item>

                <el-form-item v-if="wendaTag" label="问答提问">
                    <el-input
                            v-model="addForm.title"
                            type="textarea"
                            placeholder="请输入问答提问"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="wendaTag" label="问答回答" >
                    <el-input
                            v-model="addForm.question"
                            type="textarea"
                            placeholder="请输入问答回答"
                    ></el-input>
                </el-form-item>

                <el-form-item label="地点">
                    <el-input v-model="addForm.publish_site" placeholder="请输入地点"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="5">
                                <div class="crop-demo">
                                    <img  @click="clickImg1" :src="addForm.pic1" :v-model="addForm.pic1" class="pre-img" width="100" height="70">
                                    <div class="crop-demo-btn">选择图片1
                                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage1"/>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="crop-demo">
                                    <img @click="clickImg2" :src="addForm.pic2" :v-model="addForm.pic2" class="pre-img" width="100" height="70">
                                    <div class="crop-demo-btn">选择图片2
                                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage2"/>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="crop-demo">
                                    <img @click="clickImg3" :src="addForm.pic3"  :v-model="addForm.pic3" class="pre-img" width="100" height="70">
                                    <div class="crop-demo-btn">选择图片3
                                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage3"/>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>

                    </template>
                </el-form-item>



            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAddContent">确 定</el-button>
                </span>
        </el-dialog>
    </div>



</template>

<script>
    export default {
        name: "UserAdminWenDa",
        data() {
            return {
                defaultImg:'this.src="' + require('../../assets/img_moren.png') + '"',
                activeName: '3',
                checked: true,
                tableData:[],
                userTableData:[],
                page:'1',
                delVisible:false,
                editVisible:false,
                addVisible:false,
                options:[],
                shaituTag:false,
                wendaTag:true,
                tab:{},
                tab_index:'3',
                currentPage:1,
                xxzloading:false,
                user_id:'',
                selectInput:'',
                selectUserInput:'',
                selectShaiTuInput:'',
                tagSelectInput1:'',
                tagSelectInput2:'',
                tagSelectInputOptions1:[],
                tagSelectInputOptions2:[],
                type:'',
                addForm:{
                    url:'http://thegdlife.com:8001/users/question/0/kw/0/',
                    request_type:'post',
                    user_id:'',
                    publish_site : "",
                    tag : "",
                    title : "",
                    question : "",
                    pic1 : "",
                    pic2 : "",
                    pic3 : "",
                    to_find:'1',
                    type:'1'
                },
            };
        },
        created(){
            this.getFindTag();
        },
        watch:{
            '$route':'getParams'
        },
        methods: {
            saveAddContent(){
                this.addForm.tag = this.tagSelectInput2.join(' ');
                this.addForm.title = this.toUnicodeWords(this.addForm.title);
                this.addForm.question = this.toUnicodeWords(this.addForm.question);

                this.$axios.post("/api/users/transpond/",this.addForm,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    this.addVisible = false;
                    if (res.data.status == 1){
                        this.$message.success(res.data.message);
                        this.getData();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                })
            },
            userSelectInputAction(event){
                for (var i = 0 ;i < this.userTableData.length;i++){
                    if (this.userTableData[i].username == event){
                        this.addForm.user_id =  this.userTableData[i].id;
                    }
                }
            },
            //手动添加晒图，问答，足迹
            addnews(){
                this.getUserData();
                this.getFind_tag();
                this.addForm = {
                    url:'http://thegdlife.com:8001/users/question/0/kw/0/',
                    request_type:'post',
                    user_id:'',
                    publish_site : "",
                    tag : "",
                    title : "",
                    question : "",
                    pic1 : "",
                    pic2 : "",
                    pic3 : "",
                    to_find:'1',
                    type:'1'
                },
                    this.tagSelectInput1 = '';
                this.tagSelectInput2 = '';
                this.addVisible = true;
            },
            //选择分类1级
            getFind_tag(){
                var self = this;
                this.$axios.get("/api/users/find_tag/",{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    var dic = {'id':0,'type':'用户添加','weight':1};
                    res.data.unshift(dic);
                    self.tagSelectInputOptions1 = res.data;
                    self.type = this.tagSelectInputOptions1[0].id;
                });
            },
            //选择分类2级
            tagSelectInput1Action(event){
                for (var i = 0 ;i < this.tagSelectInputOptions1.length;i++){
                    if (this.tagSelectInputOptions1[i].type == event){
                        this.type =  this.tagSelectInputOptions1[i].id;
                    }
                }
                this.$axios.get("/api/users/tag/" + this.type + '/1/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    this.tagSelectInputOptions2 = res.data;
                })
            },


























            //请求管理员用户信息
            getUserData(){
                this.$axios.get("/api/users/admin_user/",{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    this.userTableData = res.data;
                })
            },

            clickImg1(){
                this.addForm.pic1='';
            },
            clickImg2(){
                this.addForm.pic2='';
            },
            clickImg3(){
                this.addForm.pic3='';
            },
            handleClick(tab, event) {
                this.currentPage = 1;
                var index =  event.target.getAttribute('id');
                this.tab_index =  index == 'tab-1' ? 1: index == 'tab-2' ? 2: 3;
                this.getData();
            },
            //分页切换取值
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            getFindTag(){
                var self = this;
                this.$axios.get("/api/users/find_tag/",{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.options = res.data;
                    self.getData();
                })
            },
            getData(){
                var self = this;
                this.user_id = this.$route.query.user_id;
                this.xxzloading = true;
                var url = "/api/users/get_all_question/";
                var dic = {"is_super":'1','type':'-1'};
                this.$axios.post(url,dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.tableData = [];
                    //在这里判断是因为，用户界面直接传id过来，复用了这个界面
                    if (self.user_id && self.user_id.toString().length > 0){
                        for(var item of res.data){
                            if (item.user_id == self.user_id){
                                self.tableData.push(item);
                            }
                        }

                    } else{
                        self.tableData = res.data;
                    }

                    self.xxzloading = false;

                })
            },
            editAction(tab){
                this.editVisible = true;
                this.tab = tab;
                this.checked = tab.to_recommend ;
                this.selectInput =  this.getTypeChinese(tab.type);
            },
            delAction(tab){
                this.delVisible = true;
                this.tab = tab;

            },
            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            getTypeChinese(value){
                if (value == 0) return '未分类';
                var post_type;
                for (var i = 0 ;i < this.options.length ;i++){
                    if (this.options[i].id == value){
                        post_type = this.options[i].type;
                    }
                }
                return post_type;
            },
            toChineseWords(data){
                if(data == '' || typeof data == 'undefined') return '';
                data = data.split("\\u");
                var str ='';
                for(var i=0;i<data.length;i++){
                    str+=String.fromCharCode(parseInt(data[i],16).toString(10));
                }
                return str;
            },
            toUnicodeWords(str){
                var unid='\\u';
                for(let i=0,len=str.length;i<len;i++){
                    if(i<len-1){
                        unid+=str.charCodeAt(i).toString(16)+'\\u';
                    }else if(i===len-1){
                        unid+=str.charCodeAt(i).toString(16);
                    }
                }
                return unid;
            },
            saveEdit(){
                var post_type;
                for (var i = 0 ;i < this.options.length ;i++){
                    if (this.options[i].type == this.selectInput){
                        post_type = this.options[i].id;
                    }
                }
                if (this.selectInput == '未分类') post_type = 0;
                var dic = {'to_recommend':this.checked ? 1 : 0,
                    'post_type':post_type,
                    'post_id':this.tab.id,
                    'type_':2,
                    'aim':this.tab_index
                };
                this.$axios.post("/api/users/admin_ptq/6/6/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    this.editVisible = false;
                    if (res.data.status == 1){
                        this.$message.success(res.data.message);
                        this.getData();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                })
            },
            deleteRow(){
                var dic = {'to_recommend':0,
                    'post_type':0,
                    'post_id':this.tab.id,
                    'type_':3,
                    'aim':this.tab_index
                };
                this.$axios.post("/api/users/admin_ptq/6/6/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    this.delVisible = false;
                    if (res.data.status == 1){
                        this.$message.success(res.data.message);
                        this.getData();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                })
            },
            getPingLun1(tab){
                if (tab.max_hot_comment){
                    return tab.max_hot_comment.user_photo;
                }
                if (tab.answer && tab.answer.length > 0){
                    return tab.answer[0].user_photo;
                }
                if (tab.comment_list && tab.comment_list.length > 0){
                    return  tab.comment_list[0].photo;
                }
                return '';
            },
            getPingLun2(tab){
                if (tab.max_hot_comment){
                    return tab.max_hot_comment.user_name;
                }
                if (tab.answer && tab.answer.length > 0){
                    return tab.answer[0].user_name;
                }
                if (tab.comment_list && tab.comment_list.length > 0){
                    return  tab.comment_list[0].user_name;
                }
                return '';
            },
            getPingLun3(tab){
                if (tab.max_hot_comment){
                    return this.toChineseWords(tab.max_hot_comment.comment);
                }
                if (tab.answer && tab.answer.length > 0){
                    return this.toChineseWords(tab.answer[0].answer);
                }
                if (tab.comment_list && tab.comment_list.length > 0){
                    return  this.toChineseWords(tab.comment_list[0].comment);
                }
                return '';
            },
            getPhoto(tab){
                if (tab.photo){
                    return tab.photo;
                }
                if (tab.user_photo){
                    return tab.user_photo;
                }
                return '';
            },
            setImage1(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var self = this;
                reader.onload = (event) => {
                    self.addForm.pic1 = event.target.result;
                    self.$uploadQiNiuYun.uploadqiniuyun(self.addForm.pic1,function (res,key) {
                        self.addForm.pic1 = res;
                    }),
                    self.$refs.cropper && self.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            setImage2(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var self = this;
                reader.onload = (event) => {
                    self.addForm.pic2 = event.target.result;
                    self.$uploadQiNiuYun.uploadqiniuyun(self.addForm.pic2,function (res,key) {
                        self.addForm.pic2 = res;}),
                    self.$refs.cropper && self.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            setImage3(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var self = this;
                reader.onload = (event) => {
                    self.addForm.pic3 = event.target.result;
                    self.$uploadQiNiuYun.uploadqiniuyun(self.addForm.pic3,function (res,key) {
                        self.addForm.pic3 = res;}),
                    self.$refs.cropper && self.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },



        }
    }
</script>

<style scoped>
    .image{
        width: 100px;
        height:100px;
    }
    .pre-img{
        width: 100px;
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
