import { Link } from 'gatsby'
import React, { useState } from 'react'
import HookContent from '../components/HookContent'
import Layout from '../components/layout'
import QuickExampleContent from '../components/QuickExampleContent'
import Seo from '../components/seo'
import siteLogo from '../images/site-logo.png'

const IndexPage = () => {
  // Make the drop-down menu visible when the user clicks the current language.
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLanguageSelect = () => {
    window.location.href = 'https://jinaga.net';
  };

  return (
    <Layout
      className="body-container"
      head={<div className="hero">
        <img src={siteLogo} alt="Jinaga" />
        <p>Local-first web and mobile application framework</p>
        <div className="language-container">
          <p>Choose your language:
            <button className="language" onClick={() => setMenuVisible(!menuVisible)}>
              TypeScript▾
            </button>
            <div className={`language-menu ${menuVisible ? 'visible' : ''}`}>
              <button className="language" onClick={handleLanguageSelect}>
                .NET
              </button>
            </div>
          </p>
        </div>
      </div>}
    >
      <Seo
        title="Jinaga"
        keywords={[`jinaga`, `node`, `typescript`, `javascript`]} />
      <HookContent />
      <Link
        className="cta"
        style={{ border: 'none' }}
        to={'/documents/concepts/'}
      >
        <div className="button-container">Learn the concepts</div>
      </Link>
      <QuickExampleContent />
    </Layout>
  )
}

export default IndexPage
