'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
        }

        document.getElementById("delete-list-button").onmousedown = function() {}
        document.getElementById("delete-list-button").style.color = "#353a44";
        document.getElementById("delete-list-button").onmouseover = function(){document.getElementById("delete-list-button").style.backgroundColor = "black";}
        document.getElementById("delete-list-button").onmouseout = function(){document.getElementById("delete-list-button").style.backgroundColor = "#353a44";}
        
        document.getElementById("add-item-button").onmousedown = function() {}
        document.getElementById("add-item-button").style.color = "#353a44";
        document.getElementById("add-item-button").onmouseover = function(){document.getElementById("add-item-button").style.backgroundColor = "black";}
        document.getElementById("add-item-button").onmouseout = function(){document.getElementById("add-item-button").style.backgroundColor = "#353a44";}


        document.getElementById("close-list-button").style.color = "#353a44";
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // Clear the transaction stact
        this.model.tps.clearAllTransactions();

        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    changeItemTask(itemId){
        let currentModel = this.model;
        this.checkStatus();
        this.checkDate();
        this.checkDes();
        document.getElementById("add-list-button").onmousedown = function() {}
        document.getElementById("add-list-button").style.color = '#353a44';

        let oldText = document.getElementById(itemId).childNodes[0].innerHTML;
        document.getElementById(itemId).childNodes[0].innerHTML = "<input type = 'text' id = 'text"+itemId+"' value = '" + oldText + "'>";
        document.getElementById(itemId).childNodes[0].onmousedown = function(){};
        document.onmousedown = function(){
            document.onmousedown = function(div){
                if(div.target.id != "text" + itemId){
                    try{
                        document.getElementById("add-list-button").onmousedown = function() {currentModel.addNewList();}
                        document.getElementById("add-list-button").style.color = 'white'
                        currentModel.changeItemTaskTransaction(itemId, document.getElementById("text" + itemId).value);
                    }catch{}
                }
            }
        }
    }
    //currentModel.view.viewList(currentModel.currentList);

    changeDueDate(itemId){
        let currentModel = this.model;
        this.checkStatus();
        this.checkDate();
        this.checkDes();
        document.getElementById("add-list-button").onmousedown = function() {}
        document.getElementById("add-list-button").style.color = '#353a44';

        document.getElementById(itemId).childNodes[1].innerHTML = "<input type = 'date' id = 'date"+itemId+"'>";

        document.getElementById(itemId).childNodes[1].onmousedown = function(){};
        document.onmousedown = function(){
            document.onmousedown = function(div){
                if(div.target.id != "date" + itemId){
                    try{
                        if(document.getElementById("date" + itemId).value == ""){
                            document.getElementById("add-list-button").onmousedown = function() {currentModel.addNewList();}
                            document.getElementById("add-list-button").style.color = 'white'
                            currentModel.view.viewList(currentModel.currentList);
                        }else{
                            document.getElementById("add-list-button").onmousedown = function() {currentModel.addNewList();}
                            document.getElementById("add-list-button").style.color = 'white'
                            currentModel.changeItemDueTransaction(itemId, document.getElementById("date" + itemId).value);
                        }
                    }catch{}
                }
            }
        }
    }

    changeStatus(itemId){
        let currentModel = this.model;
        //save the currentStats
        let otheroption;
        let currentStats = document.getElementById(itemId).childNodes[2].innerHTML;
        if(currentStats == "complete"){
            otheroption = "incomplete";
        }else{
            otheroption = "complete";
        }

        this.checkStatus();
        this.checkDate();
        this.checkDes();
        document.getElementById("add-list-button").onmousedown = function(){}
        document.getElementById("add-list-button").style.color = '#353a44';

        document.getElementById(itemId).childNodes[2].innerHTML = "<select id = 'selected"+itemId+"'>"
        + "<option value = "+ currentStats +">" + currentStats +"</option>"
        + "<option value = "+ otheroption +">" + otheroption +"</option>"
        + "</select>";

        document.getElementById(itemId).childNodes[2].onmousedown = function(){};
        document.onmousedown = function(){
            document.onmousedown = function(div){
                if(div.target.id != "selected" + itemId){
                    try{if(document.getElementById("selected" + itemId).value == currentStats){
                        document.getElementById("add-list-button").onmousedown = function() {currentModel.addNewList();}
                        document.getElementById("add-list-button").style.color = 'white'
                        currentModel.view.viewList(currentModel.currentList);
                    }else{
                        document.getElementById("add-list-button").onmousedown = function() {currentModel.addNewList();}
                        document.getElementById("add-list-button").style.color = 'white'
                        currentModel.changeItemStatsTransaction(itemId);
                    }}catch(Exception){}
                }
            }
        }
    }

    moveItemDown(itemId){
        this.checkStatus();
        this.checkDate();
        this.checkDes();
        this.model.moveItemDownTransaction(itemId);
    }

    moveItemUp(itemId){
        this.checkStatus();
        this.checkDate();
        this.checkDes();
        this.model.moveItemUpTransaction(itemId);
    }

    closeItem(itemId){
        this.checkStatus();
        this.checkDate();
        this.checkDes();
        this.model.closeItemTransaction(itemId);
    }


    /**
     * This function is used for check if there are any status block is during the state of processing.
     * If there do have one, finish its process and refresh the page. **/
    checkStatus(){
        let currentModel = this.model;
        for(let i = 0; i < document.getElementById("todo-list-items-div").childNodes.length; i++){
            let subId = document.getElementById("todo-list-items-div").childNodes[i].id;
            if(document.getElementById(subId).childNodes[2].innerHTML.length > 15){
                let deal = document.getElementById("selected" + subId).value;
                if(deal == document.getElementById("selected" + subId).childNodes[0].value){
                    currentModel.view.viewList(currentModel.currentList);
                }else{
                    currentModel.changeItemStatsTransaction(subId);
                }
                    
            }
        }

        for(let i = 0; i < document.getElementById("todo-list-items-div").childNodes.length; i++){
            let subId = document.getElementById("todo-list-items-div").childNodes[i].id;
            if(document.getElementById(subId).childNodes[1].innerHTML.length > 15){
                let deal = document.getElementById("date" + subId).value;
                try{
                    if(deal == ""){
                        currentModel.view.viewList(currentModel.currentList);
                    }else{
                        currentModel.changeItemDueTransaction(subId, deal);
                    }
                }catch{}
            }
        }
    }

     /**
     * This function is used for check if there are any date block is during the state of processing.
     * If there do have one, finish its process and refresh the page. **/
    checkDate(){
        let currentModel = this.model;
        for(let i = 0; i < document.getElementById("todo-list-items-div").childNodes.length; i++){
            let subId = document.getElementById("todo-list-items-div").childNodes[i].id;
            if(document.getElementById(subId).childNodes[1].innerHTML.length > 11){
                let deal = document.getElementById("date" + subId).value;
                try{
                    if(deal == ""){
                        currentModel.view.viewList(currentModel.currentList);
                    }else{
                        currentModel.changeItemDueTransaction(subId, deal);
                    }
                }catch{}
            }
        }
    }

     /**
     * This function is used for check if there are any description block is during the state of processing.
     * If there do have one, finish its process and refresh the page. **/
    checkDes(){
        let currentModel = this.model;
        for(let i = 0; i < document.getElementById("todo-list-items-div").childNodes.length; i++){
            let subId = document.getElementById("todo-list-items-div").childNodes[i].id;
            let subject = document.getElementById(subId).childNodes[0].innerHTML.toString();
            if(subject.charAt(0) == '<' && subject.charAt(1) == 'i'){
                currentModel.changeItemTaskTransaction(subId, document.getElementById("text" + subId).value);
            }
        }
    }

    replaceString(oldS, newS, fullS){
        return fullS.split(oldS).join(newS);
      }
}