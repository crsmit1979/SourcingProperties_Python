ko.components.register('lead-list-table', {
    template: { element: 'lead-list-table-template' },
    viewModel: function(params) {
            self.leads = ko.observableArray();
            self.selected_lead = ko.observable();
            self.selected_property = ko.observable();
            self.query = ko.observable();

            self.filteredLeads = ko.computed(function(){
                if (self.query() && self.query().length>0)
                {
                    var search = self.query().toLowerCase();
                    var results= ko.utils.arrayFilter(self.leads(), function (lead) {
                        var inPropertyAddress = valueIsIn(lead.property_address(), search);
                        var inSellerName = valueIsIn(lead.seller_name(),search);
                        var inSellerEmail = valueIsIn(lead.seller_email(),search);
                        var inSellerPhone = valueIsIn(lead.seller_phone(), search);
                        var recordFound = (inPropertyAddress || inSellerEmail || inSellerName || inSellerPhone);
                        return recordFound;
                    });
                    return results;
                }
                else {
                    return self.leads();
                }
            })

            self.get_leads = function(){
                var firstEntry = null;
                $.ajax({
                    type:"GET",
                    url:"http://localhost:3000/api/leads",
                    contentType:"application/json",
                    success:function(dt){
                        var records = [];
                        dt.forEach(function(record){
                            var lead = new LeadModel()
                            lead.populate_from_json(record);
                            records.push(lead);
                            if (firstEntry == null)
                            {
                                self.selected_lead(lead);
                                lead.get_properties();
                            }
                        });

                            self.leads(records);
                    }
                });
            }

        this.addNew = function(){
            var lead = new LeadModel();
            self.selected_lead(lead);
             dialog = $("#popupLead").semanticModal({
                buttons: {
                    "Create":function(){
                        $.ajax({
                            type:"POST",
                            url:"http://localhost:3000/api/leads",
                            data:JSON.stringify(self.selected_lead().to_json()),
                            contentType:"application/json",
                            success:function(){
                                self.get_leads();
                                dialog.dialog( "close" );
                            }
                        })
                    },
                    "Cancel": function(){
                            dialog.close();
                            self.selected_lead(null);
                    }
                }
             })
        }


        self.removeLead = function(item){
             dialog = $("#confirm_deletion").semanticModal({
                buttons: {
                    "Continue":function(){
                        $.ajax({
                            type:"DELETE",
                            url:"http://localhost:3000/api/leads/"+item.uuid(),
                            success:function(){
                                self.get_leads();
                                dialog.close();
                            }
                        })
                    },
                    "Cancel": function(){
                            dialog.close();
                            self.selected_lead(null);
                    }
                }
             })
        }
        self.viewProperty = function(item){
            dialog = $("#popupLead").semanticModal("close");
            self.selected_property(item);
             dialog = $("#popupProperty").semanticModal({
                buttons: {
                    "Save":function(){
                    },
                    "Cancel": function(){
                            dialog.close();
                    }
                }
             })
        }
        self.viewLead = function(item)
        {
            self.selected_lead(item);
             dialog = $("#popupLead").semanticModal({
                buttons: {
                    "Save":function(){
                        $.ajax({
                            type:"PUT",
                            url:"http://localhost:3000/api/leads/"+self.selected_lead().uuid(),
                            data:JSON.stringify(self.selected_lead().to_json()),
                            contentType:"application/json",
                            success:function(){
                                self.get_leads();
                                dialog.close();
                            }
                         });
                    },
                    "Cancel": function(){
                            dialog.close();
                    }
                }
             })
        }
        self.get_leads();
    }
    });
