
<template>
    <div class="container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for='item in todo' :label="item.type" :name="item.type"></el-tab-pane>
        </el-tabs>
        <div style="margin: 20px;"></div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10">批量删除</el-button>
            <el-input  placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search">搜索</el-button>
            <el-button type="success" icon="search" @click="addnews">新增</el-button>
        </div>
        <el-table :data="data"  tooltip-effect="dark"
                  border  class="table" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="id"  width="50" align="center">
            </el-table-column>
            <el-table-column prop="name" label="name"  width="150" align="center">
            </el-table-column>
            <el-table-column  label="图片"  width="150" align="center">
                <template  slot-scope="scope">
                    <img :src="scope.row.photo_list[0].photo"  width="120" height="80" class="pre-img"/>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="100" align="center">
            </el-table-column>
            <el-table-column prop="info" show-overflow-tooltip label="配件信息" align="center" >
            </el-table-column>
            <el-table-column prop="notice" show-overflow-tooltip  align="center" label="购买须知"  >
            </el-table-column>
            <el-table-column prop="weight" label="权重" width="80" align="center">
            </el-table-column>
            <el-table-column  label="修改图片" width="80" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" round @click="changePhotolist(scope.$index, scope.row)">图片</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

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
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :close-on-click-modal="false" :visible.sync="editVisible" width="80%" >
            <el-form ref="form" :model="form" label-width="100px" label-height = auto>
                <el-form-item label="类型" >
                    <el-input v-model="form.type_accessories" :disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="品牌名">
                    <el-input v-model="form.brand_name" :disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="配件名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="权重">
                    <el-input v-model="form.weight"></el-input>
                </el-form-item>
                <el-form-item label="配件信息">
                    <el-input type="textarea" v-model="form.info"></el-input>
                </el-form-item>
                <el-form-item label="购买须知">
                    <el-input type="textarea" v-model="form.notice"></el-input>
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
    export default {
        name: "CigarShopDetail",
        data() {
            return {
                activeName: '2',
                brand_name:'',
                tableData:[],
                form:{
                    name:'',
                    price:'',
                    photo_list:'',
                    info:'',
                    notice:'',
                    type:'',
                    weight:''
                },
                tab_index:'',
                currentPage:1,
                editVisible:false,
                delVisible:false,
                activeName: '1',
                idx:'',
                todo:[],
                brandId:''
            };
        },
        created(){
            this.getParams();
        },
        watch:{
            '$route':'getParams'
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    return d;
                })
            }
        },
        methods: {
            getParams(){
                this.brand_name = this.$route.query.brand_name;
                this.brand_id =this.$route.query.brand_id;
                var self = this;
                this.$axios.get('/api/cigar/cigar_accessories_type/'+self.brand_id+'/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    self.todo = res.data;
                    self.tab_index = self.todo[0]['id'];
                    self.activeName = self.todo[0]['type'];
                    self.getData();
                });
            },
            //请求数据
            getData(){
                var self = this;
                if (!this.brand_name){
                    return;
                }
                var parStr = "/api/cigar/cigar_accessories/"+ this.tab_index+'/'+this.currentPage+'/'+this.brand_name+'/';
              this.$axios.get(parStr).then(res=>{
                  self.tableData = res.data;
                  for(var i = 0 ; i < self.tableData.length;i++){
                      if(self.tableData[i].photo_list.length == 0){
                          var dic = {'photo_url':''};
                          self.tableData[i].photo_list.push(dic)
                      }
                  }
              })
            },
            //tab切换
            handleClick(tab, event) {
                this.currentPage = 1;
                var index =  event.target.getAttribute('id');
                var brandTagName =   index.replace('tab-','');
                for (var i = 0; i < this.todo.length; i++){
                    if (this.todo[i].type == brandTagName) {
                        this.tab_index = this.todo[i].id;
                        this.activeName = this.todo[i].type;
                        break;
                    }
                }
                this.getData();
            },
            //分页切换取值
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //编辑按钮,弹出框
            handleEdit(index, row) {
                const item = this.tableData[index];
                var val = this.tab_index;
                this.form = {
                    brand_name:this.brand_name,
                    name:item.name,
                    price:item.price,
                    info:item.info,
                    notice:item.notice,
                    type:1,
                    weight:item.weight,
                    cigar_accessories_id:item.id,
                    type_accessories:this.activeName,
                }
                this.editVisible = true;
            },
            //新增按钮
            addnews(){
                var val = this.tab_index;
                this.form = {
                    brand_name:this.brand_name,
                    name:'',
                    price:'',
                    info:'',
                    notice:'',
                    type:2,
                    weight:'',
                    cigar_accessories_id:'',
                    type_accessories:this.activeName,
                }
                this.editVisible = true;
            },
            //新增和编辑的请求
            saveEdit(){
                if (!this.brand_name){
                    return;
                }
                var self = this;
                var dic = this.form;
                dic.type_accessories = this.tab_index;
                console.log(dic);
                this.$axios.post('/api/cigar/cigar_accessories/6/6/bn/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    self.$message.success(res.data.message);
                    self.getData();
                });
                this.cancleBtn();
            },
            //取消按钮
            cancleBtn(){
                this.editVisible = false;
            },
            //删除,弹出框
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            //删除请求
            deleteRow(){
                if (!this.brand_name){
                    return;
                }
                this.delVisible = false;
                var self = this;
                var dic = this.form;
                dic.brand_name = this.brand_name;
                dic.cigar_accessories_id = self.tableData[this.idx]['id'];
                dic.type = 3;
                dic.type_accessories = this.tab_index;
                this.$axios.post('/api/cigar/cigar_accessories/6/6/bn/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    self.$message.success(res.data.message);
                    self.getData();
                });
            },
            //修改图片片
            changePhotolist(index,row){
                var self = this;
                this.$router.push({
                    path:'/CigarShopDetailsImage',
                    query: {'key':self.tableData[index]}
                })
            },
            handleSelectionChange(){

            }
        }
    };
</script>
<style>
    .table{
        width: 100%;
        font-size: 14px;
    }
    .handle-box {
        margin-bottom: 20px;
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
</style>
