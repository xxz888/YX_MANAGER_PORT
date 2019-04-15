



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
                    'intro':'',
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
                    type:'1',
                    intro:item.intro,

                }

                var t = this;
                this.$router.push({
                    path:'/CigarShop_Edit',
                    query:{
                        'form':t.form,
                    }
                })

            },
            addInfo(){

                this.form = {
                    brand_name: '',
                    brand_logo: '',
                    is_got: true,
                    brand_id:'',
                    type:'2',
                    intro:'',

                }
                var t = this;
                this.$router.push({
                    path:'/CigarShop_Edit',
                    query:{
                        'form':t.form,
                    }
                })
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
