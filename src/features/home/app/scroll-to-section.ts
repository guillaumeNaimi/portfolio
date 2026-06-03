export const scrollToSection = (id: string) => {
  const viewport = document.querySelector<HTMLElement>(
    '[data-slot="scroll-area-viewport"]',
  );
  const target = document.getElementById(id);
  if (!viewport || !target) return;

  const nav = document.querySelector<HTMLElement>("[data-home-nav]");
  const navHeight = nav?.offsetHeight ?? 56;

  const containerTop = viewport.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;

  viewport.scrollTo({
    top: viewport.scrollTop + (targetTop - containerTop) - navHeight,
    behavior: "smooth",
  });
};
