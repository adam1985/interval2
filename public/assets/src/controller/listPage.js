define(['jquery', 'interface/ajax', 'component/template', 'My97DatePicker'],
    function($, ajax, template){
        return function() {

            $(document).on('click', '.remove-user', function(){
                var $this = $(this),
                    tbody = $this.closest('tbody'),
                    username = $this.attr('data-username');

                if( confirm('是否真要删除该用户？') ) {
                    ajax({
                        dataType : 'json',
                        url : '/removeuser',
                        data : {
                            username : username
                        },
                        success: function( res ){
                            alert( res.msg );
                            if( res.success ) {
                                tbody.remove();
                            }
                        }
                    });
                }
            });

            $(document).on('click', '.remove-platform', function(){
                var $this = $(this),
                    tr = $this.closest('tr'),
                    username = $this.attr('data-username'),
                    plat_name = $this.attr('data-platform');

                if( confirm('是否真要删除公众平台？') ) {
                    ajax({
                        dataType : 'json',
                        url : '/removePlatform',
                        data : {
                            username : username,
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
        };
});