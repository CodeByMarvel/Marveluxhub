export const tokens = {
  bg: "#0A0A0A", surface: "#141414", surfaceAlt: "#1E1E1E", surfaceHover: "#242424",
  text: "#FAFAFA", text2: "rgba(255,255,255,0.70)", text3: "rgba(255,255,255,0.38)",
  green: "#2ECC71", greenDim: "rgba(46,204,113,0.12)", greenBorder: "rgba(46,204,113,0.25)",
  amber: "#F5A623", amberDim: "rgba(245,166,35,0.12)", amberBorder: "rgba(245,166,35,0.25)",
  border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.18)",
  error: "#E74C3C", errorDim: "rgba(231,76,60,0.12)", errorBorder: "rgba(231,76,60,0.25)",
};

export const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow: hidden; }
  body { font-family: 'Outfit', sans-serif; background: ${tokens.bg}; color: ${tokens.text}; font-size: 14px; line-height: 1.5; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${tokens.border}; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: ${tokens.borderStrong}; }
  select { padding: 8px 12px; background: ${tokens.surface}; border: 1px solid ${tokens.border}; border-radius: 6px; color: ${tokens.text2}; font-size: 12px; font-family: 'Outfit', sans-serif; outline: none; cursor: pointer; }
  input { outline: none; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes modalIn { from { opacity: 0; transform: scale(.97) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes toastIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
`;
