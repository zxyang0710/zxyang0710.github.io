// Load Blog into the current document. Its regular URL also works on its own.
const blogUrl = new URL("../../blog/", import.meta.url);
const originalUrl = new URL(location.href);
const sectionStyles = new URL("./sections.css?v=2", import.meta.url);
const listStyles = new URL("../../blog/styles/list.css?v=3", import.meta.url);
const main = document.querySelector("main");
const existingNav = document.querySelector(".site-nav");
const originalTitle = document.title;
const originalNavItem = existingNav?.querySelector("[aria-current]");
let request;
let view;
let revision = 0;
let returnScroll = 0;

function loadStyles(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url.href;
    link.media = "not all";
    link.onload = () => resolve(link);
    link.onerror = () => { link.remove(); reject(new Error("Could not load Blog styles")); };
    document.head.append(link);
  });
}

async function prepareBlog() {
  const response = await fetch(blogUrl);
  if (!response.ok) throw new Error("Could not load Blog");
  const page = new DOMParser().parseFromString(await response.text(), "text/html");
  const content = page.querySelector("#blog-view");
  const nav = page.querySelector(".site-nav");
  if (!content || !nav) throw new Error("Blog layout is unavailable");

  // Keep these links correct when the address changes without a page load.
  for (const link of (existingNav || nav).querySelectorAll("a[href]")) {
    link.href = new URL(link.getAttribute("href"), existingNav ? originalUrl : blogUrl).href;
  }
  const { initBlog } = await import("../../blog/list.js?v=2");
  const styles = [await loadStyles(listStyles)];
  if (!existingNav) styles.unshift(await loadStyles(sectionStyles));
  return { content, nav, styles, initBlog, title: page.title };
}

function closeBlog() {
  if (!view || view.content.hidden) return;
  view.content.hidden = true;
  if (!existingNav) view.nav.hidden = true;
  if (existingNav) {
    existingNav.querySelector("[data-open-blog]").removeAttribute("aria-current");
    originalNavItem?.setAttribute("aria-current", "page");
  }
  for (const style of view.styles) style.media = "not all";
  document.body.classList.remove("blog-view");
  main.hidden = false;
  document.title = originalTitle;
  window.scrollTo(0, returnScroll);
}

async function openBlog(url, push) {
  const attempt = ++revision;
  try {
    request ??= prepareBlog();
    const prepared = await request;
    if (attempt !== revision) return;
    if (!view) {
      view = prepared;
      if (!existingNav) main.after(view.nav);
      (existingNav || view.nav).after(view.content);
      view.initBlog(view.content);
    }
    if (push) {
      returnScroll = window.scrollY;
      history.pushState({ blogView: true }, "", url);
    }
    main.querySelector("audio")?.pause();
    main.hidden = true;
    document.body.classList.add("blog-view");
    for (const style of view.styles) style.media = "all";
    if (!existingNav) view.nav.hidden = false;
    if (existingNav) {
      originalNavItem?.removeAttribute("aria-current");
      existingNav.querySelector("[data-open-blog]").setAttribute("aria-current", "page");
    }
    view.content.hidden = false;
    document.title = view.title;
    window.scrollTo(0, 0);
    view.content.querySelector("h1").focus({ preventScroll: true });
  } catch {
    if (attempt === revision) location.assign(url);
  }
}

if (main && location.protocol !== "file:") {
  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-open-blog]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.pathname !== blogUrl.pathname) openBlog(link.href, true);
  });
  window.addEventListener("popstate", event => {
    if (event.state?.blogView) openBlog(location.href, false);
    else {
      revision++;
      closeBlog();
    }
  });
}
