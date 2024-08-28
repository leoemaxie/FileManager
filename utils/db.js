import { MongoClient } from 'mongodb';
import envLoader from './env_loader';

class DBClient {
  constructor() {
    envLoader();
    this.db = null;
    this.connect();
  }

  async connect() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files';
    const connectionString = `mongodb://${host}:${port}/${dbName}`;

    const client = new MongoClient(connectionString, { useUnifiedTopology: true, family: 4 });
    await client.connect();
    this.db = client.db(dbName);
  }

  isAlive() {
    return this.db && this.db.serverConfig.isConnected();
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments({});
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments({});
  }

  async usersCollection() {
    return this.db.collection('users');
  }

  async filesCollection() {
    return this.db.collection('files');
  }
}

export default new DBClient();
