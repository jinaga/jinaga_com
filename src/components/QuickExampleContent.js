
import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

const QuickExampleContent = () => (
  <StaticQuery
    query={graphql`
      query QuickExampleContentQuery {
        content: markdownRemark(
          fields: { slug: { eq: "/posts/quick-example/" } }
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

export default QuickExampleContent;