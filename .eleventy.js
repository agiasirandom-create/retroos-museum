module.exports = function(eleventyConfig) {
  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Watch targets
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  // Collections
  // OS collection - all OS pages in /os directory
  eleventyConfig.addCollection("operatingSystems", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/os/**/*.md");
  });

  // Browser compression for better performance
  eleventyConfig.setBrowserSyncConfig({
    ui: false,
    ghostMode: false
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
