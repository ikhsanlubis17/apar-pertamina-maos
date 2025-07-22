import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    FireExtinguisher, 
    CheckCircle, 
    AlertTriangle, 
    Clock,
    TrendingUp,
    Calendar,
    MapPin,
    BarChart3,
    Activity,
    Plus
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface DashboardProps {
    stats: {
        totalApars: number;
        activeApars: number;
        expiredApars: number;
        expiringSoon: number;
    };
    recentInspections: Array<{
        id: number;
        inspection_date: string;
        overall_status: string;
        apar: {
            number: string;
            location: string;
        };
        inspector: {
            name: string;
        };
    }>;
    monthlyInspections: Array<{
        month: number;
        count: number;
    }>;
    aparStatusDistribution: Array<{
        status: string;
        count: number;
    }>;
}

export default function Dashboard({ 
    stats, 
    recentInspections, 
    monthlyInspections, 
    aparStatusDistribution 
}: DashboardProps) {
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    const getStatusConfig = (status: string) => {
        const configs = {
            'good': { 
                color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300', 
                label: 'Baik',
                dotColor: 'bg-emerald-500'
            },
            'needs_attention': { 
                color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300', 
                label: 'Perlu Perbaikan',
                dotColor: 'bg-amber-500'
            },
            'critical': { 
                color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', 
                label: 'Rusak',
                dotColor: 'bg-red-500'
            },
            'active': {
                color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
                label: 'Aktif',
                dotColor: 'bg-emerald-500'
            },
            'inactive': {
                color: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300',
                label: 'Tidak Aktif',
                dotColor: 'bg-slate-500'
            },
            'expired': {
                color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
                label: 'Kadaluarsa',
                dotColor: 'bg-red-500'
            }
        };
        return configs[status as keyof typeof configs] || {
            color: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300',
            label: 'Tidak Diketahui',
            dotColor: 'bg-slate-500'
        };
    };

    const maxInspections = Math.max(...monthlyInspections.map(m => m.count), 1);

    return (
        <>
            <Head title="Dashboard - Sistem Monitoring APAR" />
            
            <div className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                Dashboard
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Sistem Monitoring APAR
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button 
                                asChild 
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                            >
                                <Link href="/apars/create">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Tambah APAR
                                </Link>
                            </Button>
                            <Button 
                                asChild 
                                variant="outline" 
                                size="lg"
                                className="border-slate-300 hover:bg-slate-50"
                            >
                                <Link href="/inspections/create">
                                    <Activity className="mr-2 h-5 w-5" />
                                    Inspeksi Baru
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50/50 shadow-lg shadow-blue-600/5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-semibold text-muted-foreground">
                                    Total APAR
                                </CardTitle>
                                <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2.5">
                                    <FireExtinguisher className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold text-foreground">
                                    {stats.totalApars.toLocaleString('id-ID')}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Total APAR terdaftar
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50/50 shadow-lg shadow-emerald-600/5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-600/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-semibold text-muted-foreground">
                                    APAR Aktif
                                </CardTitle>
                                <div className="rounded-full bg-emerald-100 p-2.5">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold text-emerald-700">
                                    {stats.activeApars.toLocaleString('id-ID')}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Status aktif dan siap
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-red-50/50 shadow-lg shadow-red-600/5 transition-all duration-300 hover:shadow-xl hover:shadow-red-600/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-semibold text-muted-foreground">
                                    APAR Kadaluarsa
                                </CardTitle>
                                <div className="rounded-full bg-red-100 p-2.5">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold text-red-700">
                                    {stats.expiredApars.toLocaleString('id-ID')}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Perlu penggantian segera
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-amber-50/50 shadow-lg shadow-amber-600/5 transition-all duration-300 hover:shadow-xl hover:shadow-amber-600/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-semibold text-muted-foreground">
                                    Akan Kadaluarsa
                                </CardTitle>
                                <div className="rounded-full bg-amber-100 p-2.5">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold text-amber-700">
                                    {stats.expiringSoon.toLocaleString('id-ID')}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Perlu perhatian khusus
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Recent Inspections */}
                        <Card className="border-0 bg-white shadow-lg shadow-slate-900/5 lg:col-span-8">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                                        <div className="rounded-lg bg-blue-100 dark:bg-blue-900/50 p-2">
                                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        Inspeksi Terbaru
                                    </CardTitle>
                                    <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-accent">
                                        <Link href="/inspections">
                                            Lihat Semua
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {recentInspections.length > 0 ? (
                                        recentInspections.map((inspection: any, index: number) => {
                                            const statusConfig = getStatusConfig(inspection.overall_status);
                                            return (
                                                <div 
                                                    key={inspection.id} 
                                                    className="flex items-center justify-between p-6 transition-colors hover:bg-accent/50"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${statusConfig.color}`}>
                                                            <div className={`h-3 w-3 rounded-full ${statusConfig.dotColor}`} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="font-semibold text-foreground">
                                                                APAR {inspection.apar.number}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                <MapPin className="h-3 w-3" />
                                                                {inspection.apar.location}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`font-medium ${statusConfig.color}`}
                                                        >
                                                            {statusConfig.label}
                                                        </Badge>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium text-foreground">
                                                                {new Date(inspection.inspection_date).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short'
                                                                })}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {inspection.inspector.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="rounded-full bg-muted p-4 mb-4">
                                                <Activity className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                                Belum Ada Inspeksi
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                Mulai dengan melakukan inspeksi APAR pertama
                                            </p>
                                            <Button asChild size="sm">
                                                <Link href="/inspections/create">
                                                    Buat Inspeksi
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Monthly Inspections Chart */}
                        <Card className="border-0 bg-white shadow-lg shadow-slate-900/5 lg:col-span-4">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                                    <div className="rounded-lg bg-emerald-100 p-2">
                                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    Inspeksi Bulanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {monthlyInspections.map((item) => (
                                        <div key={item.month} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-foreground">
                                                    {monthNames[item.month - 1]}
                                                </span>
                                                <span className="text-sm font-bold text-foreground">
                                                    {item.count}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                <div 
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700" 
                                                    style={{ 
                                                        width: `${Math.max((item.count / maxInspections) * 100, 4)}%` 
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* APAR Status Distribution */}
                    <Card className="border-0 bg-white shadow-lg shadow-slate-900/5">
                        <CardHeader className="border-b border-slate-100 pb-6">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                                <div className="rounded-lg bg-violet-100 p-2">
                                    <TrendingUp className="h-5 w-5 text-violet-600" />
                                </div>
                                Distribusi Status APAR
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {aparStatusDistribution.map((item: any) => {
                                    const statusConfig = getStatusConfig(item.status);
                                    return (
                                        <div 
                                            key={item.status} 
                                            className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-3 w-3 rounded-full ${statusConfig.dotColor}`} />
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {statusConfig.label}
                                                        </span>
                                                    </div>
                                                    <div className="text-2xl font-bold text-foreground">
                                                        {item.count.toLocaleString('id-ID')}
                                                    </div>
                                                </div>
                                                <div className={`rounded-full p-3 ${statusConfig.color}`}>
                                                    <FireExtinguisher className={`h-6 w-6 ${statusConfig.dotColor.replace('bg-', 'text-')}`} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: any) => <AppLayout>{page}</AppLayout>;