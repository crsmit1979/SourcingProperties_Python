    var PropertyModel = function(){
        var self = this;
        self.address_line1 = ko.observable();
        self.address_line2 =  ko.observable();
        self.city = ko.observable();
        self.postcode = ko.observable();
        self.property_condition = ko.observable();
        self.offer_type = ko.observable();

        self.offerTypes = ko.observableArray(["", "Lease Option","Below Market Value"])
    }


ko.components.register('property', {
    template: { element: 'property-view-template' },
    viewModel: function(params) {
            self.offerTypes = ko.observableArray(["Lease Option","Below Market Value"])

    }
});
