'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmousedown = function() {
            thisController.handleLoadList(newList.id);
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            var listItem = list.items[i];
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                + "<div class='task-col'>" + listItem.description + "</div>"
                                + "<div class='due-date-col'>" + listItem.dueDate + "</div>"
                                + "<div class='status-col'>"  + listItem.status + "</div>"
                                + "<div class='list-controls-col'>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
        }

        //ChangeTask
        let items = document.getElementsByClassName("task-col");
        let items0 = document.getElementsByClassName("task-col");
        for( let i = 0; i < items0.length; i++){
            if(items0[i].innerHTML == "Task"){continue;}
            let thisController = this.controller;
            items0[i].onmousedown = function(){
                thisController.changeItemTask(this.parentNode.id);
            }

            items0[i].onmouseover = function(){items0[i].style.backgroundColor = "black";}
            items0[i].onmouseout = function(){items0[i].style.backgroundColor = "#40454e";}
        }

        //ChangeDueDate
        let items1 = document.getElementsByClassName("due-date-col");
        for( let i = 0; i < items1.length; i++){
            if(items1[i].innerHTML == "Due Date"){continue;}
            let thisController = this.controller;
            items1[i].onmousedown = function(){
                thisController.changeDueDate(this.parentNode.id);
            }
            items1[i].onmouseover = function(){items1[i].style.backgroundColor = "black";}
            items1[i].onmouseout = function(){items1[i].style.backgroundColor = "#40454e";}
        }

        //ChangeStatus
        let items2 = document.getElementsByClassName("status-col");
        for( let i = 0; i < items2.length; i++){
            if(items2[i].innerHTML == "Status"){continue;}
            if(items2[i].innerHTML == "complete"){
                items2[i].style.color = "#8ed4f8";
            }else{
                items2[i].style.color = "#f5bc75";
            }
            let thisController = this.controller;
            items2[i].onmousedown = function(){
                thisController.changeStatus(this.parentNode.id);
            }
            items2[i].onmouseover = function(){items2[i].style.backgroundColor = "black";}
            items2[i].onmouseout = function(){items2[i].style.backgroundColor = "#40454e";}
        }


        //list item button
        items = document.getElementsByClassName("list-item-control material-icons");
        for( let i = 0; i < items.length; i++){
            if(items[i].innerHTML == "add_box"||items[i].innerHTML == "delete"){continue;}
            //Move Up
            if(items[i].innerHTML == "keyboard_arrow_up"){
                let thisController = this.controller;

                items[i].onmouseover = function(){items[i].style.backgroundColor = "black";}
                items[i].onmouseout = function(){items[i].style.backgroundColor = "#40454e";}

                items[i].onmousedown = function(){
                thisController.moveItemUp(this.parentNode.parentNode.id);
                }

                if(i == 3){
                    items[i].onmousedown = function(){}
                    items[i].style.color = "#353a44";
                    items[i].onmouseover = function(){}
                    items[i].onmouseout = function(){}
                }
            }
            //Move Down
            else if(items[i].innerHTML == "keyboard_arrow_down"){
                let thisController = this.controller;
                items[i].onmousedown = function(){
                thisController.moveItemDown(this.parentNode.parentNode.id);
                }

                items[i].onmouseover = function(){items[i].style.backgroundColor = "black";}
                items[i].onmouseout = function(){items[i].style.backgroundColor = "#40454e";}

                if(i == items.length - 2){
                    items[i].onmousedown = function(){}
                    items[i].style.color = "#353a44";
                    items[i].onmouseover = function(){}
                    items[i].onmouseout = function(){}
                }
            }
            //Close
            else{
                let thisController = this.controller;
                items[i].onmousedown = function(){
                thisController.closeItem(this.parentNode.parentNode.id);
                }
                items[i].onmouseover = function(){items[i].style.backgroundColor = "black";}
                items[i].onmouseout = function(){items[i].style.backgroundColor = "#40454e";}
            }

            //ElementHighLight
            
        }

        let currentModel = this.controller.model;
        document.getElementById("add-item-button").onmousedown = function() {currentModel.addNewItemTransaction();}
        document.getElementById("add-item-button").style.color = "white";

        document.getElementById("delete-list-button").onmousedown = function() {
            var e = document.getElementById("deactive");
            e.id = ("active");
            document.getElementById("overlay-close").onmousedown = function(){
                e.id = ("deactive");
                return;
            }
            document.getElementById("overlay-cancel").onmousedown = function(){
                e.id = ("deactive");
                return;
            }
            document.getElementById("overlay-confirm").onmousedown = function(){
                e.id = ("deactive");
                currentModel.removeCurrentList();
                return;
            }
        }
        document.getElementById("delete-list-button").style.color = "white";
        document.getElementById("close-list-button").style.color = "white";

        document.getElementById("redo-button").style.color = "#353a44";
        document.getElementById("undo-button").style.color = "#353a44";
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}