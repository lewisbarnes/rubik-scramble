import type { NextPage } from "next";
import Head from "next/head";
import { TimerComponent } from "../components/Timer";
import { signIn, signOut, useSession } from "next-auth/react";
import { ConditionallyVisible } from "../components/ConditionallyVisible";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session, status: authStatus } = useSession();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black pb-4">
      <Head>
        <title>rubik-scramble</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          media="screen"
          href="https://fontlibrary.org//face/segment7"
          type="text/css"
        />
      </Head>
      <ConditionallyVisible visibleOn={authStatus === "authenticated"}>
        Logged in as {session?.user?.name}
      </ConditionallyVisible>
      <ConditionallyVisible visibleOn={authStatus === "unauthenticated"}>
        <button
          className="flex-grow-0 rounded-md border p-2"
          onClick={() => signIn("discord")}
        >
          login with discord
        </button>
      </ConditionallyVisible>
      <ConditionallyVisible
        visibleOn={authStatus === "authenticated"}
        className=""
      >
        <div className="flex flex-col items-center gap-2">
          <Link href="/timer">
            <a className="self-stretch rounded-md border p-2 text-center">
              timer
            </a>
          </Link>
          <button
            className="self-stretch rounded-md border p-2"
            onClick={() => signOut()}
          >
            logout
          </button>
        </div>
      </ConditionallyVisible>
    </div>
  );
};

export default Home;
