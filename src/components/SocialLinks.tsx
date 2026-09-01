import React from 'react';
import { Linkedin, Send, MessageCircle, Twitter, Youtube, Instagram } from 'lucide-react';

const SocialLinks: React.FC = () => {
  const socials = [
    {
      name: 'WhatsApp Channel',
      url: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://whatsapp.com/channel/formbharlo',
      icon: <MessageCircle size={18} />,
      color: 'hover:bg-emerald-600 hover:text-white',
    },
    {
      name: 'Telegram Group',
      url: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/formbharlo',
      icon: <Send size={18} />,
      color: 'hover:bg-sky-600 hover:text-white',
    },
    {
      name: 'Twitter / X',
      url: 'https://twitter.com/formbharlo',
      icon: <Twitter size={18} />,
      color: 'hover:bg-slate-700 hover:text-white',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/formbharlo',
      icon: <Linkedin size={18} />,
      color: 'hover:bg-blue-700 hover:text-white',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@formbharlo',
      icon: <Youtube size={18} />,
      color: 'hover:bg-red-600 hover:text-white',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/formbharlo',
      icon: <Instagram size={18} />,
      color: 'hover:bg-pink-600 hover:text-white',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 text-slate-300 border border-slate-700/70 transition-all ${social.color} shadow-sm`}
          title={social.name}
          aria-label={social.name}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;