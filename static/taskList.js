ko.components.register('task-list', {
    template: { element: 'task-list-template' },
    viewModel: function(params) {
        var self = this;
        self.query = ko.observable();
        self.selected_task = ko.observable();
        self.showLeadModal = ko.observable(false);
        self.leadModalMode = ko.observable();

        self.tasks = ko.observableArray();
        self.get_tasks = function(){

            $.ajax({
                type:"GET",
                url:"http://localhost:3000/api/tasks",
                contentType:"application/json",
                success:function(dt){
                    console.log(dt);
                    var records = []
                    dt.forEach(function(itm){
                        var taskItem = new TaskModel();
                        taskItem.populate_from_json(itm)
                        records.push(taskItem);
                    })
                    self.tasks(records);
                }
            })
         }
         self.get_tasks();

        self.filterTasks = ko.computed(function () {
            if (self.query() && self.query().length>0)
            {
                var search = self.query().toLowerCase();
                var results= ko.utils.arrayFilter(self.tasks(), function (task) {
                    var inTitle = task.title().toLowerCase().indexOf(search) > -1;
                    var inDesc = task.description().toLowerCase().indexOf(search) > -1
                    var recordFound = (inTitle || inDesc);
                    return recordFound;
                });
                return results;
            }
            else {
                return self.tasks();
            }
        });
        self.selectTask = function(itm){
            self.selected_task(itm);
             semanticDialog = $("#popupTask2").semanticModal({
                buttons: {
                    "Save":function(){
                        $.ajax({
                            type:"PUT",
                            url:"http://localhost:3000/api/tasks/"+itm.uuid(),
                            data:JSON.stringify(self.selected_task().to_json()),
                            contentType:"application/json",
                            success:function(){
                                semanticDialog.close();
                            }
                        })
                    },
                    "Cancel": function(){
                            semanticDialog.close();
                    }
                }
             })
        }

        self.addTask = function(itm){
            var newTask = new TaskModel('new','desc')
            self.selected_task(newTask);

             semanticDialog = $("#popupTask2").semanticModal({
                buttons: {
                    "Continue":function(){
                        $.ajax({
                            type:"POST",
                            url:"http://localhost:3000/api/tasks",
                            data:JSON.stringify(self.selected_task().to_json()),
                            contentType:"application/json",
                            success:function(){
                                self.get_tasks();
                                semanticDialog.close();
                            }
                        })
                    },
                    "Cancel": function(){
                            semanticDialog();
                    }
                }
             })

        }
        self.deleteTask = function(itm){
             semanticDialog = $("#confirm_deletion").semanticModal({
                buttons: {
                    "Continue":function(){
                        $.ajax({
                            type:"DELETE",
                            url:"http://localhost:3000/api/tasks/"+itm.uuid(),
                            success:function(){
                                self.get_tasks();
                                semanticDialog.close();
                            }
                        })
                    },
                    "Cancel": function(){
                            semanticDialog.close();
                    }
                }
             })
        }

        self.onModalClosed=function() {
            alert(1);
            self.showLeadModal(false);
        }
    }
})
