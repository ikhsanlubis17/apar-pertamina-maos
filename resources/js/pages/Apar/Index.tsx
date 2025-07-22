import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    FireExtinguisher, 
    Plus, 
    Search, 
    Eye, 
    Edit, 
    CheckCircle,
    MapPin,
    Calendar,
    Droplets,
    Activity,
    Filter,
    Grid3X3,
    List,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useForm, router } from '@inertiajs/react';

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
    latest_inspection?: {
        inspection_date: string;
        overall_status: string;
    };
}

interface AparIndexProps {
    apars: {
        data: Apar[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function AparIndex({ apars }: AparIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedApar, setSelectedApar] = useState<Apar | null>(null);
    const { processing } = useForm();

    const filteredApars = apars.data.filter(apar =>
        apar.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apar.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apar.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusConfig = (status: string) => {
        const configs = {
            'active': { 
                color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300', 
                label: 'Aktif',
                dotColor: 'bg-emerald-500'
            },
            'inactive': { 
                color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', 
                label: 'Tidak Aktif',
                dotColor: 'bg-slate-500'
            },
            'expired': { 
                color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', 
                label: 'Kadaluarsa',
                dotColor: 'bg-red-500'
            },
            'maintenance': { 
                color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300', 
                label: 'Pemeliharaan',
                dotColor: 'bg-amber-500'
            }
        };
        return configs[status as keyof typeof configs] || {
            color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
            label: status,
            dotColor: 'bg-slate-500'
        };
    };

    const getTypeConfig = (type: string) => {
        const configs = {
            'powder': { label: 'Bubuk', icon: '🧯', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
            'co2': { label: 'CO2', icon: '💨', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
            'foam': { label: 'Busa', icon: '🫧', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
            'water': { label: 'Air', icon: '💧', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300' }
        };
        return configs[type as keyof typeof configs] || { 
            label: type, 
            icon: '🧯', 
            color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
        };
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const now = new Date();
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
    };

    const isExpired = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const now = new Date();
        return expiry < now;
    };

    const handleDelete = (apar: Apar) => {
        setSelectedApar(apar);
        setDeleteDialogOpen(true);
    };
    const confirmDelete = () => {
        if (!selectedApar) return;
        router.delete(`/apars/${selectedApar.id}`, {
            onFinish: () => {
                setDeleteDialogOpen(false);
                setSelectedApar(null);
            },
        });
    };

    return (
        <>
            <Head title="APAR - Sistem Monitoring APAR" />
            
            <div className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                APAR
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Informasi detail Alat Pemadam Api Ringan
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <FireExtinguisher className="h-4 w-4" />
                                    {apars.total} Total APAR
                                </span>
                                <span>•</span>
                                <span>{filteredApars.length} Ditampilkan</span>
                            </div>
                        </div>
                        <Button 
                            asChild 
                            size="lg"
                        >
                            <Link href="/apars/create">
                                <Plus className="mr-2 h-5 w-5" />
                                Tambah APAR
                            </Link>
                        </Button>
                    </div>

                    {/* Search and Controls */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari APAR berdasarkan nomor, lokasi, atau tipe..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'table' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('table')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content */}
                    {viewMode === 'grid' ? (
                        /* Grid View */
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredApars.map((apar) => {
                                const statusConfig = getStatusConfig(apar.status);
                                const typeConfig = getTypeConfig(apar.type);
                                const expiringSoon = isExpiringSoon(apar.expiry_date);
                                const expired = isExpired(apar.expiry_date);
                                
                                return (
                                    <Card 
                                        key={apar.id} 
                                        className="group relative overflow-hidden transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        
                                        <CardHeader className="relative pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="rounded-lg bg-primary/10 p-2">
                                                            <FireExtinguisher className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-lg font-bold text-foreground">
                                                                {apar.number}
                                                            </CardTitle>
                                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {apar.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col gap-2">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={`border font-medium ${statusConfig.color}`}
                                                    >
                                                        {statusConfig.label}
                                                    </Badge>
                                                    {(expired || expiringSoon) && (
                                                        <Badge 
                                                            variant="outline"
                                                            className={expired ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'}
                                                        >
                                                            {expired ? 'Expired' : 'Segera Expired'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="relative space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Tipe
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{typeConfig.icon}</span>
                                                        <span className="font-medium text-foreground">
                                                            {typeConfig.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Kapasitas
                                                    </p>
                                                    <p className="font-medium text-foreground flex items-center gap-1">
                                                        <Droplets className="h-3 w-3" />
                                                        {apar.capacity}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Tanggal Kadaluarsa
                                                </p>
                                                <p className={`font-medium flex items-center gap-1 ${
                                                    expired ? 'text-red-600 dark:text-red-400' : 
                                                    expiringSoon ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
                                                }`}>
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(apar.expiry_date)}
                                                </p>
                                            </div>

                                            {apar.latest_inspection && (
                                                <div className="rounded-lg bg-muted/50 p-3">
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                                        Inspeksi Terakhir
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-foreground">
                                                            {formatDate(apar.latest_inspection.inspection_date)}
                                                        </span>
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`text-xs ${getStatusConfig(apar.latest_inspection.overall_status).color}`}
                                                        >
                                                            {getStatusConfig(apar.latest_inspection.overall_status).label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                <Button asChild size="sm" variant="outline" className="flex-1">
                                                    <Link href={`/apars/${apar.id}`}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Detail
                                                    </Link>
                                                </Button>
                                                <Button asChild size="sm" variant="outline" className="flex-1">
                                                    <Link href={`/apars/${apar.id}/edit`}>
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    asChild 
                                                    size="sm" 
                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                >
                                                    <Link href={`/inspections/create?apar_id=${apar.id}`}>
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={() => handleDelete(apar)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        /* Table View */
                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="text-left p-4 font-semibold text-muted-foreground">Nomor</th>
                                                <th className="text-left p-4 font-semibold text-muted-foreground">Lokasi</th>
                                                <th className="text-left p-4 font-semibold text-muted-foreground">Tipe</th>
                                                <th className="text-left p-4 font-semibold text-muted-foreground">Kapasitas</th>
                                                <th className="text-left p-4 font-semibold text-muted-foreground">Kadaluarsa</th>
                                                <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                                                <th className="text-left p-4 font-semibold text-muted-foreground">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredApars.map((apar) => {
                                                const statusConfig = getStatusConfig(apar.status);
                                                const typeConfig = getTypeConfig(apar.type);
                                                const expiringSoon = isExpiringSoon(apar.expiry_date);
                                                const expired = isExpired(apar.expiry_date);
                                                
                                                return (
                                                    <tr 
                                                        key={apar.id} 
                                                        className="border-b transition-colors hover:bg-muted/50"
                                                    >
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="rounded-lg bg-primary/10 p-2">
                                                                    <FireExtinguisher className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <span className="font-semibold text-foreground">
                                                                    {apar.number}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <MapPin className="h-3 w-3" />
                                                                {apar.location}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm">{typeConfig.icon}</span>
                                                                <span className="text-muted-foreground">{typeConfig.label}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <Droplets className="h-3 w-3" />
                                                                {apar.capacity}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="space-y-1">
                                                                <div className={`flex items-center gap-1 ${
                                                                    expired ? 'text-red-600 dark:text-red-400' : 
                                                                    expiringSoon ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                                                                }`}>
                                                                    <Calendar className="h-3 w-3" />
                                                                    {formatDate(apar.expiry_date)}
                                                                </div>
                                                                {(expired || expiringSoon) && (
                                                                    <Badge 
                                                                        variant="outline"
                                                                        className={`text-xs ${expired ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'}`}
                                                                    >
                                                                        {expired ? 'Expired' : 'Segera Expired'}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge 
                                                                variant="outline" 
                                                                className={`border font-medium ${statusConfig.color}`}
                                                            >
                                                                {statusConfig.label}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <Button asChild size="sm" variant="outline">
                                                                    <Link href={`/apars/${apar.id}`}>
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button asChild size="sm" variant="outline">
                                                                    <Link href={`/apars/${apar.id}/edit`}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button 
                                                                    asChild 
                                                                    size="sm" 
                                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                                >
                                                                    <Link href={`/inspections/create?apar_id=${apar.id}`}>
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleDelete(apar)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty State */}
                    {filteredApars.length === 0 && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="rounded-full bg-muted p-4 mb-4">
                                    <FireExtinguisher className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {searchTerm ? 'APAR Tidak Ditemukan' : 'Belum Ada APAR'}
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    {searchTerm 
                                        ? `Tidak ada APAR yang cocok dengan pencarian "${searchTerm}"`
                                        : 'Mulai dengan menambahkan APAR pertama untuk sistem monitoring'
                                    }
                                </p>
                                {!searchTerm && (
                                    <Button asChild size="lg">
                                        <Link href="/apars/create">
                                            <Plus className="mr-2 h-5 w-5" />
                                            Tambah APAR Pertama
                                        </Link>
                                    </Button>
                                )}
                                {searchTerm && (
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setSearchTerm('')}
                                        size="lg"
                                    >
                                        Hapus Filter
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Konfirmasi Hapus APAR</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground">Apakah Anda yakin ingin menghapus APAR <b>{selectedApar?.number}</b>? Tindakan ini tidak dapat dibatalkan.</p>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={processing}>Batal</Button>
                  <Button variant="destructive" onClick={confirmDelete} disabled={processing}>Hapus</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </>
    );
}

AparIndex.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;