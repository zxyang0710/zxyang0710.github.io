# zxyang 的个人网站

这是一个静态网站，可以直接用 HTTP 服务预览，也可以部署到 GitHub Pages。

## 本地预览

在项目根目录运行：

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

首页在 http://127.0.0.1:8000/，博客在 http://127.0.0.1:8000/blog/。

## 改哪里

| 想改的内容 | 文件或目录 |
| --- | --- |
| 首页文案、头像和导航 | `index.html` |
| 首页背景、样式和涟漪 | `assets/home/` |
| 公用小鱼加载条 | `assets/shared/` |
| 博客列表、标签树与侧栏交互 | `blog/index.html`、`blog/list.js` |
| 博客背景与样式 | `blog/assets/`、`blog/styles/` |
| 博客文章索引 | `blog/data/posts.json` |
| 站内文章正文与公式渲染 | `blog/articles/`、`blog/render-math.js` |
| 音乐页 | `playlist/index.html` |
| 旧主题页面及其资源 | `comments/`、`guestbook/`、`schedule/`、`css/`、`js/`、`font/`、`img/` |

## 添加或修改博客

文章正文放到 `blog/articles/`，再更新 `blog/data/posts.json`。索引中的 `published` 记录发布时间，列表按索引顺序显示，将较新的条目放在前面。 `category` 是一级标签，`tags` 是二级标签数组。 `localUrl` 相对于 `blog/`，例如 `articles/example.html`。省略此字段时，列表会显示「待迁移」。 `url` 可保留原文来源。
