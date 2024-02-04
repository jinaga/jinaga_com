import PropTypes from 'prop-types'
import React from 'react'
import '../stylesheets/main.scss'
import Header from './header'
import Footer from './footer'

const Layout = ({ className, children, head }) => (
  <>
    <div className={`index-head-container`}>
      <Header />
      {head}
    </div>
    <div className={className}>{children}</div>
    <Footer />
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
