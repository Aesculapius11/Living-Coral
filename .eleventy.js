const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");

// 加载 Prism 的 docker 组件（以及 YAML，用于复用高亮规则）
require('prismjs/components/prism-docker');
require('prismjs/components/prism-yaml');

function normalizePathPrefix(prefix = "/") {
  let normalized = prefix || "/";
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized || "/";
}

function buildAbsoluteUrl(baseUrl, pathPrefix = "/", pathname = "") {
  const normalizedBase = (baseUrl || "").endsWith("/")
    ? baseUrl.slice(0, -1)
    : (baseUrl || "");
  const normalizedPrefix = normalizePathPrefix(pathPrefix);
  const prefixPart = normalizedPrefix === "/" ? "" : normalizedPrefix;
  const cleanPath = String(pathname || "").replace(/^\/+|\/+$/g, "");

  if (!cleanPath) {
    return `${normalizedBase}${prefixPart}/`;
  }

  return `${normalizedBase}${prefixPart}/${cleanPath}/`;
}

function buildPrefixedPath(pathPrefix = "/", pathname = "") {
  const normalizedPrefix = normalizePathPrefix(pathPrefix);
  const prefixPart = normalizedPrefix === "/" ? "" : normalizedPrefix;
  const cleanPath = String(pathname || "").replace(/^\/+/, "");

  if (!cleanPath) {
    return `${prefixPart || "/"}`;
  }

  return `${prefixPart}/${cleanPath}`;
}

const markdownLib = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

markdownLib.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex("href");
  if (hrefIndex >= 0) {
    const href = token.attrs[hrefIndex][1] || "";
    if (/^https?:\/\//i.test(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
    }
  }
  return self.renderToken(tokens, idx, options);
};

