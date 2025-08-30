const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
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
    collectionApi.getFilteredByGlob("src/blog/*.md").forEach((item) => {
      if (item.data.category) catSet.add(item.data.category);
    });
    return [...catSet].sort();
  });

  // 站点地图集合
  eleventyConfig.addCollection("sitemap", (collectionApi) => {
    const baseUrl = "https://www.antares.xin";
    const pathPrefix = process.env.ELEVENTY_BASE_URL || "/";
    
    const urls = [
      {
        url: `${baseUrl}${pathPrefix}`,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 1.0
      },
      {
        url: `${baseUrl}${pathPrefix}about/`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8
      },
      {
        url: `${baseUrl}${pathPrefix}blog/`,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 0.9
      },
      {
        url: `${baseUrl}${pathPrefix}categories/`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7
      },
      {
        url: `${baseUrl}${pathPrefix}tags/`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7
      }
    ];

    // 添加博客文章
    collectionApi.getFilteredByGlob("src/blog/*.md").forEach((item) => {
      urls.push({
        url: `${baseUrl}${pathPrefix}blog/${item.fileSlug}/`,
        lastmod: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.6
      });
    });

    // 添加分类页面
    const categories = new Set();
    collectionApi.getFilteredByGlob("src/blog/*.md").forEach((item) => {
      if (item.data.category) categories.add(item.data.category);
    });
    categories.forEach((category) => {
      urls.push({
        url: `${baseUrl}${pathPrefix}categories/${category}/`,
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
        url: `${baseUrl}${pathPrefix}tags/${tag}/`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.5
      });
    });

    return urls;
  });

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
    pathPrefix: process.env.ELEVENTY_BASE_URL || "/",
  };
};


