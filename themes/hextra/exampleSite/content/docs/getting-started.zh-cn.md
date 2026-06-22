---
title: 快速开始
weight: 1
next: /docs/guide
prev: /docs
---

## 使用模板快速开始

{{< icon "github" >}}&nbsp;[imfing/hextra-starter-template](https://github.com/imfing/hextra-starter-template)

通过使用上面的模板仓库，您将能够快速地开始。

<img src="https://docs.github.com/assets/cb-77734/mw-1440/images/help/repository/use-this-template-button.webp" width="500">

我们提供了一个 [GitHub Actions 工作流](https://docs.github.com/cn/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)，它可以帮助您自动构建并部署您的网站到 GitHub Pages，并免费托管。

[🌐 演示 ↗](https://imfing.github.io/hextra-starter-template/)

## 作为新项目开始

### 前提条件

在开始之前，请确保我们已经安装了 [Hugo](https://gohugo.io/)。
请参考 Hugo 的[官方安装指南](https://gohugo.io/installation/)以获取更多详情。

[Hugo 模块](https://gohugo.io/hugo-modules/)是管理 Hugo 主题的推荐方式。要使用 Hugo 模块，我们需要安装 [Git](https://git-scm.com/) 和 [Go](https://go.dev/)。

### 初始化 Hugo 站点

```shell
hugo new site my-site --format=yaml
```

### 通过 Hugo Module 安装

```shell
# 初始化 Hugo 模块
cd my-site
hugo mod init github.com/username/my-site

# 添加 Hextra 
hugo mod get github.com/imfing/hextra
```

编辑 `hugo.yaml` 以启用 Hextra：

```yaml
module:
  imports:
    - path: github.com/imfing/hextra
```

### 通过 Git Submodule 安装

#### 先决条件

在我们开始之前，你必须先确保以下软件已经安装：

- [Hugo (extended version)](https://gohugo.io/installation/)
- [Git](https://git-scm.com/)

#### 步骤

{{% steps %}}

### 初始化 Hugo 站点

```shell
hugo new site my-site --format=yaml
```

### 将 Hextra 添加为 Git Submodule

```shell
git submodule add https://github.com/imfing/hextra.git themes/hextra
```

添加以下内容来配置 `hugo.yaml` 以使用 Hextra：

```yaml
theme: hextra
```

### 创建你的第一个内容页

让我们为主页和文档页面创建一个新的内容页面：

```shell
hugo new content/_index.md
hugo new content/docs/_index.md
```

### 在本地预览站点

```shell
hugo server --buildDrafts --disableFastRender
```

瞧！你现在可以在 `http://localhost:1313/` 看到你的新站点。

{{% /steps %}}




使用 [CI/CD](https://en.wikipedia.org/wiki/CI/CD) 进行部署时，必须确保在运行 `hugo` 命令之前执行以下命令。

```shell
git submodule update --init
```

如果不运行此命令，theme 中将不会存在 Hextra 文件，进而导致构建失败。


{{% details title="如何更新主题？" %}}

如需把项目中所有的 Hugo Modules 都升级到最新，在终端中运行此命令：

```shell
hugo mod get -u
```

如需把 Hextra 升级到[最新的发行版本](https://github.com/imfing/hextra/releases), 在终端中运行此命令：

```shell
hugo mod get -u github.com/imfing/hextra
```

如果你需要获得更多信息，参见 [Hugo Modules](https://gohugo.io/hugo-modules/use-modules/#update-all-modules).

{{% /details %}}

## 接下来

探索这些文档以便添加更多内容：

{{< cards >}}
  {{< card link="../guide/organize-files" title="Organize Files" icon="document-duplicate" >}}
  {{< card link="../guide/configuration" title="Configuration" icon="adjustments" >}}
  {{< card link="../guide/markdown" title="Markdown" icon="markdown" >}}
{{< /cards >}}
