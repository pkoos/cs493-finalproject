export class Equipment {
    id: number = -1;
    name: string ="";
    equipment_type: number = -1;
    description: string = "";
    cost: number = -1;

    isValid(): boolean {
        const valid: boolean = 
            this.name != undefined && this.name != "" &&
            this.equipment_type != undefined && this.equipment_type != -1 &&
            this.description != undefined && this.description != "" &&
            this.cost != undefined && this.cost != -1;
            
        return valid;
    }
}