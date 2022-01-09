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
    <div className="global-wrapper relative" data-is-root-path={isRootPath}>
      <div className="absolute px-4 z-10 w-full bg-primary text-white">
        <ul className="flex justify-end mx-auto max-w-6xl text-lg py-4">
          <li className="hover:text-primary transition">
            <Link className="header-link-home" to="/">
              Home
            </Link>
          </li>
          <li className="hover:text-primary transition">
            <Link className="header-link-home" to="/blog">
              Blog
            </Link>
          </li>
        </ul>
      </div>
      <main>{children}</main>
      <footer className="text-center pb-2">
        © {new Date().getFullYear()}, Peter Jewicz
      </footer>
    </div>
  )
}

export default Layout
