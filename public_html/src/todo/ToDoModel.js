'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'
import MoveUpItem_Transaction from './transactions/MoveUpItem_Transaction.js'
import MoveDownItem_Transaction from './transactions/MoveDownItem_Transaction.js'
import ChangeItemStatus_Transaction from './transactions/ChangeItemStatus_Transaction.js'
import ChangeItemDue_Transaction from './transactions/ChangeItemDue_Transaction.js'
import ChangeItemTask_Transaction from './transactions/ChangeItemTask_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            //rearrage list, put target list to pos 0, push rest of the list by index 1
            if(this.toDoLists.length > 1){
                let target = this.toDoLists[listIndex];
                for(let i = listIndex; i != 0; i--){
                    this.toDoLists[i] = this.toDoLists[i - 1];
                }
                this.toDoLists[0] = target;
            }

            //reflash the left side list bar
            this.view.refreshLists(this.toDoLists);

            //load the list at the index 0
            let listToLoad = this.toDoLists[0];
            this.currentList = listToLoad;
            document.getElementById("todo-list-" + listToLoad.id).style.color = "#f5bc75";
            this.view.viewList(this.currentList);
        }
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        document.getElementById("add-item-button").onmousedown = function() {}
        document.getElementById("add-item-button").style.color = "#353a44";
        document.getElementById("delete-list-button").onmousedown = function() {}
        document.getElementById("delete-list-button").style.color = "#353a44";
        document.getElementById("close-list-button").style.color = "#353a44";

        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    } 

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }


    /**
     * CloseItemTransaction
     * 
     * Creates a new transaction for removing an item to the transaction stack.
     */
    closeItemTransaction(itemId) {
        let transaction = new DeleteItem_Transaction(this, itemId);
        this.tps.addTransaction(transaction);
    }

    /**
     * moveItemUpTransaction
     * 
     * This transaction will move selected item up by 1 slot.
     */
    moveItemUpTransaction(itemId){
        let transaction = new MoveUpItem_Transaction(this, itemId);
        this.tps.addTransaction(transaction);
    }

    /**
     * moveItemdownTransaction
     * 
     * This transaction will move selected item down by 1 slot.
     */
    moveItemDownTransaction(itemId){
        let transaction = new MoveDownItem_Transaction(this, itemId);
        this.tps.addTransaction(transaction);
    }

    /**
     * changeItemStatsTransaction
     * 
     * This transaction will change the status of selecte item.
     */
    changeItemStatsTransaction(itemId){
        let transaction = new ChangeItemStatus_Transaction(this, itemId);
        this.tps.addTransaction(transaction);
    }

    /**
     * changeItemDueTransaction
     * 
     * This transaction will change the due of selecte item.
     */
    changeItemDueTransaction(itemId, due){
        let transaction = new ChangeItemDue_Transaction(this, itemId, due);
        this.tps.addTransaction(transaction);
    }

    /**
     * changeItemDueTransaction
     * 
     * This transaction will change the due of selecte item.
     */
    changeItemTaskTransaction(itemId, text){
        let transaction = new ChangeItemTask_Transaction(this, itemId, text);
        this.tps.addTransaction(transaction);
    }

}