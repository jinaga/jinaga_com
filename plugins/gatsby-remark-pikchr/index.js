// Adapted from the official Gatsby plugin "gatsby-remark-graphviz"

const visit = require(`unist-util-visit`)
const pikchr = require('pikchr')
const cheerio = require(`cheerio`)

const validLanguages = [`pikchr`]

module.exports = async ({ markdownAST }, pluginOptions = {}) => {
  let codeNodes = []

  visit(markdownAST, `code`, (node) => {
    const chunks = (node.lang || ``).match(/^(\S+)(\s+(.+))?/)

    if (!chunks || !chunks.length) {
      return node
    }

    const lang = chunks[1]
    const attrString = chunks[3]

    if (validLanguages.includes(lang)) {
      node.lang = lang
      codeNodes.push({ node, attrString: attrString })
    }
    return node
  })

  await Promise.all(
    codeNodes.map(async ({ node, attrString }) => {
      const { value, lang } = node

      try {
        // Perform actual render
        const svgString = pikchr.pikchr(value) 

        // Add default inline styling
        const $ = cheerio.load(svgString)
        $(`svg`).attr(`style`, `max-width: 100%; height: auto;`)

        // Merge custom attributes if provided by user (adds and overwrites)
        if (attrString) {
          const attrElement = cheerio.load(`<element ${attrString}></element>`)
          $(`svg`).attr(attrElement(`element`).attr())
        }

        // Mutate the current node. Converting from a code block to
        // HTML (with svg content)
        node.type = `html`
        node.value = $.html(`svg`)
      } catch (error) {
        console.log(
          `Error during pikchr conversion. Leaving code block unchanged`
        )
        console.log(error)
      }

      return node
    })
  )
}
