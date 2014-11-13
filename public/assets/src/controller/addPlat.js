define(['jquery', 'interface/ajax', 'component/template', 'My97DatePicker', 'validform'],
    function($, ajax, template){
        return function() {
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
                        dataType : 'json',
                        url : '/addPlatform',
                        data : platformForm.serialize(),
                        success: function( res ){
                            if( res.success ) {
                                //platformForm[0].reset();
                            }
                            alert(res.msg);
                        }
                    });
                    return false;
                }
            });
        };
});