import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle,
    ClipboardCheck,
    Edit,
    Eye,
    MapPin,
    Plus,
    Search,
    TrendingUp,
    User,
    XCircle,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm, router } from '@inertiajs/react';

interface Apar {
    id: number;
    number: string;
    location: string;
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
    apar: Apar;
    inspector: Inspector;
}

interface InspectionIndexProps {
    inspections: {
        data: Inspection[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function InspectionIndex({ inspections }: InspectionIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
    const { processing } = useForm();

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'good':
                return {
                    variant: 'default' as const,
                    icon: CheckCircle,
                    text: 'Baik',
                    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
                };
            case 'needs_attention':
                return {
                    variant: 'secondary' as const,
                    icon: AlertTriangle,
                    text: 'Perlu Perhatian',
                    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
                };
            case 'critical':
                return {
                    variant: 'destructive' as const,
                    icon: XCircle,
                    text: 'Kritis',
                    color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
                };
            default:
                return {
                    variant: 'outline' as const,
                    icon: CheckCircle,
                    text: status,
                    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                };
        }
    };

    const handleDelete = (inspection: Inspection) => {
        setSelectedInspection(inspection);
        setDeleteDialogOpen(true);
    };
    const confirmDelete = () => {
        if (!selectedInspection) return;
        router.delete(`/inspections/${selectedInspection.id}`, {
            onFinish: () => {
                setDeleteDialogOpen(false);
                setSelectedInspection(null);
            },
        });
    };

    const filteredInspections = inspections.data.filter(
        (inspection) =>
            inspection.apar.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inspection.apar.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inspection.inspector.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Stats calculation
    const stats = {
        total: inspections.total,
        good: inspections.data.filter((i) => i.overall_status === 'good').length,
        needsAttention: inspections.data.filter((i) => i.overall_status === 'needs_attention').length,
        critical: inspections.data.filter((i) => i.overall_status === 'critical').length,
    };

    return (
        <>
            <Head title="Inspeksi - Sistem Monitoring APAR" />

            <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <ClipboardCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Inspeksi APAR</h1>
                                    <p className="text-muted-foreground">Monitoring dan tracking pemeriksaan rutin</p>
                                </div>
                            </div>
                        </div>
                        <Button asChild size="lg">
                            <Link href="/inspections/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Inspeksi Baru
                            </Link>
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Inspeksi</p>
                                        <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                                        <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status Baik</p>
                                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.good}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                                        <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Perlu Perhatian</p>
                                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.needsAttention}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                                        <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status Kritis</p>
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                                        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filter */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-2">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm font-medium text-foreground">Pencarian & Filter</span>
                                </div>
                                <div className="flex max-w-md flex-1">
                                    <div className="relative w-full">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari nomor APAR, lokasi, atau petugas..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inspections List */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-foreground">Daftar Inspeksi</CardTitle>
                                <Badge variant="outline">
                                    {filteredInspections.length} dari {inspections.total} inspeksi
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Tanggal Inspeksi
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    APAR
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Lokasi
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Petugas
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredInspections.map((inspection, index) => {
                                                const statusConfig = getStatusConfig(inspection.overall_status);
                                                const StatusIcon = statusConfig.icon;

                                                return (
                                                    <tr
                                                        key={inspection.id}
                                                        className={`transition-colors hover:bg-gray-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {formatDate(inspection.inspection_date)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-semibold text-gray-900">{inspection.apar.number}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-3 w-3 flex-shrink-0 text-gray-400" />
                                                                <span className="truncate text-sm text-gray-600">{inspection.apar.location}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                                                                    <User className="h-3 w-3 text-gray-600" />
                                                                </div>
                                                                <span className="text-sm text-gray-900">{inspection.inspector.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Badge className={`${statusConfig.color} flex w-fit items-center gap-1 border`}>
                                                                <StatusIcon className="h-3 w-3" />
                                                                {statusConfig.text}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0">
                                                                    <Link href={`/inspections/${inspection.id}`}>
                                                                        <Eye className="h-3 w-3" />
                                                                    </Link>
                                                                </Button>
                                                                <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0">
                                                                    <Link href={`/inspections/${inspection.id}/edit`}>
                                                                        <Edit className="h-3 w-3" />
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    className="h-8 w-8 p-0"
                                                                    onClick={() => handleDelete(inspection)}
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="space-y-4 p-6 md:hidden">
                                {filteredInspections.map((inspection) => {
                                    const statusConfig = getStatusConfig(inspection.overall_status);
                                    const StatusIcon = statusConfig.icon;

                                    return (
                                        <Card key={inspection.id} className="border border-gray-200">
                                            <CardContent className="space-y-3 p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                                            <Calendar className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {formatDate(inspection.inspection_date)}
                                                        </span>
                                                    </div>
                                                    <Badge className={`${statusConfig.color} flex items-center gap-1 border`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusConfig.text}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">APAR:</span>
                                                        <span className="text-sm font-semibold text-gray-900">{inspection.apar.number}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-3 w-3 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{inspection.apar.location}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3 w-3 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{inspection.inspector.name}</span>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="flex justify-end gap-2">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/inspections/${inspection.id}`}>
                                                            <Eye className="mr-1 h-3 w-3" />
                                                            Lihat
                                                        </Link>
                                                    </Button>
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/inspections/${inspection.id}/edit`}>
                                                            <Edit className="mr-1 h-3 w-3" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(inspection)}
                                                    >
                                                        <Trash2 className="mr-1 h-3 w-3" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {filteredInspections.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                                        <ClipboardCheck className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                                        {searchTerm ? 'Tidak Ada Hasil' : 'Belum Ada Inspeksi'}
                                    </h3>
                                    <p className="max-w-sm text-center text-gray-500">
                                        {searchTerm
                                            ? `Tidak ada inspeksi yang cocok dengan pencarian "${searchTerm}"`
                                            : 'Belum ada inspeksi yang terdaftar. Mulai dengan membuat inspeksi baru.'}
                                    </p>
                                    {!searchTerm && (
                                        <Button asChild className="mt-4">
                                            <Link href="/inspections/create">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Buat Inspeksi Pertama
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {inspections.last_page > 1 && (
                        <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-gray-600">
                                        Menampilkan <span className="font-medium">{(inspections.current_page - 1) * inspections.per_page + 1}</span>{' '}
                                        sampai{' '}
                                        <span className="font-medium">
                                            {Math.min(inspections.current_page * inspections.per_page, inspections.total)}
                                        </span>{' '}
                                        dari <span className="font-medium">{inspections.total}</span> inspeksi
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                        <span className="text-sm text-gray-600">
                                            Halaman {inspections.current_page} dari {inspections.last_page}
                                        </span>
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
                    <p>Apakah Anda yakin ingin menghapus inspeksi pada APAR <b>{selectedInspection?.apar.number}</b> tanggal <b>{selectedInspection && formatDate(selectedInspection.inspection_date)}</b>? Tindakan ini tidak dapat dibatalkan.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={processing}>Batal</Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={processing}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

InspectionIndex.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
