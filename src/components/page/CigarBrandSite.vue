<template>
    <div class="container">
        <div class="item-title">
            <el-button  @click="addTag()" type="success">新增</el-button>
        </div>
        <div class="drag-box">
            <div class="drag-box-item">
                <div style="margin: 20px auto"></div>
                <draggable v-model="todo"
                           :options="dragOptions"
                           @end="dragEnd">
                    <transition-group tag="div" id="todo" class="item-ul">
                        <div v-for="item in todo" class="drag-list" :key="item.id" >
                            {{item.site}}
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
        name: "CigarBrandSite",
        data(){
            return {
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                todo: [],
                brandList: [],
            }
        },
        components:{
            draggable
        },
        created(){
            this.getData();
        },
        watch:{
            '$route':'getData'
        },
        methods: {
            dragEnd(event){
                var self = this;
                for (var i = 0 ; i < this.todo.length ; i ++){
                    this.todo[i].weight = i+1;
                    var dic = {
                        'site_id':this.todo[i].id,
                        'type':'3',
                        'weight':this.todo[i].weight,
                        'site':this.todo[i].site
                    };
                    this.$axios.post("/api/cigar/cigar_brand_site/",dic,{headers:{
                            "Authorization":"JWT " + localStorage.getItem('token')
                        }}).then((res)=>{ })
                }

            },
            getData(){
                var self = this;
                self.todo = [];
                this.$axios.get('/api/cigar/cigar_brand_site/',{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    self.todo = res.data;
                });
            },
            editTag(item){
                var self = this;

                this.$prompt('请输入新的产地名', '编辑'+ '【'+item.site + '】', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:item.site,
                }).then(({ value }) => {
                    if (value.length == 0) return;
                    var dic = {
                        'site_id':item.id,
                        'site':value,
                        'type':'3',
                        'weight':item.weight,
                    };
                    this.$axios.post("/api/cigar/cigar_brand_site/",dic,{headers:{
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

                this.$alert( '是否删除产地'+ '【'+item.site + '】', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if (action == 'cancel'){
                            return;
                        }
                        var dic = {
                            'site_id':item.id,
                            'type':'2',
                            'weight':item.weight,
                            'site':''

                        };
                        this.$axios.post("/api/cigar/cigar_brand_site/",dic,{headers:{
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
                this.$prompt('请输入新的产地名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:'',
                }).then(({ value }) => {
                    if (value.length == 0) return;
                    var dic = {
                        'site':value,
                        'type':'1',
                        'weight':'1',
                        'site_id':''

                    };
                    this.$axios.post("/api/cigar/cigar_brand_site/",dic,{headers:{
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
