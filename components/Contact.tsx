'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import { Mail, Github, Linkedin, Instagram, MapPin, Send, BookOpen, ArrowUpRight } from 'lucide-react';

const socialLinks = [
  {
    label: 'Email',
    href: `mailto:${profile.contact.email}`,
    icon: <Mail size={18} />,
    value: profile.contact.email,
    external: false,
  },
  {
    label: 'LinkedIn',
    href: profile.contact.linkedin,
    icon: <Linkedin size={18} />,
    value: 'linkedin.com/in/shashisa',
    external: true,
  },
  {
    label: 'GitHub',
    href: profile.contact.github,
    icon: <Github size={18} />,
    value: 'github.com/shashiazad',
    external: true,
  },
  {
    label: 'Medium',
    href: profile.contact.medium,
    icon: <BookOpen size={18} />,
    value: 'shashisa.medium.com',
    external: true,
  },
  {
    label: 'Instagram',
    href: profile.contact.instagram,
    icon: <Instagram size={18} />,
    value: '@shashii_s_a',
    external: true,
  },
];

export default function Contact() {
  return (
    <Section id="contact" className="section-dark bg-glow-blue overflow-hidden">
      <div className="relative z-10">
        {/* Section Heading */}
        <p className="text-center text-[14px] font-medium tracking-widest uppercase text-[#86868b] mb-3">
          Connect
        </p>
        <h2 className="text-center text-[40px] sm:text-[48px] font-semibold tracking-tight mb-4">
          <span className="apple-gradient-text">Get in Touch</span>
        </h2>
        <p className="text-center text-[17px] text-[#86868b] mb-16 max-w-[600px] mx-auto">
          I&apos;m always open to discussing new opportunities, interesting projects, or just connecting with fellow engineers.
        </p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Links */}
          <div className="space-y-3">
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 1, 0.5, 1] as const }}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-[#1d1d1f] border border-white/[0.06] transition-all duration-300 hover:bg-[#2d2d2f] hover:border-[#2997ff]/20"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-[#86868b] group-hover:text-[#2997ff] group-hover:bg-[#2997ff]/10 transition-all duration-300">
                  {link.icon}
                </div>
                <div className="flex-grow">
                  <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em]">
                    {link.label}
                  </div>
                  <div className="text-[14px] font-medium text-[#f5f5f7]">
                    {link.value}
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-[#424245] group-hover:text-[#2997ff] transition-colors" />
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 1, 0.5, 1] as const }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[#1d1d1f] border border-white/[0.06]"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-[#86868b]">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.08em]">
                  Location
                </div>
                <div className="text-[14px] font-medium text-[#f5f5f7]">
                  {profile.contact.location}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 1, 0.5, 1] as const }}
            className="apple-card p-8"
            action={`mailto:${profile.contact.email}`}
            method="post"
            encType="text/plain"
          >
            <h3 className="text-[21px] font-semibold text-[#f5f5f7] mb-8">
              Send a Message
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-[#86868b] mb-2" htmlFor="name">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="w-full rounded-xl px-4 py-3 bg-white/[0.04] border border-white/[0.1] text-[#f5f5f7] placeholder-[#424245] focus:border-[#2997ff] focus:ring-2 focus:ring-[#2997ff]/20 outline-none transition-all text-[15px]"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#86868b] mb-2" htmlFor="email">
                  Your Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full rounded-xl px-4 py-3 bg-white/[0.04] border border-white/[0.1] text-[#f5f5f7] placeholder-[#424245] focus:border-[#2997ff] focus:ring-2 focus:ring-[#2997ff]/20 outline-none transition-all text-[15px]"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#86868b] mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full rounded-xl px-4 py-3 h-32 bg-white/[0.04] border border-white/[0.1] text-[#f5f5f7] placeholder-[#424245] focus:border-[#2997ff] focus:ring-2 focus:ring-[#2997ff]/20 outline-none transition-all resize-none text-[15px]"
                  placeholder="Hi Shashi, I'd like to discuss..."
                  required
                />
              </div>

              <button
                type="submit"
                className="apple-btn w-full text-[15px] py-3.5"
              >
                <Send size={16} />
                Send Message
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </Section>
  );
}
