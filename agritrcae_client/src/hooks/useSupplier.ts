import { useCallback } from "react";
import { supplierCollections } from "@/helpers/firebaseDBHelpers";
import { addDoc, where, query, getDocs } from "firebase/firestore";
import { IInviteBody, ISupplier } from "@/types/Supplier";
import axios from "axios";
import { IApiResponse } from "@/types/Api";

const BASE_URL = "/api";

const useSupplier = () => {
  const saveSupplier = useCallback(async (supplierInfo: ISupplier) => {
    const docRef = await addDoc(supplierCollections, supplierInfo);
    console.log("Document written with ID: ", docRef.id);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const resp = await axios.post(
        `${BASE_URL}/email/supplier-invite`,
        {
          email: supplierInfo.email,
          company: supplierInfo.manufacturer_address,
          name: supplierInfo.name,
          link: supplierInfo.invitelink,
        } as IInviteBody,
        config
      );

      return resp.data as IApiResponse;
    } catch (err) {
      console.log("Error sending email", err);
      return {
        status: "error",
        msg: "Could not send email",
      } as IApiResponse;
    }
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
