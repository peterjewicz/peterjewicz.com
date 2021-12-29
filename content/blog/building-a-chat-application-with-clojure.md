---
title: Building a Websockets Server With Clojure and Immutant
date: "2019-10-28T22:12:03.284Z"
description: "Build a simple chat application with Clojure"
---


A few weeks ago I wrote about setting up a very barebones web socket server and UI in Clojure. Today, I want to build upon that, and build an actual application that uses web sockets. Behold, the chat application, something I came up with and has never been done before.

Kidding aside, I think it’s a pretty nice introduction to web sockets, sort of the To-Do style application for websockets. In this article we’ll setup a simple server that sends off the message to all connected clients, and a UI that displays messages as they come in.

There’s a few pieces of functionally to build out:

Websocket server that broadcasts all messages as they come in.
Ability for the UI to send a message
UI responds to and displays messages as they come in
Server needs to handle when a user disconnects
With those goals in mind let’s get started.

Starting Off
I’m using the repo I put together in my last article, you can find it on Github here.

If you just want the end result that’s also on Github here.

The repo comes with a simple UI that you can start with

```clojure
lein fighweel
```

And also a server that you can spin up with your repl for now. Once that’s all going you should be able to interact with the UI and get some messages back from the server in your console.

Setting Up The UI
First let’s get the UI in order. We’ll set the base we need here.

```clojure
(ns immutant-websockets.core
    (:require [reagent.core :as reagent :refer [atom]]
              [wscljs.client :as ws]
              [wscljs.format :as fmt]))

(enable-console-print!)

(def messages (atom []))

(defn handle-onOpen []
  (js/alert "Connection Opened"))
(defn handle-onMessage [e]
  (js/console.log e))
(defn handle-onClose [])

(def handlers {:on-message (fn [e] (handle-onMessage e))
               :on-open    #(handle-onOpen)
               :on-close   #(handle-onClose)})

(defn open-ws-connection []
  (def socket (ws/create "ws://localhost:8080" handlers)))

(defn send-message []
  (ws/send socket (.-value (.getElementById js/document "input")) fmt/json))

(defn close-connection []
  (ws/close socket)
  (js/alert "Connection Closed"))

(defonce app-state (atom {:text "Hello world!"}))

(defn hello-world []
  [:div
    [:input#input {:type "Text" :placeholder "Enter Your Message"}]
    [:div
      [:button#send {:onClick #(send-message)} "Send"]]
    [:div#messages]])

(open-ws-connection)
(reagent/render-component [hello-world]
                          (. js/document (getElementById "app")))
```

All this will do is up our base for connection and sending messages, and then designate #messages to be where we want to display them. We’ve also setup an atom to store the messages, so we can rely on Reagent goodness to render it as new messages are received. Notice how we use a vector here, that will be important later.

For now it will just log message we receive to the console and that will allow us to test that the whole chain is working. We’ll revisit this once we set up the server.

Setting Up The Server
With the UI in a decent place let’s get the server going. Slightly modified, but not much, from the starter we have this.

```clojure
(ns immutant-websockets.server.core
  (:require
    [immutant.web             :as web]
    [immutant.web.async       :as async]
    [immutant.web.middleware  :as web-middleware]
    [compojure.route          :as route]
    [environ.core             :refer (env)]
    [compojure.core           :refer (ANY GET defroutes)]
    [ring.util.response       :refer (response redirect content-type)])
  (:gen-class))

(def channel-store (atom []))

(defn send-message-to-all [m]
  "Sends a message to all connected ws connections"
    (doseq [ch @channel-store]
      (async/send! ch m)))

; (:id (ws/session h) get user ID of message
; need to be able to pool these and send it out to all with ID
(def websocket-callbacks
  "WebSocket callback functions"
  {:on-open   (fn [channel]
    (swap! channel-store conj channel)) ; store channels for later
  :on-close   (fn [channel {:keys [code reason]}]
    (println "close code:" code "reason:" reason))
  :on-message (fn [ch m]
    (send-message-to-all m))})


(defroutes routes
  (GET "/" {c :context} (redirect (str c "/index.html")))
  (route/resources "/"))

(defn -main [& {:as args}]
  (web/run
    (-> routes
      ; (web-middleware/wrap-session {:timeout 20})
      ;; wrap the handler with websocket support
      ;; websocket requests will go to the callbacks, ring requests to the handler
      (web-middleware/wrap-websocket websocket-callbacks))
      (merge {"host" (env :demo-web-host), "port" 8080}
      args)))
```


So here we have a pretty good start, the server will receive messages, cycle through all our connections, and send them each a message.

Let’s jump back to the UI, add the following to your handler function:

```clojure
(defn handle-onMessage [e]
  (swap! messages conj (.-data e)))
```

Pretty simply here, we simply add the text we receive onto our vector atom. conj appends to the end of a vector, which is what we want with the most recent messages displayed at the end. If we used a list instead, we’d get the opposite, which is why we chose a vector.

Let’s display the messages as they come in, edit your #messages div to be the following:

```clojure
[:div#messages
      (for [message @messages]
        [:p message])]
```

This will display the messages as they come in and display them to the DOM. Using the Reagent implementation of an atom means every time the atom is changed the DOM will re-render to reflect those changes.

At this point we have a very basic but functioning chat program. If you open up two browser tabs you’ll be able to see the messages as they come in on each. The last thing we have on our list is a bit of cleanup, we want to remove channels from our channel store as they disconnect.

Let’s modify the on-close handler:

```clojure
:on-close   (fn [channel {:keys [code reason]}]
    (swap! channel-store (partial filter (fn [chan]
      (if (= chan channel)
        false
        true)))))
```

Here we simply filter out the current channel, and update our store to only hold active channels. There’s probably a cleaner way to handle the filter, but this works and I feel is pretty readable.

Notice the use of partial, if you’re not familiar with the concept it’s a very powerful idea. Basically, it allows us to define a function with less than the required amount of arguments, and then later call that function supplying it the missing arguments. Since swap!will supply our current value to the function provided we wrap filter in a partial to allow it to accept that value.

And there we have it, a fully functioning, if basic, chat program. You’ll be able to connect multiple clients to the server, and see as messages come through on each one.

Next Steps
With the program in this basic state there’s a lot of room for improvement. A couple of ideas off the top of my head:

- Show who sent a message
- Keep a log of messages to account for offline/disconnects
- Allow users to privately message
I’m sure there’s more I’m missing, but these I feel are things I would expect from an actual chat program. In future articles we’ll look at adding these features, so stick around for more Clojure goodness!
