import * as React from "react"
import { Link } from "gatsby"

import "@fontsource/open-sans/300.css"
import "@fontsource/lato"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <main>{children}</main>
      <footer className="text-center pb-2">
        © {new Date().getFullYear()}, Peter Jewicz
      </footer>
    </div>
  )
}

export default Layout
