// Custom Aspect Ratio Icons
export const VerticalRectangle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="7" y="2" width="10" height="20" rx="1.5" />
  </svg>
)

export const HorizontalRectangle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="10" rx="1.5" />
  </svg>
)