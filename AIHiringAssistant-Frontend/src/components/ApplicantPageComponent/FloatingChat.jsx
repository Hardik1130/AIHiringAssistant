import React from "react";
import { Users } from "lucide-react";

const FloatingChat = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="bg-brand-dark text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform group relative">
        <Users className="w-6 h-6" />

        <div className="absolute -top-12 right-0 bg-white text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Ask AI Recruiter
        </div>

      </button>
    </div>
  );
};

export default FloatingChat;