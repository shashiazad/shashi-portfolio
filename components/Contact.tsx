'use client';

import { motion } from 'framer-motion';
import Section from './Section';
import { profile } from '@/data/profile';
import { Mail, Github, Linkedin, Instagram, MapPin, Send, MessageSquare, ArrowUpRight } from 'lucide-react';

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
    label: 'Instagram',
    href: profile.contact.instagram,
    icon: <Instagram size={18} />,
    value: '@shashii_s_a',
    external: true,
  },
];

export default function Contact() {
  return (
    <Section id="contact">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shrink-0">
          <MessageSquare size={18} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Get in Touch</h2>
      </div>
      <div className="hr-gradient my-6" />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
            I&apos;m always open to discussing new opportunities, interesting projects, or just connecting with fellow engineers. Feel free to reach out!
          </p>

          <div className="space-y-3">
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group flex items-center gap-4 p-4 glass-card rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  {link.icon}
                </div>
                <div className="flex-grow">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {link.label}
                  </div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {link.value}
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center gap-4 p-4 glass-card rounded-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center text-brand-500">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Location
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {profile.contact.location}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 sm:p-8"
          action={`mailto:${profile.contact.email}`}
          method="post"
          encType="text/plain"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Send a Message
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="name">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="email">
                Your Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full rounded-xl px-4 py-3 h-32 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none"
                placeholder="Hi Shashi, I'd like to discuss..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-medium bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 hover:shadow-glow-lg hover:scale-[1.01] transition-all duration-300"
            >
              <Send size={16} />
              Send Message
            </button>
          </div>
        </motion.form>
      </div>
    </Section>
  );
}
