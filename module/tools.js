var dateFormat = require("./dateFormat"),
    fs = require('fs'),
    path = require('path'),
    rootPath = process.cwd();
    dateFormat.format();
var tools_ = {},
    userlistPath = rootPath + '/config/user.json';
tools_.toDate = function( str ){
        str = str.toString();
        var year = +str.substr(0, 4),
            mouth = +str.substr(4, 2) - 1,
            day = +str.substr(6, 2),
            hour = +str.substr(8, 2),
            minute= +str.substr(10, 2),
            second  = +str.substr(12);

        return new Date (year, mouth, day, hour, minute, second);

};

tools_.disposeDirSort = function( dirlists ){
    var obj = {}, list = [];

    if( dirlists.length  ) {
        dirlists.forEach(function(v){
            list.push({
                val1 : v,
                val2 : parseInt(v.replace(/\D/g, ''))
            });
        });

        list = list.sort(function(a, b){
            return b.val2 - a.val2;
        });

        obj.latest = {
            text : toDate(list[0].val2).format("yyyy-MM-dd hh:mm:ss"),
            value : list[0].val1
        };

        obj.list = [];

        list.forEach(function(v){
            obj.list.push({
                text : toDate(v.val2).format("yyyy-MM-dd hh:mm:ss"),
                value : v.val1
            });
        });
    }



    return obj;

};


tools_.readDirNames = function(dirname) {
    var dirlists = [];
    var basenames = fs.readdirSync(dirname);
    basenames.forEach(function (basename) {
        var filename = path.join(dirname, basename);
        var stats = fs.statSync(filename);
        if (stats.isDirectory()) {
            dirlists.push(basename);
        }
    });

    return dirlists;

};

