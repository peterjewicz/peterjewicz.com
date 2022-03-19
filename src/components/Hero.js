import * as React from "react"
import { Link } from "gatsby"

import Bg from "../images/bg.png"

const Hero = () => {
  return (
    <div className="relative"
         style={{height: "90vh"}}
    >
      <div className="flex h-screen items-center justify-center flex-col">
        <div
          className="text-black px-8 py-8 relative z-10 text-center max-w-2xl shadow-xl border-4 border-secondary rounded-lg"
          style={{background: "white"}}
        >
          <h1 className="text-5xl">Hi! I'm Peter Jewicz</h1>
          <p className="text-xl">I'm a full stack engineer with a passion for programming.</p>
        </div>
      </div>
    </div>
  )

}

export default Hero
