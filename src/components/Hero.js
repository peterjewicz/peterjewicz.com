import * as React from "react"
import { Link } from "gatsby"

import Bg from "../images/bg.png"

const Hero = () => {
  return (
    <div className="relative m-auto max-w-7xl px-12">
      <div className="flex h-screen justify-center flex-col">
        <div className="text-center text-center">
          <h2 className="text-5xl md:text-8xl lessBold">Hi!</h2>
          <h1 className="text-5xl md:text-8xl lessBold"> I'm <span className="text-primary extraBold">Peter Jewicz</span></h1>
          <p className="pt-6 md:pt-0 text-xl">I'm a full stack engineer building cool stuff with Clojure, React and more.</p>
          <p className="pt-6 md:pt-0 text-xl">Check out my latest projects over at <a className="text-primary link" href="https://www.mellowgolemgames.com" target="_blank">Mellow Golem Games</a>.</p>
        </div>
      </div>
    </div>
  )

}

export default Hero
