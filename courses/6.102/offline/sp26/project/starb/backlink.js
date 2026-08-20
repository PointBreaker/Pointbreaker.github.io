
window.onHandoutDidRender = function() {
  // find the path to the handout (might be parent directory)
  // const path = window.location.pathname.split("/");
  // const handoutIndex = path.indexOf("handout");
  // const handoutPath = handoutIndex === -1 ? path.join("/") : path.slice(0, handoutIndex + 1).join("/");
  const handoutPath = '.';

  // add the back link to the TOC
  const createElement = (tag, props) => Object.assign(document.createElement(tag), props);
  const backLink = createElement("li", { innerHTML: `<a href="${handoutPath}/index.html" style="color: #337ab7">&larr; Project: &#x2b50;&#xFE0F;&#x2694;&#xFE0F;</a>` });
  document.querySelector("ul.nav > li:first-child").insertAdjacentElement("beforebegin", backLink);
};