module.exports = function (eleventyConfig) {
  eleventyConfig.setLibrary("md", markdownLib);

  // 构建期语法高亮（Prism）；添加语言别名
  eleventyConfig.addPlugin(syntaxHighlight, {
    init: ({ Prism }) => {
      try {
        Prism.languages.shell = Prism.languages.bash || Prism.languages.shell;
        Prism.languages.sh = Prism.languages.bash || Prism.languages.sh;
        Prism.languages.conf = Prism.languages.ini || Prism.languages.conf;
        // 让 docker/dockerfile 使用 YAML 的高亮规则
        Prism.languages.docker = Prism.languages.yml || Prism.languages.yaml || Prism.languages.docker;
        Prism.languages.dockerfile = Prism.languages.yml || Prism.languages.yaml || Prism.languages.dockerfile;
      } catch (e) {}
    },
  });
  // --- Step 1: 获取 SITE_BASE_URL 的完整逻辑 ---
  let siteData = {};
  try {
    // 假设 site.json 位于 src/_data/site.json
    siteData = JSON.parse(fs.readFileSync('./src/_data/site.json', 'utf8'));
  } catch (e) {
    console.warn("Could not read src/_data/site.json: ", e.message);
  }

  // 1. 获取主域名部分 (SITE_BASE_URL 或 site.json.baseUrl 或默认值)
  let primaryBaseUrl = process.env.SITE_BASE_URL
                       || siteData.baseUrl
                       || "https://www.antares.xin";

  // 确保 primaryBaseUrl 没有trailing slash
  primaryBaseUrl = primaryBaseUrl.endsWith('/') ? primaryBaseUrl.slice(0, -1) : primaryBaseUrl;

  // 2. 获取路径前缀部分 (ELEVENTY_BASE_URL)
  let repoPathPrefix = normalizePathPrefix(process.env.ELEVENTY_BASE_URL || "/");

  // 3. 组合得到最终的完整 base URL
  // 例如：https://aesculapius11.github.io + /your-repo-name
  let fullSiteUrl = buildAbsoluteUrl(primaryBaseUrl, repoPathPrefix).replace(/\/$/, "");

  // --- 添加全局数据 ---
  eleventyConfig.addGlobalData("env", {
    SITE_BASE_URL: process.env.SITE_BASE_URL, // 这个是原始的 domain only
    ELEVENTY_BASE_URL: process.env.ELEVENTY_BASE_URL // 这个是原始的 path prefix
  });
  // 将最终计算出的完整的 base URL 传递给模板和集合
  eleventyConfig.addGlobalData("pathPrefix", fullSiteUrl);

  // 静态资源直拷
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/scripts": "assets" });

  // 过滤器：日期格式
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(new Date(dateObj), { zone: "utc" }).toFormat(
      "yyyy-LL-dd"
    );
  });

  // 新增：数组截取前 N 项
  eleventyConfig.addFilter("limit", (array, n) => {
    if (!Array.isArray(array)) return [];
    if (!n || n <= 0) return [];
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("json", (value) => {
    return JSON.stringify(value)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");
  });


  // 文章集合
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
  });

    // announce集合
  eleventyConfig.addCollection("announces", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/announce/*.md")
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
  });
   
    // 创建全部文章集合
  eleventyConfig.addCollection("allPosts", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/blog/*.md");
    const announces = collectionApi.getFilteredByGlob("src/announce/*.md");
    return [...posts, ...announces];
//    return [...posts];
  });

  // 标签集合
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    collectionApi.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => {
        if (tag !== "post") tagSet.add(tag);
      });
    });
    return [...tagSet].sort();
  });

  // 分类集合
  eleventyConfig.addCollection("categoryList", (collectionApi) => {
    const catSet = new Set();
    collectionApi.getAll().forEach((item) => {
      if (item.data.category) catSet.add(item.data.category);
    });
    return [...catSet].sort();
  });

  // 搜索索引集合
  eleventyConfig.addCollection("searchIndex", (collectionApi) => {
  // 搜索索引需要生成绝对 URL。
  // 如果 ELEVENTY_BASE_URL 存在，则使用它。
  // 否则，使用搜索索引特有的默认绝对 URL。
  // 这确保了即使全局 pathPrefix 是相对路径（如 "/"），搜索结果中的链接也是绝对路径。
  let searchIndexBaseUrl = normalizePathPrefix(process.env.ELEVENTY_BASE_URL || "/");
    return [
      ...collectionApi.getFilteredByGlob("src/blog/*.md"),
      ...collectionApi.getFilteredByGlob("src/announce/*.md")
    ].map((item) => {
      // 从源 Markdown 读取并转为纯文本，避免过早访问 templateContent
      let textContent = "";
      try {
        const source = fs.readFileSync(item.inputPath, "utf8");
        // 去除 YAML front matter
        const noFm = source.replace(/^---[\s\S]*?---\s*/, "");
        // 粗略移除 Markdown 语法与链接/图片，仅保留可读文本
        const noCode = noFm.replace(/```[\s\S]*?```/g, " ");
        const noInlineCode = noCode.replace(/`[^`]*`/g, " ");
        const noImages = noInlineCode.replace(/!\[[^\]]*\]\([^\)]*\)/g, " ");
        const noLinks = noImages.replace(/\[[^\]]*\]\([^\)]*\)/g, (m) => m.replace(/\[[^\]]*\]\([^\)]*\)/, " "));
        const noMd = noLinks
          .replace(/^>\s?/gm, " ")
          .replace(/^#+\s*/gm, " ")
          .replace(/^[-*+]\s+/gm, " ")
          .replace(/^\d+\.\s+/gm, " ")
          .replace(/\*|_|~~|\|/g, " ")
          .replace(/<[^>]+>/g, " ") // 防御性移除 HTML
          .replace(/&[a-z#0-9]+;/gi, " ");
        textContent = noMd.replace(/\s+/g, " ").trim();
      } catch (e) {
        textContent = "";
      }
    const fullUrl = `${searchIndexBaseUrl === "/" ? "" : searchIndexBaseUrl}${item.url}`;

      return {
        title: item.data.title || "",
        description: item.data.description || "",
        tags: item.data.tags || [],
        category: item.data.category || "",
        date: item.date,
        url: fullUrl,
        excerpt: item.data.excerpt || "",
        cover: item.data.cover || "",
        content: textContent
      };
    });
  });

  // 站点地图集合
  eleventyConfig.addCollection("sitemap", (collectionApi) => {
    // 优先使用环境变量，其次使用站点配置，最后使用默认值
    const baseUrl = process.env.SITE_BASE_URL || 
                   collectionApi.getAll()[0]?.data?.site?.baseUrl || 
                   "https://www.antares.xin";
    const pathPrefix = normalizePathPrefix(process.env.ELEVENTY_BASE_URL || "/");
    
    const urls = [
      {
        url: buildAbsoluteUrl(baseUrl, pathPrefix),
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 1.0
      },
      {
        url: buildAbsoluteUrl(baseUrl, pathPrefix, "about"),
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8
      },
      {
        url: buildAbsoluteUrl(baseUrl, pathPrefix, "blog"),
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 0.9
      },

        {
        url: buildAbsoluteUrl(baseUrl, pathPrefix, "announce"),
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 0.9
      },

      {
        url: buildAbsoluteUrl(baseUrl, pathPrefix, "search"),
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.8
      },
      {
        url: buildAbsoluteUrl(baseUrl, pathPrefix, "categories"),
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7
      },
      {
        url: buildAbsoluteUrl(baseUrl, pathPrefix, "tags"),
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7
      }
    ];

    // 添加博客文章
    collectionApi.getFilteredByGlob("src/blog/*.md").forEach((item) => {
      urls.push({
        url: buildAbsoluteUrl(baseUrl, pathPrefix, `blog/${item.fileSlug}`),
        lastmod: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.6
      });
    });

        // 添加announce文章
    collectionApi.getFilteredByGlob("src/announce/*.md").forEach((item) => {
      urls.push({
        url: buildAbsoluteUrl(baseUrl, pathPrefix, `announce/${item.fileSlug}`),
        lastmod: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.6
      });
    });
 
    // 添加分类页面
    const categories = new Set();
    collectionApi.getAll().forEach((item) => {
      if (item.data.category) categories.add(item.data.category);
    });
    categories.forEach((category) => {
      urls.push({
        url: buildAbsoluteUrl(baseUrl, pathPrefix, `categories/${encodeURIComponent(String(category))}`),
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.5
      });
    });

    // 添加标签页面
    const tags = new Set();
    collectionApi.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => {
        if (tag !== "post") tags.add(tag);
      });
    });
    tags.forEach((tag) => {
      urls.push({
        url: buildAbsoluteUrl(baseUrl, pathPrefix, `tags/${encodeURIComponent(String(tag))}`),
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.5
      });
    });

    return urls;
  });

  // LQIP 与响应式图片：Nunjucks 异步短代码
  eleventyConfig.addNunjucksAsyncShortcode(
    "image",
    async function (
      src,
      alt = "",
      sizes = "(min-width: 768px) 768px, 100vw",
      loading = "eager",
      fetchpriority = "",
      classNames = "",
      style = ""
    ) {
      // 检查是否是外部图片（img.antares.xin）
      const isExternalImage = src.includes("img.antares.xin");

      // 获取环境变量中的路径前缀
      const pathPrefix = normalizePathPrefix(process.env.ELEVENTY_BASE_URL || "/");

      if (isExternalImage) {
        // 提取路径和文件名
        const url = new URL(src);
        const pathname = url.pathname; // e.g., /atm10air/1.webp
        const dir = pathname.substring(0, pathname.lastIndexOf("/")); // e.g., /atm10air
        const filename = pathname.substring(pathname.lastIndexOf("/") + 1); // e.g., 1.webp
        const name = filename.substring(0, filename.lastIndexOf(".")); // e.g., 1

        // 生成规范化的输出路径
        const outputDir = `_site/img${dir}`; // e.g., _site/img/atm10air
        const urlPath = buildPrefixedPath(pathPrefix, `img${dir}`); // e.g., /livingcoral/img/atm10air

        // 生成LQIP + 原始图片的渐进式加载
        const safeAlt = String(alt || "").replace(/"/g, "&quot;");
        const priorityAttr = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
        const pictureClassAttr = classNames ? ` class="${classNames}"` : "";
        const pictureStyleAttr = style ? ` style="${style}"` : "";

        try {
          const metadata = await Image(src, {
            widths: [24], // 只生成最小的LQIP图片
            formats: ["jpeg"],
            outputDir: outputDir,
            urlPath: urlPath,
            sharpJpegOptions: { quality: 20 }, // 极低质量用于LQIP
            filenameFormat: function (id, src, width, format, options) {
              return `${name}-${width}.${format}`; // e.g., 1-24.jpeg
            },
          });

          const generatedEntries = metadata.jpeg || metadata.jpg || Object.values(metadata)[0];
          const lowsrc = generatedEntries && generatedEntries[0];
          if (!lowsrc) {
            throw new Error("No optimized image output was generated");
          }
          // 生成唯一ID用于JavaScript处理
          const imageId = `progressive-img-${Math.random().toString(36).substr(2, 9)}`;

          return `<picture${pictureClassAttr}${pictureStyleAttr} data-original-src="${src}">
  <img
    id="${imageId}"
    src="${lowsrc.url}"
    width="100%"
    height="100%"
    alt="${safeAlt}"
    loading="${loading}"
    decoding="async"${priorityAttr}
    style="width:100%;height:100%;display:block;object-fit:cover;"
    onload="loadOriginalImage('${imageId}', '${src}')"
  />
