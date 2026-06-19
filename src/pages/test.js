import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import BlogCard from "../components/BlogCard"

const TestPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const [inAnimation, setInAnimation] = React.useState(false)

  const generateParticles = () => {
    const particles = []
    for (let x = -10; x < 100; x++) {
      particles.push(
        <div
          className="particle"
          style={{
            left: `${x * 7}px`,
            animationDelay: `${1 * (Math.random(100) + 1)}s`,
          }}
        ></div>
      )
    }

    return particles
  }

  const startEffect = () => {
    setInAnimation(true)
  }

  return (
    <Layout location={location} title={siteTitle} filledHeader={true}>
      <Seo title="Peter Jewicz | Blog" />
      <div className="px-8 py-28">
        <h1>Test Page</h1>
        <div
          className={`relative transition-all duration-700 ${
            inAnimation && "slideup"
          }`}
          style={{ height: "460px", overflow: "hidden" }}
        >
          <img src="/images/tavern.jpg" />

          <div
            className="absolute fire  left-0"
            style={{ height: "300px", width: "500px", bottom: "-75px" }}
          >
            {inAnimation && generateParticles()}
          </div>
        </div>
        <button className="mt-4" onClick={startEffect}>
          Start Effect
        </button>
      </div>
    </Layout>
  )
}

export default TestPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
