import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";

export type Error = {
  name: string;
  type: string;
  message: string;
};

type ErrorContext = {
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
};

export const ErrorContext = createContext<ErrorContext | null>(null);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<Error | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};
