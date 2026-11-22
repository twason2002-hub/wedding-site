/**
 * One-shot gold motes when an opening reveals the names.
 * Transform and opacity only. Config: motion.delight.goldDust
 */
export default function GoldDust() {
  const bits: Array<[number, number]> = [
    [-78, -36],
    [54, -58],
    [-18, -86],
    [96, 8],
    [-108, 22],
    [18, 46],
    [-46, 72],
    [74, 58],
    [-6, -8],
    [128, -18],
    [-132, -6],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {bits.map(([dx, dy], i) => (
        <span
          key={i}
          className="wi-dust"
          style={{ animationDelay: `${i * 42}ms`, ["--dx" as string]: `${dx}px`, ["--dy" as string]: `${dy}px` }}
        />
      ))}
    </div>
  );
}
