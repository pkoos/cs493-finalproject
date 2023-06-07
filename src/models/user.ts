export class User {
    id: number = -1;
    email: string = "";
    hash: string = "";
    type: string = "";

    isValid(): boolean {
        const valid: boolean = 
            this.email != undefined && this.email != "" &&
            this.hash != undefined && this.hash != "" &&
            this.type != undefined && this.type != "";
        
            return valid;
    }
}