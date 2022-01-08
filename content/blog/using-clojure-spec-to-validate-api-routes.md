---
title: Using Clojure.spec to Validate API Routes
date: "2021-03-21T22:12:03.284Z"
description: "Use Clojure.Spec to validate api routes"
---


I was recently working on an API and wanted to ensure that specific routes had a particular data structure before going further into the application. For that, I took a look at <a href="https://clojure.org/guides/spec" target="_blank">Clojure.spec</a> which gives developers a good way to ensure consistency in map data.

There’s a lot of great stuff out there about spec, but I had a hard time finding a simple starter guide to handle what I was looking for. I’ve put this together as a very gentle intro to spec that only covers one use case for the tool. I won’t dive into some of the very cool testing stuff you can do with spec, but I do encourage you to read more about it as all the features are very interesting.

Also, note that this example is only looking at the spec implementation and doesn’t do any sort of other checks on the data. In a production environment you should probably be doing additional checks or escaping on the data to ensure it’s not malicious. This example is simply checking that the data conforms to some specific types and values and nothing outside of that.

## Our Basic Api

For this let’s create a very basic Person creating function. We want our Person to have the following attributes along with some basic types we want to enforce:

```clojure
Name: String
Age: Int
Favorite Food: String
Position: String (Specific values)
```

The only one above that has anything interesting going on is Position which will be required to be a value included in a predetermined set. We’ll get to that in a minute though, first, let’s look at a base skeleton for the code.

In this very basic example I’m using <a href="http://pedestal.io/" target="_blank">Pedestal</a> if you care about the route setup, but I’m just going to show the ring handler. The point is to demonstrate the spec stuff so I’ll strip out the Pedestal specific code.

```clojure
(defn add-person  [{:keys [json-params] :as request}] ; How I’m handling the data, this may vary depending on your setup
  (println json-params) ; {:name “Peter” :age 27 :favorite-food “steak” :position “developer”}
  {:status 200 :body (person-service/add json-params}))
Very basic so far, we’re simply calling the person-service with our json-params which you can see is a basic person map. Let’s fill out the bones for the person-service.

(ns spec_demo.person_service
  (:require [clojure.spec.alpha :as spec]))


(defn add [person]
  ; validate our data
  (DB/insert-person person))
```

Very simple, we have a spot where we want to validate the data and once that’s done we hit our database to insert the user.

Now we can jump into actually working with spec. Clojure.spec gives us the tools to define how we want a map to look and validate against that. It also lets us compose these definitions to build up larger maps from smaller pieces. Let’s look at a very basic but useful example.

```clojure
(spec/def ::name string?)

(spec/valid? ::name “Peter”) ; true
(spec/valid? ::name 1) ; false
(spec/valid? ::name {:name "Peter"}) ; false
```

Here we’ve defined a basic definition where ::name is expecting a string. We can use the valid? function to check whether a given value fits the constraint; the above showing that it does indeed pass for strings and fail for other values.

As mentioned above, we can go ahead and compose these definitions and use that to create more complex variations. Let’s do that now, and then show how we can use that to validate our Person map. Let’s leave out the position for now as that will be a bit more complicated.

```clojure
(spec/def ::name string?)
(spec/def ::age int?)
(spec/def ::favorite-food string?)
(spec/def ::person (spec/keys :req-un [::name ::age ::favorite-food]))

(spec/valid? ::person {:name "Peter" :age "None" :favorite-food "steak" :position "developer"}) ; false
(spec/valid? ::person {:name "Peter" :age 27 :favorite-food "steak" :position "developer"}) ; true
```

So here we’ve created a compound definition that takes multiple individual specs and combines them. We use the keys and :req-un to set the required keys that this map should contain. This creates our ::person spec, which will look through each of our given definitions and check that they all are true. If one is off then it will return false as the given map doesn’t conform to our definition.

Now that we have a basic spec working let’s look at that last property, position. What’s cool about spec/def is that all it’s doing is taking an arbitrary function and running the data through that. The examples above are very simple, but there’s nothing stopping us from doing more complex operations. Here’s an example, there might be a simpler way to handle this but I feel this gives a good view into what’s happening.

```clojure
(def POSITION_VALUES ["Developer" "Manager" "Marketing" "Design"])

(defn check-position [val]
  (some #(= val %) POSITION_VALUES))

(spec/def ::position check-position)

(spec/valid? ::position "Developer") ; true
(spec/valid? ::position "Engineer") ; false
```

