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
      <div className="relative">
        <div className="text-white flex justify-end flex-col"
             style={{height: "125vh", width: "100%", backgroundImage: `url(${PurpleBg})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}
        >
          <div className="flex justify-center flex-col" style={{height: "60%"}}>
            <div className="pb-8 well-met-text px-4"
            >
              <h2 className="text-8xl pb-4 extraBold">Hail and Well Met</h2>
              <div className="max-w-lg">
                <p>
                  Since my first wordpress site over a decade ago I've been obsessed with growing as a developer. Since then I've
                  worked on a wide range of projects and used a variety of languages and technology. I love developing, and
                  I'm always excited to jump into a new project and learn new things.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="py-28 text-center max-w-5xl mx-auto">
        <h2 className="text-8xl text-secondary pb-16 extraBold">From The Blog</h2>
        <ol className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" style={{ listStyle: `none` }}>
          {posts.map((post) => <BlogCard post={post} />)}
        </ol>
        <Link to={"/blog"} itemProp="url">
          <button className="border-2 text-2xl border-primary rounded-lg py-1 px-8 text-primary transition-all hover:text-white hover:bg-primary">View All</button>
        </Link>
      </div>

      <div className="py-28 px-4">
        <div className="max-w-2xl pb-16 text-center mx-auto">
          <h2 className="text-8xl pb-4 text-primary extraBold">Past Projects</h2>
          <p>A small sample of what I've worked on in the past.</p>
        </div>
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-8" style={{ listStyle: `none` }}>
          <ProjectCard
            title="The Indoor Gardens"
            description="Gatsby built static blog detailing indoor gardening."
            link="https://www.theindoorgardens.com"
            logo="https://www.theindoorgardens.com/static/logo-c1ee43d0badccb4f1b6dba00fb295c3b.webp"
          />
          <ProjectCard
            title="Simple Lead Tracker"
            description="Simple to use CMS built for small bussiness and freelancers."
            link="https://www.simpleleadtracker.com"
            logo="https://www.simpleleadtracker.com/images/mockup.png"
          />
          <ProjectCard
            title="Dungeon Maker"
            description="Dungeon building app for tabletop games and RPGs."
            link="https://apps.apple.com/us/app/dungeon-maker/id1497835992"
            logo="https://is5-ssl.mzstatic.com/image/thumb/Purple125/v4/1b/3b/67/1b3b670a-bccb-be03-5707-909f246b585f/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp"
            square={true}
          />
          <ProjectCard
            title="City Encounters"
            description="Random city encounters perfect for any fantasy tabletop RPG."
            link="https://apps.apple.com/us/app/city-encounters/id1583857845"
            logo="https://is2-ssl.mzstatic.com/image/thumb/Purple116/v4/1b/3a/cb/1b3acb5b-493a-f500-c58b-203061ff82b2/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp"
            square={true}
          />
          <ProjectCard
            title="Narrative Planner"
            description="Fully collaborative branching story telling software."
            link="https://www.narrativeplanner.com"
            logo="https://www.narrativeplanner.com/images/demo.jpg"
          />
          <ProjectCard
            title="The Pixel Artist"
            description="Create pixel masterpieces on your IOS device."
            link="https://apps.apple.com/us/app/the-pixel-artist/id1450760514"
            logo="https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/96/fd/b0/96fdb007-b780-2de7-ec95-af71559d6374/AppIcon-1x_U007emarketing-85-220-0-8.png/230x0w.webp"
            square={true}
          />
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
