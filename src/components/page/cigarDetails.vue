<template>
    <el-row>
        <el-col align="center" :span="6" v-for="(item, items) in tableData">
            <el-card  :body-style="{ padding: '5px' }">
                <img :src="item.photo_list[0].photo_url" class="image" />
                <div class="namediv" style="padding: 0px;">
                    <span class="spanname">{{item.cigar_name}}</span>
                    <el-button type="text" icon="el-icon-edit"  class="button" @click="handleClick(item)">修改</el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<style>
    .time {
        font-size: 13px;
        color: #999;
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
                tableData:[]
            };
        },
        created(){
            this.getParams()
        },
        methods:{
            getParams(){
                // 取到路由带过来的参数
                this.id = this.$route.query.id;
                this.getData();
            },
            getData(){
                var t = this;
                var dic = {'cigar_brand_id':this.id};
                this.$axios.post('/api/cigar/cigar_brand_details/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.tableData = res.data.data;
                });
            },
            handleClick(item){
                this.$router.push({
                    path:'/CigarDetailsChange',
                    query: item

                })
            }
        }
    }
</script>
