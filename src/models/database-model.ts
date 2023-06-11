import { ResultSetHeader } from "mysql2/promise";
import { db } from "..";

export abstract class DatabaseModel<T> {
    abstract tableName: string;

    abstract isValid(): boolean;
    abstract fromDatabase(data: any[]): T;
    abstract updateParams(): any[];
    abstract insertParams(): any[];
    abstract insertString(): string;
    abstract updateString(): string;

    async update(): Promise<void> {
        const updateQueryString: string = `UPDATE ${this.tableName} SET ${this.updateString()} WHERE id=?`;
        db.query(updateQueryString, this.updateParams());
    }

    async insert(): Promise<number> {
        const [db_results] = await db.query(`INSERT INTO ${this.tableName} ${this.insertString()}`, this.insertParams());
        return (db_results as ResultSetHeader).insertId;
    }

    async findById(id: number): Promise<T> {
        const [db_results] = await db.query(`SELECT * FROM ${this.tableName} WHERE id=?`, [id]);
        return this.fromDatabase(db_results as any[]);
    }

    async search(queryString: string, params: any[]): Promise<T> {
        const [db_results] = await db.query(`SELECT * FROM ${this.tableName} WHERE ${queryString}`, params);
        return this.fromDatabase(db_results as any[]);
    }
}