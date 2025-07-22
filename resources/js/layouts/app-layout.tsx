import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/ui/footer';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <>
        <Navbar />
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
        <Footer />
    </>
);
