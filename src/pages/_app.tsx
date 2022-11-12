// src/pages/_app.tsx
import "animate.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import Link from "next/link";
import { cssTransition, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import create from "zustand";
import { ConditionallyVisible } from "../components/ConditionallyVisible";
import "../styles/globals.css";

import { trpc } from "../utils/trpc";

dayjs.extend(utc);

type UIState = {
  hidden: boolean;
  setHidden: (arg0: boolean) => void;
};

export const useUIStateStore = create<UIState>((set) => ({
  hidden: false,
  setHidden: (hide) => set((state: UIState) => ({ hidden: hide })),
}));

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const fade = cssTransition({
    enter: "animate__animated animate__fadeIn",
    exit: "animate__animated animate__fadeOut",
  });

  const uiState = useUIStateStore();

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-black font-mono text-white">
        <ConditionallyVisible visibleOn={!uiState.hidden}>
          <Link href="/">
            <a className="mb-16 p-4 text-2xl">rubik-scramble</a>
          </Link>
        </ConditionallyVisible>

        <Component {...pageProps} />
        <ToastContainer
          position="top-center"
          transition={fade}
          autoClose={1000}
          draggable={false}
          limit={3}
        />
      </div>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
