import * as React from "react"
import { Link } from "gatsby"

import Bg from "../images/bg.png"

const Hero = () => {
  return (
    <div className="relative m-auto max-w-7xl px-12"
         style={{height: "80vh"}}
    >
      <div className="flex h-screen justify-center flex-col">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-6xl">Hi!</h2>
          <h1 className="text-4xl md:text-6xl"> I'm <span className="text-primary">Peter Jewicz</span></h1>
          <p className="pt-6 md:pt-0 text-xl">I'm a full stack engineer building cool stuff with Clojure and others.</p>
        </div>
      </div>
    </div>
  )

}

export default Hero
