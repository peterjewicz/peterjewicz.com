---
title: A Brief Introduction To Interceptors and Pedestal
date: "2021-05-20T22:12:03.284Z"
description: "Learn about the web framework Pedestal and a core concept to it: Interceptors"
---


I’ve been building a lot of APIs lately and as such have been using the wonderful Pedestal libraries as my starting point. One of the key ideas in pedestal is interceptors and how they handle the flow of the application. I want to take a brief look at interceptors, and build a simple one that can catch and handle errors for us.

What Are Interceptors?
For a good, in-depth explanation there’s no better place than the docs. I won’t reiterate too much here, we’ll look at them just enough to start using them in the most basic cases. Put very simply, an interceptor is a value, it can be as basic as a map. Of course, there are some specifics, and an interceptor map needs to have at least one key from :enter :leave :error, but it could have all 3.

Those keys give you a pretty decent idea of what’s going on, one big idea to realize though is that your interceptors get called twice. Think of it like a stack where you go through each interceptor’s :enter function, and the go back in reverse through each’s :leave. Along the way, if an error is encountered it will bubble up to the nearest interceptor that knows how to handle it.

Each interceptor receives the current context of the request, and should return a potentially modified version of that context. That leads to some really interesting use cases that middleware doesn’t provide like being able to modify the interceptor stack at runtime.

There’s a lot more than that, but I don’t want to spend too much time talking, let’s jump in and look at a super simple example.


A Basic Interceptor
First, start a new project using their template off the github:

```clojure
lein new pedestal-service the-next-big-server-side-thing
```

This will give you a decent place to start from. I’m then modifying the service.clj file to look something like:

```clojure
(defn home-page
   [request]
   (println 2)
   {:status 200 :body "Hello World"})

 (def test-interceptor
   (interceptor/interceptor
    {:name ::test
     :enter (fn [ctx] (println 1) ctx)
     :leave (fn [ctx] (println 3) ctx)}))

 (def common-interceptors [(body-params/body-params)
                           http/html-body
                           test-interceptor])
 ;; Tabular routes
 (def routes #{["/" :get (conj common-interceptors `home-page)]})
```

This is basically the base template with a new test-interceptor added. This is just to demo the enter/leave functionality of the interceptors. If you start the server and make a request to the service you should see:

```clojure
;1
;2
;3
```

Which is exactly as we’d expected. The :enter get’s called, then it hits our handler function, and finally on the way back out our :leave gets called. That’s cool, but not very useful. Let’s try something actually useful.


Handling Errors
When we’re writing services we always want to be sure that the consumer gets some type of response back, even if it’s just letting them know something bad happened. While we should strive to properly handle errors, there’s always going to be ones that slip through. We could wrap all of our code in a try catch block, but that would be a bit redundant. Instead, let’s take advantage of the :error property on our interceptors.

Modify your service.clj file as follows:

```clojure
(def error-interceptor
   "Error interceptor - currently captures all of our errors"
   (interceptor/interceptor
    {:name ::error
     :error (fn [ctx ex] (assoc ctx :response {:status 400 :body "There was an error"}))}))

(def common-interceptors [(body-params/body-params)
                           http/html-body
                           error-interceptor])
```

Note that this particular interceptor doesn’t have an :enter or :leave, an interceptor only needs to have 1 of the 3. In those cases, it will simply pass the context on to the next step in the chain.

If you run this you’ll get the same result, since there shouldn’t be an error this interceptor doesn’t do anything. Let’s try making an error:

```clojure
(defn home-page
   [request]
   (/ 10 0) ; Uh oh
   {:status 200 :body "Hello World"})
```

This will throw a divides by 0 error, but our interceptor comes to the rescue and captures that error and give us back a lovely error message.

The above example catches and handles all errors the same, but in a real environment you probably don’t want to do that. Pedestal offers a handle helper error-dispatch that lets you setup specific handlers for different types of errors.

More Advanced Error Handling
A better way I’ve been using a lot lately to handle errors involves monads using the fantastic Failjure library. There’s a lot you can learn about monads, but I won’t get into that here. Suffice to say they help maintain purity, and also let us write functions that don’t have to worry about a lot of boilerplate error checking.

Let’s look at a super simple example of how we can take advantage of this and deal with the failures in our interceptor. You’ll need to add the above library, and then modify your interceptor and handler function as follows:

```clojure
(def error-interceptor
   "Error interceptor - currently captures all of our errors"
   (interceptor/interceptor
    {:name ::error
     :leave
       (fn [ctx]
         (if (f/failed? (:response ctx))
           (assoc ctx :response {:status 400 :body "There was an error"})
           ctx))
     :error (fn [ctx ex] (assoc ctx :response {:status 400 :body "There was an error"}))}))

(defn home-page
   [request]
   (f/fail "Value is an error"))
```

This adds a bit of logic to our error handling, and catches any instance of the Failjure fails protocol. We can then do whatever we need to with the error data, including calling new inceptors as needed. Notice that it checks our current response in the context which is where the return from our handler function places its result.

This is a bit of a contrived example, you’d probably want to handle specific errors like this before hitting the interceptor, but it does show some interesting ways you can start to build your application through interceptors as well as how the interceptor can access and modify the context.

Hopefully this brief overview has been helpful. There’s still a lot I’m leaving out, but the above should handle a lot of the common use cases or at least be a nice primer to get you in the right mindset. Let me know your thoughts, and if you’ve tried out Pedestal how you liked it.
