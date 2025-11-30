"use client";
import { useState } from "react";
import Image from "next/image";
import { Frijole } from "next/font/google";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { quizApi } from "@/services/quizApi";

const frijole = Frijole({ weight: "400", subsets: ["latin"] });

export default function AddPeople() {
  const [invitationLink, setInvitationLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInvitation = async () => {
    try {
      const participationType = localStorage.getItem("participationType");
      const language = localStorage.getItem("language");

      if (!participationType || !language || (participationType !== "group")) {
          return;
        }
      const res = await quizApi.createQuiz({mode: participationType, language});
      setInvitationLink(process.env.NEXT_PUBLIC_INVITATION_URL + res.data.quizId );
    } catch (err) {
        setError("Failed to create invitation");
    }
  };

  const copyToClipboard = async () => {
    if (!invitationLink) return;
    await navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-screen flex justify-end">
      <Image src="/img5.png" layout="fill" objectFit="cover" alt="Background" className="opacity-60" />

      <div className="absolute flex flex-col text-center items-center space-y-4 px-48">
        <h1 className={`${frijole.className} text-4xl text-blue-800 pt-32`}>
          YOU CAN ADD <br /> PEOPLE BY USING <br /> THE INVITATION LINK
        </h1>
          <div className="relative inline-block">
            {invitationLink && (
              <div className="flex items-center bg-black opacity-70 rounded-lg shadow px-12 py-3 space-x-2">
                <input
                  type="text"
                  value={invitationLink}
                  placeholder={invitationLink}
                  readOnly
                  className="flex-1 bg-transparent text-white outline-none"
                />
                <button onClick={copyToClipboard} className="text-white hover:scale-105">
                  <ContentCopyIcon />
                </button>
                
              </div>
            )}
            
            {copied && (
              <span className="absolute top-1/2 left-full ml-3 -translate-y-1/2 text-md text-green-500 font-semibold whitespace-nowrap">
                ✅ Copied!
              </span>
            )}
            {!invitationLink && (
              <button onClick={generateInvitation} className="flex items-center bg-blue-800 rounded-lg shadow px-24 py-3 text-lg text-white hover:scale-105 hover:cursor-pointer">
                Generate Invitation
              </button>
            )}
           {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
      </div>
    </div>
  );
}
