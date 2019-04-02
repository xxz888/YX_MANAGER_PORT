<template>
    <div v-loading="B_Loading">
    <div style="margin: 20px;"></div>
    <el-form style="margin-left: 0px" :label-position="labelPosition"  label-width="100px" :model="form">
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
        <p style="margin: 0px 20px;font-size: 13px;color:red;">实例:中文名称 BHK52;环径 52;长度 119mm</p>
        <input placeholder="名字和值用空格隔开,不同字段用英文分号隔开。" type="text" style="margin: 10px 20px;width: 100%;height: 40px;font-size: 15px" v-model="otherInput">
        <div align="center">
            <el-button size="medium" type="primary" @click="saveInfo">修改</el-button>
        </div>

    </div>

</template>

<script>
    export default {
        name: "CigarDetailsChange",
        data(){
          return {
              dic:'',
              labelPosition: 'left',
              collectdisabled:'false',
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
                  id:'',
                  photo_list:[],
                  store_hongkong:'',
                  store_overseas:'',
                  collect_number:'',
                  otherInput:''
              },
              dialogImageUrl: '',
              dialogVisible: false,
              nameBtn:'',
              otherInput:'',
              B_Loading:false
          }
        },
        created(){
            this.getParams();

        },
        watch:{
            '$route':'getParams'
        },
        methods:{
            getParams(){
                this.form = this.$route.query.key;
                if (this.form.argument){
                    var dic = JSON.parse(this.form.argument);
                    for(var key in dic){
                        var newKey =   key;
                        var newValue = dic[key];
                        this.otherInput = (this.otherInput ? this.otherInput : '') + newKey + ' ' + newValue + ';';
                    }
                }
            },
            saveInfo(){
                var t = this;
                var dic = t.form;
                dic['type'] = '1';
                dic['cigar_id'] = t.form.id;
                if (!t.form.id){
                    return;
                }

                var objDic = {};
                var array = this.otherInput.split(';');
                for (var i = 0 ; i < array.length;i++){
                    var array1 = array[i].split(' ');
                    var key = array1[0];
                    var value = array1[1];
                    objDic[key] = value;
                }
                dic['argument'] = objDic;
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
            toChineseWords(data){
                if(data == '' || typeof data == 'undefined') return '';
                data = data.split("\\u");
                var str ='';
                for(var i=0;i<data.length;i++){
                    str+=String.fromCharCode(parseInt(data[i],16).toString(10));
                }
                return str;
            },


        }
    }
</script>

<style scoped>

</style>
