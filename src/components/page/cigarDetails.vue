<template>
    <div >
        <el-button style="margin:20px 0px" size="medium" type="success" @click="addInfo">新增</el-button>
    <el-row>
        <el-col align="right" :span="6" v-for="(item, items) in tableData">
            <el-card  :body-style="{ padding: '5px' }">
                <img :src="item.photo_list[0].photo_url" class="image" :onerror="errorImg01" />
                <div class="namediv" style="padding: 0px;">
                    <p class="spanname">{{item.cigar_name}}</p>
                    <el-button type="text" icon="el-icon-edit" @click="handleClick(item)">编辑</el-button>
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
        methods:{
            getParams(){
                // 取到路由带过来的参数
                this.id = this.$route.query.id;
                this.cigar_name = this.$route.query.cigar_name;
                this.getData();
            },
            getData(){
                var t = this;
                var dic = {'cigar_brand_id':this.id};
                this.$axios.post('/api/cigar/cigar_brand_details/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.tableData = res.data.data;
                    for(var i = 0 ; i < t.tableData.length;i++){
                        if(t.tableData[i].photo_list.length == 0){
                            var dic = {'photo_url':''};
                            t.tableData[i].photo_list.push(dic)
                        }
                    }
                });
            },
            handleClick(item){
                this.$router.push({
                    path:'/CigarDetailsChange',
                    query: item
                })
            },
            handleDelete(item){

                var t = this;
                var dic = item;
                dic['cigar_id'] = item.id;
                dic['type'] = '3';
                t.$axios.post('/api/cigar/ad_cigar/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    if (res.data.status == 1){
                        this.getData();
                    }else {
                        this.$message.warning(res.data.message);
                    }
                });
            },
            addInfo(){
                this.$router.push({
                    path:'/CigarDetailsChange',
                    query: {'cigar_brand_id':this.id,
                    }
                })
            }
        }
    }
</script>
