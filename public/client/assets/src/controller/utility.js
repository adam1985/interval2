
define(['jquery', 'component/template', 'component/bootstrap'], function ($, template) {

    /**
     * 使用严格模式
     */
    'use strict';

    var utility_ = {};

    var modal = function( templateId, config ){
            this.templateId = templateId;
            this.data = config.data;
            this.cb = config.cb || $.noop;
            this.options = config.options || {};
            this.buttons = config.buttons || [
                { type : 'ok', class: 'btn-primary btn-ok', text : '确定' }
            ];
            this.jqModal = this.createModal();
            this.addEvent( this.cb );
    };

    modal.prototype.createModal = function(){
        $(document.body).append(template.render( this.templateId, {
            modal : this.data
        }));

        var modal = $('#' + this.data.id);
        modal.modal( this.options );
        return modal;
    };

    modal.prototype.show = function( cb ){
        var self = this;
        cb = cb || $.noop;
        self.jqModal.on('shown.bs.modal', function(){
            cb( self.jqModal );
        });

        this.jqModal.modal('show');

        return this;
    };

    modal.prototype.hide = function( cb ){
        var self = this;
        cb = cb || $.noop;
        self.jqModal.on('hidden.bs.modal', function(){
            cb( self.jqModal );
        });
        this.jqModal.modal('hide');
        return this;
    };

    modal.prototype.addEvent = function( cb ){
        var btnOk = this.jqModal.find('.btn-ok'),
            self = this;
            cb = cb || $.noop;

        btnOk.off('click');

        btnOk.on('click', function(){
            self.hide(function(){
                cb( self, self.jqModal );
            });

        });

        return this;
    };


    modal.prototype.update = function( data, cb){
        cb = cb || $.noop;
        var self = this,
            jqModal = self.jqModal;
            jqModal.find('.modal-title').html( data.title );
            jqModal.find('.modal-body').html( data.body );
            self.addEvent( cb );
            self.show();

        return this;
    };

    var modalState = {};
    utility_.modal = function( templateId, data, cb ){
        var _modal = modalState[templateId];
        if( modalState[templateId] ) {
            _modal.update( data, cb );
        } else {
            modalState[templateId] = _modal = new modal(templateId, data, cb);
        }

        return _modal;
    };

    return utility_;

});


