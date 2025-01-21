import { MongoClient, Db } from 'mongodb';

let uri = process.env.DB_URI || '';
const dbName = process.env.DB_NAME ;

let client: MongoClient | null = null;
let db: Db;

export const connectToDB = async (): Promise<Db> => {
  if (client && db) {
    return db;
  }

  try {
    if(!uri){
      console.log('Invalid or Not Found Connection String');
    } 
    client = await MongoClient.connect(uri);
    db = client.db(dbName);
    console.log('Connected to MongoDB database');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Re-throw to allow caller to handle the error
  }
};

export const disconnectFromDatabase = async () => {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB database');
  }
};