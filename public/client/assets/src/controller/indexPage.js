define(['jquery', 'component/bootstrap', 'interface/ajax', 'component/template', './utility',  'My97DatePicker', 'validform', 'storage'],
    function($, bt, ajax, template, utility){
        return function( host ){

            var interval_token = LS.get("interval_token"),
                intervalForm = $('#interval-form'),
                platformSelect = $('#platform-select'),
                runModeSelect = $('#run-mode'),
                fsendBox = $('#fsend-box'),
                fsendSelect = $('#fsend-select'),
                tasklist = $('#task-list'),
                datepicker = $('.datepicker'),
                alertMode;

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
                                fsendSelect.html( template.render('fsend-template', {
                                    fsend_lists : res.data
                                }));
                                fsendBox.removeClass('hide').show();
                                fsendSelect.attr('disabled', false);
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
                                    platformSelect = $('#platform-select');

                                if( plat_lists.length ){
                                    intervalForm.find('.control-select').removeAttr('disabled');

                                } else {
                                    intervalForm.find('.control-select').attr('disabled', 'disabled');
                                }

                                platformSelect.html( template.render('plat_list_template', {
                                    plat_lists : res.data.plat_lists
                                }));


                                tasklist.html( template.render('tasklist-template', {
                                    taskList : res.data.taskList
                                }));

                            } else {
                                utility.modal( 'modal-template', {
                                    data : {
                                        id : 'alert-model',
                                        title : '提示',
                                        body : res.msg
                                    },
                                    cb :  function(){
                                        utility.modal( 'modal-template', {
                                            data : {
                                                id : 'alert-model',
                                                title : '请重新输入token',
                                                body : template.render('prompt-template')
                                            },
                                            cb : function( modal, $modal ){
                                                interval_token = $modal.find('.token').val();
                                                if( interval_token ) {
                                                    arg.callee();
                                                }
                                            }
                                        });
                                    }
                                });

                            }
                        }
                    });
                },

            /**
             * 控制下拉框是否可以用
             * @param {Element} ele - 当前元素
             * @param {string} state - 当前状态
             */

            changeComponentState = function (ele, state) {
                ele = $(ele);

                if (state === 'disabled') {
                    ele.attr('disabled', 'disabled');
                } else if (state === 'able') {
                    ele.removeAttr('disabled');
                    ele.removeAttr('ignore');
                }

                ele.trigger("chosen:updated");

            };

            /*intervalForm.find('select').chosen({
                width: "99%",
                allow_single_deselect: true,
                search_contains : true,
                disable_search_threshold: 10,
                no_results_text: "没有找到任何结果!"
            });*/

            if( !interval_token ){
                utility.modal( 'modal-template', {
                    data : {
                        id : 'alert-model',
                        title : 'token失效或者不正确，请重新输入',
                        body : template.render('prompt-template')
                    },
                    cb : function( modal, $modal ){
                        interval_token = $modal.find('.token').val();
                        if( interval_token ) {
                            getUserInfo();
                        }

                    }
                });
            } else {
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
                datepicker.attr('id', 'datepicker' + runMode).val('');
                if ( runMode == 0 ){
                    fsendBox.hide();
                    fsendSelect.attr('disabled', true);
                } else if( runMode == 1)  {
                    getFsendList(interval_token, platform_name, function(){});
                }
            });

            /** 加载日历控件 */
            $(document).on('click', '.datepicker', function(){
                var $this = $(this),
                    $li = $this.closest('li'),
                    html = $li.html();

                var runMode = runModeSelect.val();
                datepicker.attr('id', 'datepicker' + runMode).val('');
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
                            tasklist.append( template.render('tasklist-template', {
                                taskList : res.data
                            }));
                        } else {

                            utility.modal( 'modal-template', {data: {
                                id : 'alert-model',
                                title : '提示',
                                body : res.msg
                            }});
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

                utility.modal('modal-template', {data: {
                    id: 'alert-model',
                    title: '提示',
                    body: '是否真要删除该定时任务？'
                }, cb: function() {
                    ajax({
                        url: host + '/removeTask',
                        type: 'get',
                        dataType: 'jsonp',
                        jsonp: 'cb',
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
                }});

            });


        };
});