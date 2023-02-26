import { useContext } from "react";
import { ErrorContext } from "~/contexts/ErrorContext";

export const useError = () => {
  const errorCtx = useContext(ErrorContext);
  if (!errorCtx) {
    throw new Error("Error context does not exist");
  }
  const { error, setError } = errorCtx;

  return { error, setError };
};
