class Casco {
  constructor (defaults = []) {
    this.defaults = defaults
    this.body = document.querySelector('body')
  }

  set(classes){
    this.reset()
    if(!classes) return false

    classes = Array.isArray(classes) ? classes : [classes]

    try {
      return this.body.classList.add(...classes)
    } catch(e) {
      return false
    }
  }

  reset(){
    this.body.classList.remove(...this.body.classList)
    try{
      return this.body.classList.add(...this.defaults)
    } catch (e) {
      return false
    }
  }
}

export default {
  install: (app, { defaults }) => {
    //provide as an injectable class
    app.provide('casco', new Casco(defaults))
  }
}

export { Casco }