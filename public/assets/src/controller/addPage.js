define(['jquery', 'interface/ajax', 'component/template', 'My97DatePicker', 'validform'],
    function($, ajax, template){
        return function() {
            $(document).on('click', '.datepicker', function(){
                WdatePicker({
                    el : 'datepicker',
                    skin:'twoer',
                    dateFmt:'yyyy-MM-dd'
                });
            });

            var addPageForm = $('#addpage-form');
            addPageForm.Validform({
                btnSubmit:"#add-user",
                tiptype:function(msg,o,cssctl){
                    var objtip=$("#err-tiper");
                    if(o.type != 2 ) {
                        cssctl(objtip,o.type);
                        objtip.show().text(msg);
                    } else {
                        objtip.hide();
                    }
                },
                label:".label"
            });
        };
});