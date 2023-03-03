import {
  DocumentData,
  collection,
  CollectionReference,
} from "firebase/firestore";
import { db } from "@/lib/initFirebase";
import { ISupplier } from "@/types/Supplier";

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

//export all collections
export const supplierCollections = createCollection<ISupplier>("suppliers");
