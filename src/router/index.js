import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
            // name: 'dashboard',
            // component: resolve => require(['../components/other/Dashboard'], resolve)
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/ChouJiang1',
                    component: resolve => require(['../components/shopping/ChouJiang1.vue'], resolve),
                    meta: {title: '抽奖'}
                },
                {
                    path: '/JiFenShop',
                    component: resolve => require(['../components/shopping/JiFenShop.vue'], resolve),
                    meta: {title: '积分商城'}
                },
                {
                    path: '/JiFenShopDetail',
                    component: resolve => require(['../components/shopping/JiFenShopDetail.vue'], resolve),
                    meta: {title: '积分商城详情'}
                },
                {
                    path: '/UserAdminShaiTuWenZhang',
                    component: resolve => require(['../components/page/UserAdminShaiTuWenZhang.vue'], resolve),
                    meta: {title: '发布文章'}
                },
                {
                    path: '/HomeToolsDetail2',
                    component: resolve => require(['../components/page/HomeToolsDetail2.vue'], resolve),
                    meta: {title: '指南详情2'}
                },
                // {
                //     path: '/HomeAdver',
                //     component: resolve => require(['../components/page/HomeAdver.vue'], resolve),
                //     meta: {title: '广告列表'}
                // },
                // {
                //     path: '/HomeInfo',
                //     component: resolve => require(['../components/page/HomeInfo.vue'], resolve),
                //     meta: {title: '资讯列表'}
                // },
                // {
                //     path: '/CigarDetails',
                //     component: resolve => require(['../components/page/CigarDetails.vue'], resolve),
                //     meta: {title: '雪茄详情'}
                // },
                // {
                //     path: '/HomeAdver_Edit',
                //     component: resolve => require(['../components/page/HomeAdver_Edit.vue'], resolve),
                //     meta: {title: '广告编辑'}
                // },
                // {
                //     path: '/HomeInfo_Edit',
                //     component: resolve => require(['../components/page/HomeInfo_Edit.vue'], resolve),
                //     meta: {title: '资讯编辑'}
                // },
                // {
                //     path: '/CigarShop_Edit',
                //     component: resolve => require(['../components/page/CigarShop_Edit.vue'], resolve),
                //     meta: {title: '配件编辑'}
                // },
                //
                // {
                //     path: '/CigarAccessories_Edit',
                //     component: resolve => require(['../components/page/CigarAccessories_Edit.vue'], resolve),
                //     meta: {title: '文化编辑'}
                // },
                // {
                //     path: '/CigarInfo_Edit',
                //     component: resolve => require(['../components/page/CigarInfo_Edit.vue'], resolve),
                //     meta: {title: '雪茄编辑'}
                // },
                //

                {
                    path: '/HomeTools',
                    component: resolve => require(['../components/page/HomeTools.vue'], resolve),
                    meta: {title: '工具指南'}
                },
                {
                    path: '/HomeToolsDetail',
                    component: resolve => require(['../components/page/HomeToolsDetail.vue'], resolve),
                    meta: {title: '指南详情'}
                },

                // {
                //     path: '/CigarShop',
                //     component: resolve => require(['../components/page/CigarShop.vue'], resolve),
                //     meta: {title: '雪茄配件'}
                // },
                // {
                //     path: '/CigarShopDetail',
                //     component: resolve => require(['../components/page/CigarShopDetail.vue'], resolve),
                //     meta: {title: '配件信息'}
                // },
                {
                    path: '/UserList',
                    component: resolve => require(['../components/page/UserList.vue'], resolve),
                    meta: {title: '用户列表'}
                },
                {
                    path: '/UserAdminShaiTu',
                    component: resolve => require(['../components/page/UserAdminShaiTu.vue'], resolve),
                    meta: {title: '晒图'}
                },
                {
                    path: '/UserAdminWenDa',
                    component: resolve => require(['../components/page/UserAdminWenDa.vue'], resolve),
                    meta: {title: '问答'}
                },
                {
                    path: '/UserAdminList',
                    component: resolve => require(['../components/page/UserAdminList.vue'], resolve),
                    meta: {title: '列表'}
                },
                // {
                //     path: '/CigarInfo',
                //     component: resolve => require(['../components/page/CigarInfo.vue'], resolve),
                //     meta: {title: '雪茄品牌'}
                // },
                // {
                //     path: '/CigarDetailsChange',
                //     component: resolve => require(['../components/page/CigarDetailsChange.vue'], resolve),
                //     meta: {title: '雪茄详情修改'}
                // },
                // {
                //     path: '/CigarBrandSite',
                //     component: resolve => require(['../components/page/CigarBrandSite.vue'], resolve),
                //     meta: {title: '产地名称'}
                // },
                //
                // {
                //     path: '/CigarDetailsNewAdd',
                //     component: resolve => require(['../components/page/CigarDetailsNewAdd.vue'], resolve),
                //     meta: {title: '雪茄详情新增'}
                // },
                // {
                //     path: '/CigarShopDetailsImage',
                //     component: resolve => require(['../components/page/CigarShopDetailsImage.vue'], resolve),
                //     meta: {title: '商品图片'}
                // },
                // {
                //     path: '/CigarDetailsImage',
                //     component: resolve => require(['../components/page/CigarDetailsImage.vue'], resolve),
                //     meta: {title: '雪茄图片修改'}
                // },
                // {
                //     path: '/CigarAccessories',
                //     component: resolve => require(['../components/page/CigarAccessories.vue'], resolve),
                //     meta: {title: '雪茄文化'}
                // },
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

                // {
                //     path: '/CigarShopTags',
                //     component: resolve => require(['../components/page/CigarShopTags.vue'], resolve),
                //     meta: { title: '配件标签' }
                // },
                {
                    path: '/MoreTagList',
                    component: resolve => require(['../components/page/MoreTagList.vue'], resolve),
                    meta: { title: '更多标签' }
                },
                {
                    // 富文本编辑器组件
                    path: '/quill-editor-qiniu',
                    component: resolve => require(['../components/other/quill-editor-qiniu.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                //
                // {
                //     path: '/icon',
                //     component: resolve => require(['../components/other/Icon.vue'], resolve),
                //     meta: { title: '自定义图标' }
                // },
                // {
                //     path: '/table',
                //     component: resolve => require(['../components/other/BaseTable.vue'], resolve),
                //     meta: { title: '基础表格' }
                // },
                // {
                //     path: '/tabs',
                //     component: resolve => require(['../components/other/Tabs.vue'], resolve),
                //     meta: { title: 'tab选项卡' }
                // },
                // {
                //     path: '/form',
                //     component: resolve => require(['../components/other/BaseForm.vue'], resolve),
                //     meta: { title: '基本表单' }
                // },
                // {
                //     // 富文本编辑器组件
                //     path: '/editor',
                //     component: resolve => require(['../components/other/VueEditor.vue'], resolve),
                //     meta: { title: '富文本编辑器' }
                // },
                // {
                //     // markdown组件
                //     path: '/markdown',
                //     component: resolve => require(['../components/other/Markdown.vue'], resolve),
                //     meta: { title: 'markdown编辑器' }
                // },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: resolve => require(['../components/other/Upload.vue'], resolve),
                //     meta: { title: '文件上传' }
                // },
                // {
                //     // vue-schart组件
                //     path: '/charts',
                //     component: resolve => require(['../components/other/BaseCharts.vue'], resolve),
                //     meta: { title: 'schart图表' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: resolve => require(['../components/other/DragList.vue'], resolve),
                //     meta: { title: '拖拽列表' }
                // },
                // {
                //     // 拖拽Dialog组件
                //     path: '/dialog',
                //     component: resolve => require(['../components/other/DragDialog.vue'], resolve),
                //     meta: { title: '拖拽弹框' }
                // },
                // {
                //     // 权限页面
                //     path: '/permission',
                //     component: resolve => require(['../components/other/Permission.vue'], resolve),
                //     meta: { title: '权限测试', permission: true }
                // },
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
