import { useEffect, useRef, useState } from "react";
// Vídeo original, sem nada por cima. Slogan só abaixo.
export default function Hero() {
  const ref = useRef(null);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => setBlocked(true));
  }, []);
  return (
    <section className="hero">
      <video ref={ref} src="/videos/abertura.mp4" autoPlay muted loop playsInline
        controls={blocked} preload="auto" onError={() => setBlocked(true)} />
      <h1 className="slogan">Dê um <span className="gold">xeque</span> em sua fome</h1>
    </section>
  );
}
