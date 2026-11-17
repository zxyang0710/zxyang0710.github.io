(() => {
  const bar = document.querySelector(".fish-progress");
  if (!bar) return;

  const fill = bar.querySelector(".fish-progress__fill");
  const demo = new URLSearchParams(location.search).has("preview-loading");
  const started = performance.now();
  let position = 9;
  const timer = setInterval(() => {
    position += (91 - position) * .19;
    fill.style.width = position + "%";
  }, 240);

  let finishing = false;
  function finish() {
    if (finishing) return;
    finishing = true;
    setTimeout(() => {
      clearInterval(timer);
      fill.style.width = "100%";
      setTimeout(() => bar.classList.add("is-finished"), 420);
      setTimeout(() => bar.remove(), 650);
    }, Math.max(0, (demo ? 3200 : 0) - (performance.now() - started)));
  }

  if (document.readyState === "complete") finish();
  else window.addEventListener("load", finish, { once: true });
})();
