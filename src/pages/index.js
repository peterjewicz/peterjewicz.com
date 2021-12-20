import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Hero from "../components/Hero"
import Seo from "../components/seo"
import BlogCard from "../components/BlogCard"

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
  const posts = data.allMarkdownRemark.nodes.slice(0, 3);

  console.log(posts)
  // Add social links to the about section you asshole

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Peter Jewicz | Full Stack Engineer" />
      <Hero />
      <div className="bg-primary py-28">
        <div className="max-w-2xl text-center mx-auto text-white">
          <h2 className="text-4xl">Hail and Well Met</h2>
          <p>
            Loremum ipsum sd aow eiryt larary psose itsan
            Loremum ipsum sd aow eiryt larary psose itsan Loremum ipsum sd aow eiryt larary psose itsan
            Loremum ipsum sd aow eiryt larary psose itsan Loremum ipsum sd aow eiryt larary psose itsan Loremum ipsum sd aow eiryt larary psose itsan
            Loremum ipsum sd aow eiryt larary psose itsan Loremum ipsum sd aow eiryt larary psose itsan
          </p>
        </div>
      </div>
      <div className="py-28 text-center max-w-5xl mx-auto">
        <h2 className="text-4xl">From The Blog</h2>
        <ol className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" style={{ listStyle: `none` }}>
          {posts.map((post) => <BlogCard post={post} />)}
        </ol>
      </div>
      <div className="py-28 text-center  mx-auto relative">
        <div
          className="absolute bg-primary w-full"
          style={{height: "1000px", zIndex: -2, background: 'linear-gradient(180deg, rgba(16,118,161,1) 0%, rgba(16,118,161,1) 47%, rgba(255,255,255,1) 100%)'}}
        >
        </div>
        <h2 className="text-4xl">My Startups</h2>
        <p>
          Always busy, over the years I've worked on a number of startup projects. Below, find
          the ones still kicking and see where I've worked.
        </p>
      </div>
      <div className="py-28 px-4">
        <h1 className="text-4xl">Total Web Connections</h1>
        <p>Software development company. Currently working on a mix of client and internal projects.</p>
        <a href="#"><button>Visit</button></a>
      </div>
      <div className="py-28 px-4">
        <h1 className="text-4xl">Mellow Golem Games</h1>
        <p>Game development and related content. Currently working on RPG games.</p>
        <a href="#"><button>Visit</button></a>
      </div>
      <div className="py-28 px-4">
        <h1 className="text-4xl">Nitor Fitness</h1>
        <p>Fitness software offering customized workouts tailored to individuals.</p>
        <a href="#"><button>Visit</button></a>
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
