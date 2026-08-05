import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Publications from '@/components/Publications';
import ResumeSection from '@/components/ResumeSection';
import Contact from '@/components/Contact';

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Publications />
      <ResumeSection />
      <Contact />
    </>
  );
}
