import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration — Skripsi Wiki (W2VPred-MAP)
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Skripsi Wiki",
    pageTitleSuffix: " — W2VPred-MAP",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "id-ID",
    baseUrl: "skripsi-wiki.netlify.app",
    ignorePatterns: [".obsidian", "templates", "private"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Literata",
        body: "Source Serif 4",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#fefcf5",
          lightgray: "#ece8dd",
          gray: "#b8b3a6",
          darkgray: "#4a4540",
          dark: "#2c2824",
          secondary: "#6b4f3c",
          tertiary: "#9a8a7a",
          highlight: "rgba(143, 120, 90, 0.10)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#1a1a1e",
          lightgray: "#2d2d34",
          gray: "#595966",
          darkgray: "#cdcdd4",
          dark: "#e8e8ed",
          secondary: "#a0907a",
          tertiary: "#7a8a6a",
          highlight: "rgba(160, 144, 122, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Plugin.CustomOgImages(),  // disabled for faster build
    ],
  },
}

export default config
