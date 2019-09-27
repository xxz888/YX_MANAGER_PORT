import * as Qiniu from 'qiniu-js'
import axios from 'axios'
import $ from 'jquery'
import qiniu from 'qiniu'
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

    var accessKey = 'rpLW8CzqDzdgK27Mdp6fdrFjjdJRR-jBmfC1m8P0';
    var secretKey = 'm6t4wu-bTuHJBmw4h-H99JiogkmfKNfj2N0nvG-K';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    var options = {
        scope: 'thegdlife',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
            var addr = 'http://photo.lpszn.com/'
            var file = blob_fileImg;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('token', uploadToken);
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

};

function getImgUrl(key,fun){
    var resultUrl = '';
    if (key && key!='' && key.indexOf('base64')==-1 && key.indexOf('http://photo.lpszn.com/')==-1){
        resultUrl = 'http://photo.lpszn.com/' + key;
    }else{
        resultUrl = key;
    }
    fun(resultUrl);
};

export default {
    uploadqiniuyun,
    getImgUrl
}