tools_.each = function( obj, callback, args ) {
    var name,
        i = 0,
        length = obj.length,
        isObj =true;

    if ( args ) {
        if ( isObj ) {
            for ( name in obj ) {
                if ( callback.apply( obj[ name ], args ) === false ) {
                    break;
                }
            }
        } else {
            for ( ; i < length; ) {
                if ( callback.apply( obj[ i++ ], args ) === false ) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if ( isObj ) {
            for ( name in obj ) {
                if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( ; i < length; ) {
                if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
                    break;
                }
            }
        }
    }

    return obj;
};

/**
 * 模拟jQuery.extend方法
 * @param arg 源数据
 * @param dft 新数据
 * @param cover 是否覆盖
 * @returns {object}
 */
tools_.extend = function (arg, dft, cover) {
    for (var key in dft) {
        if ( cover ) {
            arg[key] = dft[key];
        } else {
            if (typeof arg[key] == 'undefined') {
                arg[key] = dft[key];
            }
        }

    }
    return arg;
};

tools_.interfaceDone = function( res, data, callback ){
        var resp = JSON.stringify( data );
        
        if( callback ) {
            resp = callback + '(' + resp  + ')';
        }
        
        res.set({'Content-Type':'text/plain'});

        res.send(resp);
};

tools_.getUserName = function(userlist, token){
    var userStatus = {
            has : false,
            token : token
        };

    tools_.each(userlist, function(key, val){
            if( val.info ){
                if(val.info.token == token){
                    userStatus = {
                        has : true,
                        token : token,
                        username : key,
                        platform_lists : val.platform
                    };
                    return false;
                }
            }
    });

    return userStatus;
};

tools_.getUserlist = function(){
    var userlist = {};
    if( fs.existsSync(userlistPath) ) {
        userlist = JSON.parse(fs.readFileSync(userlistPath).toString());
    }
    return userlist;
};

tools_.setUserlist = function( data ){
    fs.writeFileSync(userlistPath, JSON.stringify(data));
};

tools_.hasPlatform = function(username, name ){

    var _hasPlatform = false,
        userlist = tools_.getUserlist(),
        platList = userlist[username].platform || [];

    tools_.each(platList, function(i, v){
        var plat_info = v.plat_info;
        if( plat_info.name == name ){
            _hasPlatform = true;
            return false;
        }
    });
    return _hasPlatform;
};

tools_.cancelInterval = function( intervals ){
        (function(intervals){
            var arg = arguments;
            if( intervals.cancel ) {
                intervals.cancel();
            } else {
                tools_.each(intervals, function(key, val){
                    if( !val ){
                        return false;
                    }
                    if( val.cancel ) {
                        val.cancel();
                    } else {
                        arg.callee(val);
                    }
                });
            }

        }(intervals));
};

tools_.delInterval = function( config, type ) {
    try{
        if( type == 'user' ) {
            tools_.cancelInterval(taskObj[config.user]);
            delete taskObj[config.user];
        } else if( type == 'platform' ) {
            tools_.cancelInterval(taskObj[config.user][config.plat_name]);
            delete taskObj[config.user][config.plat_name];
        } else if( type == 'mode' ) {
            tools_.cancelInterval(taskObj[config.user][config.plat_name][config.mode]);
            delete taskObj[config.user][config.plat_name][config.mode];
        } else if( type == 'interval' ){
            tools_.cancelInterval(taskObj[config.user][config.plat_name][config.mode][config.taskIndex]);
            delete taskObj[config.user][config.plat_name][config.mode][config.taskIndex];
        }
    }catch (e){}

};

tools_.removeUserlist = function( config, type ){
    var userlist = tools_.getUserlist(),
        copyUserlist = Object.create(userlist),
        removeable = false;

    var curUser = copyUserlist[config.user],
        plat_lists = curUser.platform;

    if( type == 'user' ) {
        if( curUser ) {
            removeable = true;
            tools_.delInterval({user : config.user}, type);
            delete userlist[config.user];
        }

    } else if( type == 'platform' ){
        if( plat_lists.length >>> 0 ) {
            tools_.each(plat_lists, function(i, v){
                if( v.plat_info.name == config.plat_name ){
                    removeable = true;
                    tools_.delInterval({user : config.user, plat_name : config.plat_name}, type);
                    userlist[config.user].platform.splice(i, 1);
                    return false;
                }
            });
        }

    } else if( type == 'interval' ){
        if( plat_lists.length >>> 0 ) {

            tools_.each(plat_lists, function(i, v){
                if( v.plat_info.name == config.plat_name ){
                   var interval_list = v.interval_list;
                    if( interval_list.length >>> 0){
                        tools_.each(interval_list, function(index, val){
                            if( val.taskIndex == config.taskIndex ){
                                removeable = true;
                                userlist[config.user].platform[i].interval_list.splice(index, 1);
                                tools_.delInterval({
                                    user : config.user,
                                    plat_name : config.plat_name,
                                    mode : config.mode,
                                    taskIndex : config.taskIndex
                                }, type);
                                return false;
                            }
                        });
                    }
                    return false;
                }
            });
        }
    }

    this.setUserlist( userlist );

    return removeable;

};

tools_.addUserlist = function( config, type ) {
    var userlist = tools_.getUserlist(),
        copyUserlist = Object.create(userlist),
        addable = false;

    var curUser,
        plat_lists;

    if( type == 'user' ) {
        if(  userlist[config.user] ) {
            if( confirm('该用户已存在，是否进行覆盖操作!') ) {
                addable = true;
                userlist[config.user].info = config.data;
            }

        } else {
            addable = true;
            userlist[config.user] = {
                info : config.data
            };
        }

    } else if( type == 'platform' ){
            curUser = copyUserlist[config.user];
            if( curUser ) {
                plat_lists = curUser.platform || [];
                addable = true;
                plat_lists.push({
                    plat_info : config.data
                });

                userlist[config.user].platform = plat_lists;
            }

    } else if( type == 'interval' ){
        curUser = copyUserlist[config.user];
        if( curUser ) {
            plat_lists = curUser.platform || [];
            if( plat_lists.length >>> 0 ) {

                tools_.each(plat_lists, function(i, v){
                    if( v.plat_info.name == config.plat_name ){
                        addable = true;
                        var interval_list = v.interval_list || [];

                        interval_list.push( config.data );
                        userlist[config.user].platform[i].interval_list = interval_list;
                        return false;
                    }
                });
            }
        }

    }

    this.setUserlist( userlist );

    return addable;
};

tools_.getCounts = function( username ) {
        var counts = {
                plat : 0,
                inter : 0,
                single : 0,
                multi : 0
            },
            userlist = this.getUserlist(),
            curUser = userlist[username];

        if( curUser ) {
            var plat_list = curUser.platform;
            if( plat_list ){
                counts.plat = plat_list.length;

                tools_.each(plat_list, function(i, v){
                    var interval_lists = v.interval_list || [];
                    counts.inter += interval_lists.length;
                    tools_.each(interval_lists, function(index, val){
                        if( val.mode == 0 ) {
                            counts.multi++;
                        } else if(val.mode == 1){
                            counts.single++;
                        }
                    });
                });
            }
        }

    return counts;

};

tools_.getAllUser = function() {
    var userlist = tools_.getUserlist(),
        allUser = [];
    tools_.each(userlist, function(key){
        allUser.push( key )
    });

    return allUser;

};

tools_.getAllPlat = function( username ) {
    var userlist = tools_.getUserlist(),
        curUser = userlist[username],
        plat_list = [],
        allPlat = [];

    if( curUser ) {
        plat_list = curUser.platform || [];
    }
    tools_.each(plat_list, function(i, val){
        allPlat.push( val.plat_info );
    });

    return allPlat;
};

tools_.getPlat = function( username, plat_name){
    var allPlat = tools_.getAllPlat( username), plat_;
    tools_.each(allPlat, function(i, v){
        if(v.name == plat_name){
            plat_ = v;
            return false;
        }
    });

    return plat_;

};

tools_.getAllInterval = function( username ) {
    var userlist = tools_.getUserlist(),
        curUser = userlist[username],
        plat_list = [],
        allInterval = [];

    if( curUser ) {
        plat_list = curUser.platform || [];
    }

    tools_.each(plat_list, function(i, val){
        var interval_list = val.interval_list || [];
        allInterval = allInterval.concat( interval_list );
    });

    return allInterval;
};

tools_.updateInterval = function( username, plat_name, taskindex , cb){
    var userlist = tools_.getUserlist(),
        curUser = userlist[username],
        plat_list = [],
        allInterval = [];

    if( curUser ) {
        plat_list = curUser.platform || [];
    }
    tools_.each(plat_list, function(i, val){
        if( val.plat_info.name == plat_name) {
            var interval_list = val.interval_list || [];
            tools_.each(interval_list, function(index, v){
                if(v.taskIndex == taskIndex ){
                    userlist[username].platform[i].interval_list[index] = cb( v );
                }
            });
        }

    });

    return allInterval;
};

tools_.hasInterval = function( taskIndex ){
    var arg = arguments, _hasInterval = false;
    tools_.each(taskObj, function(key, val){
        if( !val ){
            return false;
        }

        if( val.cancel ){
            if( key == taskIndex ) {
                _hasInterval = true;
                return false;
            }
        } else {
            arg.callee( val );
        }
    });

    return _hasInterval;
};

module.exports = tools_;

