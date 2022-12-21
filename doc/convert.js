const MarkdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownHSections = require("markdown-it-header-sections");
const emoji = require("markdown-it-emoji");
const hljs = require("highlight.js"); // https://highlightjs.org

hljs.registerLanguage(
  "javascript",
  require("highlight.js/lib/languages/javascript")
);
hljs.registerLanguage(
  "typescript",
  require("highlight.js/lib/languages/typescript")
);

const fs = require("fs");
const MD = new MarkdownIt({
  html: true,
  langPrefix: "language-",
  highlight: function (str, lang) {
    console.log("HELLO", lang, hljs.getLanguage(lang));
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs language-' +
          lang +
          '"><code>' +
          hljs.highlight(str, { language: lang }).value +
          "</code></pre>"
        );
      } catch (error) {
        console.log(error);
      }
    }

    return (
      '<pre class="hljs"><code>' + MD.utils.escapeHtml(str) + "</code></pre>"
    );
  },
});
MD.use(markdownItAttrs).use(markdownHSections).use(emoji);

const md = fs.readFileSync("../README.md", { encoding: "utf8" });
const body = MD.render(md);

const template = fs.readFileSync("./template.html", { encoding: "utf8" });
const newhtml = template.replace("{body}", body);
fs.writeFileSync("./www/index.html", newhtml);
