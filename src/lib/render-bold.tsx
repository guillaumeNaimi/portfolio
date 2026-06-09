export function parseBoldParts(text: string): string[] {
  return text.split(/\*\*(.*?)\*\*/);
}

export function renderBold(text: string) {
  return parseBoldParts(text).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}
