import { DatabaseModel } from "./database-model";


export class CharacterImage extends DatabaseModel<CharacterImage> {
    owner_id: number = -1;
    pc_id: number = -1;
    image_name: string = "";
    content_type: string = "";
    image_data?: Buffer;
    thumbnail_data?: Buffer | null;

    tableName = "Character_Image";

    public constructor(init?: Partial<CharacterImage>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        return (
            this.owner_id >= 0 &&
            this.pc_id >= 0 &&
            this.image_name != undefined &&
            this.content_type != undefined &&
            this.image_data != undefined &&
            this.thumbnail_data !== undefined);
    }

    fromDatabase(data: any[]): CharacterImage {
        const db_image: any = data[0];
        const image: CharacterImage = new CharacterImage({
            id: db_image.id ?? db_image.ID,
            owner_id: db_image.owner_id,
            pc_id: db_image.pc_id,
            image_name: db_image.image_name,
            content_type: db_image.content_type,
            image_data: db_image.image_data,
            thumbnail_data: db_image.thumbnail_data
        });

        return image;
    }

    insertParams(): any[] {
        return [this.owner_id, this.pc_id, this.image_name, this.content_type, this.image_data, this.thumbnail_data];
    }

    insertString(): string {
        return `(owner_id, pc_id, image_name, content_type, image_data, thumbnail_data) VALUES(?, ?, ?, ?, ?, ?)`;
    }

    updateString(): string {
        return `owner_id=?, pc_id=?, image_name=?, content_type=?, image_data=?, thumbnail_data=?`
    }
}
