// src/pages/_app.tsx
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

dayjs.extend(utc);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    // <SessionProvider session={session}>
    <Component {...pageProps} />
    // </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
