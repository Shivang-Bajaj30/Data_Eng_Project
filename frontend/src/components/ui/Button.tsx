import React, { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'academic'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary:
        'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] shadow-sm shadow-indigo-500/20 focus-visible:ring-indigo-500 font-semibold',
      secondary:
        'bg-indigo-50/60 text-indigo-950 hover:bg-indigo-100/80 active:scale-[0.98] dark:bg-zinc-800 dark:text-indigo-200 dark:hover:bg-zinc-750 border border-indigo-200/70 dark:border-indigo-900/60 shadow-2xs focus-visible:ring-indigo-400 font-medium',
      ghost:
        'bg-transparent text-stone-600 hover:bg-indigo-50/60 dark:text-zinc-400 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300 focus-visible:ring-indigo-400',
      danger:
        'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-700 hover:to-red-700 active:scale-[0.98] shadow-sm shadow-rose-500/20 focus-visible:ring-rose-500 font-semibold',
      outline:
        'bg-white/80 dark:bg-zinc-900/80 border border-indigo-200/80 dark:border-zinc-700 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 focus-visible:ring-indigo-400 shadow-2xs font-medium',
      academic:
        'bg-gradient-to-r from-amber-50 to-orange-50/60 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border border-amber-300/80 dark:border-amber-800/60 hover:from-amber-100 hover:to-orange-100/80 dark:hover:bg-amber-900/50 shadow-xs focus-visible:ring-amber-500 font-semibold',
    }

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-3.5 py-2 h-9 gap-2',
      lg: 'text-base px-5 py-2.5 h-11 gap-2.5',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'
