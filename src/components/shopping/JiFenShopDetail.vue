
<template>
    <div class="table">
        <div class="container">
            <div style="margin: 20px;"></div>
            <div class="handle-box">
                <el-button type="success" icon="search" @click="addnews">新增</el-button>
            </div>
            <el-table
                    row-key="id"

                    :data="data"
                    tooltip-effect="dark"
                    border
                    class="table"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange">

                <el-table-column label="设为封面" width="100" align="center">
                    <template slot-scope="scope">
                        <el-checkbox @change="handleCheckChange(val,scope.$index)"  v-model="scope.row.checked == 1">封面</el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID"  width="50" align="center">
                </el-table-column>
                <el-table-column prop="name" label="名称"   align="center">
                </el-table-column>
                <el-table-column prop="integral" label="积分"  width="100" align="center">
                </el-table-column>
                <el-table-column prop="inventory" label="库存"  width="100" align="center">
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="图片信息" width="200" align="center">
                    <template slot-scope="scope">
<<<<<<< HEAD
                        <el-button type="text" icon="el-icon-edit"   @click="fengMianImageAction(scope.$index, scope.row)">商品图片</el-button>
=======
                        <el-button type="text" icon="el-icon-edit"  v-if="scope.row.checked == 1" @click="fengMianImageAction(scope.$index, scope.row)">封面图片</el-button>
