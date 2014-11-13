define(['jquery', './indexPage', './addPage', './listPage', './addPlat'],
    function($, indexPage, addPage, listPage, addPlat){
        $(function(){

            if( $('#index-page').length ){
                indexPage();
            }

            if( $('#add-page').length ){
                addPage();
            }

            if( $('#user-list').length ){
                listPage();
            }

            if( $('#add-plat').length ){
                addPlat();
            }

        });
});