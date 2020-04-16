const { MongoClient, ObjectId } = require('mongodb');

const USER = encodeURIComponent('root');
const PASSWORD = encodeURIComponent('sanagustin123');
const DB_NAME = 'usuarios';

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0-kfx78.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect(err => {
          if (err) reject(err);
          console.log('Connected succesfully to mongo');
          resolve(this.client.db(this.dbName));
        });
      });
    }
    return MongoLib.connection;
  }

  getAll(collection, query) {
    return this.connect().then(db =>
      db
        .collection(collection)
        .find(query)
        .toArray()
    );
  }

  get(collection, id) {
    return this.connect().then(db =>
      db.collection(collection).findOne({ _id: ObjectId(id) })
    );
  }

  create(collection, data) {
    return this.connect()
      .then(db => db.collection(collection).insertOne(data))
      .then(result => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then(db =>
        db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true })
      )
      .then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect()
      .then(db => db.collection(collection).deleteOne({ _id: ObjectId(id) }))
      .then(() => id);
  }
}

module.exports = MongoLib;