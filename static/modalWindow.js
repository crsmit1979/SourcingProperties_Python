ko.components.register('modal-window', {
    template: { element: 'modal-template' },
    viewModel: function(params) {
        var self = this;
        self.id = ko.observable("modal_"+uuidv4());
        self.title = ko.observable(params.title);
        self.show = ko.observable(params.show);
        self.onClosed = params.onClosed;
        self.mode = ko.observable("insert"); //insert, edit

        self.closeModal = function(){
            params.show(false);
        }
        self.onInsertClick = function(){
            alert("insert")
            self.closeModal();
        }
        self.onSaveClick = function(){
            alert("saving");
            self.closeModal();
        }
        self.onDeleteClick=function(){
            alert("delete");
            self.closeModal();
        }
        self.onConfirmClick = function(){
            self.closeModal();
        }

        self.onCancelClick = function(){
            self.closeModal();
        }
    }
});
