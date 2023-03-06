import { IInviteBody, InviteTarget } from "@/types/Supplier";
import { useCallback } from "react";
import axios from "axios";
import { invitesCollections } from "@/helpers/firebaseDBHelpers";
import { addDoc } from "firebase/firestore";
import { IApiResponse } from "@/types/Api";

const BASE_URL = "/api";

const useInvite = () => {
  const sendInvite = useCallback(async (inviteInfo: IInviteBody) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    if (inviteInfo.target === InviteTarget.Supplier) {
      // check if email is set
      if (!inviteInfo.email) {
        const resp = await axios.post(
          `${BASE_URL}/message/supplier-invite`,
          inviteInfo,
          config
        );

        const docRef = await addDoc(invitesCollections, inviteInfo);
        console.log("Document written with ID: ", docRef.id);
        return resp.data as IApiResponse;
      } else {
        //send email
        const resp = await axios.post(
          `${BASE_URL}/email/supplier-invite`,
          inviteInfo,
          config
        );
        const docRef = await addDoc(invitesCollections, inviteInfo);
        console.log("Document written with ID: ", docRef.id);
        return resp.data as IApiResponse;
      }
    } else {
      // Todo Add for Manufacture
    }
  }, []);

  return {
    sendInvite,
  };
};

export default useInvite;
