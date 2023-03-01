import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { AlertProvider } from "~/contexts/AlertContext";
import * as Toast from "@radix-ui/react-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AlertProvider>
        <Toast.Provider swipeDirection="right">
          <Component {...pageProps} />
          <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
        </Toast.Provider>
      </AlertProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
