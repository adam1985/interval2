define(['jquery', 'interface/ajax', 'component/template', './indexPage', 'My97DatePicker', 'validform', 'storage'],
    function($, ajax, template, indexPage){
        $(function(){
            var host = 'http://localhost:3000';

            if( $('#index-page').length ) {
                indexPage( host );
            }

            /** 添加公众平台 */
            if( $('#add-plat').length ) {
                var platformForm = $('#platform-form');
                platformForm.Validform({
                    btnSubmit:"#add-platform",
                    tiptype:function(msg,o,cssctl){
                        var objtip=$("#err-tiper");
                        if(o.type != 2 ) {
                            cssctl(objtip,o.type);
                            objtip.show().text(msg);
                        } else {
                            objtip.hide();
                        }
                    },
                    label:".label",
                    beforeSubmit:function() {
                        ajax({
                            dataType : 'jsonp',
                            jsonp : 'cb',
                            url : host + '/addPlatform',
                            data : platformForm.serialize(),
                            success: function( res ){
                                if( res.success ) {
                                    token = $('#token').val();
                                    LS.set("interval_token", token);
                                    platformForm[0].reset();

                                }
                                alert(res.msg);
                            }
                        });
                        return false;
                    }
                });
            }

            /** 管理公众平台 */
            if( $('#plat-list').length ) {
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

            }
        });
});