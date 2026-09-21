# E2M 读书会资料库 · Quartz

这个目录是 Quartz 网站模板。`content/e2m-vault` 指向同级的 Obsidian vault：

```text
/Users/jane/Documents/E2M/
├── E2M 读书会资料库/   # 内容唯一来源，Obsidian 与 Git 仓库
└── site-quartz/        # Quartz 配置与主题
```

本地预览：

```bash
npm ci
npx quartz build --serve -d content/e2m-vault
```

当前配置启用了 Obsidian Flavored Markdown、Explorer、Search、Graph、Backlinks、Canvas 和 Bases。`.base` 视图由 Quartz 的 `@quartz-community/bases-page` 处理；Markdown 中的 `![[某个.base]]` 和 `![[某个.base#视图名]]` 保持原样。

公开网站由现有内容仓库的 GitHub Pages 承载：
`https://gongruoz.github.io/e2m-knowledge-base-obsidian/`。

Quartz 模板保存在同一个远端仓库的 `quartz-site` 分支，本地仍是与 vault 并列的 `site-quartz` 文件夹。发布工作流分别检出 `main`（笔记）和 `quartz-site`（模板），把前者临时链接到模板的 `content/e2m-vault`，构建后上传静态页面。推送 vault 的 `main` 分支会自动发布；推送模板分支或手动运行工作流也会发布。模板分支不保存 Markdown 副本或构建产物。
