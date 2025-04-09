export const categories = [
  { label: "식비", emoji: "🍱" },
  { label: "의료", emoji: "💊" },
  { label: "교통", emoji: "🚌" },
  { label: "여가", emoji: "🎮" },
  { label: "통신", emoji: "📱" },
  { label: "급여", emoji: "💵" },
  { label: "기타", emoji: "📦" },
  { label: "주거", emoji: "🏠" },
];

export const categoryEmoji = Object.fromEntries(
  categories.map((c) => [c.label, c.emoji])
);
