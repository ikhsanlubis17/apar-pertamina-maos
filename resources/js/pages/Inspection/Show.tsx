import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Calendar, Check, CheckCircle, Clock, Download, Edit, FileText, MapPin, Shield, User, X, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface InspectionItem {
    id: number;
    item_type: string;
    status: string;
    notes?: string;
}

interface Apar {
    id: number;
    number: string;
    location: string;
    type: string;
    capacity: string;
}

interface Inspector {
    id: number;
    name: string;
}

interface Inspection {
    id: number;
    inspection_date: string;
    overall_status: string;
    notes?: string;
    digital_signature?: string;
    apar: Apar;
    inspector: Inspector;
    items: InspectionItem[];
}

interface InspectionShowProps {
    inspection: Inspection;
}

export default function InspectionShow({ inspection }: InspectionShowProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
            case 'needs_attention':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
            case 'critical':
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'good':
                return 'Baik';
            case 'needs_attention':
                return 'Perlu Perhatian';
            case 'critical':
                return 'Kritis';
            default:
                return 'Unknown';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'powder':
                return 'Powder';
            case 'co2':
                return 'CO2';
            case 'foam':
                return 'Foam';
            case 'liquid':
                return 'Liquid';
            default:
                return 'Unknown';
        }
    };

    const getItemTypeLabel = (type: string) => {
        switch (type) {
            case 'hose':
                return 'Selang';
            case 'safety_pin':
                return 'Pin Pengaman';
            case 'content':
                return 'Isi Tabung';
            case 'handle':
                return 'Handle';
            case 'pressure':
                return 'Tekanan Gas';
            case 'funnel':
                return 'Corong Bawah';
            case 'cleanliness':
                return 'Kebersihan';
            default:
                return 'Unknown';
        }
    };

    const getItemStatusIcon = (status: string) => {
        switch (status) {
            case 'good':
                return <Check className="h-4 w-4 text-emerald-600" />;
            case 'damaged':
            case 'needs_repair':
                return <X className="h-4 w-4 text-red-600" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-amber-600" />;
        }
    };

    const getItemStatusColor = (status: string) => {
        switch (status) {
            case 'good':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
            case 'damaged':
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            case 'needs_repair':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    const getItemStatusLabel = (status: string) => {
        switch (status) {
            case 'good':
                return 'Baik';
            case 'damaged':
                return 'Rusak';
            case 'needs_repair':
                return 'Perlu Perbaikan';
            default:
                return 'Unknown';
        }
    };

    const getOverallStatusIcon = (status: string) => {
        switch (status) {
            case 'good':
                return <CheckCircle className="h-8 w-8 text-emerald-600" />;
            case 'needs_attention':
                return <AlertTriangle className="h-8 w-8 text-amber-600" />;
            case 'critical':
                return <X className="h-8 w-8 text-red-600" />;
            default:
                return <Shield className="h-8 w-8 text-slate-600" />;
        }
    };

    const inspectionSummary = {
        total: inspection.items.length,
        good: inspection.items.filter((item) => item.status === 'good').length,
        needsAttention: inspection.items.filter((item) => item.status === 'needs_repair').length,
        damaged: inspection.items.filter((item) => item.status === 'damaged').length,
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { processing } = useForm();
    const handleDelete = () => setDeleteDialogOpen(true);
    const confirmDelete = () => {
        router.delete(`/inspections/${inspection.id}`, {
            onFinish: () => setDeleteDialogOpen(false),
        });
    };

    return (
        <>
            <Head title={`Inspeksi APAR ${inspection.apar.number} - Sistem Monitoring APAR`} />

            <div className="min-h-screen bg-background">
                {/* Header Section */}
                <div className="border-b bg-card">
                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        {/* Navigation & Actions */}
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="self-start text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                            >
                                <Link href="/inspections">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Daftar
                                </Link>
                            </Button>

                            <div className="flex gap-2 sm:gap-3">
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Export</span>
                                </Button>
                                <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Link href={`/inspections/${inspection.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Edit</span>
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Hapus</span>
                                </Button>
                            </div>
                        </div>

                        {/* Main Header Content */}
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                            {/* Title & Info */}
                            <div className="flex-1 space-y-6">
                                {/* Title with Status Icon */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 rounded-full border bg-card p-3 shadow-sm">
                                        {getOverallStatusIcon(inspection.overall_status)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">APAR {inspection.apar.number}</h1>
                                        <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                                            Inspeksi pada{' '}
                                            <span className="font-medium">
                                                {new Date(inspection.inspection_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Status & Meta Information */}
                                <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                                    <Badge variant="outline" className={`${getStatusColor(inspection.overall_status)} px-3 py-1 text-sm font-medium`}>
                                        {getStatusLabel(inspection.overall_status)}
                                    </Badge>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">{inspection.inspector.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">{inspection.apar.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Card */}
                            <div className="w-full lg:w-auto">
                                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                            <CheckCircle className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">Ringkasan Pemeriksaan</h3>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="mb-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{inspectionSummary.good}</div>
                                            <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Baik</div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="mb-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{inspectionSummary.needsAttention}</div>
                                            <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Perlu Perhatian</div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="mb-1 text-2xl font-bold text-red-600 dark:text-red-400">{inspectionSummary.damaged}</div>
                                            <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Rusak</div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="mb-1 text-2xl font-bold text-foreground">{inspectionSummary.total}</div>
                                            <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Total Item</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-8 px-6 py-8">
                    {/* Main Information Cards */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* APAR Details */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-foreground">Informasi APAR</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Nomor</label>
                                        <p className="mt-1 text-lg font-semibold text-foreground">{inspection.apar.number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Jenis</label>
                                        <p className="mt-1 text-lg font-semibold text-foreground">{getTypeLabel(inspection.apar.type)}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Kapasitas</label>
                                        <p className="mt-1 text-lg font-semibold text-foreground">{inspection.apar.capacity}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Lokasi</label>
                                        <p className="mt-1 text-lg font-semibold text-foreground">{inspection.apar.location}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Inspection Details */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-foreground">Detail Inspeksi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-muted-foreground">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            Tanggal
                                        </label>
                                        <p className="mt-1 text-lg font-semibold text-foreground">
                                            {new Date(inspection.inspection_date).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-muted-foreground">
                                            <Clock className="mr-1 h-4 w-4" />
                                            Status
                                        </label>
                                        <Badge variant="outline" className={`${getStatusColor(inspection.overall_status)} mt-2`}>
                                            {getStatusLabel(inspection.overall_status)}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center text-sm font-medium text-muted-foreground">
                                        <User className="mr-1 h-4 w-4" />
                                        Petugas Inspeksi
                                    </label>
                                    <p className="mt-1 text-lg font-semibold text-foreground">{inspection.inspector.name}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Notes Section */}
                    {inspection.notes && (
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                                    <FileText className="mr-2 h-5 w-5" />
                                    Catatan Inspeksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="leading-relaxed text-muted-foreground">{inspection.notes}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Inspection Items */}
                    <Card>
                        <CardHeader className="pb-6">
                            <CardTitle className="text-lg font-semibold text-foreground">Detail Pemeriksaan</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">Kondisi setiap komponen yang diperiksa</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {inspection.items.map((item) => (
                                    <div key={item.id} className="group relative">
                                        <div className="rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-md">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="font-semibold text-foreground">{getItemTypeLabel(item.item_type)}</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                                        {getItemStatusIcon(item.status)}
                                                    </div>
                                                </div>
                                            </div>

                                            <Badge variant="outline" className={`${getItemStatusColor(item.status)} font-medium`}>
                                                {getItemStatusLabel(item.status)}
                                            </Badge>

                                            {item.notes && (
                                                <div className="mt-4 rounded-lg border bg-muted/50 p-3">
                                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                                        <span className="font-medium">Catatan:</span> {item.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Digital Signature */}
                    {inspection.digital_signature && (
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-foreground">Tanda Tangan Digital</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl border bg-muted/50 p-6">
                                    <p className="mb-3 text-sm font-medium text-muted-foreground">Verifikasi petugas inspeksi</p>
                                    <div className="rounded-lg border bg-card p-4">
                                        <code className="text-sm break-all text-foreground">{inspection.digital_signature}</code>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus Inspeksi</DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">Apakah Anda yakin ingin menghapus inspeksi pada APAR <b>{inspection.apar.number}</b> tanggal <b>{new Date(inspection.inspection_date).toLocaleDateString('id-ID')}</b>? Tindakan ini tidak dapat dibatalkan.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={processing}>Batal</Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={processing}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

InspectionShow.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
