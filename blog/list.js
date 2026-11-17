const collator = new Intl.Collator("zh-Hans");

function element(name, text, className) {
  const node = document.createElement(name);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function article(post) {
  const row = element("article");
  const heading = element("div", "", "article-heading");
  const title = element("h2");
  if (post.localUrl) {
    const link = element("a", post.title);
    link.href = new URL(post.localUrl, import.meta.url).href;
    title.append(link);
  } else {
    title.textContent = post.title;
  }
  const date = element("time", post.date);
  date.dateTime = post.published;
  heading.append(title, date);
  if (!post.localUrl) heading.append(element("span", "待迁移", "badge"));
  const tags = element("div", "", "tags");
  for (const name of [post.category, ...post.tags]) tags.append(element("span", name, "badge"));
  row.append(heading, tags, element("p", post.summary || "暂无简介。", "summary"));
  return row;
}

export async function initBlog(view) {
  const tree = view.querySelector("#tree");
  const resultStatus = view.querySelector("#status");
  const list = view.querySelector("#posts");
  const sidebar = view.querySelector("#blog-sidebar");
  const sidebarToggle = view.querySelector(".sidebar-toggle");
  sidebarToggle.addEventListener("click", () => {
    const open = sidebar.hidden;
    sidebar.hidden = !open;
    view.classList.toggle("sidebar-closed", !open);
    sidebarToggle.setAttribute("aria-expanded", String(open));
    sidebarToggle.setAttribute("aria-label", open ? "收起标签栏" : "展开标签栏");
    sidebarToggle.firstElementChild.textContent = open ? "‹" : "›";
  });

  let posts;
  try {
    const response = await fetch(new URL("./data/posts.json", import.meta.url));
    if (!response.ok) throw new Error("Could not read posts");
    posts = await response.json();
  } catch {
    resultStatus.textContent = "文章加载失败，请刷新后重试。";
    return;
  }
  const categories = new Map();
  for (const post of posts) {
    if (!categories.has(post.category)) categories.set(post.category, []);
    categories.get(post.category).push(post);
  }

  function render(matches, label, button) {
    tree.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-pressed", "true");
    list.replaceChildren(...matches.map(article));
    resultStatus.textContent = `${label} · ${matches.length} 篇文章`;
  }

  function filter(label, matches, path = label) {
    const button = element("button", label, "filter");
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.append(element("span", String(matches.length), "count"));
    button.addEventListener("click", () => render(matches, path, button));
    return button;
  }

  const all = filter("全部文章", posts);
  tree.append(all);
  const groups = [...categories].sort(([left], [right]) => collator.compare(left, right));
  for (const [index, [category, scoped]] of groups.entries()) {
    const branch = element("div");
    const row = element("div", "", "branch-row");
    const mainFilter = filter(category, scoped);
    const tags = new Map();
    for (const post of scoped) {
      for (const tag of post.tags) {
        if (!tags.has(tag)) tags.set(tag, []);
        tags.get(tag).push(post);
      }
    }

    const children = element("div", "", "children");
    children.id = `tags-${index}`;
    children.hidden = true;
    if (tags.size) {
      const expand = element("button", "", "expand");
      const arrow = element("span", "›");
      arrow.setAttribute("aria-hidden", "true");
      expand.append(arrow);
      expand.type = "button";
      expand.setAttribute("aria-controls", children.id);
      function setExpanded(open) {
        children.hidden = !open;
        expand.setAttribute("aria-expanded", String(open));
        expand.setAttribute("aria-label", `${open ? "折叠" : "展开"}${category}的二级标签`);
      }
      setExpanded(false);
      expand.addEventListener("click", () => setExpanded(children.hidden));
      mainFilter.addEventListener("click", () => setExpanded(true));
      row.append(expand);
      for (const [tag, matches] of [...tags].sort(([left], [right]) => collator.compare(left, right))) {
        children.append(filter(tag, matches, `${category} / ${tag}`));
      }
    }
    row.append(mainFilter);
    branch.append(row, children);
    tree.append(branch);
  }
  render(posts, "全部文章", all);
}
