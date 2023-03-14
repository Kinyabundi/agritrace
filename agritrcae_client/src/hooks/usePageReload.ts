import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const usePageReload = () => {
  const router = useRouter();
  const [isReloaded, setIsReloaded] = useState(false);

  useEffect(() => {
    const checkIfReloaded = () => {
      setIsReloaded(true);
    };

    router.beforePopState(() => {
      checkIfReloaded();
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  return isReloaded;
};


export default usePageReload;