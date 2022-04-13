import { Models } from 'node-appwrite';

export interface StoreModel extends Models.Document {
	team: string;
	bucket: string;
	name: string;
	logo: string;
	phone: string;
	address: string;
	facebook: string;
	instagram: string;
	whatsup: string;
	telegram: string;
}
