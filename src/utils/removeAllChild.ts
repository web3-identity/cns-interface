export default function removeAllChild(dom: Element | null): void {
  let child = dom?.lastElementChild
  while (child) {
    dom?.removeChild(child)
    child = dom?.lastElementChild
  }
}