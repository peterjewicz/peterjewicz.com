import * as React from "react"
import { Link } from "gatsby"


const ProjectCard = (props) => {
  let {title, description, link, logo, alt} = props;

  const style = alt ? {gridRow: 1} : {};


  return (
      <div
        className="grid grid-cols-2 gap-4 my-24"
      >
        <div>
          <img
                className="mx-auto"
                src={logo}
                alt={`${title} - Logo`}
                width="100%"
              />
        </div>
        <div className="text-right" style={style}>
          <h2 className="text-primary text-2xl font-bold pb-5 px-5 mt-4">
            <span itemProp="headline">{title}</span>
          </h2>
          <div className="py-4 px-4 bg shadow-lg">
            <p
              dangerouslySetInnerHTML={{
                 __html: description
              }}
              itemProp="description"
            />
          </div>
          <div className="flex justify-end pt-2">
            <p className="px-1">React |</p>
            <p className="px-1">Gatsby |</p>
            <p className="px-1">AWS |</p>
          </div>
          <a target="_blank" className="pt-2 link" href={link}>View Project</a>
        </div>      
      </div>
  )

}

export default ProjectCard
