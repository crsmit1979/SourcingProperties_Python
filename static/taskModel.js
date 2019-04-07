var TaskModel = function(){
    var self = this;
    self.uuid = ko.observable()
    self.title = ko.observable();
    self.description = ko.observable();
    self.dueDate = ko.observable();

    self.populate_from_json =function(json){
        self.uuid(json.uuid);
        self.title(json.title);
        self.description(json.description)
        self.dueDate(json.dueDate);
    }
    self.to_json=function(){
        return {
            "uuid": self.uuid(),
            "title": self.title(),
            "description": self.description(),
            "dueDate": self.dueDate()
        }
    }
}