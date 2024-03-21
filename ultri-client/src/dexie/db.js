import Dexie from "dexie";
import 'dexie-syncable';

export const db = new Dexie("ultri");

db.version(6).stores({
  spaces: '$$id, name, createdAt', // Primary key and indexed props
  nuggets: '$$id, spaceId, name, alternateName, createdAt, updatedAt, pubAt, unPubAt, reviewAt, alternateType, [spaceId+nuggetType], nuggetSubType', // Primary key and indexed props
});
