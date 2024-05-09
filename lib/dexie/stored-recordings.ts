import { storedRecordingTable } from "./db.config";

export const getAllRecordingsBySetId = async (setId: string) => {
  const recordings = await storedRecordingTable.where({ setId }).sortBy("idx");
  return recordings;
};
