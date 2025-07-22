import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { useTheme } from '@/hooks/use-theme';

export default function AppSidebarLayout({ children }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    useTheme();
    return (
        <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
            {children}
        </div>
    );
}
