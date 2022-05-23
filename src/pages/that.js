import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const gridContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 200px)',
  gridGap: '1rem',
  textAlign: 'center',
}

export default function Page() {
  return (
    <Layout className="document-container">
      <SEO
        title="THAT Conference 2022"
        keywords={[`jinaga`, `node`, `typescript`, `javascript`]}
      />
      <div className="document-content">
        <h1>THAT Conference 2022</h1>
        <p>
          Thank you for attending my session at THAT Conference.
          Please share your contact information with me
          so I can connect with you after the conference.
        </p>
        <div style={gridContainer}>
          <a className="try-it" href="https://forms.gle/8hFjvCAht6iwE2FQ9">Contact Form</a>
          <a className="try-it" href="https://jinaga-sharedlist.azurewebsites.net/">Demo</a>
        </div>
      </div>
    </Layout>
  )
}
