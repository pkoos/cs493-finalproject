import { DatabaseModel } from "./database-model";

export class Equipment extends DatabaseModel<Equipment> {
    id: number = -1;
    name: string ="";
    equipment_type: number = -1;
    description: string = "";
    cost: number = -1;

    tableName: string = "Equipment";
    public constructor(init?: Partial<Equipment>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        const valid: boolean = 
            this.name != undefined && this.name != "" &&
            this.equipment_type != undefined && this.equipment_type != -1 &&
            this.description != undefined && this.description != "" &&
            this.cost != undefined && this.cost != -1;
            
        return valid;
    }

    fromDatabase(data: any[]): Equipment {
        const db_equipment: any = data[0];

        const equipment: Equipment = new Equipment({
            id: db_equipment.id,
            name: db_equipment.name,
            equipment_type: db_equipment.equipment_type,
            description: db_equipment.description,
            cost: db_equipment.cost
        });

        return equipment;
    }

    insertParams(): any[] {
        return [this.name, this.equipment_type, this.description, this.cost];
    }

    insertString(): string {
        return `(name, equipment_type, description, cost) VALUES(?, ?, ?, ?)`;
    }

    updateString(): string {
        return `name=?, equipment_type=?, description=?, cost=?`;
    }
}
