import Dexie from "dexie";

const db = new Dexie("stored-recordings");

db.version(1).stores({
  utterances: "++id, idx, utteranceId, setId, utterance, audioBlob",
});

export const storedRecordingTable = db.table("utterances");

export default db;
