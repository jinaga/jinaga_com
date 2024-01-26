import { graphql, Link, StaticQuery } from 'gatsby'
import React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import siteLogo from '../images/site-logo.png'
import good from '../images/good.png'
import bad from '../images/bad.png'

const IndexPage = () => (
  <Layout
    className="body-container"
    head={
      <div className="hero">
        <img src={siteLogo} alt="Jinaga" />
        <p>Application-agnostic back end for web and mobile applications.</p>
      </div>
    }
  >
    <Seo
      title="Jinaga"
      keywords={[`jinaga`, `node`, `typescript`, `javascript`]}
    />
    <div>
      <img src={bad} alt="Typically, all layers of an app are custom." />
      <img
        style={{ float: 'right' }}
        src={good}
        alt="In Jinaga, only the front end is."
      />
    </div>
    <h2>Build Apps Faster</h2>
    <p>
      Typical web and mobile app architectures build domain knowledge into custom database
      schemas, APIs, and front ends. That means you have to write the same idea
      in three different ways. That slows you down.
    </p>
    <p>
      Write your domain logic once. Jinaga provides an application-agnostic API
      and database.
    </p>
    <Link
      className="cta"
      style={{ border: 'none' }}
      to={'/documents/concepts/'}
    >
      <div className="button-container">Learn the concepts</div>
    </Link>
    <StaticQuery
      query={graphql`
        query IndexQuery {
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
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      )}
    ></StaticQuery>
  </Layout>
)

export default IndexPage
