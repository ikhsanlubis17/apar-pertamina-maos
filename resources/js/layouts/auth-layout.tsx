import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import Navbar from '@/components/Navbar';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <>
            <Navbar />
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </>
    );
}
