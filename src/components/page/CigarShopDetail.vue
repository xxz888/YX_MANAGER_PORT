
<template>
    <div class="container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="推荐" name="1"></el-tab-pane>
            <el-tab-pane label="雪茄剪" name="2"></el-tab-pane>
            <el-tab-pane label="打火机" name="3"></el-tab-pane>
            <el-tab-pane label="保湿盒" name="4"></el-tab-pane>
            <el-tab-pane label="雪茄盒" name="5"></el-tab-pane>
            <el-tab-pane label="烟灰缸" name="6"></el-tab-pane>
        </el-tabs>
        <div style="margin: 20px;"></div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
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
                <el-form-item label="类型">
                    <el-select v-model="form.type" placeholder="form.type">
                        <el-option key="1" label="古巴" value="1"></el-option>
                        <el-option key="2" label="非古" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="雪茄名">
                    <el-input v-model="form.cigar_brand"></el-input>
                </el-form-item>
                <el-form-item label="热门">
                    <el-checkbox v-model="checked">热门</el-checkbox>
                </el-form-item>
                <el-form-item label="详情">
                    <editor id="abc" height="500px" width=100%
                            :content="content"
                            pluginsPath="/static/kindeditor/plugins/"
                            :loadStyleMode="false"
                            @on-content-change="onContentChange">
                    </editor>
                    <input @change="fileImage" type="file" accept="image/jpeg,image/x-png,image/gif" id="" value="" />
                    <span>{{count}}/2000</span>
                </el-form-item>
                <el-form-item label="品牌logo">
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
                <el-button @click="cancleBtn">取 消</el-button>
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
                tab_index:'1',
                currentPage:'1'
            };
        },

        created(){
            this.tab_index = '1';
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
                this.getData();
            },
            getData(){
                if (!this.brand_name){
                    return;
                }
                var parStr = "/api/cigar/cigar_accessories/"+ this.tab_index+'/'+this.currentPage+'/'+this.brand_name+'/';
              this.$axios.get(parStr).then(res=>{
                  this.tableData = res.data;
              })
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            //tab切换
            handleClick(tab, event) {
                this.currentPage = '1';
                var index =  event.target.getAttribute('id');
                this.tab_index =  index == 'tab-1' ? 1:
                                    index == 'tab-2' ? 2:
                                          index == 'tab-3' ? 3:
                                              index == 'tab-4' ? 4:
                                              index == 'tab-5' ? 5:6;
                this.getData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
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
