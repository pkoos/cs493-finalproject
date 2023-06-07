import { OkPacket} from 'mysql2/promise';

export class User {
    id: number = -1;
    name: string = "";
    email: string = "";
    password: string = "";
    admin: boolean = false;

    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }

    isValid(): boolean {
        const valid: boolean =
            this.name != undefined && this.name != "" &&
            this.email != undefined && this.email != "" &&
            this.password != undefined && this.email != "";

        return valid;
    }

    static fromDatabase(row: any[]): User {
        const db_user: any = row[0];
        const user: User = new User({
            id: db_user.id,
            name: db_user.name,
            email: db_user.email,
            password: db_user.password,
            admin: db_user.admin
        });

        return user;
    }

    static deleteString(): string {
        return "DELETE FROM user WHERE id=?";
    }

    deleteParams(): any[] {
        return [this.id];
    }

    static insertString(): string {
        return `INSERT INTO user (name, email, password, admin)
            VALUES(?, ?, ?, ?)`;
    }

    insertParams(): any[] {
        return [this.name, this.email, this.password, this.admin];
    }

    // TODO: not sure if we'll need the modify functions within User, leaving in for consistency
    static modifyString(): string {
        return "";
    }

    modifyParams(): any[] {
        return [];
    }

    // TODO: not sure if we'll need the to generate a list of users, leaving in for consistency
    static generateList(data: OkPacket[]): User[] {
        const return_value: User[] = [];
        return return_value;
    }
}
