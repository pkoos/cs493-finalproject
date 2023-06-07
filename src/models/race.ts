export class Race {
    id: number = -1;
    name: string = "";
    bonus_stats: number[] = [];
    description: string = "";

    isValid(): boolean {
        const valid:boolean = this.name != undefined && this.name != "" &&
        this.bonus_stats != undefined && this.bonus_stats.length != 0 &&
        this.description != undefined && this.description != "";

        return valid;
    }
}