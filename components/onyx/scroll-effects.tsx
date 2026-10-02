'use client';

import {useEffect, useRef} from 'react';
import {photo} from '@/lib/onyx-images';

const frames=[
  {src:'/images/motion-artist.webp',alt:'Tattoo artist in studio',className:'scroll-effects__frame--one',depth:.10,rotate:-4},
  {src:'/images/motion-session.webp',alt:'Tattoo artist working on a client',className:'scroll-effects__frame--two',depth:.17,rotate:3},
  {src:'/images/motion-detail.webp',alt:'Close-up tattoo detail',className:'scroll-effects__frame--three',depth:.24,rotate:-2},
  {src:'/images/motion-work.webp',alt:'Tattoo studio portrait',className:'scroll-effects__frame--four',depth:.13,rotate:4},
];

export default function ScrollEffects(){
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse=matchMedia('(pointer: coarse)').matches;
    const path=location.pathname;
    if(reduced||coarse||path.startsWith('/admin')||path.startsWith('/login'))return;
    const node=root.current;
    if(!node)return;
    const items=Array.from(node.querySelectorAll<HTMLElement>('[data-depth]'));
    let frame=0;
    let lastY=scrollY;
    const render=()=>{
      frame=0;
      const y=scrollY;
      const velocity=Math.max(-1,Math.min(1,(y-lastY)/80));
      lastY=y;
      items.forEach((item,index)=>{
        const depth=Number(item.dataset.depth||0);
        const base=Number(item.dataset.rotate||0);
        const drift=Math.sin(y*.0012+index)*18;
        item.style.transform=`translate3d(0,${y*depth+drift}px,0) rotate(${base+velocity*(index%2?1.4:-1.4)}deg)`;
      });
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(render)};
    addEventListener('scroll',onScroll,{passive:true});
    render();
    return()=>{removeEventListener('scroll',onScroll);if(frame)cancelAnimationFrame(frame)};
  },[]);
  return <div ref={root} className="scroll-effects" aria-hidden="true">
    <div className="scroll-effects__grain"/>
    {frames.map((item,i)=><figure key={item.src} className={`scroll-effects__frame ${item.className}`} data-depth={item.depth} data-rotate={item.rotate}>
      <img src={photo(item.src)} alt="" loading={i===0?'lazy':'lazy'} decoding="async"/>
      <figcaption>ONYX / 0{i+1}</figcaption>
    </figure>)}
    <span className="scroll-effects__label">INK / ART / IDENTITY</span>
  </div>;
}
