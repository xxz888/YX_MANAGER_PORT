import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/HomeAdver',
                    component: resolve => require(['../components/page/HomeAdver.vue'], resolve),
                    meta: {title: '广告列表'}
                },
                {
                    path: '/HomeInfo',
                    component: resolve => require(['../components/page/HomeInfo.vue'], resolve),
                    meta: {title: '资讯列表'}
                },
                {
                    path: '/CigarDetails',
                    component: resolve => require(['../components/page/CigarDetails.vue'], resolve),
                    meta: {title: '雪茄详情'}
                },

                {
                    path: '/CigarShop',
                    component: resolve => require(['../components/page/CigarShop.vue'], resolve),
                    meta: {title: '雪茄配件'}
                },
                {
                    path: '/CigarShopDetail',
                    component: resolve => require(['../components/page/CigarShopDetail.vue'], resolve),
                    meta: {title: '配件信息'}
                },

                {
                    path: '/CigarInfo',
                    component: resolve => require(['../components/page/CigarInfo.vue'], resolve),
                    meta: {title: '雪茄品牌'}
                },
                {
                    path: '/CigarDetailsChange',
                    component: resolve => require(['../components/page/CigarDetailsChange.vue'], resolve),
                    meta: {title: '雪茄详情修改'}
                },
                {
                    path: '/CigarDetailsNewAdd',
                    component: resolve => require(['../components/page/CigarDetailsNewAdd.vue'], resolve),
                    meta: {title: '雪茄详情新增'}
                },
                {
                    path: '/CigarShopDetailsImage',
                    component: resolve => require(['../components/page/CigarShopDetailsImage.vue'], resolve),
                    meta: {title: '商品图片'}
                },
                {
                    path: '/CigarDetailsImage',
                    component: resolve => require(['../components/page/CigarDetailsImage.vue'], resolve),
                    meta: {title: '雪茄图片修改'}
                },
                {
                    path: '/CigarAccessories',
                    component: resolve => require(['../components/page/CigarAccessories.vue'], resolve),
                    meta: {title: '雪茄文化'}
                },
                {
                    path: '/UsersFindTag',
                    component: resolve => require(['../components/page/UsersFindTag.vue'], resolve),
                    meta: {title: '发现标签'}
                },
                {
                    path: '/UsersFindContent',
                    component: resolve => require(['../components/page/UsersFindContent.vue'], resolve),
                    meta: { title: '发现内容' }
                },
                {
                    path: '/UsersTagList',
                    component: resolve => require(['../components/page/UsersTagList.vue'], resolve),
                    meta: {title: '标签列表'}
                },
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/other/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },

                {
                    path: '/CigarShopTags',
                    component: resolve => require(['../components/page/CigarShopTags.vue'], resolve),
                    meta: { title: '配件标签' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/other/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/other/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/other/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/other/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/other/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/other/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/other/Upload.vue'], resolve),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/other/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/other/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/other/DragDialog.vue'], resolve),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/other/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/other/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/other/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
