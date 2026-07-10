import type { Metadata } from "next";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "Komunitas Developer",
  description: "Ngobrol bareng sesama developer mobile Indonesia di komunitas Mobix. Diskusi, tanya jawab, dan berbagi pengalaman seputar开发 aplikasi Android.",
};

export default function ChatPage() {
  return <ChatClient />;
}
