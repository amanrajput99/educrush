'use client'
import React from 'react';

type TestimonialCard = {
  image: string;
  name: string;
  handle: string;
  text: string;
};

const cardsData: TestimonialCard[] = [
  {
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    name: 'Rahul Verma',
    handle: '@rahul_btech',
    text: 'Found all my semester 3 DSA notes in minutes. Saved me hours of searching — genuinely the best resource I have used.',
  },
  {
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    name: 'Priya Sharma',
    handle: '@priya_cse',
    text: 'I was panicking before my OS exam and EduCrush had exactly what I needed. Clear, organised, and completely free.',
  },
  {
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
    name: 'Aryan Gupta',
    handle: '@aryan_dev',
    text: 'The projects section is incredible. Helped me build my first full-stack project for placement prep — with actual source code.',
  },
  {
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
    name: 'Karan Mehta',
    handle: '@karanmehta_',
    text: 'Coming from a small town, I never had access to good coaching. EduCrush changed that completely. Every resource, free.',
  },
  {
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200',
    name: 'Sneha Patel',
    handle: '@snehapatel21',
    text: 'I uploaded my DBMS notes and hundreds of students downloaded them. Seeing your work help others is an amazing feeling.',
  },
  {
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200',
    name: 'Vikram Singh',
    handle: '@vikram_ece',
    text: 'ECE notes were always hard to find online. EduCrush actually has them, properly organised by subject and semester.',
  },
  {
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
    name: 'Nisha Rawat',
    handle: '@nisharawat_',
    text: 'The community is so supportive. Posted a doubt and got a helpful reply within hours. Feels like studying with friends.',
  },
  {
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200',
    name: 'Rohit Joshi',
    handle: '@rohitjoshi_cs',
    text: 'Used EduCrush throughout my final year. The notes are actually accurate and exam-focused — not just copy-paste content.',
  },
];

const TestimonialCard = ({ card }: { card: TestimonialCard }) => (
  <div className="p-4 rounded-xl mx-4 shadow-md hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white/90 backdrop-blur-sm">
    <div className="flex gap-3 items-center">
      <img className="w-14 h-14 rounded-full object-cover" src={card.image} alt={card.name} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-900">{card.name}</p>
          <svg className="mt-0.5 fill-blue-500" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
          </svg>
        </div>
        <span className="text-xs text-slate-500">{card.handle}</span>
      </div>
    </div>
    <p className="text-sm py-4 text-slate-700">{card.text}</p>
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-10 px-4 bg-black text-slate-100">

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green-500">What students are saying</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-white">Loved by students across India</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
            From last-minute exam prep to final year projects — here is what real EduCrush students have to say.
          </p>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
          * { font-family: 'Sora', sans-serif; }

          @keyframes marqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .marquee-inner {
            animation: marqueeScroll 30s linear infinite;
          }
          .marquee-reverse {
            animation-direction: reverse;
          }
        `}</style>

        <div className="marquee-row w-full mx-auto overflow-hidden relative mb-8">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />
          <div className="marquee-inner flex min-w-[200%] pt-10 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <TestimonialCard key={`top-${index}`} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent" />
        </div>

        <div className="marquee-row w-full mx-auto overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />
          <div className="marquee-inner marquee-reverse flex min-w-[200%] pt-10 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <TestimonialCard key={`bottom-${index}`} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent" />
        </div>
      </div>
    </section>
  );
}