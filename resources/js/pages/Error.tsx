import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ErrorProps {
    status: number;
    title: string;
    message: string;
}

export default function Error({ status, title, message }: ErrorProps) {
    return (
        <>
            <Head title={`Error ${status} - Sistem Monitoring APAR`} />
            
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground">
                            {status} - {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <p className="text-muted-foreground">
                            {message}
                        </p>
                        
                        <div className="flex flex-col space-y-3">
                            <Button asChild>
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Kembali ke Dashboard
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" onClick={() => window.history.back()}>
                                <div>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
} 