import { useCallback } from "react";
import {
  invitesCollections,
  supplierCollections,
} from "@/helpers/firebaseDBHelpers";
import {
  addDoc,
  where,
  query,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { IInviteBody, ISupplier, SupplierStatus } from "@/types/Supplier";
import axios from "axios";
import { IApiResponse } from "@/types/Api";
import {
  contractQuery,
  unwrapResultOrDefault,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";

const BASE_URL = "/api";

const useSupplier = () => {
  const { api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.StakeholderRegistry);
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
          // @ts-ignore
          company: supplierInfo.manufacturer_name,
          name: supplierInfo.name,
          // @ts-ignore
          link: supplierInfo.invitelink,
        } as IInviteBody,
        config
      );

      const supplierDocRef = doc(supplierCollections, docRef.id);

      await updateDoc(supplierDocRef, {
          // @ts-ignore
        status: SupplierStatus.Invited,
        updated: new Date(),
      });

      return resp.data as IApiResponse;
    } catch (err) {
      console.log("Error sending email", err);
      return {
        status: "error",
        msg: "Could not send email",
      } as IApiResponse;
    }
  }, []);

  const joinViaInviteCode = useCallback(
    async (supplierInfo: ISupplier, inviteCode: string) => {
      // Validate if invite code is valid
      // If valid, update supplier status to active
      const q = query(
        invitesCollections,
        where("inviteCode", "==", inviteCode)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          status: "error",
          msg: "Invalid invite code",
        } as IApiResponse;
      }

      const supplierDocRef = await addDoc(supplierCollections, supplierInfo);

      console.log("Document written with ID: ", supplierDocRef.id);

      return {
        status: "ok",
        msg: "Supplier added successfully",
      } as IApiResponse;
    },
    []
  );

  const getSuppliers = async (manufacturer_address: string) => {
    const q = query(
      supplierCollections,
      where("manufacturer", "==", manufacturer_address)
    );

    let allsuppliers = new Array<ISupplier>();

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      allsuppliers.push({
          // @ts-ignore
        id: doc.id,
        ...doc.data(),
      });
    });
    return allsuppliers;
  };

  const getAllSuppliers = useCallback(async () => {
    if (contract && api && activeAccount) {
      const results = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getSuppliers",
        {},
        []
      );
      return unwrapResultOrDefault(results, [] as ISupplier[]);
    }
  }, [activeAccount]);

  return { saveSupplier, getSuppliers, joinViaInviteCode, getAllSuppliers };
};

export default useSupplier;
