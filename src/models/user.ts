import { OkPacket} from 'mysql2/promise';
import { DatabaseModel } from './database-model';

export class User extends DatabaseModel<User> {
    id: number = -1;
    name: string = "";
    email: string = "";
    password: string = "";
    type: string = "";

    tableName = "User";
    public constructor(init?: Partial<User>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        const valid: boolean =
            this.name != undefined && this.name != "" &&
            this.email != undefined && this.email != "" &&
            this.password != undefined && this.email != "";

        return valid;
    }

    static fromDatabase(data: any[]): User {
        const db_user: any = data[0];
        const user: User = new User({
            id: db_user.id,
            name: db_user.name,
            email: db_user.email,
            password: db_user.password,
            type: db_user.type
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
        return [this.name, this.email, this.password, this.type];
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

    fromDatabase(data: any[]): User {
        const db_data: any = data[0];
        
        this.id = db_data.id;
        this.name = db_data.name;
        this.email = db_data.email;
        this.password = db_data.password;
        this.type = db_data.type;

        return this;
    }

    insertString(): string {
        return `(name, email, password, type) VALUES(?, ?, ?, ?)`;
    }
    updateString(): string {
        return `name=?, email=?, password=?, type=?`
    }
    // updateParams(): any[] {
    //     const params: any[] = this.insertParams();
    //     params.push(this.id);
        
    //     return params;
    // }
}
