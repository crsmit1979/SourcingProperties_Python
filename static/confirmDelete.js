ko.components.register('confirm-delete', {
    template: { element: 'modal-delete-template' },
    viewModel: function(params) {
        var self = this;
        self.id = ko.observable("modal_"+uuidv4());
        self.title = ko.observable(params.title || "Title");
        self.show = ko.observable(params.show || false);
        self.showOnMessage = ko.observable(params.showOnMessage||"");
        self.onConfirm = params.onConfirm;
        self.onCancel = params.onCancel;

        self.showModal = function(){
            self.show(true);
            $("#"+self.id()).modal("show");
        }
        self.hideModal = function(){
            self.show(false);
            $("#"+self.id()).modal("hide");
        }

        self.toggle = function() {
            if (self.show())
                self.hideModal();
            else
                self.showModal();
        }
        ko.postbox.subscribe(function(newValue) {
            self.showModal();
           }, this, self.showOnMessage);

        self.onConfirmClick = function(){
            self.onConfirm();
            self.hideModal();
        }
        self.onCancelClick = function(){
            self.onCancel();
            self.hideModal();
        }
    }
});
