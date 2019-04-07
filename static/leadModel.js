    var LeadModel = function(){
        var self = this;
        self.lead_fields= ko.observableArray([
    {'field':'uuid', 'caption':'Id', 'type':'text', 'choices':'', tooltip:''},
    {'field':'date_added', 'caption':'Date Added', 'type':'text', 'choices':'', tooltip:''},
    {'field':'seller_name', 'caption':'Seller Name', 'type':'text', 'choices':'', tooltip:''},
    {'field':'seller_email', 'caption':'Seller Email', 'type':'text', 'choices':'', tooltip:''},
    {'field':'seller_phone', 'caption':'Seller Phone Number', 'type':'text', 'choices':'', tooltip:''},
    {'field':'stage_of_lead', 'caption':'Stage of Lead', 'type':'text', 'choices':'New, Due Dilligence, Dead', tooltip:'What stage is the lead in.'},
    {'field':'who_owns_lead', 'caption':'Who owns the lead', 'type':'text', 'choices':'', tooltip:''},
    {'field':'property_address', 'caption':'Property Address', 'type':'text', 'choices':'', tooltip:''},
    {'field':'correspondance_address', 'caption':'Correspondance Address', 'type':'text', 'choices':'', tooltip:''},
    {'field':'property_link', 'caption':'Property Link', 'type':'text', 'choices':'', tooltip:''},
    {'field':'type_of_property', 'caption':'Type of Property', 'type':'text', 'choices':'Semi-Detached, Apartment, House, Other', tooltip:''},
    {'field':'condition_of_property', 'caption':'Condition of Property', 'type':'options', 'choices':'Bad, Fair, Good, Excellent', tooltip:''},
    {'field':'why_are_you_selling', 'caption':'Why are you selling the property?', 'type':'text', 'choices':'', tooltip:''},
    {'field':'how_quickly_want_to_sell', 'caption':'How quickly do you want to sell the property?', 'type':'options', 'choices':'ASAP, 30 Days, 60 Days, 90 Days', tooltip:''},
    {'field':'what_you_like_to_see_happening', 'caption':'What would you like to see happening?', 'type':'textarea', 'choices':'', 'tooltip':''},
    {'field':'property_listed_for', 'caption':'What price is the property listed for?', 'type':'currency', 'choices':'', tooltip:''},
    {'field':'property_valued_to_be_worth', 'caption':'Property valued to be worth?', 'type':'currency', 'choices':'', tooltip:''},
    {'field':'how_arrived_at_number', 'caption':'How did you arrive at that value?', 'type':'text', 'choices':'', tooltip:''},
    {'field':'listed_with_agent', 'caption':'Is the property listed with an Agent?', 'type':'options', 'choices':'Yes, No, Not Sure', tooltip:''},
    {'field':'mortgaged_state', 'caption':'Is the property owned free & clear, or do they have a mortgage', 'type':'options', 'choices':'Mortaged, Not Mortgaged', tooltip:''},
    {'field':'outstanding_mortgage_amount', 'caption':'Outstanding Mortgage Amount', 'type':'currency', 'choices':'', tooltip:''},
    {'field':'other_secured_debt', 'caption':'Other secured debt?', 'type':'currency', 'choices':'', tooltip:''},
    {'field':'expectations_of_equity_release_after_sale', 'caption':'Expectation of equity release after the sale? How much?', 'type':'text', 'choices':'', tooltip:''},
]);
        self.getValueByName = function(name){
            return self[name];
        }
        self.getOptions = function(values){
            if (values && values.indexOf(",")>0)
                return values.split(",");
            else
                return null;
        }

        self.availableLeadStages = ko.observableArray(["New", "Due Dilligence", "Offer", "Under Contract", "Deal Finalised", "Dead"]);
        self.mortgagedStates = ko.observableArray(["", "Mortaged", "No Mortgage"]);
        self.listedWithAgentOptions = ko.observableArray(["", "Yes", "No", "Not sure"]);
        self.propertyTypeOptions = ko.observableArray(["", "Apartment", "Semi-Detached", "House", "Other"]);
        self.propertyConditionOptions = ko.observableArray(["", "Bad", "Fair", "Good", "Excellent"]);
        self.sellSpeedOptions = ko.observableArray(["", "ASAP", "30 Days", "60 Days", "Not in a rush"]);

        self.uuid = ko.observable();
        self.date_added = ko.observable();
        self.seller_name = ko.observable();
        self.seller_email = ko.observable();
        self.seller_phone = ko.observable();
        self.properties = ko.observableArray();
        self.stage_of_lead = ko.observable(); //new, due dilligence, offer, under contract, deal finalised, dead
        self.who_owns_lead = ko.observable();
        self.property_address =ko.observable();
        self.correspondance_address = ko.observable();
        self.property_link = ko.observable();
        self.type_of_property = ko.observable();
        self.condition_of_property = ko.observable();
        self.notes = ko.observable();

        //motivation
        self.why_are_you_selling= ko.observable();
        self.how_quickly_want_to_sell = ko.observable(); //ASAP, 30 days, 60 days, 90 days, no rush
        self.what_you_like_to_see_happening = ko.observable();

        //property valuation expectations
        self.property_listed_for = ko.observable();
        self.property_valued_to_be_worth=ko.observable();
        self.how_arrived_at_number = ko.observable();
        self.listed_with_agent = ko.observable(); //YES, NO, Not sure
        self.mortgaged_state = ko.observable(); //Mortgaged, No Mortgaged

        //basic financials
        self.outstanding_mortgage_amount = ko.observable();
        self.other_secured_debt= ko.observable();
        self.expectations_of_equity_release_after_sale = ko.observable();



        self.populate_from_json=function(json)
        {
            self.uuid = ko.observable(json.uuid);
            self.notes = ko.observable(json.notes);
            self.seller_name = ko.observable(json.seller_name);
            self.seller_email = ko.observable(json.seller_email);
            self.seller_phone = ko.observable(json.seller_phone);
            self.stage_of_lead  = ko.observable(json.stage_of_lead );
            self.who_owns_lead  = ko.observable(json.who_owns_lead );
            self.property_address = ko.observable(json.property_address);
            self.correspondance_address  = ko.observable(json.correspondance_address );
            self.property_link  = ko.observable(json.property_link );
            self.type_of_property  = ko.observable(json.type_of_property );
            self.condition_of_property  = ko.observable(json.condition_of_property );
            self.why_are_you_selling = ko.observable(json.why_are_you_selling);
            self.how_quickly_want_to_sell = ko.observable(json.how_quickly_want_to_sell);
            self.what_you_like_to_see_happening  = ko.observable(json.what_you_like_to_see_happening );
            self.property_listed_for  = ko.observable(json.property_listed_for );
            self.property_valued_to_be_worth = ko.observable(json.property_valued_to_be_worth);
            self.how_arrived_at_number  = ko.observable(json.how_arrived_at_number );
            self.listed_with_agent = ko.observable(json.listed_with_agent);
            self.mortgaged_state = ko.observable(json.mortgaged_state);
            self.outstanding_mortgage_amount  = ko.observable(json.outstanding_mortgage_amount );
            self.other_secured_debt = ko.observable(json.other_secured_debt);
            self.expectations_of_equity_release_after_sale = ko.observable(json.expectations_of_equity_release_after_sale );
            self.date_added = ko.observable(json.date_added);
        }

        self.to_json = function(){
            return {
                "uuid":self.uuid(),
                "date_added": self.date_added(),
                "notes": self.notes(),
                "seller_name":self.seller_name(),
                "seller_email":self.seller_email(),
                "seller_phone":self.seller_phone(),
                "stage_of_lead":self.stage_of_lead(),
                "who_owns_lead":self.who_owns_lead(),
                "property_address":self.property_address(),
                "correspondance_address":self.correspondance_address(),
                "property_link":self.property_link(),
                "type_of_property":self.type_of_property(),
                "condition_of_property":self.condition_of_property(),
                "why_are_you_selling":self.why_are_you_selling(),
                "how_quickly_want_to_sell":self.how_quickly_want_to_sell(),
                "what_you_like_to_see_happening":self.what_you_like_to_see_happening(),
                "property_listed_for":self.property_listed_for(),
                "property_valued_to_be_worth":self.property_valued_to_be_worth(),
                "how_arrived_at_number":self.how_arrived_at_number(),
                "listed_with_agent":self.listed_with_agent(),
                "mortgaged_state":self.mortgaged_state(),
                "outstanding_mortgage_amount":self.outstanding_mortgage_amount(),
                "other_secured_debt":self.other_secured_debt(),
                "expectations_of_equity_release_after_sale":self.expectations_of_equity_release_after_sale()
            };
        }

        self.get_properties = function(){
            $.ajax({
                type:"GET",
                url:"http://localhost:3000/api/leads/"+self.uuid()+"/properties",
                success:function(dt){
                    var props = []
                    dt.forEach(function(rec){
                        var prop = new PropertyModel();
                        prop.postcode(rec.postcode);
                        props.push(prop);
                    });
                    self.properties(props);
                }
            });
        }

        self.saveLead = function(itm){
            data = self.to_json();
            $.ajax({
                type:"PUT",
                contentType:"application/json",
                data:JSON.stringify(data),
                url:"http://localhost:3000/api/leads/"+itm.uuid(),
                success:function(){
                }
            });
        }

        self.create_property = function() {
            var property = new PropertyModel();
                property.postcode("TW170JQ");
            self.properties.push(property);
        }
    }
