import { Twitter, Instagram } from "lucide-react";

const socialMedia = [
  {
    name: "@LLCoolChris_",
    icon: Twitter,
  },
  {
    name: "@LLCoolChris_",
    icon: Instagram,
  },
];

export default function SocialMedia() {
  return (
    <div className="flex w-fit flex-row items-center justify-start gap-6">
      {socialMedia.map((social, index) => (
        <div key={index} className="flex flex-row items-center justify-start gap-2 text-white">
          <social.icon size={32} />
          <p className="text-six">{social.name}</p>
        </div>
      ))}
    </div>
  );
}