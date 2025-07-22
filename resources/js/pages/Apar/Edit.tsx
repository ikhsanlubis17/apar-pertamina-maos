// resources/js/pages/Apar/Edit.tsx

import { Head, Link, useForm } from '@inertiajs/react';
import * as React from 'react';

import AppLayout from '@/layouts/app-layout';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Activity, AlertCircle, ArrowLeft, Calendar, FireExtinguisher, MapPin, Package, Save, X } from 'lucide-react';

interface Apar {
    id: number;
    number: string;
    location: string;
    type: string;
    capacity: string;
    fill_date: string; // may come as "2024-02-20T00:00:00.000000Z" from backend
    expiry_date: string; // same
    status: string;
    notes?: string;
}

interface AparEditProps {
    apar: Apar;
    types: Record<string, string>; // e.g. { powder: "Bubuk", co2: "CO2" }
    statuses: Record<string, string>; // e.g. { active: "Aktif", inactive: "Tidak Aktif" }
}

/**
 * Convert various backend date formats (ISO string, "YYYY-MM-DD", etc.)
 * to the plain "YYYY-MM-DD" format required by <input type="date">.
 */
function formatDateForInput(date: string | null | undefined): string {
    if (!date) return '';
    // If already YYYY-MM-DD, return as-is.
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    // Try to parse (Date can handle ISO)
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // fallback
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export default function AparEdit({ apar, types, statuses }: AparEditProps) {
    const notesMax = 500;

    const { data, setData, put, processing, errors } = useForm({
        number: apar.number ?? '',
        location: apar.location ?? '',
        type: apar.type ?? '',
        capacity: apar.capacity ?? '',
        fill_date: formatDateForInput(apar.fill_date),
        expiry_date: formatDateForInput(apar.expiry_date),
        status: apar.status ?? '',
        notes: apar.notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Jika backend Laravel Anda menerima format "Y-m-d", kita kirim apa adanya (sudah diformat).
        // Jika butuh ISO, ubah di sini sebelum submit.
        put(`/apars/${apar.id}`);
    };

    const hasErrors = Object.keys(errors).length > 0;
    const notesCount = data.notes.length;

    return (
        <>
            <Head title={`Edit APAR ${apar.number} - Sistem Monitoring APAR`} />

            <div className="min-h-screen bg-background">
                {/* Header Section */}
                <header className="sticky top-0 z-30 border-b bg-card">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-6">
                            {/* Left cluster: Back + Title */}
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
                                            <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">Edit APAR {apar.number}</h1>
                                            <p className="mt-1 truncate text-sm text-muted-foreground">Perbarui informasi APAR</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Simple error indicator & quick info (desktop only) */}
                            <div className="hidden items-center gap-4 sm:flex">
                                {hasErrors && (
                                    <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                                        <AlertCircle className="mr-2 h-4 w-4" />
                                        Ada kesalahan dalam form
                                    </div>
                                )}
                            </div>

                            {/* Mobile error alert (stacked) */}
                            {hasErrors && (
                                <div className="flex items-center text-sm text-red-600 dark:text-red-400 sm:hidden">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Form belum lengkap
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Main Form */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                                            <FireExtinguisher className="mr-2 h-5 w-5" />
                                            Informasi Dasar
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Number */}
                                            <div className="space-y-2">
                                                <Label htmlFor="number" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    Nomor APAR *
                                                </Label>
                                                <Input
                                                    id="number"
                                                    value={data.number}
                                                    onChange={(e) => setData('number', e.target.value)}
                                                    placeholder="Contoh: APAR-001"
                                                    className={`h-11 ${errors.number ? 'border-red-500' : ''}`}
                                                />
                                                {errors.number && (
                                                    <p className="flex items-center text-xs text-red-600 dark:text-red-400">
                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                        {errors.number}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Location */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="location"
                                                    className="flex items-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
                                                >
                                                    <MapPin className="mr-1 h-3 w-3" />
                                                    Lokasi *
                                                </Label>
                                                <Input
                                                    id="location"
                                                    value={data.location}
                                                    onChange={(e) => setData('location', e.target.value)}
                                                    placeholder="Contoh: Lantai 1 - Ruang Server"
                                                    className={`h-11 ${errors.location ? 'border-red-500' : ''}`}
                                                />
                                                {errors.location && (
                                                    <p className="flex items-center text-xs text-red-600 dark:text-red-400">
                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                        {errors.location}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Type */}
                                            <div className="space-y-2">
                                                <Label htmlFor="type" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    Jenis APAR *
                                                </Label>
                                                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                                    <SelectTrigger
                                                        className={`h-11 ${errors.type ? 'border-red-500' : ''}`}
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
                                                    <p className="flex items-center text-xs text-red-600 dark:text-red-400">
                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                        {errors.type}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Capacity */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="capacity"
                                                    className="flex items-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
                                                >
                                                    <Package className="mr-1 h-3 w-3" />
                                                    Kapasitas *
                                                </Label>
                                                <Input
                                                    id="capacity"
                                                    value={data.capacity}
                                                    onChange={(e) => setData('capacity', e.target.value)}
                                                    placeholder="Contoh: 6 kg"
                                                    className={`h-11 ${errors.capacity ? 'border-red-500' : ''}`}
                                                />
                                                {errors.capacity && (
                                                    <p className="flex items-center text-xs text-red-600 dark:text-red-400">
                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                        {errors.capacity}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Dates & Status */}
                                <Card>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                                            <Calendar className="mr-2 h-5 w-5" />
                                            Tanggal & Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Fill Date */}
                                            <div className="space-y-2">
                                                <Label htmlFor="fill_date" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    Tanggal Isi Ulang *
                                                </Label>
                                                <Input
                                                    id="fill_date"
                                                    type="date"
                                                    value={data.fill_date}
                                                    onChange={(e) => setData('fill_date', e.target.value)}
                                                    className={`h-11 ${errors.fill_date ? 'border-red-500' : ''}`}
                                                />
                                                {errors.fill_date && (
                                                    <p className="flex items-center text-xs text-red-600 dark:text-red-400">
                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                        {errors.fill_date}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Expiry Date */}
                                            <div className="space-y-2">
                                                <Label htmlFor="expiry_date" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    Tanggal Kadaluarsa *
                                                </Label>
                                                <Input
                                                    id="expiry_date"
                                                    type="date"
                                                    value={data.expiry_date}
                                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                                    className={`h-11 ${errors.expiry_date ? 'border-red-500' : ''}`}
                                                />
                                                {errors.expiry_date && (
                                                    <p className="flex items-center text-xs text-red-600 dark:text-red-400">
                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                        {errors.expiry_date}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="status"
                                                className="flex items-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
                                            >
                                                <Activity className="mr-1 h-3 w-3" />
                                                Status *
                                            </Label>
                                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                <SelectTrigger className={`h-11 ${errors.status ? 'border-red-500' : ''}`}>
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
                                                <p className="flex items-center text-xs text-red-600 dark:text-red-400">
                                                    <AlertCircle className="mr-1 h-3 w-3" />
                                                    {errors.status}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Notes */}
                                <Card>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-foreground">Catatan Tambahan</CardTitle>
                                        <p className="text-sm text-muted-foreground">Informasi tambahan tentang APAR ini (opsional)</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => {
                                                    const value = e.target.value.slice(0, notesMax);
                                                    setData('notes', value);
                                                }}
                                                placeholder="Masukkan catatan tambahan tentang APAR ini..."
                                                rows={4}
                                                maxLength={notesMax}
                                                className="resize-none border-slate-200 focus:border-slate-400"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                {notesCount}/{notesMax} karakter
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Action Buttons */}
                                <Card className="sticky top-8 border-0 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-foreground">Aksi</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button type="submit" disabled={processing} className="w-full justify-center" size="lg">
                                            {processing ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Simpan Perubahan
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full justify-center"
                                            size="lg"
                                            type="button"
                                            disabled={processing}
                                        >
                                            <Link href="/apars">
                                                <X className="mr-2 h-4 w-4" />
                                                Batal
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Help Text */}
                                <Card className="bg-muted/50">
                                    <CardContent className="pt-6">
                                        <h4 className="mb-3 text-sm font-medium text-foreground">Tips Pengisian:</h4>
                                        <ul className="space-y-2 text-xs text-muted-foreground">
                                            <li className="flex items-start">
                                                <span className="mt-2 mr-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />
                                                Pastikan nomor APAR unik dan mudah diidentifikasi.
                                            </li>
                                            <li className="flex items-start">
                                                <span className="mt-2 mr-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />
                                                Lokasi harus spesifik dan mudah ditemukan.
                                            </li>
                                            <li className="flex items-start">
                                                <span className="mt-2 mr-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />
                                                Periksa tanggal kadaluarsa secara berkala.
                                            </li>
                                            <li className="flex items-start">
                                                <span className="mt-2 mr-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />
                                                Update status sesuai kondisi aktual APAR.
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* Current Info */}
                                <Card>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-foreground">Info Saat Ini</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Nomor:</span>
                                            <p className="font-medium text-foreground">{apar.number}</p>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Status Sebelumnya:</span>
                                            <p className="font-medium text-foreground">{statuses[apar.status] || apar.status}</p>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Terakhir Diupdate:</span>
                                            <p className="font-medium text-foreground">{new Date().toLocaleDateString('id-ID')}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

AparEdit.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
