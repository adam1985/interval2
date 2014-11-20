define(['jquery', 'component/bootstrap', 'interface/ajax', 'component/template', './utility', 'My97DatePicker', 'validform'],
    function($, bt, ajax, template, utility){
        return function( host ){
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
                label:".label-text",
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
                            utility.modal( 'modal-template', {
                                id : 'alert-model',
                                title : '提示',
                                body : res.msg
                            });
                        }
                    });
                    return false;
                }
            });


        };
});