>>>>>>> dca1ba302afaca3c7d83d894cc352a7b67b9fe3e

                        <el-button type="text" icon="el-icon-edit" class="green"  @click="fengMianImageAction1(scope.$index, scope.row)">详情图片</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="editVisible" width="70%">
            <el-form label-width="100px" label-height = auto :model="form">
                <el-form-item style="width: 50%;" label="名称">
                    <el-input placeholder="名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item style="width: 50%;" label="积分">
                    <el-input placeholder="积分" v-model="form.integral"></el-input>
                </el-form-item>
                <el-form-item style="width: 50%;" label="价格">
                    <el-input placeholder="价格" v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item style="width: 50%;" label="库存">
                    <el-input placeholder="库存" v-model="form.inventory"></el-input>
                </el-form-item>
                <el-form-item style="width: 80%;" label="权重">
                    <el-input  placeholder="请输入权重" v-model="form.weight"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
        </el-dialog>


        <!-- 封面和弹出框 -->
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="editImageVisible" width="90%">
            <el-upload
                    :on-change="handleChange"
                    :file-list="fileList"
                    :on-remove="handleRemove"
                    action="#"
                    list-type="picture-card"
                    :auto-upload="false">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail"  :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                        </span>
                </div>
            </el-upload>
        </el-dialog>
        <!-- 详情图片弹出框 -->
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="editImageVisible1" width="90%">
            <el-upload
                    :on-change="handleChange1"
                    :file-list="fileList1"
                    :on-remove="handleRemove1"
                    action="#"
                    list-type="picture-card"
                    :auto-upload="false">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail"  :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                        </span>
                </div>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'JiFenShopDetail',

        data() {
            return {
                editImageVisible1:false,
                editImageVisible:false,
                tableData: [],
                cur_page: 1,
                editVisible: false,
                delVisible: false,
                form: {
                    type_: '',
                    name: '',
                    integral:'',
                    price:'',
                    inventory:'',
                    type:'',
                    weight:''
                },
                idx: -1,
                alertIdx:-1,
                fileList: [],
                fileList1: [],

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
                startDic:'',
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                currentImageRow_id:''
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
            // this.rowDrop();
        },
        methods: {
            //详情图片
            handleRemove1(file) {
                var self = this;
                var dic = {'type':'2','detail_id':file.name};
                self.$axios.post("/api/shop/integral_commodity_detail/",dic,{headers:{
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
            fengMianImageAction1(index, row){
                const item = this.tableData[index];
                this.currentImageRow_id = item.id;


                this.editImageVisible1 = true;

                var fiewnewlist = [];
                //这里判断是否有图片
                if(item.detail_list.length!=0){
                    for (var dic of item.detail_list){
                        fiewnewlist.push({'name':dic.id,'url':this.$QiNiuUrl+dic.photo});
                    }
                }
                this.fileList1 = fiewnewlist;

            },
            handleChange1(file, fileList) {
                var self = this;
                let a = new FileReader();
                a.readAsDataURL(file.raw);
                a.onload = function (e) {
                    var base64Img = e.target.result;
                    self.$uploadQiNiuYun.uploadqiniuyun(base64Img,function (res,key) {
                        var photo = res.split(self.$QiNiuUrl)[1];
                        var dic = {'type':'1','commodity_id':self.currentImageRow_id,'photo':photo};
                        self.$axios.post("/api/shop/integral_commodity_detail/",dic,{headers:{
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
                    })
                }
            },



            //封面图片
            handleRemove(file) {
                var self = this;
                var dic = {'type':'2','photo_id':file.name};
                self.$axios.post("/api/shop/integral_commodity_photo/",dic,{headers:{
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
            fengMianImageAction(index, row){
                const item = this.tableData[index];
                this.currentImageRow_id = item.id;


                this.editImageVisible = true;

                var fiewnewlist = [];
                //这里判断是否有图片
                if(item.photo_list.length!=0){
                    for (var dic of item.photo_list){
                        fiewnewlist.push({'name':dic.id,'url':this.$QiNiuUrl+dic.photo});
                    }
                }
                this.fileList = fiewnewlist;

            },
            handleChange(file, fileList) {
                var self = this;
                let a = new FileReader();
                a.readAsDataURL(file.raw);
                a.onload = function (e) {
                     var base64Img = e.target.result;
                     self.$uploadQiNiuYun.uploadqiniuyun(base64Img,function (res,key) {
                         var photo = res.split(self.$QiNiuUrl)[1];
                         var dic = {'type':'1','commodity_id':self.currentImageRow_id,'photo':photo};
                         self.$axios.post("/api/shop/integral_commodity_photo/",dic,{headers:{
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
                     })
                }
            },
            //请求
            getData() {
                var self = this;
                this.$axios.get("/api/shop/integral_classify/",{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    for (var dic of res.data.data){
                        if (dic.id == self.startId){
                            self.tableData = dic.commodity_list;
                            self.startDic = dic;
                        }
                    }
                    for (let i = 0; i < self.tableData.length; i++) {
                        if (self.tableData[i].id == self.startDic.commodify_id){
                            self.tableData[i].checked = 1;
                        } else{
                            self.tableData[i].checked = 0;

                        }
                    }
                });
            },
            handleCheckChange(val,index){
                if (!val  && this.tableData[index].id == this.startDic.commodify_id) {
                    return;
                }
                var dic = {
                    'type':'3',
                    'classify_id':this.startDic.id,
                    'name':this.startDic.name,
                    'label':this.startDic.label,
                    'photo':this.startDic.photo,
                    'weight':this.startDic.weight,
                    'commodify_id':this.tableData[index].id,
                };
                var self = this;
                this.$axios.post("/api/shop/integral_classify/",dic,{headers:{
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
            delCommontAction(item){
                var self = this;
                var dic = {
                    'type_':'2',
                    'commodity_id':item.id
                };
                this.$axios.post("/api/shop/integral_commodity/",dic,{headers:{
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
                this.startId = this.$route.query.id;

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
                this.form = {
                    'id':item.id,
                    'type_':'3',
                    'name':item.name,
                    'integral':item.integral,
                    'price':item.price,
                    'inventory':item.inventory,
                    'type':this.startId,
                    'weight':item.weight,
                };
                this.editVisible=true;
            },
            //增加按钮，弹出框
            addnews(){
                this.form = {
                    'type_':'1',
                    'name':'',
                    'integral':'',
                    'price':'',
                    'inventory':'',
                    'type':'',
                    'weight':'',};

                this.dialogTitle = '新增';
                this.editVisible=true;
            },
            saveEdit(){
                this.saveEditAndAdd();
            },
            saveEditAndAdd(){
                var dic;
                var id =  this.form.id;
                if (id && id.length!=0){
                    dic = {
                        'type_':'3',
                        'name':this.form.name,
                        'integral':this.form.integral,
                        'price':this.form.price,
                        'inventory':this.form.inventory,
                        'type':this.startId,
                        'weight':this.form.weight,
                        'commodity_id':this.form.id
                    };
                }else{
                    dic = {
                        'type_':'1',
                        'name':this.form.name,
                        'integral':this.form.integral,
                        'price':this.form.price,
                        'inventory':this.form.inventory,
                        'type':this.startId,
                        'weight':this.form.weight,
                    };
                }

                var self = this;
                this.$axios.post("/api/shop/integral_commodity/",dic,{headers:{
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
                const item = this.tableData[index];
                localStorage.setItem('HomeToolsDetail2',item.id);
                this.$router.push({
                    path:'/HomeToolsDetail2',
                })
                /*
                this.detailId =  this.tableData[index]['id'];
                this.alertTableCommonRequest();
                */
            },

            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleDownload(file) {
                console.log(file);
            },
            alertTableCommonRequest(){
                var self = this;
                this.$axios.get("/api/pub/option/0/"+this.detailId+'/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')}}).then((res)=>{
                    self.alertTableData = res.data;
                    self.detailVisible = true;
                    setTimeout(()=>{
                        self.rowDrop();
                    },2000)

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



            //tab切换
            handleClick(tab, event) {
                var string = event.target.getAttribute('id').split('-')[1];
                for (var i = 0 ; i < this.todo.length ; i ++){
                    if (string == this.todo[i].name){
                        this.fatherId = this.todo[i].id;
                    }
                }
                this.getDataDetail();
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
                        if (action == 'cancel'){
                            return;
                        }
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

                this.form = item;
                this.form.action = 3;
                this.form.option_id = item.id;
                this.dialogTitle = '编辑';
                this.form.weight = item.weight;
                this.fatherId = null;
                this.editVisible=true;


                // this.$prompt('请输入新的标签名', '编辑'+ '【'+item.name + '】', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     inputValue:item.name,
                //     closeOnClickModal:false
                // }).then(({ value }) => {
                //     if (value.length == 0) return;
                //     var dic = {
                //         'action':3,
                //         'option_id':item.id,
                //         'name':value,
                //         'photo':'',
                //         'is_next':1,
                //         'photo_detail':'',
                //         'intro':''
                //     };
                //     this.allEditAndNewAddCommonAction(dic,1);
                // }).catch(() => {
                // });
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
                        'intro':'',
                        'weight':0,
                        'is_lock':'0'
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
