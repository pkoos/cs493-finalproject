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

    insertParams(): any[] {
        return [this.name, this.email, this.password, this.type];
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
}
