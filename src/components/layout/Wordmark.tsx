export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="inline-flex items-center gap-2">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="size-6 text-brand"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M3 21h18" />
          <path d="M5 21V8l7-5 7 5v13" />
          <path d="M9 21v-6h6v6" />
          <path d="M12 3v5" />
        </svg>
        <span className="font-heading text-[17px] font-semibold tracking-tight">
          AEC Network
        </span>
      </span>
    </span>
  );
}
