ko.components.register('lead-view', {
    template: { element: 'lead-view-template' },
    viewModel: function(params) {
        this.lead = ko.observable();
        ko.postbox.subscribe(function(newValue) {
           this.lead(newValue);
           }, this, "viewLead");
    }
});
