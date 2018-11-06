import Vue from 'vue'
import Message from './Message.vue'

const MessageContructor = Vue.extend(Message)
const messages = []
let vm = new MessageContructor({
  propsData: {
    messages
  }
})

vm.$mount()
let $el = vm.$el
document.body.appendChild($el)

export function message (options) {
  let message = {
    ...options
  }
  messages.push(message)

  if (options.during !== 0) {
    setTimeout(() => {
      messages.splice(messages.indexOf(message), 1)
    }, options.during || 4500)
  }
}
