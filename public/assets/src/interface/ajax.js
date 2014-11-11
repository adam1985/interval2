define(['jquery', 'component/loading'], function($, loading){
    /**
     * 发起ajax请求
     * @param {string} config.url ajax请求地址
     * @param {string} config.type ajax请求方式，默认为get
     * @param {string} config.dataType ajax返回数据格式
     * @param {string} config.success ajax请求成功回调
     */

    var mobileLoad = loading();

    return function (config, ishide) {

        if( !ishide ) {
            mobileLoad.show();
        }

        config = $.extend({
            type: 'get',
            cache : false,
            dataType: 'json'
        }, config);

        var success = config.success;

        config.success = function () {
            if( !ishide ) {
                mobileLoad.hide();
            }
        };

        return $.ajax(config).done(success).fail(config.success);

    };

});

