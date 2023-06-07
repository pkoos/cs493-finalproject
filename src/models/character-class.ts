export class CharacterClass {
    id: number = -1;
    name: string = "";
    bonus_stats: number[] = [];
    description: string = "";
    hit_die: number = -1;

    isValid(): boolean {
        return false;
    }
}