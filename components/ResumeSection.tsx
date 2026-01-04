'use client';

import { useState, useEffect, useRef } from 'react';
import Section from './Section';
import { Document, Page, pdfjs } from 'react-pdf';

// Worker config (required)
pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ResumeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    }

    handleResize(); // set initial width
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Section id="resume">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Resume</h2>
      <div className="hr-gradient my-4" />

      <div ref={containerRef} className="resume-pdf-wrapper flex justify-center w-full">
        {width > 0 && (
          <Document file="/resume.pdf">
            <Page
              pageNumber={1}
              width={width} // dynamically fits container
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href="/resume.pdf"
          download
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          ⬇️ Download Resume
        </a>
      </div>

    </Section>
  );
}
