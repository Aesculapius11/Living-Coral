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


