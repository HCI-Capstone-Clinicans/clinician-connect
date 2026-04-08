interface MatchedTagProps {
  label: string;
  reason: string;
}

export function MatchedTag({ label, reason }: MatchedTagProps) {
  return (
    <span className="relative group inline-block">
      <span className="px-2 py-1 text-[11px] font-medium bg-green-50 text-green-700 border border-green-200 rounded cursor-default select-none">
        {label}
      </span>
      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <span className="block w-max max-w-[200px] px-2.5 py-1.5 bg-gray-900 text-white text-[11px] leading-snug rounded shadow-lg whitespace-normal text-center">
          {reason}
        </span>
        {/* Arrow */}
        <span className="block w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1" />
      </span>
    </span>
  );
}