We’re doing a couple of things here. First, we set up our list of valid POSITION_VALUES and provide a simple helper that tells us whether a given value is present in the vector. Then, we set up a new spec definition that takes this function as its check. This works just like the previous examples, we’ve just passed a custom function in.

Let’s combine them together to see the whole spec in action.

```clojure
(def POSITION_VALUES ["Developer" "Manager" "Marketing" "Design"])

(defn check-position [val]
  (some #(= val %) POSITION_VALUES))

(spec/def ::name string?)
(spec/def ::age int?)
(spec/def ::favorite-food string?)
(spec/def ::position check-position)

(spec/def ::person (spec/keys :req-un [::name ::age ::favorite-food ::position]))

(spec/valid? ::person {:name "Peter" :age 27 :favorite-food "steak" :position "Developer"}) ;true
(spec/valid? ::person {:name "Peter" :age 27 :favorite-food "steak" :position "Engineering"}) ; false
```


Great, we now have a basic but working spec that checks a map for keys and values. That’s great on its own, but let’s see how we can hook that up to our database insert function.

In this case I’ve chosen to use the :pre modifier for our function. This will run a check before the body of the function is executed and throw an error if it fails. We could have just as easily added these checks as part of the body, but I think this makes the intent of what’s going on very clear, we want to ensure this is a valid map before doing anything else and aborting if it’s not.

```clojure
(defn add [person]
  {:pre [(spec/valid? ::person person)]}
  (println "It Works!")) ; this is where we’d do our DB/insert


(add {:name "Peter" :age 27 :favorite-food "steak" :position "Developer"}) ; It Works!
(add {:name "Peter" :age “sdsd” :favorite-food "steak" :position "Developer"} ; error
```


This looks to be exactly what we want. We have a function that is guarded based on a spec where if the values don’t conform to what we expect we throw an error.

Lastly, let’s just set up some very basic error handling. Back in our route handling function:

```clojure
(defn add-person [{:keys [json-params] :as request}]
  (try
     (do
       (add json-params)
       {:status 200 :body "Person Added"})
     (catch Error e {:status 400 :body "Problem with data"})))
```

A very simple try catch that either sends back a 200 on success or catches our validation error and returns a 400 to the user with a message. This will work, although it’s not very informative to an end user why it failed.


## Better Error Messages

Lastly, I wanted to just briefly touch on how we might improve the error handling of this system. A good tool for the is the explain-data function provided by the spec. This will create an object that has the details on the fields that cause an error.

```clojure
; Example where age is wrong
(spec/explain-data ::person {:name "Peter" :age "asd" :favorite-food "steak" :position "Developer"})

; Output
; #:clojure.spec.alpha{:problems ({:path [:age], :pred clojure.core/int?, :val "asd", :via [:spec_demo.person_service/person :spec_demo.person_service/age], :in [:age]}), :spec :spec_demo.person_service/person, :value {:name "Peter", :age "asd", :favorite-food "steak", :position "Developer"}}
```

As you can see it gives us the keys that failed, as well as the values themselves. Let’s look at a very quick and dirty way to wire that up into our api error messages.

```clojure
(defn handle-api-error [data]
  (let [validation-error (spec/explain-data ::person data)
        problem-param (first (:path (first (second (first validation-error)))))]
    {:status 400 :body (str "Issue With " \'(name problem-param)\' " Value.")}))


(defn add-person [{:keys [json-params] :as request}]
  (try
     (do
       (add json-params)
       {:status 200 :body "Person Added"})
     (catch Error e (handle-api-error person))))
```

Here we’ve created a handle-api-error function that gets called on error and finds the problem field in the request. The example above only takes the first error, but it would be pretty easy to make this work for multiple errors in a single request. It’s a very basic example, but shows how you can use some of the other functions in spec to provide more specific error messaging.

With all that we’ve reached the end, at this point you have a basic api that validates against some fields, throws an error if it fails, and then does some light formatting to provide an error message. There’s a lot more to spec, and I highly encourage you to learn more about it. There’s a lot of other great stuff in Clojure.spec, this was only meant as a brief overview for one, what I feel is, a fairly common use case. If you’re looking for more info, I’d check out the <a href="https://clojure.org/about/spec" target="_blank">rationale and overview</a> which goes into what exactly spec is and the ideas behind it, as well as the <a href="https://clojure.org/guides/spec" target="_blank">getting started guide</a>.

Above code lives in github: <a href="https://github.com/peterjewicz/peterjewicz.com/blob/master/samples/clojue_spec_api.clj" target="_blank">https://github.com/peterjewicz/peterjewicz.com/blob/master/samples/clojue_spec_api.clj</a>
