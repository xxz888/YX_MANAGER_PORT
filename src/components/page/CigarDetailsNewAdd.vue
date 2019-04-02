<template>
    <div>
        <div style="margin: 20px;"></div>
        <el-form style="margin-left: 0px"   label-width="100px" :model="form">
            <el-row :gutter="60">
                <el-col :span="10" :offset="1">
                    <el-form-item label="雪茄名">
                        <el-input v-model="form.cigar_name"></el-input>
                    </el-form-item>
                    <el-form-item label="盒装规格">
                        <el-input v-model="form.box_size"></el-input>
                    </el-form-item>
                    <el-form-item label="收藏人数">
                        <el-input v-model="form.collect_number"></el-input>
                    </el-form-item>
                    <el-form-item label="香港店名">
                        <el-input v-model="form.store_hongkong"></el-input>
                    </el-form-item>
                    <el-form-item label="海外店名">
                        <el-input v-model="form.store_overseas"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="国内单支售价">
                        <el-input v-model="form.price_single_china"></el-input>
                    </el-form-item>
                    <el-form-item label="国内一盒售价">
                        <el-input v-model="form.price_box_china"></el-input>
                    </el-form-item>
                    <el-form-item label="香港单支售价">
                        <el-input v-model="form.price_single_hongkong"></el-input>
                    </el-form-item>
                    <el-form-item label="香港一盒售价">
                        <el-input v-model="form.price_box_hongkong"></el-input>
                    </el-form-item>
                    <el-form-item label="海外单支售价">
                        <el-input v-model="form.price_single_overseas"></el-input>
                    </el-form-item>
                    <el-form-item label="海外一盒售价">
                        <el-input v-model="form.price_box_overswas"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div style="margin: 20px 20px;"></div>


        <p style="margin: 0px 20px;font-size: 13px;color:red;">备注:默认6个字段,不填代表手机端不显示</p>
        <el-form style="margin: 10px 0px"  label-width="100px" :model="form1">
            <el-row  :gutter="50">
                <el-col  :span="10" :offset="1">
                    <el-form-item label="中文名">
                        <el-input v-model="form1.中文名"></el-input>
                    </el-form-item>
                    <el-form-item label="品型">
                        <el-input v-model="form1.品型"></el-input>
                    </el-form-item>
                    <el-form-item label="环径">
                        <el-input v-model="form1.环径"></el-input>
                    </el-form-item>

                </el-col>
                <el-col :span="10">
                    <el-form-item label="长度">
                        <el-input v-model="form1.长度"></el-input>
                    </el-form-item>
                    <el-form-item label="浓度">
                        <el-input v-model="form1.浓度"></el-input>
                    </el-form-item>
                    <el-form-item label="口味">
                        <el-input v-model="form1.口味"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <p style="margin: 0px 20px;font-size: 13px;color:red;">实例:中文名称 BHK52;环径 52;长度 119mm</p>
        <input placeholder="名字和值用空格隔开,不同字段用英文分号隔开。" type="text" style="margin: 10px 20px;width: 100%;height: 40px;font-size: 15px" v-model="otherInput">
        <div style="margin: 20px 20px;"></div>
        <div align="center">
            <el-button size="medium" type="primary" @click="saveInfo">完成</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: "CigarDetailsNewAdd",
        data(){
            return {
                dic:'',
                form1: {
                    中文名: '',
                    品型:'',
                    环径: '',
                    长度: '',
                    浓度: '',
                    口味: '',
                },
                otherInput:'',
                form: {
                    cigar_name: '',
                    cigar_brand_id:'',
                    price_single_china: '',
                    price_box_china: '',
                    price_single_hongkong: '',
                    price_box_hongkong: '',
                    price_single_overseas: '',
                    price_box_overswas: '',
                    box_size: '',
                    store_hongkong:'',
                    store_overseas:'',
                    collect_number:''
                },
                dialogImageUrl: '',
                dialogVisible: false,
                nameBtn:'',
            }
        },
        created(){
        },
        methods:{
            addOther(){
                this.$prompt('请输入新的字段,名称和值用空格分隔开', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    if (value.indexOf(' ') == -1) {
                        this.$message.warning('名称和值用空格分隔开');
                        return;
                    }
                    this.otherInput = this.otherInput+value+';';
                }).catch(() => {

                });
            },
            saveInfo(){
                var t = this;
                var dic = t.form;
                dic['type'] = '2';
                dic['cigar_brand_id'] =this.$route.query.cigar_brand_id;
                dic['cigar_id']='';
                //input
                var array = this.otherInput.split(';');

                for (var i = 0 ; i < array.length;i++){
                    var array1 = array[i].split(' ');
                    var key = array1[0];
                    var value = array1[1];
                    t.form1[key] = value;
                }
                for(var key in t.form1) {
                    if(t.form1[key] == '') {
                        delete t.form1[key]
                    }
                }
                dic['argument']= t.form1;
                t.$axios.post('/api/cigar/ad_cigar/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    if (res.data.status == 1){
                        t.$router.go(-1);
                        t.$message.success(res.data.message);
                    }else {
                        t.$message.warning(res.data.message);
                    }
                });
            },


        }
    }
</script>
<style scoped>
    .itemStyle{
        background: #2b81af;
    }
</style>
