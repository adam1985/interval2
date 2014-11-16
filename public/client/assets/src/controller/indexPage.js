define(['jquery', 'interface/ajax', 'component/template', 'My97DatePicker', 'validform'],
    function($, ajax, template){
        return function( host ){

            var getFsendList = function( token, platform_name, cb){
                    ajax({
                        url : host + '/getSeqList',
                        type : 'get',
                        dataType : 'jsonp',
                        jsonp : 'cb',
                        data : {
                            token : token,
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
                },

                getUserInfo = function(){
                    var arg = arguments;

                    ajax({
                        dataType : 'jsonp',
                        jsonp : 'cb',
                        url : host + '/getUserInfo',
                        data : {
                            token : interval_token
                        },
                        success : function( res ){
                            if( res.success ) {
                                LS.set("interval_token", interval_token);
                                var plat_lists = res.data.plat_lists || [],
                                    intervalForm = $('#interval-form'),
                                    platformSelect = $('#platform-select');


                                if( plat_lists.length ){
                                    intervalForm.find('.control-select').removeAttr('disabled');

                                } else {
                                    intervalForm.find('.control-select').attr('disabled', 'disabled');
                                }

                                platformSelect.html( template.render('plat_list_template', {
                                    plat_lists : res.data.plat_lists
                                }));


                                $('#task-list').html( template.render('tasklist-template', {
                                    taskList : res.data.taskList
                                }));

                            } else {
                                if ( confirm( res.msg )){
                                    interval_token = prompt("请重新输入token：");
                                    if( interval_token ) {
                                        arg.callee();
                                    }
                                }

                            }
                        }
                    });
                };

            var interval_token = LS.get("interval_token"),
                platformSelect = $('#platform-select'),
                runModeSelect = $('#run-mode');

            if( !interval_token ){
                interval_token = prompt("token失效或者不正确，请重新输入：");
            }

            if( interval_token ) {
                getUserInfo();
            }

            $(document).on('change', '.platform-select', function(){
                var platform_name = this.value;
                var runMode = runModeSelect.val();

                if( runMode == 1) {
                    getFsendList(interval_token, platform_name);
                }
            });

            $(document).on('change', '.run-mode', function(){
                var runMode = this.value,
                    platform_name = platformSelect.val();
                $('.datepicker').attr('id', 'datepicker' + runMode).val('');
                if ( runMode == 0 ){
                    $('#fsend-box').hide();
                    $('.fsend-select').attr('disabled', true);
                } else if( runMode == 1)  {
                    getFsendList(interval_token, platform_name, function(){
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

                if( interval_token ){
                    serializeArray.push({
                        name : "token",
                        value : interval_token
                    });
                }
                ajax({
                    url : host + '/addTask',
                    type : 'get',
                    dataType : 'jsonp',
                    jsonp : 'cb',
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
                        url: host + '/removeTask',
                        type: 'get',
                        dataType: 'jsonp',
                        jsonp : 'cb',
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


        };
});