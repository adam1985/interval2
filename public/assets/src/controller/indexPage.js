define(['jquery', 'interface/ajax', 'component/template', 'My97DatePicker', 'validform'],
    function($, ajax, template){
        return function(){

            var getFsendList = function( username, platform_name, cb){
                    ajax({
                        url : '/getSeqList',
                        type : 'get',
                        dataType : 'json',
                        data : {
                            username : username,
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

            var userSelect = $('#user-select'),
                platformSelect = $('#platform-select'),
                runModeSelect = $('#run-mode');

            $(document).on('change', '.user-select', function(){
                var username = userSelect.val(),
                    platform_name = platformSelect.val(),
                    runMode = runModeSelect.val();

                if( runMode == 1) {
                    getFsendList(username, platform_name);
                }

                ajax({
                    url : '/getUserInfo',
                    type : 'get',
                    dataType : 'json',
                    data : {
                        username : this.value
                    },
                    success : function( res ){
                        if( res.success ) {
                            var plat_lists = res.data.plat_lists || [],
                                intervalForm = $('#interval-form'),
                                platformSelect = $('#platform-select');

                                if( plat_lists.length ){
                                    intervalForm.find('.control-select').removeAttr('disabled');

                                } else {
                                    intervalForm.find('.control-select').attr('disabled', 'disabled');
                                }

                                platformSelect.html( template.render('plat_list_template', {
                                    plat_lists : plat_lists
                                }));


                                $('#task-list').html( template.render('tasklist-template', {
                                    taskList : res.data.taskList
                                }));

                        } else {
                            alert( res.msg );
                        }
                    }
                });


            });


            $(document).on('change', '.platform-select', function(){
                var username = userSelect.val(),
                    platform_name = this.value,
                    runMode = runModeSelect.val();

                if( runMode == 1) {
                    getFsendList(username, platform_name);
                }
            });

            $(document).on('change', '.run-mode', function(){
                var runMode = this.value,
                    username = userSelect.val(),
                    platform_name = platformSelect.val();
                $('.datepicker').attr('id', 'datepicker' + runMode).val('');
                if ( runMode == 0 ){
                    $('#fsend-box').hide();
                    $('.fsend-select').attr('disabled', true);
                } else if( runMode == 1)  {
                    getFsendList(username, platform_name, function(){
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
                    var selectText = fsendSelect.options[fsendSelect.selectedIndex].text;
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
                        } else {
                            alert( res.msg );
                        }
                    }
                });
            });

            /** 删除定时任务 */
            $(document).on('click', '.remove-interval', function(){
                var $this = $(this),
                    taskindex = $this.attr('data-task-index'),
                    username =  $this.attr('data-username'),
                    plat_name = $this.attr('data-platform'),
                    mode = $this.attr('data-mode'),
                    tr = $this.closest('tr');
                if( confirm('是否真要删除该定时任务？') ) {
                    ajax({
                        url: '/removeTask',
                        type: 'get',
                        dataType: 'json',
                        data: {
                            taskindex: taskindex,
                            username: username,
                            plat_name: plat_name,
                            mode: mode
                        },
                        success: function (res) {
                            if (res.success) {
                                tr.remove();
                            }
                        }
                    });
                }

            });


            /** 重启所有定时任务 */
            $(document).on('click', '.start-all-interval', function(){
                $.ajax({
                    url : '/restartAllTask',
                    type : 'get',
                    dataType : 'json',
                    success : function( res ){
                        if( res.success ) {
                            alert('操作成功!');
                        }
                    }
                });
            });
        };
});