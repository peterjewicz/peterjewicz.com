import * as React from "react"
import { Link } from "gatsby"

// For if we want to add images to posts
// <div style={{height: "180px", overflow: "hidden"}}>
//   <img src="/images/test.jpg" alt="Blog Image" style={{minHeight: "100%", width: "auto"}} />
// </div>

const BlogCard = (props) => {
  let {post} = props;
  const title = post.frontmatter.title || post.fields.slug

  return (
    <Link to={post.fields.slug} itemProp="url">
      <li className="rounded-lg py-5 my-5 mx-2 ProjectCard relative" key={post.fields.slug}
       style={{boxShadow: "0  5px 10px rgba(154,160,185,0.05), 0 15px 40px rgba(166,173,201,0.2)"}}
       >
        <article
          itemScope
          itemType="http://schema.org/Article"
          style={{minHeight: "204px"}}
        >
          <header style={{minHeight: "70px"}}>
            <h2 className="text-secondary text-xl font-bold pb-5 px-5 text-center">
              <Link to={post.fields.slug} itemProp="url">
                <span itemProp="headline">{title}</span>
              </Link>
            </h2>
          </header>

          <div className="pt-5 px-5 text-center">
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: post.frontmatter.description || post.excerpt,
                }}
                itemProp="description"
              />
            </section>
          </div>
        </article>
      </li>
    </Link>
  )

}

export default BlogCard
