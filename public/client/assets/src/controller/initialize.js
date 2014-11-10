define(['jquery', 'interface/ajax', 'My97DatePicker', 'validform', 'storage'],
    function($, ajax, My97DatePicker, validform){
        $(function(){
            var host = 'http://localhost:3000';

            /** 添加公众平台 */
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
                            }
                            alert(res.msg);
                        }
                    });
                    return false;
                }
            });
        });
});