import * as Qiniu from 'qiniu-js'
import axios from 'axios'
import $ from 'jquery'

function uploadqiniuyun(params,fun) {
    var base64Arr = params.split(',');
    var imgtype = '';
    var base64String = '';
    if(base64Arr.length > 1){
        //如果是图片base64，去掉头信息
        base64String = base64Arr[1];
        imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':')+1,base64Arr[0].indexOf(';'));
    }
    // 将base64解码
    var bytes = atob(base64String);
    //var bytes = base64;
    var bytesCode = new ArrayBuffer(bytes.length);
    // 转换为类型化数组
    var byteArray = new Uint8Array(bytesCode);
    // 将base64转换为ascii码
    for (var i = 0; i < bytes.length; i++) {
        byteArray[i] = bytes.charCodeAt(i);
    }
    var blob_fileImg = new Blob( [bytesCode] , {type : imgtype});

    var userid = localStorage.getItem('id');
    var timestamp = (new Date()).getTime();
    var key = userid + '_image_' + timestamp + '.jpg';
    var url =  '/api/pub/qiniu_token/'+key + '/';
    axios.get(url,{headers:{
            "Authorization":"JWT " + localStorage.getItem('token')
        }}).then((res) =>{
            var addr = 'http://photo.thegdlife.com/'
            var file = blob_fileImg;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('token', res.data.token);
            formData.append('key',key);
            $.ajax({
                url: 'http://up-z0.qiniup.com/',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: formData,
                processData: false,
                contentType: false
            }).done((res) => {
                fun(addr+res.key,key)
            }).fail(function(err) {
                console.log('error');
            });
    })

};
export default {
    uploadqiniuyun
}
