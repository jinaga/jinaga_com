
import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

const HookContent = () => (
  <StaticQuery
    query={graphql`
      query HookContentQuery {
        content: markdownRemark(
          fields: { slug: { eq: "/posts/hook/" } }
        ) {
          html
        }
      }
    `}
    render={({ content }) => (
      <div
        className="page-content"
        dangerouslySetInnerHTML={{ __html: content.html }} />
    )}
  />
);

export default HookContent;