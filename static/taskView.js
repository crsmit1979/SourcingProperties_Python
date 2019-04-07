ko.components.register('task-view', {
    template: { element: 'task-view-template' },
    viewModel: function(params) {
        var self = this;
        self.data = ko.observable(params.task);

    }
})
