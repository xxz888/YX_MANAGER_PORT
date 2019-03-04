<template>
    <div>
    <div style="margin: 20px;"></div>
    <el-form style="margin-left: 0px" :label-position="labelPosition"  label-width="100px" :model="form">
        <el-row :gutter="60">
            <el-col :span="10" :offset="1">
                <el-form-item label="雪茄名">
                    <el-input v-model="form.cigar_name"></el-input>
                </el-form-item>
                <el-form-item label="产地">
                        <el-input v-model="form.origin"></el-input>
                </el-form-item>
                <el-form-item label="形状">
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
            </el-col>
        </el-row>
    </el-form>
        <div style="margin: 20px;"></div>
        <div align="center">
            <el-button size="medium" type="primary" @click="saveInfo">保存</el-button>
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
                  photo_list:[]
              },
              dialogImageUrl: '',
              dialogVisible: false,
              imgSrc:'',
          }
        },
        created(){
            if (this.$route.query.cigar_name){
                this.getParams();
            }
        },
        methods:{
            getParams(){
                this.form = this.$route.query;
                this.imgSrc = this.form.photo_list[0].photo_url;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            saveInfo(){
                var t = this;
                var dic = t.form;
                if (this.$route.query.cigar_name){
                    dic['type'] = '1';
                    dic['cigar_id'] = t.form.id;
                }else{
                    dic['type'] = '2';
                    dic['cigar_brand_id'] =this.$route.query.cigar_brand_id;

                }
                t.$axios.post('/api/cigar/ad_cigar/',dic,{headers:{
                        "Authorization":"JWT " + localStorage.getItem('token')
                    }}).then(res=>{
                    if (res.data.status == 1){
                        this.$router.go(-1);
                    }else {
                        this.$message.warning(res.data.message);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .red{
        color: #ff0000;
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
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .spanname{
        text-align: left;
        vertical-align: middle;

    }
    .button {
        padding: 0;
        float: right;
        vertical-align: middle;
    }
    .image {
        width: 100%;
        display: block;
    }
    .namediv{
        text-align:left
    }
</style>
