module.exports = function (grunt) {
    // 以下代码初始化Grunt任务
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // 压缩css任务
        cssmin: {
            css: {
                files: [
                    {
                        src: ['assets/styles/layout.css'],
                        dest: 'assets/dist/layout.css'
                    }
                ]
            }
        },

        requirejs: {
            compile: {
                options: {
                    "baseUrl": "assets/src",
                    "paths": {
                        "jquery": "jquery/jquery",
                        "My97DatePicker" : "../My97DatePicker/WdatePicker",
                        "validform" : "component/Validform_v5.3.2",
                        "storage" : "component/storage"
                    },
                    "shim": {
                        "My97DatePicker" : [],
                        "validform" : ["jquery"],
                        "storage" : ["jquery"]
                    },
                    "exclude": ["My97DatePicker"],
                    //"dir": "assets/dist",
                    "removeCombined": true,
                    "preserveLicenseComments": false,
                    "cssImportIgnore": null,
                    "optimizeCss": "standard",
                    "name": "index",
                    "out": "assets/dist/index.js"
                }
            }
        },

        // watch任务
        watch: {
            options: {
                livereload: true,
                interrupt: true,
                nospawn: true,
                atBegin: true
            },
            css: {
                files: [
                    'assets/styles/layout.css'],
                tasks: ['cssmin']
            }
        }

    });

    // 加载package.json中的想用插件
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 注册一个任务，第二参数可以是数组或者字符串

    /**
     * 单个任务执行
     */

    grunt.registerTask('css', ['cssmin']); // 合并压缩css文件
    grunt.registerTask('build', ['requirejs']); // js合并压缩编译

    /**
     * 自动编译
     */

    grunt.registerTask('wcss', ['css', 'watch:css']); //　自动合并压缩css文件

    // 默认会执行default任务.
    grunt.registerTask('default', ['cssmin', 'build']);

};



