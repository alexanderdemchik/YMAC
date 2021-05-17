export function getScrollParent(element: HTMLElement, includeHidden: boolean = false): HTMLElement {
  var style = getComputedStyle(element);
  var excludeStaticParent = style.position === "absolute";
  var overflowRegex = includeHidden ? /(auto|scroll|hidden|overlay)/ : /(auto|scroll|overlay)/;

  if (style.position === "fixed") return document.body;
  for (var parent = element; (parent = parent.parentElement!);) {
      style = getComputedStyle(parent);
      if (excludeStaticParent && style.position === "static") {
          continue;
      }
      if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
  }

  return document.body;
}