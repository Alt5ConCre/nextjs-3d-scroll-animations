'use client'

import dynamic from 'next/dynamic'

const CinematicEngine = dynamic(() => import('@/components/cinematic/CinematicEngine'), { ssr: false })

const chapters = [
  { eyebrow: '01 / ARRIVAL', title: 'A living canvas.', text: 'Scroll controls the cinematic journey while the artifact keeps moving on its own.' },
  { eyebrow: '02 / MOTION', title: 'Two timelines. One scene.', text: 'The camera follows scroll progress. Rotation, particles, reflections and atmosphere run independently.' },
  { eyebrow: '03 / DEPTH', title: 'Built for real 3D.', text: 'The engine is ready for GLB assets, PBR materials, HDR environments, shaders and compressed textures.' },
  { eyebrow: '04 / PERFORMANCE', title: 'Cinematic without wasting frames.', text: 'Responsive DPR, lazy assets, mobile fallbacks and reduced-motion behavior are part of the foundation.' },
]

export default function Home() {
  return (
    <main>
      <CinematicEngine />
      <div className="cinematic-ui">
        <header className="topbar"><span>CINEMATIC ENGINE</span><span>SCROLL / INTERACT</span></header>
        <section className="hero chapter">
          <div><p className="eyebrow">NEXT-GEN WEBGL EXPERIENCE</p><h1>SCROLL THE<br />FILM. MOVE<br />THE WORLD.</h1><p className="lede">A reusable cinematic engine for super-realistic, interactive websites.</p></div>
          <span className="scroll-cue">↓ SCROLL TO EXPLORE</span>
        </section>
        {chapters.map((chapter) => (
          <section className="chapter content-chapter" key={chapter.eyebrow}>
            <div><p className="eyebrow">{chapter.eyebrow}</p><h2>{chapter.title}</h2><p className="lede">{chapter.text}</p></div>
          </section>
        ))}
      </div>
    </main>
  )
}
