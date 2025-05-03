import {model, Schema, Types} from "mongoose";

export const DOCUMENT_NAME = "User"
export const COLLECTION_NAME = "users"

export interface User{
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
}

const schema = new Schema<User>({
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
    }
    },
    {
    timestamps: true,
    versionKey: false,
})

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME)

