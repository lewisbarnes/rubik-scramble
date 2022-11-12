import { toast } from "react-toastify";

export const ScrambleDisplay = ({ scramble }: { scramble: string[] }) => {
  const copyScramble = () => {
    navigator.clipboard.writeText(scramble.join(" "));
    toast("copied scramble to clipboard!", {
      hideProgressBar: true,
    });
  };

  return (
    <div className="text-md flex flex-auto flex-row flex-wrap justify-center gap-4 text-center uppercase">
      {scramble?.map((s, i) => (
        <div key={`scramble${i}`} className="block">
          {s}
        </div>
      ))}
      <button
        title="Copy Scramble"
        onClick={copyScramble}
        className="block rounded-md p-1 text-zinc-700 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
  );
};
