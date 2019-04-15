<template>
    <div >
        <el-button style="margin:20px 0px" size="medium" type="success" @click="addInfo">新增</el-button>
    <el-row>
        <el-col align="right" :span="6" v-for="(item, index) in tableData">
            <el-card  :body-style="{ padding: '5px' }">
                <img :src="item.photo_list[0].photo_url" class="image" />
                <div class="namediv" style="padding: 0px;">
                    <p class="spanname">{{item.cigar_name}}</p>
                    <el-button type="text" icon="el-icon-edit" @click="handleClick(index)">编辑信息</el-button>
                    <el-button type="text" icon="el-icon-edit" @click="handleClickImage(index)">编辑图片</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(item)">删除</el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
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

    }
    .button {
        padding: 0;
        float: right;
        vertical-align: middle;
    }
    .image {
        width: 100%;
        display: block;
    }
    .namediv{
        text-align:left
    }
</style>

<script>
    export default {
        name:'CigarDetails',
        data() {
            return {
                currentDate: new Date(),
                id:'',
                cigar_name:'',
                tableData:[],
                errorImg01: 'this.src="' + require('../../assets/logo.png') + '"'

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
                this.id = this.$route.query.id;
                this.cigar_name = this.$route.query.cigar_name ? this.$route.query.cigar_name : '';
                this.getData();
            },
            getData(){
                if (!this.id){
                    return;
                }
                var t = this;
                var dic = {'cigar_brand_id':this.id};
                this.$axios.post('/api/cigar/admin_cigar_brand_details/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.tableData = res.data.data;
                    var array = [];
                    for(var i = 0 ; i < t.tableData.length;i++){
                        if(t.tableData[i].photo_list.length == 0){
                            var dic = {'photo_url':''};
                            t.tableData[i].photo_list.push(dic)
                        }
                        array.push(t.tableData[i]['cigar_name'].replace(/''/g, ""));
                    }
                    console.log(array);
                });
            },

            handleDelete(item){
                if (!this.id){
                    return;
                }
                var t = this;
                var dic = item;
                dic['cigar_id'] = item.id;
                dic['type'] = '3';
                t.$axios.post('/api/cigar/ad_cigar/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    if (res.data.status == 1){
                        t.$message.success(res.data.message);
                        t.getData();
                    }else {
                        t.$message.warning(res.data.message);
                    }
                });
            },
            handleClick(index){
                var t = this;
                this.$router.push({
                    path:'/CigarDetailsChange',
                    query: {'key':t.tableData[index]}
                })
            },
            handleClickImage(index){
                var t = this;
                this.$router.push({
                    path:'/CigarDetailsImage',
                    query: {'key':t.tableData[index]}
                })
            },
            addInfo(){
                var t = this;
                this.$router.push({
                    path:'/CigarDetailsNewAdd',
                    query: {'cigar_brand_id':t.id}
                })
            }
        }
    }
</script>
