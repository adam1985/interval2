define(['jquery', 'interface/ajax', 'component/template', 'My97DatePicker', 'validform'],
    function($, ajax, template){
        return function(){

            var getFsendList = function( platform_name, cb){
                $.ajax({
                    url : '/getSeqList',
                    type : 'get',
                    dataType : 'json',
                    data : {
                        platform_name : platform_name
                    },
                    success : function( res ){
                        if( res.success ) {
                            $('#fsend-select').html( template.render('fsend-template', {
                                fsend_lists : res.data
                            }));
                            cb && cb();
                        }
                    }
                });
            };

            $(document).on('change', '.platform-select', function(){
                var platform_name = this.value;
                var runMode = $('#run-mode').val();

                if( runMode == 1) {
                    getFsendList(platform_name);
                }
            });

            $(document).on('change', '.run-mode', function(){
                var runMode = this.value;
                $('.datepicker').attr('id', 'datepicker' + runMode).val('');
                if ( runMode == 0 ){
                    $('#fsend-box').hide();
                    $('.fsend-select').attr('disabled', true);
                } else if( runMode == 1)  {
                    getFsendList($('#platform-select').val(), function(){
                        $('.fsend-select').attr('disabled', false);
                        $('#fsend-box').show();
                    });
                }
            });

            /** 加载日历控件 */
            $(document).on('click', '.datepicker', function(){
                var $this = $(this),
                    $li = $this.closest('li'),
                    html = $li.html();

                var runMode = $('#run-mode').val();
                $('.datepicker').attr('id', 'datepicker' + runMode).val('');
                if( runMode == 0 ) {
                    WdatePicker({
                        el : 'datepicker' + runMode,
                        skin:'twoer',
                        dateFmt:'HH:mm:ss'
                    });
                } else if( runMode == 1) {
                    WdatePicker({
                        el : 'datepicker' + runMode,
                        skin:'twoer',
                        dateFmt:'yyyy-MM-dd HH:mm:ss'
                    });
                }
            });

            /** 添加定时任务 */
            $(document).on('click', '.add-interval', function(){
                var serializeArray = $('#interval-form').serializeArray(),
                    fsendSelect = $('#fsend-select')[0];
                if( !$(fsendSelect).attr('disabled') ) {
                    var selectText = fsendSelect.options[fsendSelect.selectedIndex].text
                    serializeArray.push({
                        name : "title",
                        value : selectText
                    });
                }
                ajax({
                    url : '/addTask',
                    type : 'get',
                    dataType : 'json',
                    data : serializeArray,
                    success : function( res ){
                        if( res.success ) {
                            $('#task-list').append( template.render('tasklist-template', {
                                taskList : res.data
                            }));
                        }
                    }
                });
            });

            /** 删除定时任务 */
            $(document).on('click', '.remove-interval', function(){
                var $this = $(this),
                    taskindex = $this.attr('data-task-index'),
                    tr = $this.closest('tr');
                ajax({
                    url : '/removeTask',
                    type : 'get',
                    dataType : 'json',
                    data : {
                        taskindex : taskindex
                    },
                    success : function( res ){
                        if( res.success ) {
                            tr.remove();
                        }
                    }
                });

            });


            /** 查看定时任务 */
            $(document).on('click', '.view-interval', function(){
                $.ajax({
                    url : '/viewInterval',
                    type : 'get',
                    dataType : 'json',
                    success : function( res ){
                        if( res.success ) {
                            alert( res.data );
                        }
                    }
                });
            });
        };
});