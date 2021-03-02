'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR DELETING SELECTED ITEM
export default class DeleteItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemId) {
        super();
        this.model = initModel;
        this.item = itemId;
        this.targetId = null;
        this.targetPos = null;
        this.target = null;
    }

    replaceString(oldS, newS, fullS){
        return fullS.split(oldS).join(newS);
      }

    doTransaction() {
        try{
            this.targetId = parseInt(this.replaceString("todo-list-item-","", this.item));
        //get the pos of the target item
        for(let i = 0; i < this.model.currentList.items.length; i++){
            if(this.model.currentList.items[i].getId() == this.targetId){
                this.targetPos = i;
                this.target = this.model.currentList.items[i];
                this.model.currentList.removeItem(this.model.currentList.items[i]);
                break;
            }
        }
        this.model.view.viewList(this.model.currentList);
        }catch(Exception){}
    }

    undoTransaction() {
        this.model.currentList.addItem(this.target);
        let currentPos = parseInt(this.model.currentList.getIndexOfItem(this.target));
        while(currentPos != this.targetPos){
            this.model.currentList.items[currentPos] = this.model.currentList.items[currentPos - 1];
            currentPos--;
        }
        this.model.currentList.items[currentPos] = this.target;
        this.model.view.viewList(this.model.currentList);
        // TODO
    }
}