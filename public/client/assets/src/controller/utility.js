
define(['jquery', 'component/template', 'component/bootstrap'], function ($, template) {

    /**
     * 使用严格模式
     */
    'use strict';

    var utility_ = {};

    var modal = function( templateId, data, cb ){
            this.templateId = templateId;
            this.data = data;
            this.cb = cb;
            this.jqModal = this.createModal();
            this.addEvent( cb );
    };

    modal.prototype.createModal = function(){
        $(document.body).append(template.render( this.templateId, {
            modal : this.data
        }));

        var modal = $('#' + this.data.id);
        modal.modal();
        return modal;
    };

    modal.prototype.show = function(){
        this.jqModal.modal('show');
        return this;
    };

    modal.prototype.show = function(){
        this.jqModal.modal('hide');
        return this;
    };

    modal.prototype.addEvent = function( cb ){
        var btnOk = this.jqModal.find('.btn-ok');

        btnOk.off('click');
        if( cb ){
            btnOk.on('click', cb);
        }
        return this;
    };

    modal.prototype.update = function( data, cb){
        var jqModal = this.jqModal;
        jqModal.find('.modal-title').html( data.title );
        jqModal.find('.modal-boby').html( data.boby );
        cb = cb || this.cb;
        this.addEvent( cb );
        return this;
    };

    var modalState = {};
    utility_.modal = function( templateId, data, cb ){
        var _modal = modalState[templateId];
        if( modalState[templateId] ) {
            _modal.update( data, cb);
        } else {
            modalState[templateId] = _modal = new modal(templateId, data, cb);
        }

        return _modal;
    };

    return utility_;

});


