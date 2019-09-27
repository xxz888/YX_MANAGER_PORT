// 修改babel.config.js
module.exports = {
    "presets": [
        "@vue/app"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            },
            "syntax-dynamic-import"
        ]
    ]
}
