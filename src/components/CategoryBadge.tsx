import clsx from "clsx";

type ColorStyle = {
  badge: string;
  dot: string;
  bar: string;
  cardBorder: string;
  iconBg: string;
};

export const CATEGORY_COLOR_MAP: Record<string, ColorStyle> = {
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    cardBorder: "hover:border-emerald-300",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    dot: "bg-indigo-500",
    bar: "bg-indigo-500",
    cardBorder: "hover:border-indigo-300",
    iconBg: "bg-indigo-100 text-indigo-700",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    cardBorder: "hover:border-amber-300",
    iconBg: "bg-amber-100 text-amber-700",
  },
  cyan: {
    badge: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
    dot: "bg-cyan-500",
    bar: "bg-cyan-500",
    cardBorder: "hover:border-cyan-300",
    iconBg: "bg-cyan-100 text-cyan-700",
  },
  violet: {
    badge: "bg-violet-50 text-violet-700 ring-violet-600/20",
    dot: "bg-violet-500",
    bar: "bg-violet-500",
    cardBorder: "hover:border-violet-300",
    iconBg: "bg-violet-100 text-violet-700",
  },
  blue: {
    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
    cardBorder: "hover:border-blue-300",
    iconBg: "bg-blue-100 text-blue-700",
  },
};

export function getCategoryColorStyle(color: string): ColorStyle {
  return CATEGORY_COLOR_MAP[color] ?? CATEGORY_COLOR_MAP.blue;
}

type CategoryBadgeProps = {
  name: string;
  color: string;
  className?: string;
};

export default function CategoryBadge({
  name,
  color,
  className,
}: CategoryBadgeProps) {
  const style = getCategoryColorStyle(color);

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        style.badge,
        className
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", style.dot)} />
      {name}
    </span>
  );
}

