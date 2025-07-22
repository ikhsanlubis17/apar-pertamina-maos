import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Activity, AlertTriangle, ArrowLeft, Calendar, CheckCircle, Clock, Edit, FileText, FireExtinguisher, MapPin, Plus, User, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface InspectionItem {
    id: number;
    item_type: string;
    status: string;
    notes?: string;
}

interface Inspection {
    id: number;
    inspection_date: string;
    overall_status: string;
    notes?: string;
    inspector: {
        name: string;
    };
    items: InspectionItem[];
}

interface Apar {
    id: number;
    number: string;
    location: string;
    type: string;
    capacity: string;
    fill_date: string;
    expiry_date: string;
    status: string;
    notes?: string;
    inspections: Inspection[];
}

interface AparShowProps {
    apar: Apar;
}

// Tambahkan tipe status
type AparStatus = 'active' | 'inactive' | 'expired' | 'maintenance';
type OverallStatus = 'good' | 'needs_attention' | 'critical';

export default function AparShow({ apar }: AparShowProps) {
    const getStatusConfig = (status: string) => {
        const configs: Record<AparStatus, { color: string; label: string; icon: React.ElementType }> = {
            active: {
                color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
                label: 'Aktif',
                icon: CheckCircle,
            },
            inactive: {
                color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
                label: 'Tidak Aktif',
                icon: Clock,
            },
            expired: {
                color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
                label: 'Kadaluarsa',
                icon: AlertTriangle,
            },
            maintenance: {
                color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
                label: 'Pemeliharaan',
                icon: Activity,
            },
        };
        return configs[status as AparStatus] || configs['inactive'];
    };

    const getOverallStatusConfig = (status: string) => {
        const configs: Record<OverallStatus, { color: string; label: string }> = {
            good: {
                color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
                label: 'Baik',
            },
            needs_attention: {
                color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
                label: 'Perlu Perhatian',
            },
            critical: {
                color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
                label: 'Kritis',
            },
        };
        return configs[status as OverallStatus] || configs['good'];
    };

    const getTypeLabel = (type: string) => {
        const typeLabels: Record<string, string> = {
            powder: 'Bubuk',
            co2: 'CO2',
            foam: 'Busa',
            liquid: 'Cair',
        };
        return typeLabels[type] || type;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const statusConfig = getStatusConfig(apar.status);
    const StatusIcon = statusConfig.icon;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { processing } = useForm();
    const handleDelete = () => setDeleteDialogOpen(true);
    const confirmDelete = () => {
        router.delete(`/apars/${apar.id}`, {
            onFinish: () => setDeleteDialogOpen(false),
        });
    };

    return (
        <>
            <Head title={`APAR ${apar.number} - Sistem Monitoring APAR`} />

            <div className="min-h-screen bg-background">
                
                {/* Header Section */}
                <header className="sticky top-0 z-30 border-b bg-card">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Wrapper: mobile stack, desktop row */}
                        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-6">
                            {/* Left: Back + APAR Info */}
                            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                                <Button asChild variant="ghost" size="sm" className="shrink-0 text-muted-foreground hover:text-foreground">
                                    <Link href="/apars" className="inline-flex items-center">
                                        <ArrowLeft className="mr-0 h-4 w-4 sm:mr-2" />
                                        <span className="hidden sm:inline">Kembali</span>
                                    </Link>
                                </Button>

                                <div className="border-l pl-3 sm:pl-4">
                                    <div className="flex items-start gap-3 sm:items-center">
                                        <div className="shrink-0 rounded-lg bg-muted p-2">
                                            <FireExtinguisher className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0">
                                            <h1 className="text-xl font-bold text-foreground sm:text-2xl">APAR {apar.number}</h1>
                                            <p className="mt-1 flex items-center gap-1 truncate text-sm text-muted-foreground">
                                                <MapPin className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{apar.location}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions (shown on >=sm) */}
                            <div className="hidden items-center gap-3 sm:flex">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/apars/${apar.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={`/inspections/create?apar_id=${apar.id}`}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Inspeksi
                                    </Link>
                                </Button>
                            </div>

                            {/* Mobile Actions (shown <sm) */}
                            <div className="grid grid-cols-2 gap-2 sm:hidden">
                                <Button asChild size="sm" variant="outline" className="w-full">
                                    <Link href={`/apars/${apar.id}/edit`}>
                                        <Edit className="mr-1 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button asChild size="sm" className="w-full">
                                    <Link href={`/inspections/create?apar_id=${apar.id}`}>
                                        <Plus className="mr-1 h-4 w-4" />
                                        Inspeksi
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Information */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Status Overview */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-foreground">Status Overview</h3>
                                        <div
                                            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.color}`}
                                        >
                                            <StatusIcon className="mr-2 h-4 w-4" />
                                            {statusConfig.label}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                                        <div className="rounded-xl bg-muted/50 p-4 text-center">
                                            <div className="text-2xl font-bold text-foreground">{getTypeLabel(apar.type)}</div>
                                            <div className="mt-1 text-xs text-muted-foreground">Jenis</div>
                                        </div>
                                        <div className="rounded-xl bg-muted/50 p-4 text-center">
                                            <div className="text-2xl font-bold text-foreground">{apar.capacity}</div>
                                            <div className="mt-1 text-xs text-muted-foreground">Kapasitas</div>
                                        </div>
                                        <div className="rounded-xl bg-muted/50 p-4 text-center">
                                            <div className="text-2xl font-bold text-foreground">{apar.inspections.length}</div>
                                            <div className="mt-1 text-xs text-muted-foreground">Total Inspeksi</div>
                                        </div>
                                        <div className="rounded-xl bg-muted/50 p-4 text-center">
                                            <div className="text-2xl font-bold text-foreground">
                                                {apar.inspections.filter((i) => i.overall_status === 'good').length}
                                            </div>
                                            <div className="mt-1 text-xs text-muted-foreground">Inspeksi Baik</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Detailed Information */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-foreground">Informasi Detail</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Nomor APAR</label>
                                                <p className="mt-1 text-lg font-semibold text-foreground">{apar.number}</p>
                                            </div>

                                            <div>
                                                <label className="flex items-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    <MapPin className="mr-1 h-3 w-3" />
                                                    Lokasi
                                                </label>
                                                <p className="mt-1 text-lg text-muted-foreground">{apar.location}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="flex items-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    Tanggal Isi Ulang
                                                </label>
                                                <p className="mt-1 text-lg text-muted-foreground">{formatDate(apar.fill_date)}</p>
                                            </div>

                                            <div>
                                                <label className="flex items-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    Tanggal Kadaluarsa
                                                </label>
                                                <div className="mt-1 flex items-center space-x-2">
                                                    <p className="text-lg text-muted-foreground">{formatDate(apar.expiry_date)}</p>
                                                    {isExpiringSoon(apar.expiry_date) && (
                                                        <span className="inline-flex items-center rounded bg-amber-100 dark:bg-amber-900/50 px-2 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                                                            <AlertTriangle className="mr-1 h-3 w-3" />
                                                            Segera Expired
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {apar.notes && (
                                        <div className="border-t pt-4">
                                            <label className="flex items-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                <FileText className="mr-1 h-3 w-3" />
                                                Catatan
                                            </label>
                                            <p className="mt-2 leading-relaxed text-muted-foreground">{apar.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Recent Inspections */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                                            <Activity className="mr-2 h-5 w-5" />
                                            Inspeksi Terakhir
                                        </CardTitle>
                                        {apar.inspections.length > 3 && (
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/inspections?apar_id=${apar.id}`} className="text-xs">
                                                    Lihat Semua
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {apar.inspections.length > 0 ? (
                                        <div className="space-y-4">
                                            {apar.inspections.slice(0, 3).map((inspection, index) => {
                                                const statusConfig = getOverallStatusConfig(inspection.overall_status);
                                                return (
                                                    <div
                                                        key={inspection.id}
                                                        className={`rounded-xl border-l-4 p-4 ${
                                                            index === 0 ? 'border-l-primary bg-muted/50' : 'border-l-border bg-card'
                                                        }`}
                                                    >
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <span className="text-sm font-medium text-foreground">
                                                                {formatDate(inspection.inspection_date)}
                                                            </span>
                                                            <span
                                                                className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${statusConfig.color}`}
                                                            >
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center text-xs text-muted-foreground">
                                                            <User className="mr-1 h-3 w-3" />
                                                            {inspection.inspector.name}
                                                        </div>
                                                        {inspection.notes && (
                                                            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{inspection.notes}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                            <p className="mt-3 text-sm text-muted-foreground">Belum ada inspeksi</p>
                                            <Button asChild size="sm" className="mt-3">
                                                <Link href={`/inspections/create?apar_id=${apar.id}`}>Buat Inspeksi Pertama</Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-foreground">Aksi Cepat</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button asChild className="w-full justify-start" variant="outline">
                                        <Link href={`/inspections/create?apar_id=${apar.id}`}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Buat Inspeksi Baru
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full justify-start" variant="outline">
                                        <Link href={`/apars/${apar.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Informasi APAR
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full justify-start" variant="outline">
                                        <Link href={`/inspections?apar_id=${apar.id}`}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Riwayat Lengkap
                                        </Link>
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="destructive"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus APAR
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus APAR</DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">Apakah Anda yakin ingin menghapus APAR <b>{apar.number}</b>? Tindakan ini tidak dapat dibatalkan.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={processing}>Batal</Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={processing}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AparShow.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
