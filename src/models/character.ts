import { Equipment } from './equipment'

export class Character {
    id: number = -1;
    owner_id: number = -1;
    name: string = "";
    class_id: number = -1;
    race_id: number = -1;
    hitpoints: number = -1;
    raw_stats: number[] = [];
    mod_stats: number[] = [];
    background: string = "";
    alignment: string = "";
    description: string = "";
    inventory: Equipment[] = [];

    isValid(): boolean {
        const valid: boolean = 
            this.owner_id != undefined && this.owner_id != -1 &&
            this.name != undefined && this.name != "" &&
            this.class_id != undefined && this.class_id != -1 &&
            this.race_id != undefined && this.race_id != -1 &&
            this.hitpoints != undefined && this.hitpoints != -1 &&
            this.raw_stats != undefined && this.raw_stats.length != 0 &&
            this.mod_stats != undefined && this.mod_stats.length != 0 &&
            this.background != undefined && this.background != "" &&
            this.alignment != undefined && this.alignment != "" &&
            this.inventory != undefined && this.inventory.length != 0;
            
        return valid;
    }
}