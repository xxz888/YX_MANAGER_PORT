<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>订单列表 【新订单状态下，输入完订单号，单据状态自动变成已发货状态】</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="data"  tooltip-effect="dark"
                      border  class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="ID"  width="50" align="center">
                </el-table-column>
                <el-table-column prop="express" label="快递单号" align="center" width="200">
                    <!-- 图片的显示 -->
                    <template  slot-scope="scope">
                        <el-input @blur="inputFinish(scope.row)" v-model="scope.row.express" placeholder="请输入单号"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="address_info.name" label="用户信息"  width="100" align="center">
                </el-table-column>
                <el-table-column prop="address_info.phone" label="用户手机"  width="120" align="center">
                </el-table-column>
                <el-table-column prop="commodity_info.name" label="商品信息"  width="200" align="center">
                </el-table-column>
                <el-table-column prop="status" label="订单状态" align="center" width="110">
                    <!-- 图片的显示 -->
                    <template  slot-scope="scope">
                        <el-select @change="selectStatus" v-model="scope.row.status==1?'新订单':'已发货'" placeholder="请选择">
                            <el-option
                                    key="1"
                                    label="新订单"
                                    value="1">
                            </el-option>
                            <el-option
                                    key="2"
                                    label="已发货"
                                    value="2">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column prop="address_info.site" label="地址信息"   align="center">
                </el-table-column>




            </el-table>
        </div>
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

    </div>
</template>

<script>

    export default {
        name: 'DingDanList',

        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                editVisible: false,
                delVisible: false,
                dialogVisible: false,
                dialogTitle:'',
                currentPage:1,
            }
        },
        created() {
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
            //订单号输入完成
            inputFinish(dic){
                var dic = {
                    'express':dic.express,
                    'type':'2',
                    'oder_id':dic.id,
                    'status':'2'
                };
                var self = this;
                this.$axios.post("/api/shop/integral_oder/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    if (res.data.status == 1){
                        self.$message.success(res.data.message);
                        self.getData();
                    } else {
                        self.$message.warning(res.data.message);
                    }
                })
            },
            //订单状态切换
            selectStatus(val){

            },
            //分页切换取值
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //请求
            getData() {
                var self = this;
                this.$axios.get("/api/shop/integral_oder/?page="+this.currentPage,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.tableData = res.data.data;
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        },
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .table{
        width: 100%;
        font-size: 14px;

    }
    .red{
        color: #ff0000;
    }
    .green{
        color: #58B92D;
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

    .pre-img1{
        width: 250px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
</style>
