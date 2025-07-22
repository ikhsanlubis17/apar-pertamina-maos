import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, FireExtinguisher, Menu, Moon, Shield, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const [open, setOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const isAdmin = auth?.user?.role === 'admin';

    const navItems = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/apars', label: 'APAR' },
        { href: '/inspections', label: 'Inspeksi' },
    ];

    const adminNavItems = [{ href: '/admin/dashboard', label: 'Dashboard Admin', icon: Shield }];

    const isActiveRoute = (href: string) => {
        return page.url.startsWith(href);
    };

    const navLinks = (
        <>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'block rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                        isActiveRoute(item.href) && 'bg-blue-50 font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                    )}
                    onClick={() => setOpen(false)}
                >
                    {item.label}
                </Link>
            ))}
            {isAdmin && (
                <>
                    <div className="mt-2 px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Panel Admin</div>
                    {adminNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'block rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                isActiveRoute(item.href) && 'bg-blue-50 font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                            )}
                            onClick={() => setOpen(false)}
                        >
                            <div className="flex items-center gap-2">
                                {item.icon && <item.icon className="h-4 w-4" />}
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </>
            )}
        </>
    );

    const desktopNavLinks = (
        <div className="flex items-center gap-4">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                        isActiveRoute(item.href) && 'font-semibold text-blue-600 dark:text-blue-400',
                    )}
                >
                    {item.label}
                </Link>
            ))}
            {isAdmin && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                            <Shield className="h-4 w-4" />
                            <span>Admin</span>
                            <ChevronDown className="ml-1 h-3 w-3 opacity-70" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                        {adminNavItems.map((item) => (
                            <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                                <Link href={item.href} className="w-full">
                                    <div className="flex items-center gap-2">
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        {item.label}
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <FireExtinguisher className="h-6 w-6 text-blue-600" />
                            <span className="text-lg font-bold text-gray-900 dark:text-white">APAR Monitor</span>
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    {auth && auth.user ? <div className="hidden flex-1 items-center justify-center lg:flex">{desktopNavLinks}</div> : null}

                    {/* Right side: User menu or Auth links */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle Button */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme('light')}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('dark')}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('system')}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Hamburger */}
                        {auth && auth.user ? (
                            <div className="lg:hidden">
                                <Sheet open={open} onOpenChange={setOpen}>
                                    <SheetTrigger asChild>
                                        <button
                                            className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
                                            aria-label="Buka menu"
                                        >
                                            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-72 p-0 dark:bg-gray-900">
                                        <SheetHeader className="border-b px-6 py-4 dark:border-gray-800">
                                            <div className="flex items-center justify-between">
                                                <SheetTitle className="flex items-center gap-2 text-left">
                                                    <FireExtinguisher className="h-5 w-5 text-blue-600" />
                                                    <span className="font-bold text-gray-900 dark:text-white">Menu</span>
                                                </SheetTitle>
                                                <button
                                                    onClick={() => setOpen(false)}
                                                    className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
                                                    aria-label="Tutup menu"
                                                >
                                                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                </button>
                                            </div>
                                        </SheetHeader>
                                        <div className="flex h-full flex-col space-y-2 p-4">{navLinks}</div>
                                        <div className="border-t p-4 dark:border-gray-800">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                            <AvatarFallback>{auth.user.name?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {auth.user.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">Pengguna</span>
                                                        </div>
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <UserMenuContent user={auth.user} />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        ) : null}

                        {/* Desktop User Menu */}
                        {auth && auth.user ? (
                            <div className="hidden items-center lg:flex">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                <AvatarFallback>{auth.user.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{auth.user.name}</span>
                                            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="rounded-lg px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
