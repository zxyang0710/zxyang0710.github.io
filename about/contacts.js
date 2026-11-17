const contacts = document.querySelector(".contact-icons");
let active;
let pinned = false;

function show(item, keepOpen = false) {
  if (active && active !== item) {
    active.querySelector("button").setAttribute("aria-expanded", "false");
    active.querySelector(".qr-panel").hidden = true;
  }
  active = item;
  pinned = keepOpen;
  if (active) {
    active.querySelector("button").setAttribute("aria-expanded", "true");
    active.querySelector(".qr-panel").hidden = false;
  }
}

for (const item of contacts.querySelectorAll(".qr-contact")) {
  const button = item.querySelector("button");
  item.addEventListener("pointerenter", event => {
    if (event.pointerType === "mouse" && !pinned) show(item);
  });
  item.addEventListener("pointerleave", () => {
    if (active === item && !pinned) show(null);
  });
  button.addEventListener("click", () => {
    if (active === item && pinned) show(null);
    else show(item, true);
  });
}

document.addEventListener("click", event => {
  if (active && !active.contains(event.target)) show(null);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && active) show(null);
});
