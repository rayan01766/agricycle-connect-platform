import { cn } from './Button';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'neutral';
    className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
    const variants = {
        success: 'bg-green-100 text-green-700 border-green-200',
        warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        danger: 'bg-red-100 text-red-700 border-red-200',
        neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
        <span
            className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
