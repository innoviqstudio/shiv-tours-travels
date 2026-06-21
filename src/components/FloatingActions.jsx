import React from 'react';
import { MessageCircle, PhoneCall } from 'lucide-react';

const FloatingActions = () => {
  const whatsappUrl = "https://wa.me/918010936793?text=Hello%20Shiv%20Tours%20and%20Travels,%20I%20want%20to%20enquire%20about%20your%20cab%20and%20travel%20services.";
  const callUrl = "tel:+919405601603";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-slow"
        title="WhatsApp Enquiry"
      >
        {/* Pulsing ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping -z-10" />
        <MessageCircle className="w-7 h-7 fill-white stroke-green-500" />
        
        {/* Tooltip */}
        <span className="absolute right-16 scale-0 transition-all rounded bg-navy-dark px-3 py-1.5 text-xs text-slate-100 group-hover:scale-100 whitespace-nowrap shadow-md border border-gold/20">
          WhatsApp Enquiry
        </span>
      </a>

      {/* Call Button */}
      <a
        href={callUrl}
        className="group relative flex items-center justify-center w-14 h-14 bg-gold hover:bg-gold-dark text-navy-dark rounded-full shadow-lg shadow-gold/30 transition-all duration-300 hover:scale-110 active:scale-95"
        title="Call Us Now"
      >
        {/* Pulsing ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-gold/50 opacity-75 animate-ping -z-10" />
        <PhoneCall className="w-6 h-6 fill-navy-dark stroke-navy-dark" />

        {/* Tooltip */}
        <span className="absolute right-16 scale-0 transition-all rounded bg-navy-dark px-3 py-1.5 text-xs text-slate-100 group-hover:scale-100 whitespace-nowrap shadow-md border border-gold/20">
          Call Now
        </span>
      </a>
    </div>
  );
};

export default FloatingActions;
