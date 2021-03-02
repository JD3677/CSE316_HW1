'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR CHANGING ITEM TASK
export default class ChangeItemTask_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemId, text) {
        super();
        this.model = initModel;
        this.item = itemId;
        this.targetId = null;
        this.targetPos = null;
        this.target = null;
        this.newText = text;
        this.oldText = null;
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
                this.oldText = this.model.currentList.items[i].getDescription();
                this.model.currentList.items[i].setDescription(this.newText);
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
                this.model.currentList.items[i].description = this.oldText;
                break;
            }
        }
        this.model.view.viewList(this.model.currentList);
    }
}