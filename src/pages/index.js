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


import PurpleBg from "../images/purple-bg.png"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes.slice(0, 3);
  //
  // console.log(posts)
  // Add social links to the about section you asshole

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Peter Jewicz | Full Stack Engineer" />
      <Hero />
      <div className="text-center py-28 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-6xl pb-6 text-tetriary">Hail and Well Met!</h2>
          <p className="text-xl pt-8 max-w-3xl mx-auto">
            Since my first Wordpress site over a decade ago I've worked with a huge range of technologies in everything from finance to healthcare. 
            I'm now a full-stack engineer with a special interest in Clojure/Clojurescript and building games.
            I'm always interested in hearing about new and exciting projects, say hi!
          </p>
        </div>
      </div>

      <div className="py-28 max-w-5xl mx-auto styled-bg" >
        <h2 className="text-6xl md:text-6xl pb-16 text-center extraBold">From The Blog</h2>
        <ol className="max-w-2xl mx-auto" style={{ listStyle: `none` }}>
          {posts.map((post) => <BlogCard post={post} />)}
        </ol>
        <Link to={"/blog"} itemProp="url">
          <button className="flex mx-auto border-2 text-2xl border-primary rounded-lg py-1 px-8 text-primary transition-all hover:text-white hover:bg-primary">View All</button>
        </Link>
      </div>

      <div className="py-28 mb-16 mx-auto max-w-6xl px-4">
        <div className="max-w-2xl pb-16 text-center mx-auto"
        >
          <h2 className="text-6xl md:text-6xl pb-4 extraBold">Past Projects</h2>
          <p>A small sample of what I've worked on in the past.</p>
        </div>
        <div style={{ listStyle: `none` }}>
          <ProjectCard
            title="Simple Lead Tracker"
            description="Simple to use CMS built for small bussiness and freelancers."
            link="https://www.simpleleadtracker.com"
            logo="https://www.simpleleadtracker.com/images/mockup.png"
            alt={true}
            tech={["PHP", "Laravel", "Vue"]}
          />
          <ProjectCard
            title="Dungeon Maker"
            description="Dungeon building app for tabletop games and RPGs."
            link="https://apps.apple.com/us/app/dungeon-maker/id1497835992"
            logo="/images/projects/dungeon-maker.jpg"
            tech={["Clojure", "CLJS", "Cordova"]}
          />
          <ProjectCard
            title="City Encounters"
            description="Random city encounters perfect for any fantasy tabletop RPG."
            link="https://apps.apple.com/us/app/city-encounters/id1583857845"
            logo="https://is2-ssl.mzstatic.com/image/thumb/Purple116/v4/1b/3a/cb/1b3acb5b-493a-f500-c58b-203061ff82b2/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp"
            alt={true}
            tech={["Clojure", "CLJS", "Tailwind"]}
          />
          <ProjectCard
            title="Narrative Planner"
            description="Fully collaborative branching story telling software."
            link="https://www.narrativeplanner.com"
            logo="https://www.narrativeplanner.com/images/demo.jpg"
            tech={["Clojure", "CLJS", "Reagent"]}
          />
          <ProjectCard
            title="The Pixel Artist"
            description="Create pixel masterpieces on your IOS device."
            link="https://apps.apple.com/us/app/the-pixel-artist/id1450760514"
            logo="https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/96/fd/b0/96fdb007-b780-2de7-ec95-af71559d6374/AppIcon-1x_U007emarketing-85-220-0-8.png/230x0w.webp"
            alt={true}
            tech={["Javascript", "Cordova"]}
          />
        </div>

      </div>

      <div className="text-center py-28 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-6xl">Get In Touch.</h2>
          <p className="pb-6">Have a project, a question, or just want to chat? Reach out and I'll get back to you.</p>
          <a href="mailto:peterjewicz@totalwebconnections">
            <button className="border-2 text-2xl border-white rounded-lg py-1 px-8 text-white transition-all hover:text-secondary hover:bg-white">Contact</button>
          </a>
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
