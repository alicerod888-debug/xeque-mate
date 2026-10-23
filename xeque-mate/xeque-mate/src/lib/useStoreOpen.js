import { useCallback, useEffect, useState } from "react";
import { getStoreStatus } from "./hours.js";

// Mantém o status aberto/fechado atualizado sem recarregar a página.
export default function useStoreOpen() {
  const [open, setOpen] = useState(() => getStoreStatus().open);
  const recheck = useCallback(() => {
    const o = getStoreStatus().open;
    setOpen(o);
    return o;
  }, []);
  useEffect(() => {
    const id = setInterval(recheck, 1000);
    document.addEventListener("visibilitychange", recheck);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", recheck); };
  }, [recheck]);
  return [open, recheck];
}
