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

// <ol style={{ listStyle: `none` }}>
//   {posts.map(post => {
//     const title = post.frontmatter.title || post.fields.slug
//
//     return (
//       <li key={post.fields.slug}>
//         <article
//           className="post-list-item"
//           itemScope
//           itemType="http://schema.org/Article"
//         >
//           <header>
//             <h2>
//               <Link to={post.fields.slug} itemProp="url">
//                 <span itemProp="headline">{title}</span>
//               </Link>
//             </h2>
//             <small>{post.frontmatter.date}</small>
//           </header>
//           <section>
//             <p
//               dangerouslySetInnerHTML={{
//                 __html: post.frontmatter.description || post.excerpt,
//               }}
//               itemProp="description"
//             />
//           </section>
//         </article>
//       </li>
//     )
//   })}
// </ol>

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Peter Jewicz | Blog" />
      <div className="px-8 py-28">
        <h1 className="text-4xl">Blog</h1>
        <ol className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" style={{ listStyle: `none` }}>
          {posts.map((post) => <BlogCard post={post} />)}
        </ol>
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
