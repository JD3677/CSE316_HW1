'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR CHANGING ITEM DUE DATE
export default class ChangeItemDue_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemId, due) {
        super();
        this.model = initModel;
        this.item = itemId;
        this.targetId = null;
        this.targetPos = null;
        this.target = null;
        this.newDue = due;
        this.oldDue = null;
    }

    replaceString(oldS, newS, fullS){
        return fullS.split(oldS).join(newS);
      }

    doTransaction() {
        // TODO
        this.targetId = parseInt(this.replaceString("todo-list-item-","", this.item));
        // Find Target
        for(let i = 0; i < this.model.currentList.items.length; i++){
            if(this.model.currentList.items[i].getId() == this.targetId){
                this.targetPos = i;
                this.target = this.model.currentList.items[i];
                // store the old and replace with the new
                this.oldDue = this.model.currentList.items[i].getDueDate();
                this.model.currentList.items[i].setDueDate(this.newDue);
                break;
            }
        }
        this.model.view.viewList(this.model.currentList);
    }

    undoTransaction() {
        // TODO
        for(let i = 0; i < this.model.currentList.items.length; i++){
            if(this.model.currentList.items[i].getId() == this.targetId){
                // store the old and replace with the new
                this.model.currentList.items[i].dueDate = this.oldDue;
                break;
            }
        }
        this.model.view.viewList(this.model.currentList);
    }
}