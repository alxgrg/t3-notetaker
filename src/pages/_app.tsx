import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ErrorProvider } from "~/contexts/ErrorContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ErrorProvider>
        <Component {...pageProps} />
      </ErrorProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
