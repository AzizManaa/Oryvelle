// Replaceable, independently authored composition artwork, not final photography.
export default function Stand({ foreground = false }: { foreground?: boolean }) {
  const prefix = foreground ? "front" : "rear";
  return <svg viewBox="0 0 1000 900" aria-hidden="true">
    <defs>
      <linearGradient id={`${prefix}-metal`} x1="0" x2="1"><stop stopColor="#101014" /><stop offset=".18" stopColor="#37333c" /><stop offset=".32" stopColor="#17161c" /><stop offset=".72" stopColor="#15141a" /><stop offset=".94" stopColor="#36313b" /><stop offset="1" stopColor="#111014" /></linearGradient>
      <linearGradient id={`${prefix}-edge`} x2="0" y2="1"><stop stopColor="#77717d" /><stop offset=".16" stopColor="#35313a" /><stop offset=".4" stopColor="#151419" /><stop offset="1" stopColor="#0c0c0f" /></linearGradient>
      <pattern id={`${prefix}-rib`} width="9" height="9" patternUnits="userSpaceOnUse"><path d="M1 0V9" stroke="#77707b" strokeOpacity=".19" strokeWidth="2" /><path d="M5 0V9" stroke="#08080a" strokeOpacity=".8" strokeWidth="3" /></pattern>
      <linearGradient id={`${prefix}-fade`} x2="0" y2="1"><stop offset=".72" stopColor="white" /><stop offset="1" stopColor="black" /></linearGradient>
      <mask id={`${prefix}-mask`}><rect width="1000" height="900" fill={`url(#${prefix}-fade)`} /></mask>
    </defs>
    {!foreground ? <g mask={`url(#${prefix}-mask)`}>
      <ellipse cx="500" cy="845" rx="330" ry="31" fill="#000" opacity=".65" />
      <path d="M445 585H555L568 812H432Z" fill={`url(#${prefix}-metal)`} stroke="#312c37" strokeWidth="3" />
      <path d="M295 802Q500 758 705 802L759 841Q500 893 241 841Z" fill={`url(#${prefix}-edge)`} stroke="#343039" strokeWidth="3" />
      <rect x="226" y="15" width="548" height="606" rx="55" fill={`url(#${prefix}-metal)`} stroke="#4b4552" strokeWidth="3" />
      <rect x="232" y="19" width="536" height="595" rx="50" fill={`url(#${prefix}-rib)`} />
      <rect x="343" y="509" width="314" height="81" rx="27" fill="#111014" stroke="#28242d" />
    </g> : <g>
      {[230, 665].map(x => <g key={x}><path d={`M${x} 554 Q${x} 535 ${x+28} 535H${x+77}Q${x+105} 535 ${x+105} 560V618Q${x+105} 638 ${x+80} 638H${x+23}Q${x} 638 ${x} 615Z`} fill={`url(#${prefix}-edge)`} stroke="#45404a" strokeWidth="3" /><path d={`M${x+11} 555 Q${x+50} 547 ${x+94} 555`} fill="none" stroke="#aaa1ae" strokeOpacity=".5" strokeWidth="5" /><rect x={x+9} y="572" width="87" height="49" rx="18" fill="#111014" /></g>)}
    </g>}
  </svg>;
}
