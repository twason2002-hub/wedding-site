/** Fine gold divider: hairlines with a centered mark (uses .wi-divider). */
export default function GoldDivider({ color }: { color?: string }) {
  return (
    <div aria-hidden="true" className="wi-divider" style={color ? { color: color } : undefined}>
      <span>✦</span>
    </div>
  );
}
