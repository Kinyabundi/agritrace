import { useCallback } from "react";
import { supplierCollections } from "@/helpers/firebaseDBHelpers";
import { addDoc, where, query, getDocs } from "firebase/firestore";
import { ISupplier } from "@/types/Supplier";

const useSupplier = () => {
  const saveSupplier = useCallback(async (supplierInfo: ISupplier) => {
    const docRef = await addDoc(supplierCollections, supplierInfo);
    return docRef.id;
  }, []);

  const getSuppliers = async (manufacturer_address: string) => {
    const q = query(
      supplierCollections,
      where("manufacturer", "==", manufacturer_address)
    );

    let allsuppliers = new Array<ISupplier>();

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      allsuppliers.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return allsuppliers;
  };

  return { saveSupplier, getSuppliers };
};

export default useSupplier;
