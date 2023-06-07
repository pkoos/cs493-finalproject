export class User {
    id: number = -1;
    email: string = "";
    hash: string = "";
    type: string = "";

    isValid(): boolean {
        return false;
    }
}