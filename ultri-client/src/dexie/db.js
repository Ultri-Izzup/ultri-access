import Dexie from "dexie";
import 'dexie-syncable';

export const db = new Dexie("ultri");

db.version(2).stores({
  spaces: '$$id, name, createdAt', // Primary key and indexed props
  nuggets: '$$id, name, alternateName, createdAt, updatedAt, pubAt, unPubAt, reviewAt, alternateType', // Primary key and indexed props
});
