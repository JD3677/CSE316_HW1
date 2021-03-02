'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR CHANGING ITEM STATS
export default class ChangeItemStatus_Transaction extends jsTPS_Transaction {
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
                // store the old date and replace with the new
                if(this.model.currentList.items[i].status == "complete"){
                    this.model.currentList.items[i].status = "incomplete";
                }else{
                    this.model.currentList.items[i].status = "complete";
                }
                break;
            }
        }
        // TODO
        this.model.view.viewList(this.model.currentList);
    }

    undoTransaction() {
        if(this.target == null){return;}
        // Find Target
        for(let i = 0; i < this.model.currentList.items.length; i++){
            if(this.model.currentList.items[i].getId() == this.targetId){
                // SWAP TARGET STATUS
                if(this.model.currentList.items[i].status == "complete"){
                    this.model.currentList.items[i].status = "incomplete";
                }else{
                    this.model.currentList.items[i].status = "complete";
                }
                break;
            }
        }
        // TODO
        this.model.view.viewList(this.model.currentList);
    }
}