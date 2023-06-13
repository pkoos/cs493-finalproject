import { DatabaseModel } from "./database-model";

export class EquipmentType extends DatabaseModel<EquipmentType> {
    id: number = -1;
    name: string = "";

    tableName: string = "Equipment_Type";
    public constructor(init?: Partial<EquipmentType>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        const valid: boolean = 
            this.name != undefined && this.name != "";
        return valid;
    }

    fromDatabase(data: any[]): EquipmentType {
        const db_user: any = data[0];
        const equipmentType: EquipmentType = new EquipmentType({
            id: db_user.id,
            name: db_user.name
        });

        return equipmentType;
    }

    insertParams(): any[] {
        return [this.name];
    }

    insertString(): string {
        return `(name) VALUES(?)`;
    }

    updateString(): string {
        return `name=?`;
    }
}