import { ObjectId } from "mongodb";

export function arrayMapMongoIdToString<T extends { _id: ObjectId }>(arr: T[]) {
  return arr.map((a) => ({ ...a, _id: a._id.toString() }));
}
