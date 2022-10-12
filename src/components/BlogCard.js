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
      <li className="BlogCard max-w-lg  py-6 px-4 my-5 mx-auto rounded-lg relative transition-all" key={post.fields.slug}
       >
        <article
          itemScope
          itemType="http://schema.org/Article"
        >
          <header>
            <h2 className="text-secondary text-xl font-bold">
              <span itemProp="headline">{title}</span>
            </h2>
            <span className="mb-4 block">{post.frontmatter.date}</span>
          </header>

          <div>
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
