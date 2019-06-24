<template>
    <div class="container">
        <el-tabs v-model="activeName" @tab-click="handleClick" >
            <el-tab-pane v-for="item in brandList" :label="item.brand_name" :name="item.brand_name"></el-tab-pane>
        </el-tabs>

        <div class="drag-box">
            <div class="drag-box-item">
                <div class="item-title">
                    <span>{{activeName}}</span>
                    <el-button style="float:right;" @click="addTag()" type="success">新增</el-button>
                </div>
                <div style="margin: 20px auto"></div>
                <draggable v-model="todo"
                           :options="dragOptions"
                @end="dragEnd">
                    <transition-group tag="div" id="todo" class="item-ul">
                        <div v-for="item in todo" class="drag-list" :key="item.id" >
                            {{item.type}}
                            <div style="float: right;">
                                <el-button size="mini" @click="editTag(item)" type="primary" icon="el-icon-edit" circle></el-button>
                                <el-button  size="mini" @click="delTag(item)" type="danger" icon="el-icon-delete" circle></el-button>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
            </div>
        </div>
    </div>

</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        name: "CigarShopTags",
        data(){
          return{
              dragOptions:{
                  animation: 120,
                  scroll: true,
                  group: 'sortlist',
                  ghostClass: 'ghost-style'
              },
              todo: [],
              brandList:[],
              brandId:'',
              activeName: '1'

          }
        },

        components:{
            draggable
        },
        created(){
            this.getBrandList();
        },
        watch:{
            '$route':'getBrandList'
        },
        methods: {
            //tab切换
            handleClick(tab, event) {
                var index =  event.target.getAttribute('id');
                var brandTagName =   index.replace('tab-','');
                for (var i = 0; i < this.brandList.length; i++){
                    if (this.brandList[i].brand_name == brandTagName) {
                        this.brandId = this.brandList[i].id;
                        break;
                    }
                }
                this.getData();
            },
            dragEnd(event){
                var self = this;

                console.log(this.todo);
                for (var i = 0 ; i < this.todo.length ; i ++){
                    this.todo[i].weight = i+1;
                    var dic = {
                        'tag_id':this.todo[i].id,
                        'tag':this.todo[i].type,
                        'type':'1',
                        'weight':this.todo[i].weight,
                        'brand_id':self.brandId

                    };
                    this.$axios.post("/api/cigar/cigar_accessories_type/0/",dic,{headers:{
                            "Authorization":"JWT " + localStorage.getItem('token')
                        }}).then((res)=>{ })
                }

            },
            getBrandList(){
                var self = this;
                this.$axios.get('/api/cigar/cigar_accessories_brand/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    self.brandList = res.data;
                    self.brandId = self.brandList[0]['id'];
                    self.activeName = self.brandList[0]['brand_name'];
                    self.getData();
                });
            },
            getData(){
                var self = this;
                self.todo = [];
                 this.$axios.get('/api/cigar/cigar_accessories_type/'+self.brandId+'/',{headers:{
                         "Authorization":"JWT " + localStorage.getItem('token')
                     }}).then(res=>{
                    self.todo = res.data;
                });
            },
            editTag(item){
                var self = this;

                this.$prompt('请输入新的标签名', '编辑'+ '【'+item.type + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:item.type,
                }).then(({ value }) => {
                    if (value.length == 0) return;
                    var dic = {
                        'tag_id':item.id,
                        'tag':value,
                        'type':'1',
                        'weight':item.weight,
                        'brand_id':self.brandId
                    };
                    this.$axios.post("/api/cigar/cigar_accessories_type/0/",dic,{headers:{
                            "Authorization":"JWT " + localStorage.getItem('token')
                        }}).then((res)=>{
                        if (res.data.status == 1){
                            this.$message.success(res.data.message);
                            this.getData();
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    })
                }).catch(() => {
                });
            },
            delTag(item){
                var self = this;

                this.$alert( '是否删除标签'+ '【'+item.type + '】', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if (action == 'cancel'){
                            return;
                        }
                        var dic = {
                            'tag_id':item.id,
                            'tag':'',
                            'type':'3',
                            'weight':item.weight,
                            'brand_id':self.brandId

                        };
                        this.$axios.post("/api/cigar/cigar_accessories_type/0/",dic,{headers:{
                                "Authorization":"JWT " + localStorage.getItem('token')
                            }}).then((res)=>{
                            if (res.data.status == 1){
                                this.$message.success(res.data.message);
                                this.getData();
                            } else {
                                this.$message.warning(res.data.message);
                            }
                        })
                    }
                });
            },
            addTag(){
                var self = this;
                this.$prompt('请输入新的标签名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:'',
                }).then(({ value }) => {
                    if (value.length == 0) return;
                    var dic = {
                        'tag_id':'',
                        'tag':value,
                        'type':'2',
                        'weight':'1',
                        'brand_id':self.brandId

                    };
                    this.$axios.post("/api/cigar/cigar_accessories_type/0/",dic,{headers:{
                            "Authorization":"JWT " + localStorage.getItem('token')
                        }}).then((res)=>{
                        if (res.data.status == 1){
                            this.$message.success(res.data.message);
                            this.getData();
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    })
                }).catch(() => {
                });
            }
        }
    }
</script>

<style scoped>
    .drag-box{
        display: flex;
        user-select: none;
    }
    .drag-box-item {
        flex: 1;
        max-width: 330px;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
        align-content: end;
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }
    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }
</style>

