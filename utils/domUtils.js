// createElement()
//  ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅
//   SYNTAX
//     let element = createElement(tagName[, className, parent, attributes])
//   
//   PARAMETERS
//     tagName: A string that specifies the type of element to be created.
//     className (optional): A string that specifies the className attribute of the created element.
//     parent (optional): An HTML Element that specifies the parent element to append the created element to.
//     attributes (optional): An object in the format {key(HTML attribute): value(attribute value)}.
//                            Keys can be HTML attribute names (i.e. height) or event listeners in the format onEvent or event.
//                            If an attributes value is a function it will be evaluated as an event listener.
//   
//   RETURN VALUE
//     The created HTML element

export const createElement = (tagName, className="", parent=null, attributes={}) => {
  const elem = document.createElement(tagName)

  if (className) {
    elem.className = className
  }

  Object.keys(attributes).forEach(key => {
    const value = attributes[key]
    if (typeof value === "function") {
      const eventType = (key.indexOf("on") === 0
        ? key.slice(2)
        : key).toLowerCase()
      elem.addEventListener(eventType, value)
    } else if (key === "text") {
      elem.innerText = value
    } else {
      elem.setAttribute(key, value)
    }
  })

  if (parent) {
    parent.appendChild(elem)
  }

  return elem
}