(() => {
  const header = document.querySelector(".intro");
  if (!header) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const layer = document.createElement("div");
  layer.className = "home-ripples";
  layer.setAttribute("aria-hidden", "true");
  header.prepend(layer);

  const random = (min, max) => min + Math.random() * (max - min);
  let timer;
  let visible = false;

  function ripple() {
    const wave = document.createElement("div");
    const duration = random(2900, 4100);
    const spacing = random(280, 440);
    wave.className = "home-ripple";
    wave.style.setProperty("--x", random(8, 94) + "%");
    wave.style.setProperty("--y", random(16, 93) + "%");
    wave.style.setProperty("--size", random(28, 70) + "vmin");
    wave.style.setProperty("--duration", duration + "ms");

    for (let index = 0; index < 3; index++) {
      const ring = document.createElement("span");
      ring.style.setProperty("--delay", index * spacing + "ms");
      wave.append(ring);
    }

    layer.append(wave);
    setTimeout(() => wave.remove(), duration + 2 * spacing + 100);
    timer = setTimeout(ripple, random(1700, 4200));
  }

  function update() {
    clearTimeout(timer);
    if (visible && !document.hidden && !reducedMotion.matches) {
      timer = setTimeout(ripple, random(350, 900));
    } else {
      layer.replaceChildren();
    }
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }).observe(header);
  document.addEventListener("visibilitychange", update);
  reducedMotion.addEventListener("change", update);
})();
