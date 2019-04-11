



<template>
    <div >
        <!--<el-button style="margin:20px 0px" size="medium" type="success" @click="addInfo">新增</el-button>-->
        <el-row>
            <el-col align="right" :span="4" v-for="(item, index) in tableData">
                <el-card  :body-style="{ padding: '5px',height:'250px'}">
                    <img :src="item.brand_logo" class="image" />
                    <div class="namediv" style="padding: 15px;">
                        <p class="spanname">{{item.brand_name}}</p>
                        <el-button style="margin: 15px 0px" size="mini" type="success" @click="handleClick(index)">编辑</el-button>
                        <el-button size="mini" type="danger"  @click="handleDelete(index)">删除</el-button>
                        <el-button  style="margin: 10px 0px" size="mini" type="warning" @click="addInfo">新增</el-button>


                        <el-button  size="mini" type="primary" @click="handleDetails(index)">详情</el-button>

                    </div>
                </el-card>
            </el-col>
        </el-row>




        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :close-on-click-modal="false" :visible.sync="editVisible" width="80%">
            <el-form ref="form" :model="form" label-width="100px" label-height = auto>
                <el-form-item label="品牌名">
                    <el-input v-model="form.brand_name"></el-input>
                </el-form-item>
                <el-form-item label="热门">
                    <el-checkbox v-model="checked">热门</el-checkbox>
                </el-form-item>
                <el-form-item label="品牌logo">
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

<style>
    .time {
        font-size: 13px;
        color: #999;
    }
    .red{
        color: #ff0000;
    }
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }
    .spanname{
        text-align: left;
        vertical-align: middle;
        white-space:nowrap
    }
    .button {
        padding: 0;
        float: right;
        vertical-align: middle;
    }
    .image {
        width: 100px;
        height: 100px;
        display: block;
        background-color: #A0A0A0;
        margin: 0 auto;
    }
    .namediv{
        text-align:left
    }
</style>

<script>
    export default {
        name:'CigarShop',
        data() {
            return {
                currentDate: new Date(),
                id:'',
                cigar_name:'',
                tableData:[],
                errorImg01: 'this.src="' + require('../../assets/logo.png') + '"',
                editVisible:false,
                delVisible:false,
                checked:false,
                form: {
                    brand_name: '',
                    brand_logo: '',
                    is_got: '',
                    id:'',
                    type:''
                },
                imgSrc:'',
                idx:''
            };
        },
        created(){
            this.getParams()
        },
        watch:{
            '$route':'getParams'
        },
        methods:{
            getParams(){
                // 取到路由带过来的参数
                this.getData();
            },
            getData(){
                var t = this;
                this.$axios.get('/api/cigar/cigar_accessories_brand/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.tableData = res.data;
                });
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
            saveAndEditCommon(res,key) {
                var t = this;
                var dic = {
                    'brand_name': t.form.brand_name,
                    'brand_logo': res,
                    'is_got': t.checked?'1':'0',
                    'brand_id':t.form.brand_id,
                    'type':t.form.brand_id ? 1 : 2,
                    'qiniu_key':key                      //七牛key
                };
                t.$axios.post('/api/cigar/cigar_accessories_brand/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                    t.getData();
                });
                t.cancleBtn();
            },
            cancleBtn(){
              this.editVisible = false;
            },
            deleteRow(){

                var t = this;
                var dic = {
                    'brand_name': '',
                    'brand_logo': '',
                    'is_got': t.checked?'1':'0',
                    'brand_id':this.tableData[this.idx].id,
                    'type':3,
                    'qiniu_key':''                      //七牛key
                };
                t.$axios.post('/api/cigar/cigar_accessories_brand/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                    t.getData();
                });
                this.delVisible = false;
            },
            handleDelete(index){
                this.idx = index;
                this.delVisible = true;


            },
            handleClick(index){
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    brand_name: item.brand_name,
                    brand_logo: item.brand_logo,
                    is_got: this.checked?'1':'0',
                    brand_id:item.id,
                    type:''
                }
                this.checked = item.is_hot == '是' ? true : false;
                this.imgSrc = item.brand_logo;
                this.editVisible = true;
            },
            addInfo(){
                this.form = {
                    brand_name: '',
                    brand_logo: '',
                    is_got: '',
                    brand_id:'',
                    type:''
                }
                this.imgSrc = '';
                this.editVisible = true;
            },
            handleDetails(index){
                const item = this.tableData[index];

                var t = this;
                this.$router.push({
                    path:'/CigarShopDetail',
                    query: {'brand_name':item.brand_name,
                            'brand_id':item.id
                    }
                })
            },
            editImgVisible(){

            },
        }
    }
</script>

<style>

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
