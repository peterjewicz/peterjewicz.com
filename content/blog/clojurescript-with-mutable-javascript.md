---
title: Clojurescript With Mutable Javascript
date: "2019-08-16T22:12:03.284Z"
description: "Be careful when using JS libraries with CLJS as it can leave to mutable variables"
---



I love Clojurescript, and have been using it almost exclusively for my projects for some time now. Being a big fan of Clojure in general, it’s natural for me to want to use it on the front-end too. I’m not the biggest fan of Javascript as is, and while things like Typescript are a step in the right direction, Clojurescript just feels like it produces better, easier to maintain code.

Two of the biggest draws of Clojurescript are its immutability, and its easy interop with its host language Javascript. While being able to pull in any Javascript library with ease is nice, it’s important to realize at that point you’re working with Javascript. That sounds like a pretty obvious statement, but it caught me by surprise the first time I saw it happen. There’s a couple of gotchas here, and today I wanted to look at one; you might be losing immutability when you’re working with Javascript even in a Clojurescript project.

For the example in question I’m using the date/time library Moment.js. Whether this is the right choice for the project is not the question here, so let’s just assume it is and using something else is not an option.

After requiring Moment in the file, do the following which creates a moment object, then simply outputs it in a bit easier to read format.

```clojure
(def dateTime (moment))
(print (.format dateTime "MM/DD/YYYY"))
; 08/16/2019
```

We get the moment object back out as expected, and it’s formatted for today’s date. Now try the following code that simply adds one day to the moment object.

```clojure
(def dateTime (moment))
(print (.format (.add dateTime 1 "days") "MM/DD/YYYY"))
; 08/17/2019
```

As you can see the date of the moment object is now the 17th (I’m writing this August 16th) which is correctly adding a day.

Now that all worked as expected, but let’s try this. In this example we’re going add one day to our date, but then after that print out our formatting instead of doing it all in one step.

```clojure
(def dateTime (moment))
(print (.format dateTime "MM/DD/YYY"))
; 08/16/2019

(.add dateTime 1 "days")
(print (.format dateTime "MM/DD/YYY"))
; 08/17/2019
```

Something bad is happening here. As you can see, we defined a date object that was the 16th, but after running the add method and running the same format function we got a different result. Think about that for a second, we ran the same exact method with what should be the same parameters but got a different result; that’s not very functional.

This means that under the hood the variable is being mutated, and we lost all the good stuff we can assume based on immutability.

When we think about it this makes sense, if we look at the <a href="https://momentjs.com/docs/#/manipulating/add/" target="_blank">docs for add</a>:

```clojure
Mutates the original moment by adding time.
```

We see that the moment is indeed mutated by the Moment.Js library. It doesn’t matter that we’re using Clojurescript; when we’re dealing with the Javascript interop it’s javascript data structures we’re going to get. This makes perfect sense when you think about it, but it can come as a bit of surprise the first time you see it. It’s certainly something to keep in mind when you’re making use of Javascript libraries.

Now, I’m not saying that we shouldn’t use Javascript interop, it’s a big draw for the language and having such rich access to the host language is a huge bonus. But, it’s important to keep in mind what your code is actually doing, and understand the risks when working with the Javascript interop in Clojurescript.
