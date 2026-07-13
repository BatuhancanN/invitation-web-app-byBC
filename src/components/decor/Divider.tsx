export default function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6" aria-hidden>
      <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-gold-light" />
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 0L11 7L18 9L11 11L9 18L7 11L0 9L7 7L9 0Z"
          fill="var(--color-gold)"
        />
      </svg>
      <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-gold-light" />
    </div>
  );
}
