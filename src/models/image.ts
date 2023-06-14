import { DatabaseModel } from "./database-model";


export class Image extends DatabaseModel<Image> {
    owner_id: number = -1;
    image_data?: Buffer;
    image_content_type: string = "";
    thumbnail_content_type: string = "";
    thumbnail_data?: Buffer;

    tableName = "Image";

    public constructor(init?: Partial<Image>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        return (
            this.owner_id >= 0 &&
            this.image_data != undefined &&
            this.image_data != null &&
            this.image_content_type != undefined &&
            this.image_content_type != null &&
            this.image_content_type != "" &&
            this.thumbnail_content_type != "" &&
            this.thumbnail_content_type != undefined &&
            this.thumbnail_content_type != null &&
            this.thumbnail_data != undefined &&
            this.thumbnail_data != null);
    }

    fromDatabase(data: any[]): Image {
        const db_image: any = data[0];
        const user: Image = new Image({
            id: db_image.id,
            owner_id: db_image.owner_id,
            image_data: db_image.image_data,
            image_content_type: db_image.image_content_type,
            thumbnail_content_type: db_image.thumbnail_content_type,
            thumbnail_data: db_image.thumbnail_data,
        });

        return user;
    }

    insertParams(): any[] {
        return [this.owner_id, this.image_data, this.image_content_type, this.thumbnail_content_type, this.thumbnail_data];
    }

    insertString(): string {
        return `(owner_id, image_data, image_content_type, thumbnail_content_type, thumbnail_data) VALUES(?, ?, ?, ?, ?)`;
    }

    updateString(): string {
        return `owner_id=?, image_data=?, image_content_type=?, thumbnail_content_type=?, thumbnail_data=?`
    }
}
