define(['jquery', './indexPage'],
    function($, indexPage){
        $(function(){

            if( $('#index-page').length ){
                indexPage();
            }

        });
});