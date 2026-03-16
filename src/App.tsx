/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageCircle,
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Menu, 
  X, 
  ChevronRight, 
  Award, 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  Send,
  ArrowRight,
  Loader2
} from 'lucide-react';

// --- AI ChatBot Component ---

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Dobar dan! Ja sam Vaš asistent u Zubnoj laboratoriji Bulić. Kako Vam mogu pomoći danas?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [{ text: `Ti si asistent za Zubnu laboratoriju Bulić iz Beograda. 
            Laboratorija ima preko 30 godina tradicije. 
            Specijalizovani su za Bredent master laboratoriju, CAD/CAM tehnologiju, digitalne otiske i 3D štampu. 
            Vlasnik je porodica Bulić. 
            Kontakt telefon: +381 63 277 790. 
            Email: dentallabbulic@gmail.com.
            Odgovaraj ljubazno, profesionalno i na srpskom jeziku. 
            Korisnik pita: ${userMessage}` }]
          }
        ]
      });

      const response = await model;
      const botResponse = response.text || "Izvinite, trenutno ne mogu da odgovorim. Molimo Vas pozovite nas na +381 63 277 790.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Došlo je do greške. Molimo Vas pokušajte kasnije ili nas kontaktirajte direktno." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] max-w-[90vw] h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-navy/10"
          >
            {/* Header */}
            <div className="bg-navy p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <MessageCircle size={18} className="text-navy" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm">Bulić Asistent</h4>
                  <span className="text-[10px] text-gold uppercase tracking-widest">Online</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-gold transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-soft-white/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-navy text-white rounded-tr-none' 
                    : 'bg-white text-navy shadow-sm border border-navy/5 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-navy/5 rounded-tl-none">
                    <Loader2 size={18} className="animate-spin text-gold" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-navy/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pitajte nas nešto..."
                  className="w-full bg-soft-white rounded-full px-6 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center hover:bg-gold transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group relative"
      >
        <div className="absolute -top-12 right-0 bg-white text-navy text-[10px] font-bold py-2 px-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-navy/5">
          Pitajte našeg asistenta
        </div>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

// --- Components ---

