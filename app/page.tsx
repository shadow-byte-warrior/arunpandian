import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Timeline from '@/components/Timeline';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';
import { resumeData } from '@/lib/data';

export default function Page() {
  return (
    <div className="grain bg-bg text-ink min-h-screen relative">
      <Navbar />
      
      {/* We pass extracted resume data down to components or modify them to use data.ts */}
      <Hero data={resumeData.personalInfo} />
      <About data={{
         personalInfo: resumeData.personalInfo,
         education: resumeData.education
      }} />
      <Skills data={resumeData.skills} />
      <Timeline data={resumeData.experience} />
      
      <section id="projects" className="py-24 sm:py-32 bg-bg">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="text-xs font-mono tracking-[0.25em] text-accent uppercase">04 — Selected Work</span>
            <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-5xl text-ink tracking-tight">Recruiter-ready case studies</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {resumeData.projects.map((project, i) => (
              <ProjectCard key={i} project={project} />
            ))}
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
