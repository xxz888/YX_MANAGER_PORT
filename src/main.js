import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';

import "babel-polyfill";
import upload_global from './router/upLoadQinNiuYun'
Vue.prototype.$uploadQiNiuYun = upload_global;

import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'
import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
Vue.use(VueUeditorWrap);
Vue.config.productionTip = false
/* eslint-disable no-new */

Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

Vue.prototype.$QiNiuUrl = "http://photo.lpszn.com/";
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


var vue = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

window.addEventListener('load', function () {
    if (vue.$route.path === '/CigarDetailsChange' ||
        vue.$route.path === '/CigarDetails' ||
        vue.$route.path === '/CigarDetailsImage'
    ) { // /date 表示日期选择路由
        vue.$router.replace('/CigarInfo') // 列表页面的路由
    }
})
