import {
  createContext,
  type ReactNode,
  useState,
  useEffect,
  type SetStateAction,
  type Dispatch,
} from "react";

export type Alert = {
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  message: string;
};

type AlertContext = {
  alert: Alert | null;
  setAlert: Dispatch<SetStateAction<Alert | null>>;
};

export const AlertContext = createContext<AlertContext | null>(null);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const delay = 5000;

  useEffect(() => {
    if (!alert) {
      return;
    }
    const timer = setTimeout(() => {
      setAlert(null);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [alert]);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
