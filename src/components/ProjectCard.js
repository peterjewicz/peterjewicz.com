import * as React from "react"
import { Link } from "gatsby"


const ProjectCard = (props) => {
  let {title, description, link, logo, alt, tech} = props;

  const style = alt ? {gridRow: 1, textAlign: "left"} : {textAlign: "right"};


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
        <div style={style}>
          <h2 className="text-secondary text-3xl font-bold pb-5 mt-4">
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
          <div className={`flex pt-2 ${!alt && "justify-end"}`}>
            {
              tech.map(item => {
                return (
                  <p className="px-1">{`${item} |`}</p>
                )
              })
            }
          </div>
          <div className="px-1 pt-1">
           <a target="_blank" className="link" href={link}>View Project</a>
          </div>
        </div>      
      </div>
  )

}

export default ProjectCard
