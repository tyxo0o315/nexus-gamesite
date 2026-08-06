# 我们的服 — 游戏同步站

[![CI](https://github.com/tyxo0o315/nexus-gamesite/actions/workflows/ci.yml/badge.svg)](https://github.com/tyxo0o315/nexus-gamesite/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-online-2ea44f)](https://tyxo0o315.github.io/nexus-gamesite/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

朋友圈用来同步 Mod 列表、版本信息和一起玩的想法。

**在线访问：** https://tyxo0o315.github.io/nexus-gamesite/

![Nexus game site screenshot](assets/screenshot.png)

## 如何更新内容

**只需编辑一个文件：`js/data.js`**

### 更新 Mod 列表

在 `mods` 数组中添加或删除条目：

```js
{
  id: "mod-id",           // 唯一标识，英文小写
  name: "Mod 名称",
  category: "性能优化",   // 必须与 modCategories 中的 id 一致
  description: "简介",
  version: "1.0.0",
  required: true,         // true = 必装，false = 可选
  downloadUrl: "https://modrinth.com/mod/...",
},
```

### 更新游戏版本

修改 `activeGames` 数组中对应游戏的 `version`、`totalMods`、`lastUpdated` 字段。

### 添加整合包下载

将 `packDownloadUrl` 替换为真实下载链接（Google Drive、Dropbox、OneDrive 等）。

### 同步服务器地址

公开仓库不要提交私人服务器地址。`serverAddress` 默认使用占位值，真实地址建议通过群聊、私有文档或私有 fork 同步。

### 添加想法

在 `playingIdeas` 数组末尾添加：

```js
{
  id: "idea-N",
  author: "你的名字",
  title: "标题",
  body: "详细描述",
  tags: ["标签1", "标签2"],
  votes: 0,
  pinned: false,        // true = 置顶
  color: "cream",       // "cream" | "warm" | "sage"
  date: "2026-05-27",
},
```

## 本地预览

直接用浏览器打开 `index.html` 即可，无需服务器。

## 部署到 GitHub Pages

1. 把整个 `gaming-sync` 文件夹推送到 GitHub 仓库
2. 仓库设置 → Pages → Source 选 `main` 分支根目录
3. 几分钟后即可访问

## 质量检查

GitHub Actions 会检查 JavaScript 语法，并确认 `index.html` 引用了核心 CSS/JS 入口。

## License

MIT.
