const MarkdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownHSections = require("markdown-it-header-sections");
const emoji = require("markdown-it-emoji");
const hljs = require("./highlight.js"); // https://highlightjs.org

const fs = require("fs");
const MD = new MarkdownIt({
  html: true,
  langPrefix: "language-",
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ""; // use external default escaping
  },
});
MD.use(markdownItAttrs).use(markdownHSections).use(emoji);

const md = fs.readFileSync("../README.md", { encoding: "utf8" });
const body = MD.render(md);

const template = fs.readFileSync("./template.html", { encoding: "utf8" });
const html = template.replace("{body}", body);
fs.writeFileSync("./www/index.html", html);
