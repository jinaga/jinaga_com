module.exports = {
  siteMetadata: {
    title: "Jinaga",
    description: "Resilient, reliable, and connected web applications.",
    author: "Michael L Perry",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images",
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Jinaga",
        short_name: "Jinaga",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/jinaga-icon.png", // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: "./src/content/"
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "examples",
        path: "./src/examples/",
        ignore: [
          "**/*\.json"
        ]
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "jinaga",
        path: "./node_modules/jinaga/dist/",
        ignore: [
          "**/*\.js",
          "**/*\.map",
        ]
      }
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 590
            }
          },
          "gatsby-remark-pikchr",
          "mlp-remark-graphviz",
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              noInlineHighlight: true,
              languageExtensions: [
                {
                  language: 'specification',
                  definition: {
                    string: {
                      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
                      lookbehind: true,
                      greedy: true
                    },
                    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
                    boolean: /\b(?:false|true)\b/,
                    "class-name": {
                      pattern: /([:]\s*)[A-Z_][A-Z0-9_.]*/i,
                      lookbehind: true
                    },
                    function: {
                      pattern: /(->\s*)[A-Z_][A-Z0-9_]*/i,
                      lookbehind: true
                    },
                    property: {
                      pattern: /([.]\s*)[A-Z_][A-Z0-9_]*/i,
                      lookbehind: true
                    },
                    keyword: /\b(let)\b/,
                    operator: /(->|=>|\#|=|\.|!|\bE\b)/,
                    punctuation: /[()\[\]{}:]/,
                    variable: /[A-Z_][A-Z0-9_]*/i
                  }
                }
              ]
            }
          },
          "gatsby-remark-copy-linked-files"
        ]
      }
    },
    {
      resolve: "gatsby-transformer-code",
      options: {
        name: "jinaga",
        extensions: [ "ts" ]
      }
    },
    {
      resolve: "gatsby-transformer-code",
      options: {
        name: "examples",
        extensions: [ "ts" ]
      }
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
        "G-QFRCB0PBTS",
        ],
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true
        },
      },
    },
  ],
}
