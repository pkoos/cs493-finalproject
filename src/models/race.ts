export class Race {
    id: number = -1;
    name: string = "";
    bonus_stats: number[] = [];
    description: string = "";

    isValid(): boolean {
        return false;
    }
}