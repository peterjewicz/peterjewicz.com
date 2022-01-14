import * as React from "react"
import { Link } from "gatsby"

import Bg from "../images/bg.png"

const Hero = () => {
  // <div
  //   className="absolute h-screen bg-contain w-full h-full bg-no-repeat z-0"
  //   style={{backgroundImage: `url('${Bg}')`,}}
  // >
  // </div>
// overflow-hidden
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="relative z-10 text-center max-w-2xl pb-4  border-b-2 border-secondary">
        <h1 className="text-5xl">Hi! I'm Peter Jewicz</h1>
        <p className="text-xl">I'm a full stack engineer with a passion for programming. Currently working working with Clojure
        and functional development</p>
      </div>
    </div>
  )

}

export default Hero
