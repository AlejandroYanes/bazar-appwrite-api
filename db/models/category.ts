import { Models } from 'node-appwrite';

export interface CategoryModel extends Models.Document {
	name: string;
}
