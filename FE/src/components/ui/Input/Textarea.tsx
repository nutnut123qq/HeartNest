'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-secondary-300 focus-visible:ring-primary-500',
        error: 'border-error-500 focus-visible:ring-error-500',
        success: 'border-success-500 focus-visible:ring-success-500',
      },
      size: {
        default: 'min-h-[80px]',
        sm: 'min-h-[60px] px-2 text-xs',
        lg: 'min-h-[120px] px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
  maxLength?: number
  showCharCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    size,
    label,
    error,
    helperText,
    containerClassName,
    maxLength,
    showCharCount = false,
    value,
    id,
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error
    const finalVariant = hasError ? 'error' : variant
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        
        <textarea
          className={cn(textareaVariants({ variant: finalVariant, size, className }))}
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        
        <div className="flex justify-between items-center">
          <div>
            {(error || helperText) && (
              <p className={cn(
                'text-sm',
                hasError ? 'text-error-600' : 'text-secondary-600'
              )}>
                {error || helperText}
              </p>
            )}
          </div>
          
          {showCharCount && maxLength && (
            <p className={cn(
              'text-xs',
              currentLength > maxLength * 0.9 ? 'text-warning-600' : 'text-secondary-500'
            )}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
