import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Hero from "../components/Hero"
import Seo from "../components/seo"
import BlogCard from "../components/BlogCard"
import ProjectCard from "../components/ProjectCard"

import Totalwebconnections from "../images/totalwebconnections.png"
import Mellowgolemgames from "../images/mellowgolemgames.png"
import NitorFitness from "../images/nitorfitness.png"


const popularPostSlgus = ["/starting-with-clojures-threading-macros/", "/building-a-chat-application-with-clojure/", "/clojurescript-perlin-noise-tilemap/"]

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  const popularPosts = posts.filter(post => popularPostSlgus.includes(post.fields.slug));

  console.log(popularPosts)

  return (
    <Layout location={location} title={siteTitle} filledHeader={true}>
      <Seo title="Peter Jewicz | Blog" />
      <div className="px-8 py-28">
        <div className="sm:flex">
          <div className="sm:w-3/4">
            <h2 className="text-4xl">Recent Blog Posts</h2>
            <ol className="grid xs:grid-cols-1 sm:grid-cols-2 gap-3" style={{ listStyle: `none` }}>
              {posts.map((post) => <BlogCard post={post} />)}
            </ol>
          </div>
          <div className="sm:w-1/4 sm:pl-4 py-8">
            <div className="bg-white shadow-lg rounded-lg px-2 py-2">
              <h3 className="text-2xl">Popular Posts</h3>
              {popularPosts.map((post) => {
                return (
                  <Link to={post.fields.slug} itemProp="url">
                    <div className="py-3 text-black hover:text-secondary">
                      <h4>{ post.frontmatter.title }</h4>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
