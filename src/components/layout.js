import * as React from "react"
import { Link } from "gatsby"

import "@fontsource/open-sans/300.css"
import "@fontsource/lato/"
import "@fontsource/pt-sans/700.css"
import "@fontsource/lato/900.css"

import LOGO from '../images/logo.png';
import LOGO_INVERSE from '../images/logo-inverse.png';

const Layout = ({ location, title, filledHeader, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const logoUrl = filledHeader ? LOGO_INVERSE : LOGO;


  return (
    <div className="global-wrapper relative" data-is-root-path={isRootPath}>
      <div className={`absolute px-4 z-10 w-full ${filledHeader ? "bg-tetriary" : null}`}>
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <div>
            <Link className="header-link-home" to="/">
              <img src={logoUrl} width="240px" alt="Peterjewicz.com Logo" />
            </Link>
          </div>
          <ul className="flex text-2xl font-bold py-4 justify-end">
            <li className={`hover:text-primary transition ${filledHeader ? "text-white hover:text-black" : null}`}>
              <Link className="header-link-home" to="/">
                Home
              </Link>
            </li>
            <li className={`hover:text-primary transition ${filledHeader ? "text-white hover:text-black" : null}`}>
              <Link className="header-link-home" to="/blog">
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <main>{children}</main>
      <footer className="text-center pb-2">
        © {new Date().getFullYear()}, Peter Jewicz
      </footer>
    </div>
  )
}

export default Layout
