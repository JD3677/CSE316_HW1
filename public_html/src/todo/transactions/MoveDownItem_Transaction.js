'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR MOVING THE ITEM DOWN BY ONE POS
export default class MoveDownItem_Transaction extends jsTPS_Transaction {
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
        this.targetId = parseInt(this.replaceString("todo-list-item-","", this.item));
        // Find Target
        for(let i = 0; i < this.model.currentList.items.length; i++){
            if(this.model.currentList.items[i].getId() == this.targetId){
                this.targetPos = i;
                this.target = this.model.currentList.items[i];
                if(this.targetPos == this.model.currentList.items.length-1){
                    this.target = null;
                    break;
                }
                // SWAP TARGET POS FORWARD
                this.model.currentList.items[i] = this.model.currentList.items[i+1];
                this.model.currentList.items[i+1] = this.target;
                break;
            }
        }
        this.model.view.viewList(this.model.currentList);
    }

    undoTransaction() {
        if(this.target == null){return;}
        // Find Target
        for(let i = 0; i < this.model.currentList.items.length; i++){
            if(this.model.currentList.items[i].getId() == this.targetId){
                // SWAP TARGET POS BACKWARD
                this.model.currentList.items[i] = this.model.currentList.items[i-1];
                this.model.currentList.items[i-1] = this.target;
                break;
            }
        }
        this.model.view.viewList(this.model.currentList);
    }
}