import * as React from "react"
import { Link } from "gatsby"


const BlogCard = (props) => {
  let {post} = props;
  const title = post.frontmatter.title || post.fields.slug

  return (
    <Link to={post.fields.slug} itemProp="url">
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

          <div className="pt-5 px-5">
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
