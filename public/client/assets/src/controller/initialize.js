define(['jquery', './indexPage', './addPlat', './platList'],
    function ($, indexPage, addPlat, platList) {
        $(function () {
            //var host = 'http://interval.sturgeon.mopaas.com';
            var host = 'http://localhost:3000';
            if ($('#index-page').length) {
                indexPage(host);
            }

            /** 添加公众平台 */
            if ($('#add-plat').length) {
                addPlat(host);
            }

            /** 管理公众平台 */
            if ($('#plat-list').length) {
                platList(host);
            }
        });
    });