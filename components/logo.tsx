import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-base",
    md: "w-8 h-8 text-xl", 
    lg: "w-12 h-12 text-2xl"
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl"
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image 
        src="/logo.svg" 
        alt="Dolly VIBE Logo" 
        width={size === "sm" ? 24 : size === "md" ? 32 : 48}
        height={size === "sm" ? 24 : size === "md" ? 32 : 48}
        className={sizeClasses[size].split(' ').slice(0, 2).join(' ')}
      />
      <div className={`text-white font-bold flex items-center gap-1 ${sizeClasses[size].split(' ')[2]}`}>
        Dolly <span className={`text-orange-500 ${textSizes[size]} bg-orange-500/20 px-2 py-0.5 rounded`}>VIBE</span>
      </div>
    </div>
  )
}