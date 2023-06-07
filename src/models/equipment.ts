export class Equipment {
    id: number = -1;
    name: string ="";
    equipment_type: number = -1;
    description: string = "";
    cost: number = -1;

    isValid(): boolean {
        return false;
    }
}