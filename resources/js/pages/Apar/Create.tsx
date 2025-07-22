import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, FileText, FireExtinguisher, Hash, MapPin, Scale } from 'lucide-react';

interface AparCreateProps {
    types: Record<string, string>;
    statuses: Record<string, string>;
}

export default function AparCreate({ types, statuses }: AparCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        number: '',
        location: '',
        type: '',
        capacity: '',
        fill_date: '',
        expiry_date: '',
        status: 'active',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/apars');
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { variant: 'default' as const, icon: CheckCircle2, text: 'Aktif' },
            maintenance: { variant: 'secondary' as const, icon: AlertCircle, text: 'Maintenance' },
            expired: { variant: 'destructive' as const, icon: AlertCircle, text: 'Kadaluarsa' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {config.text}
            </Badge>
        );
    };

    return (
        <>
            <Head title="Tambah APAR - Sistem Monitoring APAR" />

            <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* Header with breadcrumb style */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Link href="/apars">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Link href="/apars" className="transition-colors hover:text-foreground">
                                    APAR Management
                                </Link>
                                <span>/</span>
                                <span className="font-medium text-foreground">Tambah Baru</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <FireExtinguisher className="h-6 w-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Tambah APAR Baru</h1>
                                    <p className="text-muted-foreground">Daftarkan unit APAR baru ke dalam sistem monitoring</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Form Card */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="space-y-1 pb-6">
                                    <CardTitle className="text-lg font-semibold text-foreground">Informasi APAR</CardTitle>
                                    <p className="text-sm text-muted-foreground">Lengkapi data APAR yang akan didaftarkan</p>
                                </CardHeader>

                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Basic Information */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                <Hash className="h-4 w-4" />
                                                Identifikasi
                                            </div>

                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-3">
                                                    <Label htmlFor="number" className="text-sm font-medium text-foreground">
                                                        Nomor APAR <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="number"
                                                        value={data.number}
                                                        onChange={(e) => setData('number', e.target.value)}
                                                        placeholder="APAR-001"
                                                        className={`transition-all ${errors.number ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors.number && (
                                                        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.number}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        Lokasi <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="location"
                                                        value={data.location}
                                                        onChange={(e) => setData('location', e.target.value)}
                                                        placeholder="Lantai 1 - Ruang Server"
                                                        className={`transition-all ${errors.location ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors.location && (
                                                        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        {/* Technical Specifications */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                <Scale className="h-4 w-4" />
                                                Spesifikasi Teknis
                                            </div>

                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-3">
                                                    <Label htmlFor="type" className="text-sm font-medium text-foreground">
                                                        Jenis APAR <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                                        <SelectTrigger
                                                            className={`transition-all ${errors.type ? 'border-red-500' : ''}`}
                                                        >
                                                            <SelectValue placeholder="Pilih jenis APAR" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(types).map(([value, label]) => (
                                                                <SelectItem key={value} value={value}>
                                                                    {label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.type && (
                                                        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.type}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <Label htmlFor="capacity" className="text-sm font-medium text-foreground">
                                                        Kapasitas <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="capacity"
                                                        value={data.capacity}
                                                        onChange={(e) => setData('capacity', e.target.value)}
                                                        placeholder="6 kg"
                                                        className={`transition-all ${errors.capacity ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors.capacity && (
                                                        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.capacity}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        {/* Date Information */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                <Calendar className="h-4 w-4" />
                                                Informasi Tanggal
                                            </div>

                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-3">
                                                    <Label htmlFor="fill_date" className="text-sm font-medium text-foreground">
                                                        Tanggal Isi Ulang <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="fill_date"
                                                        type="date"
                                                        value={data.fill_date}
                                                        onChange={(e) => setData('fill_date', e.target.value)}
                                                        className={`transition-all ${errors.fill_date ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors.fill_date && (
                                                        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.fill_date}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <Label htmlFor="expiry_date" className="text-sm font-medium text-foreground">
                                                        Tanggal Kadaluarsa <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="expiry_date"
                                                        type="date"
                                                        value={data.expiry_date}
                                                        onChange={(e) => setData('expiry_date', e.target.value)}
                                                        className={`transition-all ${errors.expiry_date ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors.expiry_date && (
                                                        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.expiry_date}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        {/* Status and Notes */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                <FileText className="h-4 w-4" />
                                                Status & Catatan
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <Label htmlFor="status" className="text-sm font-medium text-foreground">
                                                        Status <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                        <SelectTrigger
                                                            className={`transition-all ${errors.status ? 'border-red-500' : ''}`}
                                                        >
                                                            <SelectValue placeholder="Pilih status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(statuses).map(([value, label]) => (
                                                                <SelectItem key={value} value={value}>
                                                                    {label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.status && (
                                                        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.status}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                                                        Catatan
                                                    </Label>
                                                    <Textarea
                                                        id="notes"
                                                        value={data.notes}
                                                        onChange={(e) => setData('notes', e.target.value)}
                                                        placeholder="Catatan tambahan tentang APAR ini..."
                                                        rows={4}
                                                        className="resize-none transition-all focus:border-primary focus:ring-primary/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">
                                            <Button asChild variant="outline" size="lg" className="sm:w-auto">
                                                <Link href="/apars">Batal</Link>
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                size="lg"
                                                className="bg-primary hover:bg-primary/90 sm:w-auto"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Simpan APAR
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Info Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold text-foreground">Panduan Pengisian</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-muted-foreground">
                                    <div className="space-y-2">
                                        <p className="font-medium text-foreground">Tips:</p>
                                        <ul className="list-inside list-disc space-y-1.5">
                                            <li>Gunakan nomor APAR yang unik</li>
                                            <li>Lokasi harus spesifik dan mudah ditemukan</li>
                                            <li>Pastikan tanggal kadaluarsa sesuai dengan label</li>
                                            <li>Status default adalah "Aktif"</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status Preview */}
                            {data.status && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-semibold text-foreground">Preview Status</CardTitle>
                                    </CardHeader>
                                    <CardContent>{getStatusBadge(data.status)}</CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AparCreate.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
