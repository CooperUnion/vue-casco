# Vue-Casco
## A hacky way of altering the head tag within a Vue 3 project

# Background
This project does exactly one thing: helps add classes to the body tag of a Vue 3 project. There is a rich history of projects that do this, like react-helmet, vue-helmet, and even the more modern vue-pseudo-window, but none of them do as little as what we needed, or did it well in a current Vue 3 app. 

There may be proper ways of updating the body classes appropraitely; this library definitely doesn't do things the "right" way, but it's designed to make you feel like it is.

In all honesty, you probably shouldn't be building an application in Vue 3 that relies on the cascade of css, including setting classes on the body tag. That being said, if you are in a situation where you need to do so, hopefully this can be of some assistance in at least providing a not-awful interface for doing so.

# Installation
In an es6-authored vue 3 application (like with vue-cli):
`npm install vue-casco`

# Configuration
When instantiating `casco` in a router, it accepts a single argument as an array of default classes. These classes will be applied to all body routes, and will persist after being reset.

*Note* Just instantiating this library does not make it active. You must also use it either as a navigation guard in your router, or by using it within a component or view.
```javascript
import { Casco } from 'vue-casco'
const casco = new Casco(['standard'])
```

# Usage
There are a few ways this plugin can be used:
1. As an enhancement to a vue-router configuration
2. As an injectable utility within any vue component

## Usage with vue-router
In your `router/index.js` file, you need to import the library, and add it on after creating the router.

In this abbreviated look, the library is imported, a prop specifying a class is added to a route, and then a [navigation guard](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards) is configured to conditionally use the library. 

The name of the property that carries the classes isn't specified in the library, so if you want to refer to it by something other than "theme", you can do so via changing the props name and its corresponding value being sent to `header.set()`:

```javascript
import { casco } from 'vue-casco'

const routes = [
  ...
  {
    path:'/about',
    name: 'About',
    component: About
    props: {
      theme: ['dark']
    }
  }
]

router.beforeEach((to, from, next) => {
  try{ 
    const props = to.matched[0].props.default
    casco.set(props.theme)
  } catch(e) {
    casco.reset()
  }
  next()
})
```

A more complete view into an entire `router/index.js` file might look more like this following example. Of note, the instantiation of casco is setting a default class `standard` that would be applied to the body at all times.

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import { Casco } from 'vue-casco'

const casco = new Casco(['standard'])

const routes = [
  {
    path:'/',
    name: 'Home',
    component: Home
  },
  {
    path:'/about',
    name: 'About',
    component: About
    props: {
      theme: ['dark']
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  try{ 
    const props = to.matched[0].props.default
    casco.set(props.theme)
  } catch(e) {
    casco.reset()
  }
  next()
})

export default router
```

## Usage within a view or component
In this single-file vue component example, the same props are being applied from the vue-router example above, but this assumes that the router navigation guard hasn't been enabled, either for the route that renders this page, or at all.

```html
<template>
  <h1>Active classes on the body: {{bodyClasses}}</h1>
</template>
<script>
  import { Casco } from 'vue-casco'
  const casco = new Casco()

  export default {
    name: 'Home',
    props: {
      theme: Array
    },
    setup(props) {
      const bodyClasses = casco.set(props.theme)
      return { bodyClasses }
    }
  }
</script>
<style>
  body.dark {
    background-color: black;
  }
</style>