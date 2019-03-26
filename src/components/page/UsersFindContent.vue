<template>
    <div class="container" v-loading="xxzloading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="晒图" name="1"></el-tab-pane>
            <el-tab-pane label="足迹" name="2"></el-tab-pane>
            <el-tab-pane label="问答" name="3"></el-tab-pane>
        </el-tabs>


        <el-collapse accordion>
            <el-collapse-item v-for="tab in tableData">
                <template slot="title" >
                    <img   :src="getPhoto(tab)" style="width: 35px;height:35px;border-radius:50%" >
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
                    <img   :src="tab.photo1 ? tab.photo1 : tab.pic1" class="image">
                    <img   :src="tab.photo2 ? tab.photo2 : tab.pic2" class="image">
                    <img    :src="tab.photo3 ? tab.photo3 : tab.pic3 " class="image">
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
                :total="100"
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
                <el-checkbox v-model="checked">是否同步到推荐</el-checkbox>
            </el-form-item>

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
    </div>



</template>

<script>
    export default {
        name: "UsersFindContent",
        data() {
            return {
                activeName: '1',
                checked: true,
                tableData:[],
                page:'1',
                delVisible:false,
                editVisible:false,
                options:[],
                selectInput:'',
                tab:{},
                tab_index:'1',
                currentPage:1,
                xxzloading:false
            };
        },
        created(){
            this.getFindTag();
        },
        methods: {
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
                this.xxzloading = true;
                var url = "/api/users/admin_ptq/"+this.tab_index+'/'+this.currentPage+'/';
                this.$axios.get(url,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    this.tableData = res.data;
                    this.xxzloading = false;
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

    }
    }
</script>

<style scoped>
.image{
    width: 100px;
    height:100px;
}
</style>