const TopBar = () => (
  <div className="bg-navy text-white/80 py-2 px-4 md:px-12 flex justify-between items-center text-xs tracking-wider border-b border-white/10">
    <div className="flex gap-6">
      <a href="tel:+38163277790" className="flex items-center gap-2 hover:text-gold transition-colors">
        <Phone size={14} /> +381 63 277 790
      </a>
      <a href="mailto:dentallabbulic@gmail.com" className="hidden md:flex items-center gap-2 hover:text-gold transition-colors">
        <Mail size={14} /> dentallabbulic@gmail.com
      </a>
    </div>
    <div className="flex gap-4">
      <a href="#" className="hover:text-gold transition-transform hover:scale-110"><Facebook size={14} /></a>
      <a href="#" className="hover:text-gold transition-transform hover:scale-110"><Instagram size={14} /></a>
    </div>
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Početna', href: '#' },
    { name: 'O nama', href: '#o-nama' },
    { name: 'Usluge', href: '#usluge' },
    { name: 'Tehnologija', href: '#tehnologija' },
    { name: 'Kontakt', href: '#kontakt' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-3 glass shadow-lg' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-navy flex items-center justify-center rounded-lg shadow-xl group-hover:shadow-gold/20 transition-all duration-500">
            <span className="text-white font-serif font-bold text-xl">B</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-tight tracking-tight text-navy group-hover:text-gold transition-colors duration-500">ZUBNA LABORATORIJA</span>
            <span className="text-xs tracking-[0.3em] font-bold text-gold drop-shadow-sm">BULIĆ</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="relative group text-sm font-medium tracking-wide text-navy uppercase overflow-hidden"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">{link.name}</span>
              <span className="absolute top-full left-0 inline-block transition-transform duration-300 group-hover:-translate-y-full text-gold">{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a 
            href="https://wa.me/38163277790"
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-button bg-[#25D366] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300 shadow-xl"
          >
            KONTAKTIRAJ NAS
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-navy" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-serif text-navy hover:text-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="https://wa.me/38163277790"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-center shadow-lg"
              >
                KONTAKTIRAJ NAS
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2000" 
          alt="Dental Laboratory" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-soft-white"></div>
      </motion.div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-serif text-navy leading-tight mb-8">
            Vaš osmeh <br />
            <span className="italic font-normal">znači više.</span>
          </h1>
          <div className="relative inline-block mb-12">
            <p className="text-lg md:text-2xl text-navy font-semibold max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Mi nismo fabrika zuba, mi smo umetnička radionica gde se spajaju najsavremenija tehnologija i decenijsko iskustvo.
            </p>
            <div className="absolute -inset-4 bg-white/30 blur-xl -z-10 rounded-full"></div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a 
              href="#o-nama"
              className="magnetic-button bg-navy text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 shadow-2xl flex items-center gap-3 group"
            >
              Pročitaj više <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="https://wa.me/38163277790"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-button bg-[#25D366] text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-all duration-300 shadow-2xl"
            >
              KONTAKTIRAJ NAS
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-navy to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-navy/40 font-bold">Scroll</span>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="o-nama" className="py-24 md:py-40 px-6 md:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-gold/30"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-gold/30"></div>
          <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000" 
              alt="Dental Craftsmanship" 
              className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-1/2 -right-10 md:-right-20 bg-navy text-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-[250px] hidden md:block">
            <span className="text-4xl font-serif block mb-2">30+</span>
            <span className="text-xs uppercase tracking-widest text-gold font-bold">Godina Tradicije</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">O Laboratoriji</span>
          <h2 className="text-4xl md:text-6xl font-serif text-navy mb-8 leading-tight">
            Zubna laboratorija <br />
            <span className="italic">Bulić</span>
          </h2>
          <div className="space-y-6 text-lg text-navy/70 font-light leading-relaxed">
            <p>
              Porodična firma koja je nastala devedesetih godina prošlog veka u Beogradu. Naša misija je uvek bila jasna: pružiti vrhunski kvalitet kroz individualan pristup svakom pacijentu.
            </p>
            <p>
              Savremena tehnologija, inovativni materijali i njihova implementacija u svakodnevnoj praksi uz stručnost našeg tima čine nas liderima u oblasti dentalne protetike. Zubna laboratorija Bulić je visoko tehnološki opremljena, sa vrhunskim timom stručnjaka koji neprestano usavršavaju svoja znanja.
            </p>
          </div>
          <button className="mt-12 magnetic-button bg-navy text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 shadow-xl">
            Više o nama
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="text-gold" size={32} />,
      title: "Iskustvo",
      desc: "Preko tri decenije posvećenosti i hiljade uspešnih radova."
    },
    {
      icon: <Award className="text-gold" size={32} />,
      title: "Preciznost",
      desc: "Mikronska tačnost u svakom detalju za savršen zagrižaj."
    },
    {
      icon: <Cpu className="text-gold" size={32} />,
      title: "Moderna Tehnologija",
      desc: "CAD/CAM sistemi i najkvalitetniji materijali današnjice."
    }
  ];

  return (
    <section id="usluge" className="py-24 md:py-40 px-6 md:px-12 bg-soft-white">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-serif text-navy mb-8">
            Mi znamo da Vaš osmeh <br />
            <span className="italic">znači više.</span>
          </h2>
          <p className="text-lg text-navy/60 font-light max-w-3xl mx-auto">
            Estetska stomatologija i implant protetika su polja na kojem su zahtevi pacijenata najkompleksniji, to je mesto gde se sreću znanje, funkcija, veština, umetnost i strast.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {pillars.map((pillar, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-white p-12 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100"
          >
            <div className="w-16 h-16 bg-soft-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-navy group-hover:scale-110 transition-all duration-500">
              <div className="group-hover:text-white transition-colors duration-500">
                {pillar.icon}
              </div>
            </div>
            <h3 className="text-2xl font-serif text-navy mb-4">{pillar.title}</h3>
            <p className="text-navy/60 font-light leading-relaxed">{pillar.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const SmileImage = () => {
  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      <motion.div 
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full h-full"
      >
        <img 
          src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=2000" 
          alt="Perfect Smile" 
          className="w-full h-full object-cover grayscale contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-navy/20 mix-blend-multiply"></div>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white text-center"
        >
          <span className="text-xs uppercase tracking-[0.5em] font-bold opacity-70">Umetnost Osmeha</span>
        </motion.div>
      </div>
    </section>
  );
};

const Certification = () => {
  return (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-navy text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Sertifikacija</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
              Bredent master <br />
              <span className="italic">laboratorija</span>
            </h2>
            <p className="text-lg text-white/70 font-light leading-relaxed mb-10">
              Zvanje kojim je krunisano četvorogodišnje školovanje u Bredent akademiji Senden, Nemačka, a nakon niza sertifikovanih procedura. Ponosni smo što smo jedna od retkih laboratorija u regionu sa ovim prestižnim priznanjem.
            </p>
            <div className="flex flex-wrap gap-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center">
                  <Award className="text-gold" size={20} />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold">Edukacija</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center">
                  <ShieldCheck className="text-gold" size={20} />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold">Sertifikat</span>
              </div>
            </div>
            <button className="mt-12 magnetic-button bg-gold text-navy px-12 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-2xl">
              Pročitaj više
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <div className="absolute inset-0 border-2 border-gold/20 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-4 border border-gold/10 rounded-full animate-reverse-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Award size={80} className="text-gold mx-auto mb-4" />
                  <span className="block font-serif text-2xl">MASTER</span>
                  <span className="block text-[10px] tracking-[0.3em] text-gold font-bold uppercase">Laboratorija</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Technology = () => {
  return (
    <section id="tehnologija" className="py-24 md:py-40 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Inovacije</span>
            <h2 className="text-4xl md:text-6xl font-serif text-navy mb-8">
              Budućnost je <br />
              <span className="italic">već počela</span>
            </h2>
            <p className="text-lg text-navy/60 font-light max-w-2xl mx-auto">
              Danas kao nikada do sada imamo čitavu paletu materijala koju možemo upotrebiti u našem svakodnevnom radu, uz podršku najnaprednijih digitalnih sistema.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              <div className="bg-soft-white p-8 rounded-3xl aspect-square flex flex-col justify-end group hover:bg-navy transition-all duration-500">
                <Cpu className="text-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="text-xl font-serif text-navy group-hover:text-white transition-colors">CAD/CAM</h4>
              </div>
              <div className="bg-soft-white p-8 rounded-3xl aspect-[3/4] flex flex-col justify-end group hover:bg-navy transition-all duration-500">
                <ShieldCheck className="text-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="text-xl font-serif text-navy group-hover:text-white transition-colors">Digitalni Otisak</h4>
              </div>
            </div>
            <div className="space-y-6 pt-12">
              <div className="bg-soft-white p-8 rounded-3xl aspect-[3/4] flex flex-col justify-end group hover:bg-navy transition-all duration-500">
                <Award className="text-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="text-xl font-serif text-navy group-hover:text-white transition-colors">3D Štampa</h4>
              </div>
              <div className="bg-soft-white p-8 rounded-3xl aspect-square flex flex-col justify-end group hover:bg-navy transition-all duration-500">
                <Cpu className="text-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="text-xl font-serif text-navy group-hover:text-white transition-colors">Zirkon</h4>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-serif text-navy leading-tight">Digitalni Workflow za Savršene Rezultate</h3>
            <p className="text-navy/70 font-light leading-relaxed">
              Korišćenjem najsavremenijih skenera i softvera za modelovanje, eliminišemo greške koje su bile uobičajene u tradicionalnim metodama. Svaka krunica, most ili proteza se dizajnira sa digitalnom preciznošću koja garantuje dugovečnost i estetiku.
            </p>
            <ul className="space-y-4">
              {['Individualni pristup dizajnu', 'Najkvalitetniji biokompatibilni materijali', 'Brža izrada bez gubitka kvaliteta'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-navy/80 font-medium">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="magnetic-button bg-navy text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 shadow-xl">
              Pročitaj više
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="kontakt" className="relative py-24 md:py-40 px-6 md:px-12 bg-navy overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000" 
          alt="Contact Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight">
              Kontaktirajte <br />
              <span className="italic">nas</span>
            </h2>
            <p className="text-xl text-white/60 font-light mb-12">
              Mi znamo da Vaš osmeh znači više. Tu smo da odgovorimo na sva Vaša pitanja i započnemo saradnju.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
                  <Phone className="text-gold group-hover:text-navy transition-colors" size={24} />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Telefon</span>
                  <a href="tel:+38163277790" className="text-xl text-white hover:text-gold transition-colors">+381 63 277 790</a>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
                  <Mail className="text-gold group-hover:text-navy transition-colors" size={24} />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Email</span>
                  <a href="mailto:dentallabbulic@gmail.com" className="text-xl text-white hover:text-gold transition-colors">dentallabbulic@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
                  <MapPin className="text-gold group-hover:text-navy transition-colors" size={24} />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Adresa</span>
                  <span className="text-xl text-white">Beograd, Srbija</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass p-10 md:p-16 rounded-[40px] shadow-2xl"
          >
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-navy/60 font-bold ml-2">Ime i Prezime</label>
                <input 
                  type="text" 
                  placeholder="Upišite Vaše ime i prezime"
                  className="w-full bg-white/50 border border-navy/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-navy/60 font-bold ml-2">Email Adresa</label>
                <input 
                  type="email" 
                  placeholder="Upišite Vašu email adresu"
                  className="w-full bg-white/50 border border-navy/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-navy/60 font-bold ml-2">Poruka</label>
                <textarea 
                  rows={4}
                  placeholder="Mesto za Vašu poruku"
                  className="w-full bg-white/50 border border-navy/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none"
                ></textarea>
              </div>
              <button className="w-full magnetic-button bg-navy text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 shadow-xl flex items-center justify-center gap-3">
                Pošalji Poruku <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-24 pb-12 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer">
              <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl group-hover:shadow-gold/20 transition-all duration-500">
                <span className="text-navy font-serif font-bold text-2xl">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-tight tracking-tight group-hover:text-gold transition-colors duration-500">ZUBNA LABORATORIJA</span>
                <span className="text-xs tracking-[0.3em] font-bold text-gold">BULIĆ</span>
              </div>
            </div>
            <p className="text-white/50 font-light leading-relaxed max-w-md">
              Vrhunska dentalna protetika sa tradicijom dugom preko 30 godina. Spajamo umetnost i tehnologiju za Vaš savršen osmeh.
            </p>
          </div>
          
          <div>
            <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-8">Brzi Linkovi</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Početna</a></li>
              <li><a href="#o-nama" className="hover:text-white transition-colors">O nama</a></li>
              <li><a href="#usluge" className="hover:text-white transition-colors">Usluge</a></li>
              <li><a href="#tehnologija" className="hover:text-white transition-colors">Tehnologija</a></li>
              <li><a href="#kontakt" className="hover:text-white transition-colors">Kontakt</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-8">Pratite Nas</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all duration-300">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
          <span>Copyright © 2026 Dental Lab Bulić | Sva prava zadržana</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Politika Privatnosti</a>
            <a href="#" className="hover:text-white transition-colors">Uslovi Korišćenja</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative w-full overflow-x-hidden selection:bg-gold selection:text-navy">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gold z-[100] origin-left"
        style={{ scaleX }}
      />

      <ChatBot />

      <Navbar />
      
      <main className="w-full">
        <Hero />
        <About />
        <TrustSection />
        <SmileImage />
        <Certification />
        <Technology />
        <Contact />
      </main>

      <Footer />

      {/* Global CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 15s linear infinite;
        }
      `}} />
    </div>
  );
}
