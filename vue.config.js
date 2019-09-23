module.exports = {

    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target:'http://lpszn.com/api/',
                target:'http://192.168.101.22:8001',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            },
        }
    },

}

