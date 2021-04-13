export default function(func, delay) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    const callback = function() {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(callback, delay)
  }
}