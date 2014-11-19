define(['jquery', 'component/bootstrap', 'interface/ajax', 'component/template', 'My97DatePicker', 'validform', 'storage'],
    function($, bt, ajax, template){
        return function( host ){

            var interval_token = LS.get("interval_token");

            var getPlatlist = function(){
                var arg = arguments;
                ajax({
                    dataType : 'jsonp',
                    jsonp : 'cb',
                    url : host + '/platformlist',
                    data : {
                        token : interval_token
                    },
                    success: function( res ){
                        if( res.success ) {
                            LS.set("interval_token", res.data.token);
                            $('#platform-list').html( template.render('platform-list-template', {
                                platform_lists : res.data.platform_lists
                            }) );
                        } else {
                            if( confirm( res.msg ) ) {
                                interval_token = prompt("请重新输入token：");
                                if( interval_token ) {
                                    arg.callee();
                                }
                            }
                        }
                    }
                });
            };

            if( !interval_token ){
                interval_token = prompt("token失效或者不正确，请重新输入：");
            }

            if( interval_token ) {

                getPlatlist();

                $(document).on('click', '.remove-platform', function(){
                    var $this = $(this),
                        tr = $this.closest('tr'),
                        plat_name = $this.attr('data-plat-name');

                    if( confirm('是否真要删除公众平台？') ) {
                        ajax({
                            dataType : 'jsonp',
                            jsonp : 'cb',
                            url : host + '/removePlatform',
                            data : {
                                token : interval_token,
                                plat_name : plat_name
                            },
                            success: function( res ){
                                alert( res.msg );
                                if( res.success ) {
                                    tr.remove();
                                }
                            }
                        });
                    }
                });
            }


        };
});