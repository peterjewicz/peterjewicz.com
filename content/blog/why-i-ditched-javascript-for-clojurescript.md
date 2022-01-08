---
title: Why I Ditched Javascript for Clojure(script)
date: "2019-10-13T22:12:03.284Z"
description: "Reasons why I moved from Javascript for Clojurescript"
---


Over the passed year or so I’ve almost exclusively used Clojurescript in places where I have the choice. I still use Javascript in my day to day work, but If I could I’d replace that all with Clojurescript. I get asked, usually from Javascript developers, why I’ve switched over to Clojurescript when Javascript can do just as much. I’ve been able to sum up my thoughts with a couple of key points, all of which come together to make Clojurescript a better language in my opinion.


## Simplicity

The Clojure language is small and simple. It doesn’t take too long to learn all there is in terms of data structures and built ins, and I like that. Compare that to something where you have a huge range of ES5, ES6, Webpack, Babel, ect. It’s easy to get lost.

I value the simplicity of the language as well as the simplicity of the ecosystem that surrounds it, and I feel that Clojure knocks this out of the park.

## Consistency

Clojure has a great design philosophy, and that makes it easier for us as developers. For example, if something is a seq you already know a bunch about what you can do with it. Clojure’s data structures are designed in terms of abstractions, and that allows you to re-use the same methods on them without worrying about the underlying implementation.

This removes a lot of the load of learning the language, and goes back to the root of Clojure’s simplicity. It feels like everything in the language is well thought out and really considered before being added back into the language. I can’t say the same about Javascript.

## Immutability

At this point I get a lot push back from Javascript developers. Javascript has things like Immutable.js which bring immutability to Javascript. While that’s true, I don’t believe it’s true immutability, and introduces a host of issues.

At the end of the day, it’s just a wrapper on top of the language. Everything you add increases the amount of time spending learning the new features, debugging them, and integrating them. The more dependencies you have in a project, the more likely something is to break. It also forces you to remember which parts are immutable and which are not. While I certainly think this is a step in the right direction, the fact that it adds a ton of overhead I feel is a serious drawback to this approach.

Clojurescript on the other hand this is all beaked in. There is no loading in new libraries, there is no learning new things, and there’s no chance (if you’re using pure Clojurescript) that a variable slipped through and is mutable. You get all the great guarantees of immutability without having to add more clutter your project.

## Interop With Host

While I move away from Javascript I still can’t deny the usefulness of the language. There’s a lot of great stuff out there build with Javascript, and luckily Clojurescrip’s interop with the host is top notch. I can drop in and use nearly any Javascript library or framework with relative ease, and begin using it in my project. While I try to using this sparingly, it’s a big win that the Interop is this easy and seamless.

## Productivity

In the end Clojurescript has made me significantly more productive. I feel like I get more done, write less code, and spend less time chasing errors. Clojruescript has let me become a better develop, and I’m happy for it.

I also feel like the patterns it forces you to go down being a functional language are for the best. My code is more maintainable, easier to test, and easier to reason about. Each of those points is a serious win for any non-trivial application, and I feel like writing in Clojurescript forces me to write code that naturally moves in those directions.

Now, I won’t pretend like it’s all ice cream and rainbows. Clojure(script) is a different beast than a lot of developers are use to. Syntax non-withstanding, making the jump from a more tradition Object Oriented language to a purely functional one is a big leap. Like I said though, it’s totally worth it.

It was difficult for me, and I’m sure it was for other developers as well. But, it’s more than worth it. Even when I’m not using Clojurescript, I find myself using the ideas of functional languages in my development. Even looking at things like React and Redux you see the influence of functional programming, and the strengths it brings to an application. I’m a huge fan of functional programming, and if you spend some time learning Clojure, even if you don’t use it, I guarantee you’ll be more productive and write better code in nearly every other language.
