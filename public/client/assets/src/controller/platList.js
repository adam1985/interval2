define(['jquery', 'component/bootstrap', 'interface/ajax', 'component/template', './utility', 'My97DatePicker', 'validform', 'storage'],
    function($, bt, ajax, template, utility){
        return function( host ){

            var interval_token = LS.get("interval_token"),
                alertMode;

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
                            if( alertMode ){
                                alertMode.hide();
                            }
                            LS.set("interval_token", res.data.token);
                            $('#platform-list').html( template.render('platform-list-template', {
                                platform_lists : res.data.platform_lists
                            }) );
                        } else {
                            alertMode = utility.modal( 'modal-template', {
                                id : 'alert-model',
                                title : '提示',
                                body : res.msg
                            }, function(){

                                alertMode = utility.modal( 'modal-template', {
                                    id : 'alert-model',
                                    title : '请重新输入token',
                                    body : template.render('prompt-template')
                                }, function( modal, $modal ){
                                    interval_token = $modal.find('.token').val();
                                    if( interval_token ) {
                                        arg.callee();
                                    }
                                });
                            });
                        }
                    }
                });
            };

            if( !interval_token ){
                alertMode = utility.modal( 'modal-template', {
                    id : 'alert-model',
                    title : 'token失效或者不正确，请重新输入',
                    body : template.render('prompt-template')
                }, function( modal, $modal ){
                    interval_token = $modal.find('.token').val();
                    if( interval_token ) {
                       getPlatlist();
                    }
                });
            } else {
                getPlatlist();
            }


            $(document).on('click', '.remove-platform', function(){
                var $this = $(this),
                    tr = $this.closest('tr'),
                    plat_name = $this.attr('data-plat-name');

                utility.modal( 'modal-template', {
                    id : 'alert-model',
                    title : '提示',
                    body : '是否真要删除公众平台？'
                }, function(modal){
                    ajax({
                        dataType : 'jsonp',
                        jsonp : 'cb',
                        url : host + '/removePlatform',
                        data : {
                            token : interval_token,
                            plat_name : plat_name
                        },
                        success: function( res ){
                            utility.modal( 'modal-template', {
                                id : 'alert-model',
                                title : '提示',
                                body : res.msg
                            }, function( modal ){
                                modal.hide();
                            });
                            if( res.success ) {
                                tr.remove();
                            }
                        }
                    }).fail(function(){
                        modal.hide();
                    });
                });

            });
        }


});