import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

export default function Page() {
  setTimeout(() => {
    window.location.href = "https://forms.gle/8hFjvCAht6iwE2FQ9";
  }, 500);
  
  return (
    <Layout className="document-container">
      <SEO title="THAT Conference 2022" keywords={[`jinaga`, `node`, `typescript`, `javascript`]} />
      <div className="document-content">
        <h1>THAT Conference 2022</h1>
        <p>
            Thank you for attending my session at THAT Conference.
            Please <a href="https://forms.gle/8hFjvCAht6iwE2FQ9">share your contact information</a> with me so I can connect
            with you after the conference.
        </p>
      </div>
    </Layout>
  );
}
