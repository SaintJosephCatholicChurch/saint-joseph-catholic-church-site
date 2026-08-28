export function scrollToHelpHeading(id: string) {
  const heading = document.getElementById(id);

  if (!heading) {
    return;
  }

  const preferredRoot = document.getElementById('cms-help-scroll');
  const scroller =
    preferredRoot && preferredRoot.scrollHeight > preferredRoot.clientHeight + 1
      ? preferredRoot
      : findScrollableAncestor(heading);

  if (!scroller) {
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const nextTop = heading.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
  scroller.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
}

function findScrollableAncestor(element: HTMLElement) {
  let parent = element.parentElement;

  while (parent && parent !== document.body && parent !== document.documentElement) {
    const overflowY = getComputedStyle(parent).overflowY;

    if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight + 1) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
}
