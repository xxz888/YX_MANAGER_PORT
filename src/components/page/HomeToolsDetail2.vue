<template>


    <div class="table">
        <el-tabs v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane v-for = 'item in todo' :label="item.name" :name="item.name"></el-tab-pane>
        </el-tabs>
        <div style="margin: 20px;"></div>
            <el-button type="primary" @click="addObj1">添加标题</el-button>
            <el-button type="success" @click="addObj2">添加段落</el-button>
            <el-button type="danger"    @click="addObj3">添加图片</el-button>
            <el-button type="warning" @click="addObj4">添加轮播图</el-button>
            <el-table
                    row-key="id"
                    :data="alertTableData"
                    style="width: 100%;margin-top: 20px"
                    tooltip-effect="dark"
                    border
                    class="table"
                    ref="multipleTable">
                <el-table-column
                        prop="id"
                        label="id"
                        width="80"
                        align="center">
                </el-table-column>

                <el-table-column
                        prop="obj"
                        label="类型"
                        width="100"
                        align="center"
                        :formatter="objFormatter">
                </el-table-column>
                <el-table-column
                        prop="detail"
                        label="Detail"
                        align="center">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.obj == 1" v-model="scope.row.detail" ></el-input>
                        <el-input v-if="scope.row.obj == 2" v-model="scope.row.detail"  type="textarea"   ></el-input>
                        <div      v-if="scope.row.obj == 3" class="crop-demo">
                            <img :src="scope.row.detail"    v-model="scope.row.detail" class="pre-img-Detail"  >
                            <div class="crop-demo-btn">添加编辑
                                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImageDetail($event,scope.$index)"/>
                            </div>
                        </div>
                        <div      v-else>
                            <el-row :gutter="0">
                                <el-col v-for="(item,indexTag) in scope.row.detail_list" :span="8">
                                    <div class="crop-demo">
                                        <img :src="item"  class="pre-img-Detail">
                                        <div class="crop-demo-btn">添加编辑
                                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImageDetailLunBo($event,scope.$index,indexTag)"/>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="alertHandleSave(scope.$index, scope.row)">保存</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="alertTableDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <!-- 标签管理弹出框 -->
        <el-dialog title="标签管理" :close-on-click-modal="false" :visible.sync="tagVisible" width="90%">
            <el-tag size="medium"
                    :key="item.id"
                    v-for="item in todo"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(item)"
                    @click="changeEdit(item)">
                {{item.name}}
            </el-tag>
            <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
            >
            </el-input>

            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
    import Sortable from 'sortablejs'

    export default {
        name: 'HomeToolsDetail2',
        components: {
            VueUeditorWrap
        },
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    id: '',
                    name: '',
                    photo: '',
                    intro:'',
                    photo_detail:''
                },
                idx: -1,
                alertIdx:-1,
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                checked:'',
                base64Array:[],
                activeName: '',
                tab_index:'',
                count:'',
                content:'',
                todo:[],
                currentPage:1,
                fatherId:'',
                startId:'',
                dialogTitle:'',
                detailPhoto:'',
                detailVisible:false,
                detailId:'',
                detailDetailId:'',
                isDetailEditOrAdd:false, //false为新增 true为编辑
                tagVisible:false,
                inputValue:'',
                inputVisible:false,
                alertTableData:[],
            }
        },
        created() {
            this.getParmters();
        },
        watch:{
            '$route':'getParmters'
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    return d;
                })
            },
        },
        mounted() {
             this.rowDrop();
        },
        methods: {
            //行拖拽
            rowDrop() {
                const tbody = document.querySelector('.el-table__body-wrapper tbody');
                const self = this;
                Sortable.create(tbody, {
                    onEnd({ newIndex, oldIndex }) {
                        var weight1 = self.alertTableData[oldIndex].id;
                        var weight2 = self.alertTableData[newIndex].id;
                        var url = "/api/pub/option_detail/?first_id="+weight2+'&second_id='+weight1;
                        self.$axios.get(url,{headers:{
                                "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                            if (res.data.status == 1){
                                self.$message.success(res.data.message);
                                self.alertTableCommonRequest();
                            } else {
                                self.$message.warning(res.data.message);
                            }
                        });
                    }
                })
            },
            addObj1(){

                var dic = {
                    'detail': "",
                    'id': '99999',
                    'obj':'1',
                    'option_id': this.detailId,
                    'weight': this.alertTableData.length+1
                }
                this.alertTableData.push(dic);
            },
            addObj2(){
                var dic = {
                    'detail': "",
                    'id': '99999',
                    'obj':'2',
                    'option_id': this.detailId,
                    'weight': this.alertTableData.length+1
                }
                this.alertTableData.push(dic);
            },
            addObj3(){
                var dic = {
                    'detail': "",
                    'id': '99999',
                    'obj':'3',
                    'option_id': this.detailId,
                    'weight': this.alertTableData.length+1
                }
                this.alertTableData.push(dic);
            },
            addObj4(){
                var dic = {
                    'detail': "",
                    'id': '99999',
                    'obj':'4',
                    'option_id': this.detailId,
                    'weight': this.alertTableData.length+1,
                    'detail_list':['','','']

                }
                this.alertTableData.push(dic);
            },

            alertHandleSave(index, row){
                this.alertIdx = index;
                const data = this.alertTableData[index];
                var dic = {};
                if (data.id == 99999){
                    dic = {
                        'action':1,
                        'option_id':data.option_id,
                        'obj':data.obj,
                        'detail':data.detail,
                        'weight':data.weight
                    };
                    if (data.obj == 4){
                        var detail = data.detail_list.join(',');
                        dic.detail = detail;
                    }
                }else{

                    dic = {
                        'action':3,
                        'option_detail_id':data.id,
                        'option_id':this.detailId,
                        'obj':data.obj,
                        'detail':data.detail,
                        'weight':data.weight
                    };
                    if (data.obj == 4){
                        var detail = data.detail_list.join(',');
                        dic.detail = detail;
                    }
                }
                console.log(dic);
                this.allAerltEditAndNewAddCommonAction(dic);
            },
            allAerltEditAndNewAddCommonAction(dic){
                var self = this;
                this.$axios.post("/api/pub/option_detail/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    if (res.data.status == 1){
                        self.$message.success(res.data.message);
                        self.alertTableCommonRequest();
                    } else {
                        self.$message.warning(res.data.message);
                    }
                })
            },


            alertTableDelete(index, row){
                this.alertIdx = index;
                const item = this.alertTableData[index];
                var self = this;
                this.$confirm('是否删除此行', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (item.id==99999){
                        self.alertTableData.splice(index);
                    } else {
                        self.alertDelCommontAction(item);
                    }
                }).catch(() => {});
            },
            alertDelCommontAction(item){
                var dic = {
                    'action':2,
                    'option_detail_id':item.id
                };
                var self = this;
                this.$axios.post("/api/pub/option_detail/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    if (res.data.status == 1){
                        self.$message.success(res.data.message);
                        self.alertTableCommonRequest();
                    } else {
                        self.$message.warning(res.data.message);
                    }
                })
            },
            delCommontAction(item){
                var self = this;
                var dic = {'action':2,'option_id':item.id,};
                this.$axios.post("/api/pub/option/6/6/",dic,{headers:{
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
            getParmters(){
                this.startId = localStorage.getItem('HomeToolsDetail2');
                if (this.startId){
                    this.getData();
                }
            },
            //分页切换取值
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //编辑按钮,弹出框
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = item;
                this.form.action = 3;
                this.form.option_id = item.id;
                this.dialogTitle = '编辑';
                this.fatherId = null;
                this.editVisible=true;
            },
            //增加按钮，弹出框
            addnews(){
                this.form = {
                    'id':'',
                    'name':'',
                    'photo':'',
                    'action':1,
                    'father_id':this.father_id,
                    'is_next':1
                }
                this.dialogTitle = '新增';
                this.editVisible=true;
            },
            saveEdit(){
                var self = this;

                var boll1 =  this.form.photo.indexOf('http://photo.thegdlife.com') == -1;
                var boll2 =  this.form.photo_detail.indexOf('http://photo.thegdlife.com') == -1;

                if (boll1 && !boll2){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.form.photo,function (res,key) {
                        self.form.photo = res;
                        self.saveEditAndAdd();
                    })
                }else if(boll1 && boll2){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.form.photo,function (res,key) {
                        self.form.photo = res;
                        self.$uploadQiNiuYun.uploadqiniuyun(this.form.photo_detail,function (res1,key) {
                            self.form.photo_detail = res1;
                            self.saveEditAndAdd();
                        })
                    })
                }else if(!boll1 && boll2){
                    this.$uploadQiNiuYun.uploadqiniuyun(this.form.photo_detail,function (res,key) {
                        self.form.photo_detail = res;
                        self.saveEditAndAdd();
                    })
                }else{
                    self.saveEditAndAdd();
                }

            },
            saveEditAndAdd(){
                var dic;
                if (this.fatherId){
                    dic = {
                        'action':this.form.action,
                        'father_id':this.fatherId,
                        'name':this.form.name,
                        'photo':this.form.photo,
                        'is_next':1,
                        'photo_detail':this.form.photo_detail,
                        'intro':this.form.intro
                    };
                }else{
                    dic = {
                        'action':this.form.action,
                        'name':this.form.name,
                        'photo':this.form.photo,
                        'is_next':1,
                        'option_id':this.form.option_id,
                        'photo_detail':this.form.photo_detail,
                        'intro':this.form.intro
                    };
                }

                var self = this;
                this.$axios.post("/api/pub/option/6/6/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    if (res.data.status == 1){
                        self.$message.success(res.data.message);
                        self.getData();
                    } else {
                        self.$message.warning(res.data.message);
                    }
                    self.editVisible = false;
                })
            },
            //确定删除,请求
            handleDelete(index, row){
                this.idx = index;
                const item = this.tableData[index];
                var self = this;
                this.$confirm('是否删除' + '【'+item.name + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.delCommontAction(item);
                }).catch(() => {});
            },
            //详情alerttabledata点击按钮
            handleDetail(index, row){
                this.detailId =  this.tableData[index]['id'];
                this.alertTableCommonRequest();
            },
            alertTableCommonRequest(){
                var self = this;
                this.$axios.get("/api/pub/option/0/"+this.detailId+'/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.alertTableData = res.data;
                });
            },
            //封面图片和详情图片
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.form.photo = event.target.result;
                    t.$refs.cropper && t.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            //详情图片
            setImage1(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.form.photo_detail = event.target.result;
                    t.$refs.cropper && t.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            //一张图片
            setImageDetail(e,index){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.$uploadQiNiuYun.uploadqiniuyun(event.target.result,function (res,key) {
                        t.alertTableData[index].detail = res;}),
                    t.$refs.cropper && t.$refs.cropper.replace(event.target.result)
                };
                reader.readAsDataURL(file);
            },
            //轮播图片
            setImageDetailLunBo(e,index,indexTag){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                var t = this;
                reader.onload = (event) => {
                    t.$uploadQiNiuYun.uploadqiniuyun(event.target.result,function (res,key) {
                        t.alertTableData[index].detail_list.splice(indexTag,1,res);
                    }),
                    t.$refs.cropper && t.$refs.cropper.replace(event.target.result)
                };
                reader.readAsDataURL(file);
            },

            //请求
            getData() {
                var self = this;
                this.$axios.get("/api/pub/option/1/"+this.startId+'/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.todo = res.data;
                    self.activeName = res.data[0]['name'];
                    self.detailId = res.data[0]['id'];
                    self.alertTableCommonRequest();
                });
            },
            //tab切换
            handleClick(tab, event) {
                var string = event.target.getAttribute('id').split('-')[1];
                for (var i = 0 ; i < this.todo.length ; i ++){
                    if (string == this.todo[i].name){
                        this.detailId = this.todo[i].id;
                    }
                }
                this.alertTableCommonRequest();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search() {
                this.is_search = true;
                this.$message.info('功能开发中');
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            data_formatter(value){
                return this.getLocalTime(value.date);
            },
            tagManager(){
                this.tagVisible = true;
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //删除
            handleClose(item) {
                this.$alert( '是否删除标签'+ '【'+item.name + '】', {
                    confirmButtonText: '确定',
                    callback: action => {
                        var dic = {
                            'action':2,
                            'option_id':item.id,
                        };
                        var self = this;
                        this.$axios.post("/api/pub/option/6/6/",dic,{headers:{
                                "Authorization":"JWT " + localStorage.getItem('token')
                            }}).then((res)=>{
                            if (res.data.status == 1){
                                self.$message.success(res.data.message);
                                self.getData();
                            } else {
                                self.$message.warning(res.data.message);
                            }
                            self.inputVisible = false;
                        })
                    }
                });
            },
            //编辑
            changeEdit(item) {
                this.$prompt('请输入新的标签名', '编辑'+ '【'+item.name + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:item.name,
                    closeOnClickModal:false
                }).then(({ value }) => {
                    if (value.length == 0) return;
                    var dic = {
                        'action':3,
                        'option_id':item.id,
                        'name':value,
                        'photo':'',
                        'is_next':1,
                        'photo_detail':'',
                        'intro':''
                    };
                    this.allEditAndNewAddCommonAction(dic,1);
                }).catch(() => {
                });
            },
            //新增
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue.length == 0) return;
                if (inputValue) {
                    var dic = {
                        'action':1,
                        'father_id':this.startId,
                        'name':inputValue,
                        'photo':'',
                        'is_next':1,
                        'photo_detail':'',
                        'intro':''
                    };
                    this.allEditAndNewAddCommonAction(dic);

                }
            },
            allEditAndNewAddCommonAction(dic){
                var self = this;
                this.$axios.post("/api/pub/option/6/6/",dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then((res)=>{
                    if (res.data.status == 1){
                        self.$message.success(res.data.message);
                        self.getData();
                    } else {
                        self.$message.warning(res.data.message);
                    }
                    self.inputVisible = false;
                    self.inputValue = '';
                })
            },
            objFormatter(data){
                return data.obj == 1 ? '标题' : data.obj == 2 ? '段落' : data.obj == 3 ? '图片' : data.obj == 4 ? '轮播图' : '其他';
            }
        },
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
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
    .green{
        color: #58B92D;
    }
    .mr10{
        margin-right: 10px;
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
    .crop-demo-btn-lunbo{
        position: relative;
        width: 40px;
        height: 40px;
        padding: 0 8px;
        margin-left: 10px;
        background-color: #409eff;
        color: #fff;
        font-size: 10px;
        border-radius: 4px;
        line-height: 40px;
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
        border-radius: 50px;
    }
    .pre-img-Detail{
        width: 100px;
        height: 60px;
        background: #f8f8f8;
        border-radius: 5px;
    }

    .el-tag + .el-tag {
        margin-left: 10px
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;

        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
