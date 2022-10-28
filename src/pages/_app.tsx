// src/pages/_app.tsx
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { cssTransition, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "animate.css";

import { trpc } from "../utils/trpc";

dayjs.extend(utc);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const fade = cssTransition({
    enter: "animate__animated animate__fadeIn",
    exit: "animate__animated animate__fadeOut",
  });

  return (
    // <SessionProvider session={session}>
    <div>
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        transition={fade}
        autoClose={1000}
        draggable={false}
      />
    </div>
    // </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
