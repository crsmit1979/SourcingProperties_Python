ko.components.register('numeric-input', {
    template: { element: 'numeric-input-template' },
    viewModel: function(params) {
        this.number = params.number;
    }
});
