
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
            <el-table-column prop="info" show-overflow-tooltip label="配件信息" align="center" >
            </el-table-column>
            <el-table-column prop="notice" show-overflow-tooltip  align="center" label="购买须知"  >
            </el-table-column>
            <el-table-column prop="weight" label="权重" width="80" align="center">
            </el-table-column>
            <el-table-column prop="is_show" label="显示" width="80" align="center" :formatter="isShowFormatter">
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
                :total="1000"
                :current-page = 'currentPage'
                @current-change="handleCurrentChange"
        >
        </el-pagination>



        <el-dialog title="编辑图片" :close-on-click-modal="false" :visible.sync="editImgVisible" width="80%">
            <div class="hello">
                <div class="upload">
                    <div class="upload_warp">
                        <div class="upload_warp_left" @click="fileClick">
                            <img src="../../assets/img/upload.png">
                        </div>
                        <div class="upload_warp_right" @drop="drop($event)" @dragenter="dragenter($event)" @dragover="dragover($event)">
                            或者将文件拖到此处
                        </div>
                    </div>
                    <div class="upload_warp_text">
                        选中{{imgList.length}}张图片
                    </div>
                    <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>
                    <div class="upload_warp_img" v-show="imgList.length!=0">
                        <div class="upload_warp_img_div" v-for="(item,index) of imgList">
                            <div class="upload_warp_img_div_top">
                                <div class="upload_warp_img_div_text">
                                    {{item.file.name}}
                                </div>
                                <img src="../../assets/img/del.png" class="upload_warp_img_div_del" @click="fileDel(index)">
                            </div>
                            <img :src="item.file.src">
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin: 20px;"></div>
            <div align="center">
                <el-button size="medium" type="primary" @click="saveUpLoad">确认上传</el-button>
                <el-button size="medium" type="success" @click="returnVC">返回</el-button>

            </div>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :close-on-click-modal="false" :visible.sync="editVisible" width="80%" >
            <el-form ref="form" :model="form" label-width="100px" label-height = auto>
                <el-form-item label="类型" >
                    <el-input v-model="form.type_accessories" :disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="品牌名">
                    <el-input v-model="form.brand_name" :disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="显示">
                    <el-checkbox v-model="showChecked">显示</el-checkbox>
                </el-form-item>
                <el-form-item label="配件名">
                    <el-input v-model="form.name"></el-input>
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
                <el-form-item label="地区价格">
                    <p style="font-size: 13px;color:red;">实例:国内 100元;美国 200美元</p>
                    <input placeholder="名字和值用空格隔开,不同字段用英文分号隔开。" type="text" style="width: 100%;height: 40px;font-size: 15px" v-model="otherInput">

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
                    weight:'',
                    is_hot:''
                },
                tab_index:'',
                currentPage:1,
                editVisible:false,
                delVisible:false,
                activeName: '1',
                idx:'',
                todo:[],
                brandId:'',
                dic:{},
                imgList: [],
                size: 0,
                editImgVisible:false,
                otherInput:'',
                showChecked:''

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
            isShowFormatter: function (row, column) {
                return row.is_show? '是' : '否';
            },
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
                var parStr = "/api/cigar/admin_cigar_accessories/"+ this.tab_index+'/'+this.currentPage+'/'+this.brand_name+'/';
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
                    is_show:item.is_show,
                }
                this.editVisible = true;
                this.showChecked = this.form.is_show;
                this.otherInput =
                    item.store_a + ' ' + item.price_a + ';'  +
                    item.store_b + ' ' + item.price_b + ';'  +
                    item.store_c + ' ' + item.price_c + ';';


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
                    is_show:true,

                }


                this.editVisible = true;
            },
            //新增和编辑的请求
            saveEdit(){
                if (!this.brand_name){
                    return;
                }

                var array = this.otherInput.split(';');
                if (array.length == 1){
                    var array1 = array[0].split(' ');
                    this.form.store_a = array1[0];
                    this.form.price_a = array1[1];
                    this.form.store_b = '';
                    this.form.price_b = '';
                    this.form.store_c = '';
                    this.form.price_c = '';
                }
                if (array.length == 2){
                    var array1 = array[0].split(' ');
                    this.form.store_a = array1[0];
                    this.form.price_a = array1[1];
                    var array2 = array[1].split(' ');
                    this.form.store_b = array2[0];
                    this.form.price_b = array2[1];
                    this.form.store_c = '';
                    this.form.price_c = '';
                }
                if (array.length >= 3){
                    var array1 = array[0].split(' ');
                    this.form.store_a = array1[0];
                    this.form.price_a = array1[1];
                    var array2 = array[1].split(' ');
                    this.form.store_b = array2[0];
                    this.form.price_b = array2[1];
                    var array3 = array[2].split(' ');
                    this.form.store_c = array3[0];
                    this.form.price_c = array3[1];
                }
                 this.form.is_show = this.showChecked ? '1' : '0';

                this.form.type_accessories = this.tab_index;
                var self = this;
                this.$axios.post('/api/cigar/cigar_accessories/6/6/bn/',this.form,{headers:{
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
                dic.price_a = '';
                dic.store_a = '';
                dic.price_b = '';
                dic.store_b = '';
                dic.price_c = '';
                dic.store_c = '';
                this.$axios.post('/api/cigar/cigar_accessories/6/6/bn/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    self.$message.success(res.data.message);
                    self.getData();
                });
            },
            //修改图片片
            changePhotolist(index,row){
                this.editImgVisible = true;
                this.imgList = [];
                this.dic = this.tableData[index];
                for (var i = 0 ; i <this.dic.photo_list.length;i++){
                    if (this.dic.photo_list[i].photo.length != 0) {
                        this.imgList.push({
                                'file': {
                                    'name':this.dic.photo_list[i]['id'],
                                    'src':this.dic.photo_list[i]['photo']
                                }
                            }
                        )
                    }

                }


                return;
                var self = this;
                this.$router.push({
                    path:'/CigarShopDetailsImage',
                    query: {'key':self.tableData[index]}
                })
            },
            saveUpLoad(){
                var t = this;
                var qiniuImgList = [];

                for (let i = 0 ; i <this.imgList.length;i++){
                    var src = this.imgList[i].file.src;
                    (function () {
                        if (src.indexOf('http://photo.lpszn.com') == -1){
                            t.$uploadQiNiuYun.uploadqiniuyun(src,function (res,key) {
                                var dic = {
                                    'cigar_accessories_id':t.dic.id,
                                    'photo_url':res,
                                    'photo_id':'',
                                    'type':2,           //操作类型(2/新增，3/删除)
                                };
                                t.$axios.post('/api/cigar/ad_cigar_accessories_photo/',dic,{headers:{
                                        "Authorization":"JWT " + localStorage.getItem('token')
                                    }}).then(res=>{
                                    if (res.data.status == 1){
                                        t.$message.success(res.data.message);
                                    }else {
                                        t.$message.warning(res.data.message);
                                    }
                                });
                            })

                        }
                    })(src);



                }



            },




            fileClick() {
                document.getElementById('upload_file').click()
            },
            fileChange(el) {
                if (!el.target.files[0].size) return;
                this.fileList(el.target);
                el.target.value = ''
            },
            fileList(fileList) {
                let files = fileList.files;
                for (let i = 0; i < files.length; i++) {
                    //判断是否为文件夹
                    if (files[i].type != '') {
                        this.fileAdd(files[i]);
                    } else {
                        //文件夹处理
                        this.folders(fileList.items[i]);
                    }
                }
            },
            //文件夹处理
            folders(files) {
                let _this = this;
                //判断是否为原生file
                if (files.kind) {
                    files = files.webkitGetAsEntry();
                }
                files.createReader().readEntries(function (file) {
                    for (let i = 0; i < file.length; i++) {
                        if (file[i].isFile) {
                            _this.foldersAdd(file[i]);
                        } else {
                            _this.folders(file[i]);
                        }
                    }
                })
            },
            foldersAdd(entry) {
                let _this = this;
                entry.file(function (file) {
                    _this.fileAdd(file)
                })
            },
            fileAdd(file) {
                //总大小
                this.size = this.size + file.size;
                //判断是否为图片文件
                if (file.type.indexOf('image') == -1) {
                    file.src = 'wenjian.png';
                    this.imgList.push({
                        file
                    });
                } else {
                    let reader = new FileReader();
                    reader.vue = this;
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        file.src = this.result;
                        this.vue.imgList.push({
                            file
                        });
                    }
                }
            },
            fileDel(index) {
                var t = this;
                var dic = {
                    'cigar_accessories_id':t.dic.id,
                    'photo_url':t.imgList[index].file.src,
                    'photo_id':t.imgList[index].file.name,
                    'qiniu_key':t.imgList[index].file.src.split('http://photo.lpszn.com/')[1],
                    'type':3,           //操作类型(2/新增，3/删除)
                };
                t.$axios.post('/api/cigar/ad_cigar_accessories_photo/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    t.$message.success(res.data.message);
                    t.imgList.splice(index, 1);
                });
            },
            returnVC() {
                this.editImgVisible = false;
                this.getData();
            },
            bytesToSize(bytes) {
                if (bytes === 0) return '0 B';
                let k = 1000, // or 1024
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            },
            dragenter(el) {
                el.stopPropagation();
                el.preventDefault();
            },
            dragover(el) {
                el.stopPropagation();
                el.preventDefault();
            },
            drop(el) {
                el.stopPropagation();
                el.preventDefault();
                this.fileList(el.dataTransfer);
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
    .upload_warp_img_div_del {
        position: absolute;
        top: 6px;
        width: 16px;
        right: 4px;
    }

    .upload_warp_img_div_top {
        position: absolute;
        top: 0;
        width: 100%;
        height: 30px;
        background-color: rgba(0, 0, 0, 0.4);
        line-height: 30px;
        text-align: left;
        color: #fff;
        font-size: 12px;
        text-indent: 4px;
    }

    .upload_warp_img_div_text {
        white-space: nowrap;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .upload_warp_img_div img {
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
    }

    .upload_warp_img_div {
        position: relative;
        height: 100px;
        width: 120px;
        border: 1px solid #ccc;
        margin: 0px 30px 10px 0px;
        float: left;
        line-height: 100px;
        display: table-cell;
        text-align: center;
        background-color: #eee;
        cursor: pointer;
    }

    .upload_warp_img {
        border-top: 1px solid #D2D2D2;
        padding: 14px 0 0 14px;
        overflow: hidden
    }

    .upload_warp_text {
        text-align: left;
        margin-bottom: 10px;
        padding-top: 10px;
        text-indent: 14px;
        border-top: 1px solid #ccc;
        font-size: 14px;
    }

    .upload_warp_right {
        float: left;
        width: 57%;
        margin-left: 2%;
        height: 100%;
        border: 1px dashed #999;
        border-radius: 4px;
        line-height: 130px;
        color: #999;
    }

    .upload_warp_left img {
        margin-top: 32px;
    }

    .upload_warp_left {
        float: left;
        width: 40%;
        height: 100%;
        border: 1px dashed #999;
        border-radius: 4px;
        cursor: pointer;
    }

    .upload_warp {
        margin: 14px;
        height: 130px;
    }

    .upload {
        margin: 0 auto;
        border: 1px solid #ccc;
        background-color: #fff;
        width: 100%;
        box-shadow: 0px 1px 0px #ccc;
        border-radius: 4px;
    }

    .hello {
        width: 100%;
        margin-left: 0;
        margin-top: 50px;
        text-align: center;
    }
</style>
