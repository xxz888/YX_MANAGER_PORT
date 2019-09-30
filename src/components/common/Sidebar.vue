<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        index: 'UserList',
                        title: '用户列表'
                    },
                    // {
                    //     index: '2',
                    //     title: '雪茄相关',
                    //     subs: [
                    //         {
                    //             index: 'CigarInfo',
                    //             title: '雪茄品牌'
                    //         },
                    //         {
                    //             index: 'CigarBrandSite',
                    //             title: '产地名称'
                    //         },
                    //     ]
                    // },
                    {
                        index: '3',
                        title: '管理运营',
                        subs: [
                            {
                                index: 'UserAdminList',
                                title: '管运列表'
                            },
                            // {
                            //     index: 'UserAdminWenDa',
                            //     title: '问答'
                            // }
                        ]
                    },
                    // {
                    //     index: '4',
                    //     title: '新闻相关',
                    //     subs: [
                    //         {
                    //             index: 'HomeAdver',
                    //             title: '广告列表'
                    //         },
                    //         {
                    //             index: 'HomeInfo',
                    //             title: '资讯列表'
                    //         },
                    //         {
                    //             index: 'CigarAccessories',
                    //             title: '文化'
                    //         },
                    //     ]
                    // },
                    {
                        index: '5',
                        title: '发现相关',
                        subs: [
                            {
                                index: 'UserAdminShaiTu',
                                title: '发现列表'
                            },
                            {
                                index: 'UsersFindTag',
                                title: '发现标签'
                            },

                            {
                                index: 'MoreTagList',
                                title: '更多标签'
                            },
                        ]
                    },
                    {
                        index: 'HomeTools',
                        title: '工具指南'
                    },
                    {
                        index: '6',
                        title: '积分商城',
                        subs: [
                            {
                                index: 'ChouJiang1',
                                title: '积分抽奖'
                            },
                            {
                                index: 'JiFenShop',
                                title: '积分商城'
                            },
                        ]
                    },
                    // {
                    //     index: '7',
                    //     title: '配件',
                    //     subs: [
                    //         {
                    //             index: 'CigarShop',
                    //             title: '配件'
                    //         },
                    //         {
                    //             index: 'CigarShopTags',
                    //             title: '配件标签'
                    //         },
                    //     ]
                    // },




/*
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'table',
                        title: '基础表格'
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: 'tabs',
                        title: 'tab选项卡'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                index: 'form',
                                title: '基本表单'
                            },
                            {
                                index: '3-2',
                                title: '三级菜单',
                                subs: [
                                    {
                                        index: 'editor',
                                        title: '富文本编辑器'
                                    },
                                    {
                                        index: 'markdown',
                                        title: 'markdown编辑器'
                                    },
                                ]
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-emoji',
                        index: 'icon',
                        title: '自定义图标'
                    },
                    {
                        icon: 'el-icon-lx-favor',
                        index: 'charts',
                        title: 'schart图表'
                    },
                    {
                        icon: 'el-icon-rank',
                        index: '6',
                        title: '拖拽组件',
                        subs: [
                            {
                                index: 'drag',
                                title: '拖拽列表',
                            },
                            {
                                index: 'dialog',
                                title: '拖拽弹框',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-warn',
                        index: '7',
                        title: '错误处理',
                        subs: [
                            {
                                index: 'permission',
                                title: '权限测试'
                            },
                            {
                                index: '404',
                                title: '404页面'
                            }
                        ]
                    }
*/
                    ]
            }},
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 150px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
