
define(['jquery', './maskLayer'], function ($, maskLayer ) {

    /**
     * 使用严格模式
     */
    'use strict';

    /**
     * @constructor
     * @param {object} config 配置参数
     * @param {string} config.wrapBox loading容器
     * @param {string} config.url loading小图标链接
     * @param {string} config.width loading小图标宽度
     * @param {string} config.heigth loading小图标高度
     * @param {string} config.isMask 是否显示模式窗口
     * @private
     */

    var loading_ = function (config) {
        var self = this;
        config = config || {};

        /**
         * 参数配置与合并
         * @type {Object}
         */

        config = $.extend({
            url: 'assets/images/loadding.gif',
            isMask: true,
            width: 124,
            height: 124,
            wrapBox: document.body

        }, config);

        this.config = config;

        /**
         * 把config配置参数写入this当前对象上
         */
        $.each(config, function (key, val) {
            self[key] = val;
        });

        this.zIndex = 9999;

        this.create();

        return this;
    };

    loading_.prototype = {
        constructor: loading_,
        /**
         * 生成模拟窗口与loading小图标，并渲染到页面body底部
         */
        create: function () {

            var container = $('<div/>').css({
                position: 'fixed',
                display: 'none',
                'z-index': this.zIndex,
                left: '50%',
                top: '50%',
                margin: -(this.height / 2) + 'px 0 0 ' + -(this.width / 2) + 'px'
            }).append($('<img src="' + this.config.url + '"/>'));


            this.container = container;

            $(this.wrapBox).append(container);


            if (this.isMask) {
                this.maskLayer = maskLayer({
                    contaier: this.wrapBox,
                    zIndex: this.zIndex - 1
                });
            }

            return this;

        },

        /**
         * 显示模拟窗口与loading小图标
         */
        hide: function (fn) {

            this.container.hide();
            this.isMask && this.maskLayer.hide(fn);
            return this;
        },

        /**
         * 隐藏模拟窗口与loading小图标
         */
        show: function (fn) {
            this.isMask && this.maskLayer.show(fn);
            this.container.show();
            return this;
        }
    };

    /**
     * 通过单例模式返回一个引用函数
     * @param config 传入配置参数
     * @returns {Function} 返回一个functionr
     */
    var loadObj;
    return function (config) {
        if (!loadObj) {
            loadObj = new loading_(config);
        }
        return loadObj;
    };

});


