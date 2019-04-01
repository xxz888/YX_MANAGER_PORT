<template>
    <div v-loading="B_Loading">
    <div style="margin: 20px;"></div>
    <el-form style="margin-left: 0px" :label-position="labelPosition"  label-width="100px" :model="form">
        <el-row :gutter="60">
            <el-col :span="10" :offset="1">
                <el-form-item label="雪茄名">
                    <el-input v-model="form.cigar_name"></el-input>
                </el-form-item>
                <el-form-item label="中文名">
                    <el-input v-model="form.cigar_name_CN"></el-input>
                </el-form-item>
                <el-form-item label="产地">
                        <el-input v-model="form.origin"></el-input>
                </el-form-item>
                <el-form-item label="品型">
                    <el-input v-model="form.shape"></el-input>
                </el-form-item>
                <el-form-item label="环径">
                    <el-input v-model="form.ring_gauge"></el-input>
                </el-form-item>
                <el-form-item label="长度">
                    <el-input v-model="form.length"></el-input>
                </el-form-item>
                <el-form-item label="包装颜色">
                    <el-input v-model="form.wrapper_color"></el-input>
                </el-form-item>
                <el-form-item label="浓度">
                    <el-input v-model="form.strength"></el-input>
                </el-form-item>
                <el-form-item label="口味">
                    <el-input v-model="form.flavour"></el-input>
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
        </el-row>
    </el-form>
        <div style="margin: 20px;"></div>
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
              form: {
                  cigar_name: '',
                  cigar_brand_id:'',
                  origin: '',
                  shape: '',
                  ring_gauge: '',
                  length: '',
                  wrapper_color: '',
                  strength: '',
                  flavour: '',
                  price_single_china: '',
                  price_box_china: '',
                  price_single_hongkong: '',
                  price_box_hongkong: '',
                  price_single_overseas: '',
                  price_box_overswas: '',
                  box_size: '',
                  id:'',
                  photo_list:[],
                  cigar_name_CN:'',
                  store_hongkong:'',
                  store_overseas:'',
                  collect_number:''

              },
              dialogImageUrl: '',
              dialogVisible: false,
              nameBtn:'',

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
            },
            saveInfo(){
                var t = this;
                var dic = t.form;
                dic['type'] = '1';
                dic['cigar_id'] = t.form.id;
                if (!t.form.id){
                    return;
                }
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

</style>
