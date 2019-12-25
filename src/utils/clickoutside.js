let seed = 0
const nodeList = []

const ctx = '__clickoutsideContext'

export default {
  bind: (el, binding, vnode) => {
    nodeList.push(el)
    const id = ++seed
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression
    }
  },
  update: (el, binding, vnode) => {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.expression
  },
  unbind: (el) => {
    nodeList.forEach((ele, index) => {
      if (ele[ctx].id = el[ctx].id) {
        nodeList.splice(index, 1)
      }
    })
    delete el[ctx];
  }
}

document.addEventListener('click', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e))
}, false)

function createDocumentHandler(el, binding, vnode) {
  return function(click = {}) {
    if (!vnode ||
      !vnode.context ||
      !click.target ||
      el.contains(click.target) ||
      el === click.target ||
      (vnode.context.el &&
        document.getElementById(vnode.context.el)) &&
        document.getElementById(vnode.context.el) === click.target) return;
    
    if (binding.expression &&
        el[ctx].methodName &&
        vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]()
    }
  }
}