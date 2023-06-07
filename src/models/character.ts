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
        return false;
    }
}