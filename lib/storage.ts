import { SQLiteDatabase } from "expo-sqlite"

export interface User {
  name: string;
  rollNo: string;
}
export interface Score {
  name: string;
  rollNo: string;
  value: number;
}

export interface FullCollection {
  id: number
  timestamp: Date
  values: Value[]
}
export interface InsertCollection {
  timestamp: Date
  values: InsertValue[]
}
export interface Collection {
  id: number
  timestamp: Date
}

export interface Value {
  id: number
  timestamp: number
  value: number  
}
export interface InsertValue {
  timestamp: number
  value: number
}

export const getDbUser = async (db: SQLiteDatabase) => {
  const user : User|null = await db.getFirstAsync('SELECT * FROM user ORDER BY id DESC;');

  return user;
}

export const setDbUser = async (db: SQLiteDatabase, user: User|null) => {
  await db.runAsync('DELETE FROM user;');

  if (user) await db.runAsync('INSERT INTO user (name, rollNo) VALUES (?, ?)', [user.name, user.rollNo]);
}


export const getAllCollections = async (db: SQLiteDatabase) => {
  const result : Collection[] = await db.getAllAsync('SELECT id, timestamp FROM collection ORDER BY timestamp DESC;');

  return result;
};

export const getCollection = async (db: SQLiteDatabase, id: string) => {
  const collection : FullCollection|null = await db.getFirstAsync('SELECT * FROM collection WHERE id = ?', [id]);

  if (!collection) {
    return null;
  }

  const values : Value[] = await db.getAllAsync('SELECT * FROM value WHERE collectionId = ?', [id]);

  return {
    id: collection.id,
    timestamp: collection.timestamp,
    values
  };
};

export const getCollectionValues = async (db: SQLiteDatabase, id: number) => {
  const values : Value[] = await db.getAllAsync('SELECT * FROM value WHERE collectionId = ?', [id]);

  return values;
};

export const formatValue = (v: number) : InsertValue => {
  return {
    timestamp: Date.now(),
    value: v
  };
};

export const addCollection = async (db: SQLiteDatabase, v: InsertValue[]) => {
  const collection = await db.runAsync('INSERT INTO collection (timestamp) VALUES (?)', [Date.now()]);

  const collectionId = collection.lastInsertRowId.toString();

  let q = ``;

  for (const value of v) {
    q += `INSERT INTO value (timestamp, value, collectionId) VALUES (${value.timestamp}, ${value.value}, ${collectionId});`;
    q += "\n";
  }

  await db.execAsync(q);

  return collectionId;
};

export const initDb = (db: SQLiteDatabase) => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS collection (
      id INTEGER PRIMARY KEY,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      rollNo TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS value (
      id INTEGER PRIMARY KEY,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      value REAL NOT NULL,
      collectionId INTEGER NOT NULL,
      FOREIGN KEY (collectionId) REFERENCES collection (id) ON DELETE CASCADE
    );
  `);
};