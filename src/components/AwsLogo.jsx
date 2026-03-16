// AwsLogo.jsx — drop-in glowing AWS-themed cloud mark
export default function AwsLogo({ size = 38 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="aws-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <filter id="aws-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer rounded square bg */}
      <rect x="1" y="1" width="38" height="38" rx="10" ry="10"
        fill="rgba(5,8,16,0.9)"
        stroke="url(#aws-grad)"
        strokeWidth="1.2"
      />

      {/* Cloud shape */}
      <path
        d="M11 24 C9 24 7 22 7 20 C7 17.5 9 16 11 16 C11.5 13 14 11 17 11 C19 11 20.5 12 21.5 13.5 C22.5 12.5 24 12 25.5 12 C28.5 12 31 14.5 31 17.5 C32.5 18 33.5 19.5 33.5 21 C33.5 22.5 32.5 24 31 24 Z"
        fill="none"
        stroke="url(#aws-grad)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        filter="url(#aws-glow)"
      />

      {/* Down arrows — AWS smile style */}
      <path
        d="M15 26 L13 29 L17 29"
        stroke="#38bdf8"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#aws-glow)"
      />
      <path
        d="M25 26 L23 29 L27 29"
        stroke="#a78bfa"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#aws-glow)"
      />
      <line x1="17" y1="29" x2="23" y2="29"
        stroke="url(#aws-grad)" strokeWidth="1.3" strokeLinecap="round"
        filter="url(#aws-glow)"
      />
    </svg>
  );
}