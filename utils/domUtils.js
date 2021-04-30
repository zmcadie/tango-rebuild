// createElement()
//  ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅
//   SYNTAX
//     let element = createElement(tagName[, className, parent, attributes])
//   
//   PARAMETERS
//     tagName: A string that specifies the type of element to be created.
//     attributes (optional): An object in the format {key(HTML attribute): value(attribute value)}.
//                            Keys can be HTML attribute names (i.e. height) or event listeners in the format onEvent or event.
//                            If an attributes value is a function it will be evaluated as an event listener.
//     parent (optional): An HTML Element that specifies the parent element to append the created element to.
//   
//   RETURN VALUE
//     The created HTML element

export const createElement = (tagName, attributes, parent, prepend = false) => {
  const elem = document.createElement(tagName)

  attributes && setAttributes(elem, attributes)

  if (parent) {
    parent[prepend ? "prepend" : "appendChild"](elem)
  }

  return elem
}

export function setAttributes(element, attributes) {
  if (typeof attributes === "string") {
    return element.className = attributes
  }

  Object.keys(attributes).forEach(key => {
    const value = attributes[key]
    if (typeof value === "function") {
      const eventType = (key.indexOf("on") === 0
        ? key.slice(2)
        : key).toLowerCase()
      element.addEventListener(eventType, value)
    } else if (key === "text") {
      element.innerText = value
    } else {
      element.setAttribute(key, value)
    }
  })
}