import { Models } from 'node-appwrite';

export interface SubCategoryModel extends Models.Document {
	name: string;
	category: string;
}
