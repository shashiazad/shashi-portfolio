'use client';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <footer className="py-10 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm opacity-80">
        <div>© {new Date().getFullYear()} {profile.name}. All rights reserved.</div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          {/* Instagram */}
          {profile.contact.instagram && (
            <a
              href={profile.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors"
              aria-label="Instagram"
              title='Instagram'
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2a.75.75 0 110 1.5.75.75 0 010-1.5zm-4.25 1.25a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </a>
          )}

          {/* LinkedIn */}
          {profile.contact.linkedin && (
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors"
              aria-label="LinkedIn"
              title='LinkedIn'
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5a2.5 2.5 0 11-.001 5.001A2.5 2.5 0 014.98 3.5zm.02 6.5H2V21h3V10zm7 0h-3v11h3v-5.5c0-3 4-3.25 4 0V21h3v-6.5c0-5-5-4.85-7-2.375V10z" />
              </svg>
            </a>
          )}

          {/* GitHub */}
          {profile.contact.github && (
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors"
              aria-label="GitHub"
              title='GitHub'
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.533 1.032 1.533 1.032.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.842-2.338 4.687-4.566 4.934.36.31.682.921.682 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.134 20.162 22 16.418 22 12c0-5.52-4.48-10-10-10z" />
              </svg>
            </a>
          )}
          {/* Codolio */}
          {profile.contact.codolio && (
            <a
              href={profile.contact.codolio}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors flex items-center"
              aria-label="Codolio"
              title="Codolio"
            >
              <img
                src="https://codolio.com/codolio_assets/codolio.svg"
                alt="Codolio"
                className="w-5 h-5"
              />
            </a>
          )}

        </div>
      </div>
    </footer>
  );
}
