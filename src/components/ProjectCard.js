import * as React from "react"
import { Link } from "gatsby"


const ProjectCard = (props) => {
  let {title, description, link, logo, square} = props;


  return (
    <a href={link} target="_blank">
      <div
        className="ProjectCard bg-white shadow-lg rounded-lg py-5 my-5 mx-2 text-center relative"
      >
        <article
          itemScope
          itemType="http://schema.org/Article"
        >
          <header>
            <img
              className="mx-auto"
              src={logo}
              alt={`${title} - Logo`}
              width="85%"
              style={{maxWidth: square ? "50px" : "120px"}}
            />
            <h2 className="text-secondary text-xl font-bold pb-5 px-5 mt-4 text-center">
              <span itemProp="headline">{title}</span>
            </h2>
          </header>

          <div className="pt-5 px-5">
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: description
                }}
                itemProp="description"
              />
            </section>
          </div>
        </article>
      </div>
    </a>
  )

}

export default ProjectCard