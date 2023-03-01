import { useContext } from "react";
import { AlertContext } from "~/contexts/AlertContext";

export const useAlert = () => {
  const alertCtx = useContext(AlertContext);
  if (!alertCtx) {
    throw new Error("Alert context does not exist");
  }
  const { alert, setAlert } = alertCtx;

  return { alert, setAlert };
};
