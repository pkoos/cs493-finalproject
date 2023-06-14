import { ResultSetHeader } from "mysql2/promise";
import { db } from "..";

export abstract class DatabaseModel<T> {
    id: number = -1;
    abstract tableName?: string;

    abstract isValid(): boolean;
    abstract fromDatabase(data: any[]): T;
    
    updateParams(): any[] {
        const params: any[] = this.insertParams();
        params.push(this.id);

        return params;
    }
    abstract insertParams(): any[];
    abstract insertString(): string;
    abstract updateString(): string;

    async update(): Promise<boolean> {
        const updateQueryString: string = `UPDATE ${this.tableName} SET ${this.updateString()} WHERE id=?`;
        const [db_results] = await db.query(updateQueryString, this.updateParams());
        return (db_results as ResultSetHeader).affectedRows > 0;
    }

    async insert(): Promise<number> {
        const [db_results] = await db.query(`INSERT INTO ${this.tableName} ${this.insertString()}`, this.insertParams());
        this.id = (db_results as ResultSetHeader).insertId;
        return this.id;
    }

    async findById(id: number): Promise<T | undefined> {
        const [db_results] = await db.query(`SELECT * FROM ${this.tableName} WHERE id=?`, [id]);
        if(!((db_results as any[]).length > 0)) {
            return;
        }
        return this.fromDatabase(db_results as any[]);
    }

    async search(queryString: string, params: any[]): Promise<T | undefined> {
        const [db_results] = await db.query(`SELECT * FROM ${this.tableName} WHERE ${queryString}`, params);
        return this.fromDatabase(db_results as any[]);
    }
}