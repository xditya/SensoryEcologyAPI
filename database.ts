/*
(c) @xditya
*/

import { MongoClient, ObjectId } from "mongo";

import config from "$env";

console.log("Connecting to MongoDB...");
const client = new MongoClient();
const MONGO_URL = new URL(config.MONGO_URL);
if (!MONGO_URL.searchParams.has("authMechanism")) {
  MONGO_URL.searchParams.set("authMechanism", "SCRAM-SHA-1");
}
try {
  await client.connect(MONGO_URL.href);
} catch (err) {
  console.error("Error connecting to MongoDB", err);
  throw err;
}
const db = client.database("SensoryEcology");

interface DataSchema {
  _id: ObjectId;
  light: number;
  temperature: number;
  gas: number;
}

const data = db.collection<DataSchema>("SensorData");

async function setData(light: number, temperature: number, gas: number) {
  await data.drop();
  await data.insertOne({ light, temperature, gas });
}

async function getData() {
  return await data.findOne();
}

export { setData, getData };
