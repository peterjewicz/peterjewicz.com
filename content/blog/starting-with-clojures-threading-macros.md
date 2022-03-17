---
title: Starting With Clojure's Threading Macros
date: "2022-03-17T22:12:03.284Z"
description: "Learn about Clojure's cool threading macros and how they can make your code easier to read!"
---

As I’ve explored Clojure more I’ve gotten more comfortable with a lot of the cool tools the language provides. One tool, the threading macros, was something that I was a bit hesitant to utilize at first. It adds some very nice syntactic sugar, but the first time you see it used it can be a bit confusing.

It’s a mistake to avoid it though as it really helps clean up your code. Today, we’ll take a brief dive into these macros, and hopefully by the end you’ll feel confident in using them in your own code.


Note that this article is only going to deal with the two more common macros, the thread first ```->``` and thread last ```-->```. There are a couple more threading macros Clojure provides, but this should be enough to get you started.

Before we jump in, you can also find any of the code examples below here: https://github.com/peterjewicz/peterjewicz.com-code/blob/master/samples/intro-to-threading-macros.clj

## The Problem

There are two general problems I find threading macros are excellent for. That’s dealing with deeply nested data and running pipelines of functions where the output of one is the input for the other.

Let’s take a look at deeply nested data first. Suppose you have the following map.

```clojure
(def Person
  {:name "Person" :address {:street {:number 123 :name "Fun Street"}}})
```

Now suppose we need to get the street number. The most basic way to do so is something like:

```clojure
(:number (:street (:address Person)))
; 123
```

Now that doesn’t seem so bad, but it is a little messy and it’s easy to see that if the map was larger it would become cumbersome to access deeply nested properties.

Let’s try writing it now with our thread first macro, or ```->```.

```clojure
(-> Person
    :address
    :street
    :number)
; 123
```

We get the same answer, and it’s a lot clearer what is going on. The macro allows us to write the accessors in order instead of having to nest them going from the inside out. This is a huge benefit for deeply nested data, or if you want to run functions like ```first``` at specific steps of the computation.

What the thread first macro does is take each step of the computation, and use it as the first argument for the next step. So after each step above, it takes the result of that and passes it to the next function in line. It’s exactly the same as our nested example, but easier to read.

To better illustrate this, let's take a look at our second use case where we have a pipeline of computations. Suppose we have the following map that represents a home.

```clojure
(def Home
  {:price 100 :new-furnace? false :energy-efficient? false})
```

Now we want to do a few things, we want to add a new furnace, make the home energy efficient, and update the price to reflect these additions. That might look something like this.

```clojure
(defn add-furnace [home]
  (conj home {:new-furnace? true}))

(defn make-energy-efficient [home]
  (conj home {:energy-efficient? true}))

(defn update-price [home]
  (update home :price + 50))


(update-price (make-energy-efficient (add-furnace Home)))
; {:price 150, :new-furnace? true, :energy-efficient? True}
```

It’s a bit of a contrived example, but I think it shows the point. Generally, each step in this computation takes in the home, performs some transformation on it, and then returns the updated value. It works, but having those nested function calls makes it a little messy to read. Let’s refactor it to use the threading macro.

```clojure
(-> Home
   add-furnace
   make-energy-efficient
   update-price)
; {:price 150, :new-furnace? true, :energy-efficient? True}
```

It returns the same result as before, but this is much easier to read. That’s especially the case if you had a larger computation and wanted to avoid nesting a dozen function calls.

Now, you may be wondering why this is called the thread first macro, and that’s because it adds the value as the FIRST argument to the function. So, if you have a function with multiple arguments the value passed in by the thread first function will always occupy the first spot.

Let’s slightly modify the above price update function to accept a value making it a two argument function.

```clojure
(defn update-price-with-value [home value]
  (update home :price + value))

(-> Home
  add-furnace
  make-energy-efficient
  (update-price-with-value 200))
; {:price 300, :new-furnace? true, :energy-efficient? True}
```

Notice how we’re calling the function with only one argument, ```200```, but it’s occupying the second spot in the function. That’s because our thread first macro is still passing in home as the first argument.



## Thread Last

All the above is great, but what about functions like map that take the argument in the last position? If we try to use thread first here it won’t work. That’s where thread last ```-->``` comes in. It works exactly like thread first, but passes in the argument as the last one in the function call.

An example helps to demonstrate. Below we have a list of stock prices. We want to update the price of each by one, and then filter out any that have a price below ```10``` after the increase.

```clojure
(->> STOCK_PRICES
    (map #(update % :price inc))
    (filter #(> (:price %) 10))
    (into []))
 ;  [{:name "company 2", :price 11}]

; Note that this is the same as

(into [] (filter #(> (:price %) 10) (map #(update % :price inc) STOCK_PRICES)))
; [{:name "company 2", :price 11}]
```



Each of these functions ```(map/filter)``` take the argument of the collection as the last one. Our thread last macro does exactly this, so we’re able to build up easy to read computations without having to nest a bunch of function calls. We also transform it back into a vector just to show that it works with any function that takes the collection as the last argument.

Once again, this is a contrived example, you might want to use <a href="https://clojure.org/reference/transducers" target="_blank">transducers</a> for something like this, but it illustrates the point of what thread last is doing.

One interesting note about both macros is that, because each one is passing the full result to the next function, you can influence preceding steps with the past ones. In the stock price example, our filter function would initially remove both items. However, since we’re bumping the price and then passing the updated maps to filter we get our intended result.


## Keep Them Simple, But Not Too Simple.

A couple words of caution, I believe it’s best to not muddy up your threading flows with lots of tricks or hacks. If you’re having a hard time getting the data to fit in a your threading macro that’s a good sign that it might be the best fit for it.

Let’s look at an example of what I would consider a bad use of the threading macro.

Suppose we have the the first ```Person``` example, but now we have multiple addresses instead of one.

```clojure
(def Persons
  {:name "Person" :addresses [{:street {:number 456 :name "Fun Street"}} {:street {:number 123 :name "Fun Street"}}]})
```

With that, we want to select the ```addresses```, and then only keep the one that is ```123```.

```clojure
(-> Persons
  :addresses
  ( #(filter (fn [address] (= (:number (:street address)) 123)) %)))
; ({:street {:number 123, :name "Fun Street"}})
```

This works, but it’s purposely inverting the arguments by using an anonymous function. This ends up making it difficult to read what’s going on as it’s purposely modifying the behavior of ```->```.

- My advice is to avoid doing this like:
- Using anonymous functions
- Mixing -> and - - >
- Defining complex functions in the macro itself.


Remember that the key here is these are meant to make the code easier to read. If it’s not accomplishing  that then it might not be the right choice.

That in mind, I also avoid using it for very simple or small steps.

```clojure
(-> Guy
  :name)
; Peter
```

This works, but to what benefit? I’d argue the standard map accessor is just fine for simple cases like this, and using the macro here is overkill. Just because you can use something doesn’t mean you should.


## Other Threading Macros

As I noted at the start, there are a couple more macros to explore that deal with threading. I find that I use these less frequently, but are still good to know. We won’t cover them here since this is meant as a brief introduction, but you can <a href="https://clojure.org/guides/threading_macros" target="_blank">check out the docs</a> to learn more.



## Using Threading Macros

At the end of the day, threading macros are meant to make your code more readable. You don’t always have to use them, and in many cases you shouldn’t. There’s tradeoffs to everything, so always ask yourself if your usage of these techniques makes your code easier to reason or is just adding cool tricks for the sake of showing them off.
