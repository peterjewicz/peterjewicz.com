---
title: Building a Dialogue System In Clojurescript
date: "2022-12-26T22:12:03.284Z"
description: "Build a sample Dialogue system inspired by text-based choose your own adventure games."
---


I was recently working on an RPG that’s primarily text-based and has a very “choose your own adventure” type vibes. One of the core gameplay loops is a dialogue/exploration system that presents the user with several branching paths and allows them to pick which one to follow. 

Here’s an example of the system in action: 

<img src="/images/dialogue-demo.gif" width="350px" alt="GIF of Dialogue Demo">

<i>Note that we'll only be covering the basics of the functionality here. We won't get in the styles or some of the more finrer points of actually dispatching and handling these effects. Perhaps in a future tutorial?</i>


As I was building it, I thought it was interesting enough to dive into. That spawned this article which will touch on how I went about building this and show the core ideas built out in Clojurescript which is what the game itself is written in. 


## Requirements 

Before we jump in, let’s specify the requirements so we know what we’re going to build. 

- Show the user a view with a text description and options in the form of buttons. 
- There can be a variable number of buttons, but always at least one. 
- Buttons should have constraint checks to conditionally display (ie. show this button if a quest is started or the player has an item).
- Buttons can have 1 or more effects from advancing dialogue to entering combat.
- Button effects are not all specified yet, so it should be easy to extend with new ones later.

Overall, it’s a pretty simple project with the real complexity coming in the last two points. First off, a button might have multiple different effects that we need to account for. It might advance dialogue, move locations, pick up an item, start a quest, or a variety of other things. We need to make sure that we have a way to easily define these effects and handle them in a consistent way. 

We also want to make sure that we’re easily able to extend these effects later. We might imagine that we start working on this before the entirety of the game is fleshed out. Because of this, we don’t necessarily know which effects we’ll have to handle. Writing out code in a way that’s easy to extend is going to save us a lot of time in refactoring later.


## Getting Started

