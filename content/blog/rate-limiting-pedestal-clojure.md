---
title: Rate Limiting in a Clojure Pedestal API
date: "2023-06-19T22:12:03.284Z"
description: "Learn To Setup Rate Limiting in a Pedestal API Application."
---

I recently wanted to add some rate limiting to a pedestal app I was building. In the ring world, there’s already an existing <a href="https://github.com/liwp/ring-congestion" target="_blank">ring-congestion</a> middleware that does exactly that. Unfortunately, pedestal doesn’t use the middleware pattern but instead uses an interceptor pattern. This means we’ll need to do a bit of work to get a middleware to place nicely with a pedestal app.

Luckily, the process is pretty simple and just requires a basic understanding of how interceptors work. This will be a quick article in which we’ll do exactly that; we’ll modify the congestion middleware to work in our pedestal app.

## What Is Rate Limiting?

Before we jump in let’s just briefly talk about what rate limiting is. At a basic level, rate limiting is the practice of throttling requests and rejecting those that go over some predefined threshold, say 5 requests in a second for example.

The goal is to prevent abuse of the system. Too many requests in too short of a timeframe can often mean the request is coming from a bot or a user attempting some sort of malicious action. If a standard user makes 1 request per second, seeing a user make 100 in the same timeframe can be a cause for concern. This can have both security and performance implications.

There are many ways to deal with this, but in this case, we’ll do the most basic. We’ll be setting up an in-memory store that tracks IP addresses and blocks users making too many requests. There are certainly more advanced and sophisticated ways to do this, and this implementation has some easy workarounds for someone who knows what they're doing, but it will work for small apps and as a simple demo.

## A Basic Example

I’m working off a basic pedestal app, but this should work at nearly any stage of an existing app. Let’s start by adding the congestion library to our dependencies and setting up a basic interceptor. I’m basically following the readme for the library with some minor modifications.

```clojure
(def storage (storage/local-storage))

;; Define the rate limit: 1 req/s per IP address
(def limit (ip-rate-limit :limit-id 1 (t/seconds 5)))

;; Define the middleware configuration
(def rate-limit-config {:storage storage :limit limit})

(def rate-limit-interceptor
  "Adds rate limit info to context."
  (interceptor/interceptor
    {:name ::rate-limit
     :enter (fn [ctx]
              (let [limit ((wrap-rate-limit ctx rate-limit-config) (:request ctx))]
                (if (:body limit)
                  (assoc ctx :response limit)
                  ctx)))}))
```

Now let’s add our new interceptor to our interceptors list. I’ve added a few other examples to show a sample chain that might be close to a real app.

```clojure
(def auth-interceptors
  [(body-params/body-params)
   http/html-body
   auth/authentication-interceptor
   rate-limit-interceptor
   ; More interceptors here
  ])
```

This sets up a new interceptor that will limit IPs to a single request every 5 seconds. If you hit an endpoint using this interceptor once it should return the response. However, if you hit it again within that 5 second window you should get the following response with a `429` error code:

```clojure
{
"error": "Too Many Requests"
}
```

This is the base response that the library provides. If you wait 5 seconds and make another request you should see it succeed again.

Important to note that this will use an in-memory store to persist requests and check timings. This is fine for this example and a small application, but a more robust solution would likely use some other type of data store. The middleware comes with support for <a href="https://redis.com/" target="_blank">Redis</a> out of the box, but it’s not too difficult to configure something else if desired.

## Going a Little Further

Now, the above will work perfectly fine, but it’s a bit odd in its current state. If we look at the source for `wrap-rate-limit` we can see that it’s expecting to call our handler function and add the rate limit information to the response. This follows the typical pattern for middlewares, but in the pedestal world we’re working with interceptors.

So, what we’ll do is take the code for `wrap-rate-limit` and pull it out into our interceptor. Here’s a slightly modified version that does just that:

```clojure
(def rate-limit-interceptor
  "Adds rate limit info to context."
  (interceptor/interceptor
    {:name ::rate-limit
     :enter (fn [ctx]
              (let [quota-state (quota-state/read-quota-state storage limit (:request ctx))]
                (if (quota-state/quota-exhausted? quota-state)
                  (assoc ctx :response (quota-state/build-error-response quota-state (:response ctx)))
                  (do
                    (quota-state/increment-counter quota-state storage)
                    (assoc ctx :rate-limit-details (quota-state/rate-limit-response quota-state {}))))))}))
```

This does basically the same thing, but also appends a new key to our context called `:rate-limit-details` that will contain the info when the limit hasn’t been reached. This gives us more control and allows us to perform operations based on the values there such as showing a warning to a user if they’re approaching the limit.

This is a little more complex but gives us more data and feels a bit more interceptor-y. The original solution would work perfectly fine if you prefer something simpler and don't need the extras this method provides.

And that’s it, it’s fairly easy to rework most types of middleware to work with pedestal’s interceptors. The key is to think about how the context differs from the standard request in a middleware pattern, and also to keep in mind the different keys in the context and what they mean.
