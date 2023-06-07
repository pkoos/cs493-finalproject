export class EquipmentType {
    id: number = -1;
    name: string = "";

    isValid(): boolean {
        const valid: boolean = 
            this.name != undefined && this.name != "";
        return valid;
    }
}