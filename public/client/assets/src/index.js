require.config({
    baseUrl: 'assets/src',
    "paths": {
        "jquery": "jquery/jquery",
        "My97DatePicker" : "../My97DatePicker/WdatePicker",
        "chosen" : "component/chosen.jquery",
        "datatables" : "component/datatables",
        "validform" : "component/Validform_v5.3.2",
        "storage" : "component/storage"
    },
    "shim": {
        "My97DatePicker" : [],
        "chosen" : ["jquery"],
        "validform" : ["jquery"],
        "storage" : ["jquery"]
    }
});

require(['controller/initialize']);