For reference, I’m building this out of a simple re-frame app using the [template found here](https://github.com/day8/re-frame-template). This isn’t a requirement, but I find it’s one of the easier ways to spin up a simple Clojurescript project. I started my project running: 

```clojure
lein new re-frame dialogue-demo
Npm install
Npm run watch
```


This will set us up with a basic re-frame application, install our dependencies, and spin up the dev server. This is a quick way to follow along, but we won’t be using any features of re-frame in this tutorial so it’s not essential. We will however be taking advantage of [Reagent](https://reagent-project.github.io), so you may want to have that at the least to follow along.


First things first, let’s build out a simple component for holding our view. I’ll just work in the ```Views.cljs``` file for now, but you can do so wherever makes sense for your setup. 

```clojure
(defn Dialogue-view [{:keys [description]} dialogue-step]
 [:div
  [:p description]])
 
(defn main-panel []
 [Dialogue-view {:description "Here's a test description"}])
```


Here we simply set up our core dialogue view which takes in our ```dialogue-step``` map which we’ll define a bit more later. We also use the destructuring shorthand to pull out the base ```description```. As we build more in the ```dialogue-step``` map the destructuring will come in handy.


## Dialogue Overview

Before we jump in, let’s think about how we want to lay out our data. To start, we need a way to save multiple steps of the dialogue and a way to determine which step we’re on. 

We could create a vector and save the position, but we could also use a map and simply save the key. The second option seems a bit easier, and follows more closely to the spirit of Clojure, so we’ll do that. 

After that, we also need to store the buttons and options. This we can turn into a vector as we’ll always need to iterate through them. Each item can represent a button, and can also contain a :constraint key that we can treat as a bool to show/hide buttons. 

Finally, each button will take a vector of effects that will again be maps. This is also a good opportunity to use [multimethods](https://clojure.org/reference/multimethods) as we can then treat each ```button-effect``` the same way from an event handling perspective. 

So, that gives us a structure like: 

```clojure
{:key {:description "" :options [:text "" :constraints [] :effects []]}}
```

Don’t worry if any of that doesn’t make sense yet, we’ll be walking through each step below. 

 
## Base Dialogue Setup


Let’s start by defining a map that is keyed by the correct step of the dialogue we’re in. We’ll also add a description since we know every step will need that.

```clojure
{:base {:description "First description"} :second {:description "Second"}}
```

That’s a decent start, and what it will allow us to do is simply save the key of the step we’re on in an atom. Let’s do that now, and add a simple function that will pull out our current dialogue step.

First, if you’re working in the same view file, you’ll need to import the Reagent atom. 

```clojure
[reagent.core :as r]
```

I’ll assume you’re familiar with reagent to a degree, but if not the key idea to remember is that a reagent atom will re-render our UI on changes. As we change the value stored there we should expect our UI to dynamically update based on it. With that in mind, let’s change our file to the following: 


```clojure
(def !current-step (r/atom :base))

(def dialogue
 {:base {:description "First description"}
  :second {:description "Second"}})
 
(defn Dialogue-view [{:keys [description]} dialogue-step]
 [:div
  [:p description]])
 
(defn main-panel []
 [Dialogue-view (@!current-step dialogue)])
```
 

Still pretty simple, but now we’re pulling in the dialogue and properly setting a place to store our current step. Note that in a real application you’d probably want to store this somewhere else (in a true reframe application this would live in your state DB) but this will suffice for now. 



## Changing The View


With this setup, in order to change the view all we have to do is update our atom to the new key. To start, let’s first add our options vector to our base dialogue config. 

```clojure
(def dialogue
 {:base {:description "First description"
         :options [{:display "Go Forward" :actions [{:type :key :value :second}]}]}
  :second {:description "Second"}})
```


We’ve added two things to the options. The first is ```:display```, which will be the text of the button. The other is the ```:actions``` vector, which as we talked about above is the list of effects that get fired off when a user clicks the button. 

We also talked about adding multimethods, which is where the ```:type``` property will come into play. Before we do that though, let’s go ahead and render these options as buttons on the screen. 

<i>Note that we’ll use ```:display``` for the key. This probably isn’t going to work in a real application since we might have multiple buttons with the same text, but should be fine for this demo.</i>

```clojure
(defn Dialogue-view [{:keys [description options]} dialogue-step]
 [:div
  [:p description]
  (for [option options]
    (let [display (:display option)]
    [:button {:key display} display]))])
```

If you’ve done everything correctly you should now see a button with the text “Go Forward” on your screen. Unfortunately, it doesn’t do anything yet. It’s about time we got to the real meat of the dialogue system and start handling our effects. 


## Setting Up Our Multimethods

As I’ve alluded to, multimethods are going to be a natural choice here. With them, we’ll be able to define a single handler function that dispatches different functions depending on some property we specify, which in this case will be the ```:type``` property on our buttons. Multimethods are also simple to extend in the future, so as we need to handle more effects we can safely add more functionality without affecting our past work. 

Let’s go ahead and add the first multimethod now. 

```clojure
(defmulti handle-dialogue-action :type)
 
(defmethod handle-dialogue-action :key [action]
 (print action))
```

All we’ve done here is set up a multimethod that looks for a ```:type``` property and dispatches a function based on that. We only have one handler function for now, and all it will do is print the single argument so that we can ensure that it’s doing what we want. Before we flesh out the handler let’s wire up the button to actually call the function. 

It’s important to keep in mind that the :actions is a vector that could have one or more items. So, on each click, we’ll need to loop through the list and call each action as its own function. 

```clojure
[:button {:on-click #(doseq [action (:actions option)](handle-dialogue-action action)) :key display}
  display]
```

We’re using ```doseq``` here as the button click produces side-effects. If you click on the button now you should see the action being printed back. If you go ahead and add a second action with the same type then you should see each one getting printed back separately. 

With all that done, the last thing is to update our atom with the new value. In our case, all we have to do is take the ```:value``` from our action and replace the atom value with it.  We just have to make sure that all subsequent actions that are of the type :key also have a :value. 

```clojure
(defmethod handle-dialogue-action :key [action]
 (reset! !current-step (:value action)))
```


If you click the button now you should see the view change to the ```:second``` key’s value. That’s perfect, and we’ve got one big item out of the way. 


## Handling Other Effects 

As we mentioned, we want to also handle other events in each dialogue step. Luckily, all we have to do to support this is add other methods for the different handlers. Let’s add two more, one for starting a quest and one for acquiring gold. 

```clojure
(defmethod handle-dialogue-action :quest [action]
 (js/alert (str "You started quest: " (:name action))))
 
(defmethod handle-dialogue-action :gold [action]
 (js/alert (str "You got: " (:amount action) " gold")))
```

And then to see these in action let’s go ahead and add to our dialogue config. Afterward it will look like this: 

```clojure
(def dialogue
 {:base {:description "First description"
         :options [{:display "Go Forward" :actions [{:type :key :value :second} {:type :quest :name "Fetch Quest"}]}]}
  :second {:description "Second"
           :options [{:display "Leave" :actions [{:type :key :value :base}]}
                     {:display "Leave With Gold" :actions [{:type :key :value :base}{:type :gold :amount 20}]}]}})
```


Now, we can start to see how easy it would be to build up more complex dialogue trees. Here we have examples of all 3 handlers as well as both actions that contain a single and multiple effects to handle. As we extend this all we need to do is create more methods to handle different events. Best of all, there’s no need to touch existing code when adding new methods.  

The one thing this doesn’t really show is how I store things like quests in the dialogue config. In the real game, the ```:name``` key for quests would instead be an ```:id``` which would match up to a separate list that is my quests keyed by ```:id```. That way, I can call something like ```(start-quest (:id action))``` and have a generic way to start any quest in the game from this view. The same works for things like combat and items as well. 

The downside to that is now there’s some coupling between my dialogue config and the rest of my game. If I change an ```:id``` on my quest list then I also need to do it here. This coupling is fairly loose though, and I deem it acceptable here. 

All this isn’t really applicable to this quick demo, but I wanted to give you some more context on how this fits into a real application and some of the considerations and trade-offs I made to implement it. 


## Constraints 

Our last bit we need to handle is constraints. In my game, having a certain item or starting a particular quest can mean that there are different dialogue options available. Let’s show an example of how that might look. 

First, let’s update our dialogue config to add a third option that has a constraint value:

```clojure
(def dialogue
 {:base {:description "First description"
         :options [{:display "Go Forward" :actions [{:type :key :value :second} {:type :quest :name "Fetch Quest"}]}
                   {:display "Third" :actions [{:type :key :value :third}]}]}
  :second {:description "Second"
           :options [{:display "Leave" :actions [{:type :key :value :base}]}
                     {:display "Leave With Gold" :actions [{:type :key :value :base}{:type :gold :amount 20}]}]}
  :third {:description "Now You're On The Third option."
          :options [{:constraint true
                     :false {:display "You Don't Have it"}
                     :true {:display "You Do have It"}}]}})
```

Notice the ```:third``` key’s ```:options``` has the new ```:constraint``` key set. We’ve also keyed the options by their boolean values since we want our constraint check to return a boolean itself.

For the constraint, we’ll add a simple function that just returns a boolean: 

```clojure
(defn check-constraint []
 false)
```

In the real application the ```:constraint``` contains more data on how to check this, and that itself gets dispatched in its own multimethod. It might look like ```{:constraint {:type :inventory :item 1}}``` and you can start to see how we follow a similar flow to the dialogue. That’s a bit out of scope here though, suffice to say that function will return a boolean, and we’ll use it in the same way we do with this simple example. 

What we need to do now is a few things :

1. Check if the constraint is there, if it’s not we can follow our old flow. 
2. If it is, we call our check-constraint function to get a boolean of whether it passes or not.
3. Next, we turn that boolean into a keyword to access the correct entry in our map. 
4. Lastly, we render that just as we would have if the constraint check did not exist. 



With that in mind, we’ll need to rewrite our button generation code a bit. We’ll need to pull out the render code itself since we know that both paths, constraint or not, will render the same button in the end. 

```clojure
(defn render-button [option]
 (let [display (:display option)]
   [:button {:on-click #(doseq [action (:actions option)] (handle-dialogue-action action)) :key display}
    display]))
 
(defn Dialogue-view [{:keys [description options]} dialogue-step]
 [:div
  [:p description]
  (for [option options]
    (if (:constraint option)
      (render-button ((-> (check-constraint) str keyword) option))
      (render-button option)))])
```


Note that ```render-button``` is used in either case; it's just a different value that gets passed in. We also use a bit of threading there just to make it a bit cleaner as keyword won’t work on booleans. 

Now, if you click the button for :third you should see the text “You don’t have it”. If you change the check-constraint to true you should see “You Do Have It”. We now have a simple way to build out conditional rendering for our dialogue trees!



## Final Thoughts 

As noted, this is just a quick overview of the dialogue system I built for my upcoming game. It handwaves a couple of the details, but hopefully some of the additional thoughts can help you see how it was extended in the real application. 

The one thing to keep in mind with these large maps is validation. For the game, I wrote a custom testing script that inspects the map and checks that the various types have the proper keys. For example, it makes sure that an action with the :gold type has a corresponding :amount value. These types of checks are important otherwise you end up with runtime bugs when map values are missing. This may or not be problematic depending on your implementation, so make sure to think through those scenarios carefully. 

For those interested, you can find the [full source on my github here](https://github.com/peterjewicz/peterjewicz.com-code/blob/master/samples/dialogue_demo.cljs). 

I’m also happy to answer any questions you might have; as always feel free to reach out to me either through email, linkedin, or Twitter. If you’re interested in the game itself I’ll update this post once it’s released.  
 
