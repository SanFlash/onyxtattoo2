'use client';
export default function Error({reset}:{reset:()=>void}){return <main className="error-page"><p className="eyebrow">ONYX / SOMETHING WENT WRONG</p><h1>THE INK SPILLED.</h1><p>Please try again in a moment.</p><button onClick={reset}>Try again</button><a href="/">Back to home</a></main>}
