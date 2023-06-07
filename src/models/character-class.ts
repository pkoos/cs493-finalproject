export class CharacterClass {
    id: number = -1;
    name: string = "";
    bonus_stats: number[] = [];
    description: string = "";
    hit_die: number = -1;

    isValid(): boolean {
        const valid: boolean = 
            this.name != undefined && this.name != "" &&
            this.bonus_stats != undefined && this.bonus_stats.length != 0 &&
            this.description != undefined && this.description != "" &&
            this.hit_die != undefined && this.hit_die != -1;
        return valid;
    }
}