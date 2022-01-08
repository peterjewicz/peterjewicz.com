import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Hero from "../components/Hero"
import Seo from "../components/seo"
import BlogCard from "../components/BlogCard"

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
          style={{height: "1200px", zIndex: -2, background: 'linear-gradient(180deg, rgba(16,118,161,1) 0%, rgba(16,118,161,1) 47%, rgba(255,255,255,1) 100%)'}}
        >
        </div>
        <div className="text-white pt-28 max-w-2xl mx-auto">
          <h2 className="text-4xl">Startups</h2>
          <p>
            Always busy, over the years I've worked on a number of startup projects. Below, find
            the ones still kicking and see where I've worked.
          </p>
        </div>
      </div>
      <div className="py-28 px-4 md:flex max-w-5xl mx-auto">
        <div className="px-2 text-center md:text-left text-white">
          <h3 className="text-4xl">Total Web Connections</h3>
          <p className="mb-8">Software development company. Currently working on a mix of client and internal projects.</p>
          <div  className="mb-16">
            <a href="#"><button>Visit</button></a>
          </div>
        </div>
        <div className="px-2">
          <img className="mx-auto" src={Totalwebconnections} width="640px" alt="Total Web Connections" />
        </div>
      </div>
      <div className="py-28 px-4 flex flex-col-reverse md:flex-row max-w-5xl mx-auto">
        <div className="px-2">
          <img className="mx-auto" src={Mellowgolemgames} width="340px" alt="Mellow Golem Games" />
        </div>
        <div className="px-2 text-center md:text-right">
          <h3 className="text-4xl">Mellow Golem Games</h3>
          <p className="mb-8">Game development and related content. Currently working on RPG games.</p>
          <div  className="mb-16">
            <a href="#"><button>Visit</button></a>
          </div>
        </div>
      </div>
      <div className="py-28 px-4 md:flex max-w-5xl mx-auto border-b-2 border-primary">
        <div className="px-2 text-center md:text-left">
          <h3 className="text-4xl">Nitor Fitness</h3>
          <p className="mb-8">Fitness software offering customized workouts tailored to individuals.</p>
          <div  className="mb-16">
            <a href="#"><button>Visit</button></a>
          </div>
        </div>
        <div className="px-2">
          <img className="mx-auto" src={NitorFitness} width="340px" alt="Total Web Connections" />
        </div>
      </div>

      <div className="py-28 px-4">
        <div className="max-w-2xl text-center mx-auto">
          <h2 className="text-4xl">Past Projects</h2>
          <p>A small sample of what I've worked on in the past.</p>
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
