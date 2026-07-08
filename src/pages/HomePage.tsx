import React from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Experience from '../components/sections/Experience'
import Contact from '../components/sections/Contact'
import ProjectCard from '../components/ui/ProjectCard'
import { resumeData } from '../data/resumeData'

export default function HomePage() {
  return (
    <div className="grain bg-bg text-ink min-h-screen relative">
      <Navbar />
      
      <Hero data={resumeData.personalInfo} />
      <About data={{
         personalInfo: resumeData.personalInfo,
         education: resumeData.education
      }} />
      <Skills data={resumeData.skills} />
      <Experience data={resumeData.experience} />
      
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

      <Contact />
    </div>
  )
}
