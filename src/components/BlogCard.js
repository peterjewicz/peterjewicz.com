import * as React from "react"
import { Link } from "gatsby"


const BlogCard = (props) => {
  let {post} = props;
  const title = post.frontmatter.title || post.fields.slug

  return (
    <li className="bg-white shadow-lg rounded-lg py-5 my-5 mx-2" key={post.fields.slug}>
      <article
        itemScope
        itemType="http://schema.org/Article"
      >
        <header style={{minHeight: "70px"}}>
          <h2 className="text-secondary text-xl font-bold pb-5 px-5 text-center">
            <Link to={post.fields.slug} itemProp="url">
              <span itemProp="headline">{title}</span>
            </Link>
          </h2>
        </header>
        <div
          style={{width: "100%",
                  height: "240px",
                  overflow: "hidden",
                  backgroundImage: `url('/images/posts/${post.frontmatter.thumbnail}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}>
        </div>
        <div className="pt-5 px-5">
          <section>
            <p
              dangerouslySetInnerHTML={{
                __html: post.frontmatter.description || post.excerpt,
              }}
              itemProp="description"
            />
          </section>
          <section className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 pt-8">
            <Link to={post.fields.slug} itemProp="url">
              Read More
            </Link>
          </section>
        </div>
      </article>
    </li>
  )

}

export default BlogCard
