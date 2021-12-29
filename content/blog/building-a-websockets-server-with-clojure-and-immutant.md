---
title: Building a Websockets Server With Clojure and Immutant
date: "2019-08-09T22:12:03.284Z"
description: "Learn To Build a simple Websocket Immutant server with Clojure"
---

Today we’re going to look at setting up a websocket server using Clojure and Immutant, and then hook it all up with some Clojurescript on the front-end. I recently started a new project, and wanted to get a very basic websocket server setup and running without many dependencies. I also wanted to use Clojure on both ends.

To start I used a bit of code from the following great point on Heroku. I used this as a starter for the server, so some of the code will look similar.

Start by creating a new Leiningen project.

```clojure
lein new websocketdemo
```

Then modify your project.clj file to the following:

```clojure
(defproject websocketdemo "0.1.0-SNAPSHOT"
  :dependencies [[org.clojure/clojure "1.10.0"]
                  [org.immutant/immutant "2.1.10"]
                  [compojure "1.6.1"]
                  [ring/ring-core "1.7.1"]
                  [environ "1.0.0"]]
  :main de websocketdemo.core
  :uberjar-name "websocketdemo-standalone.jar"
  :profiles {:uberjar {:aot [websocketdemo]}}
  :min-lein-version "2.4.0")
```

Note that I’ve updated some of the versions compared to the link above.

Next let’s add the following to our core.clj file.

```clojure
(ns websocketdemo.core
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

(defn send-message-to-all []
  "Sends a message to all connected ws connections"
    (doseq [ch @channel-store]
      (async/send! ch "Message Received")))

(def websocket-callbacks
  "WebSocket callback functions"
  {:on-open   (fn [channel]
    (swap! channel-store conj channel) ; store channels for later
    (async/send! channel "Ready to reverse your messages!"))
  :on-close   (fn [channel {:keys [code reason]}]
    (println "close code:" code "reason:" reason))
  :on-message (fn [ch m]
    (send-message-to-all)
    (async/send! ch (apply str (reverse m))))})

(defroutes routes
  (GET "/" {c :context} (redirect (str c "/index.html")))
  (route/resources "/"))

(defn -main [& {:as args}]
  (web/run
    (-> routes
      ;; wrap the handler with websocket support
      ;; websocket requests will go to the callbacks, ring requests to the handler
      (web-middleware/wrap-websocket websocket-callbacks))
      (merge {"host" (env :demo-web-host), "port" 8080}
      args)))
```

This is pretty similar to the link above, but I’ve added an atom that will hold the channels that are created. I’ve also added a send-message-to-all function that will loop through the list of channels and send a message every time the server receives a new message. This is a pretty poor use case above, but it could be used to send messages to specific users, for a collaboration app perhaps. The one thing missing in this demo is actually removing the connections from the atom as they are disconnected, but for a simple demo I figured I could skip it.

From this point you should be able to start up the server. Run lein run and the server should be spun up at port 8080.

Next up, we need to set up a front end to send messages to the server. You could use anything here, but I also wanted to use Clojure on the front-end so I’m using Clojurescript in this demo.

I’m using the following two repos to get started quickly:

https://github.com/bhauman/figwheel-template – A barebones figwheel template for hot reloading. I’m also using Reagent in the code samples.


https://github.com/nilenso/wscljs – A helper to setup websocket connections on the client side. This isn’t needed, but makes the code a bit more concise and easier to read than doing some Javascript to setup the connections.

With that in mind, here’s the core file for the client side.

```clojure
(ns immutant-websockets.core
    (:require [reagent.core :as reagent :refer [atom]]
              [wscljs.client :as ws]
              [wscljs.format :as fmt]))

(enable-console-print!)

;; define your app data so that it doesn't get over-written on reload

(defn handle-onOpen []
  (js/alert "Connection Opened"))
(defn handle-onClose [])
(defn handle-onMessage [e]
  (js/console.log e))

(def handlers {:on-message (fn [e] (handle-onMessage e))
               :on-open    #(handle-onOpen)
               :on-close   #(handle-onClose)})

(defn open-ws-connection []
  (def socket (ws/create "ws://localhost:8080" handlers)))

(defn send-message []
  (ws/send socket "value" fmt/json))

(defn close-connection []
  (ws/close socket)
  (js/alert "Connection Closed"))


(defonce app-state (atom {:text "Hello world!"}))

(defn hello-world []
  [:div
    [:input#input {:type "Text" :placeholder "Enter Text To Reverse"}]
    [:div
      [:button#open {:onClick #(open-ws-connection)} "Open"]
      [:button#send {:onClick #(send-message)} "send"]
      [:button#close {:onClick #(close-connection)} "close"]]
    [:div#messages]])

(reagent/render-component [hello-world]
                          (. js/document (getElementById "app")))
```

It’s pretty simple, it sets up a few buttons that handle the connection and sending messages, then prints messages it receives from the server to the console. What’s cool here is since we setup a handler to send a message to every connected user you can make multiple connections and get updates as other clients send messages.

Overall, it’s a pretty simple setup but should be enough to get started with. It has all the key ideas and handlers.

For anyone interested, the full code both the client and server can be found here: https://github.com/peterjewicz/immutant-websockets
