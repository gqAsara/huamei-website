export default function BoxOutline({index}:{index:number}) {
  return <svg viewBox="0 0 120 80" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
    {index===0 ? <path d="m20 43 39-13 42 13-39 15Z M20 43v15l42 15 39-15V43 M62 58v15 M20 43 9 22l39-14 11 22 M9 22l43 15 M20 58l-9-8 9-7 M101 43l10 7-10 8"/> : index===1 ? <path d="m37 39 39-12 32 15-40 15Z M37 39v19l31 17 40-14V42 M68 57v18 M37 39 8 23l40-13 28 17 M37 39l-6-3v18l6 4 M68 64l15-5v8l-15 5"/> : <path d="m34 29 27-9 27 10-27 10Z M34 29v38l27 10 27-10V30 M61 40v37 M34 29l-9-16 27-9 9 16 M61 40l11-10 16 0 M34 67l27 10 27-10"/>}
  </svg>;
}