</picture>`;
        } catch (e) {
          console.warn(`Failed to optimize external image ${src}: ${e.message}`);
          return `<img src="${src}" alt="${safeAlt}" loading="${loading}" decoding="async"${priorityAttr}${pictureClassAttr}${pictureStyleAttr} style="width:100%;height:100%;display:block;object-fit:cover;" />`;
        }
      } else {
        // 对于本地图片，使用原有的响应式图片处理
        const metadata = await Image(src, {
          widths: [24, 320, 640, 1024, 1600],
          formats: ["webp", "jpeg"],
          outputDir: "_site/img",
          urlPath: buildPrefixedPath(pathPrefix, "img"),
          sharpWebpOptions: { quality: 70 },
          sharpJpegOptions: { quality: 76 },
        });

        const imageFormats = Object.values(metadata);
        const lowsrc = metadata.jpeg ? metadata.jpeg[0] : imageFormats[0][0];
        const highsrc = metadata.jpeg ? metadata.jpeg[metadata.jpeg.length - 1] : imageFormats[0][imageFormats[0].length - 1];

        // 生成 <picture>，使用最小图作为 LQIP，加载后移除模糊
        const sources = imageFormats
          .map((formatEntries) => {
            const type = formatEntries[0].sourceType;
            const srcset = formatEntries.map((e) => e.srcset).join(", ");
            return `  <source type="${type}" srcset="${srcset}" sizes="${sizes}">`;
          })
          .join("\n");

        const safeAlt = String(alt || "").replace(/"/g, "&quot;");
        const priorityAttr = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
        const pictureClassAttr = classNames ? ` class="${classNames}"` : "";
        const pictureStyleAttr = style ? ` style="${style}"` : "";

        return `<picture${pictureClassAttr}${pictureStyleAttr}>\n${sources}\n  <img\n    src="${lowsrc.url}"\n    width="${highsrc.width}"\n    height="${highsrc.height}"\n    alt="${safeAlt}"\n    loading="${loading}"\n    decoding="async"${priorityAttr}\n    onload="this.style.filter='none';this.style.transform='none';"\n  />\n</picture>`;
      }
    }
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: normalizePathPrefix(process.env.ELEVENTY_BASE_URL || "/"),
  };
};


