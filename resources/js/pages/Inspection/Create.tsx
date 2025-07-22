import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Calendar, Check, CheckCircle, FireExtinguisher, MapPin, Package, Settings, X } from 'lucide-react';
import { useEffect } from 'react';

interface Apar {
    id: number;
    number: string;
    location: string;
    type: string;
    capacity: string;
}

interface InspectionCreateProps {
    apars: Apar[];
    itemTypes: Record<string, string>;
    apar_id?: string;
}

const INSPECTION_ITEMS = ['hose', 'safety_pin', 'content', 'handle', 'pressure', 'funnel', 'cleanliness'];

export default function InspectionCreate({ apars, itemTypes, apar_id }: InspectionCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        apar_id: apar_id || '',
        inspection_date: new Date().toISOString().split('T')[0],
        digital_signature: '',
        overall_status: 'good',
        notes: '',
        items: INSPECTION_ITEMS.map((type) => ({
            item_type: type,
            status: 'good',
            notes: '',
        })),
    });

    const handleItemStatusChange = (index: number, status: string) => {
        const newItems = [...data.items];
        newItems[index].status = status;
        setData('items', newItems);
    };

    const handleItemNotesChange = (index: number, notes: string) => {
        const newItems = [...data.items];
        newItems[index].notes = notes;
        setData('items', newItems);
    };

    const updateOverallStatus = () => {
        const hasCritical = data.items.some((item) => item.status === 'damaged');
        const hasNeedsRepair = data.items.some((item) => item.status === 'needs_repair');
        let newStatus = 'good';
        if (hasCritical) {
            newStatus = 'critical';
        } else if (hasNeedsRepair) {
            newStatus = 'needs_attention';
        }
        if (data.overall_status !== newStatus) {
            setData('overall_status', newStatus);
        }
    };

    useEffect(() => {
        updateOverallStatus();
    }, [data.items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inspections');
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'good':
                return <Check className="h-4 w-4 text-emerald-600" />;
            case 'damaged':
            case 'needs_repair':
                return <X className="h-4 w-4 text-rose-600" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-amber-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
            case 'damaged':
                return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
            case 'needs_repair':
                return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
        }
    };

    const getStatusLabel = (status: string) => {
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

    const selectedApar = apars.find((apar) => apar.id.toString() === data.apar_id);

    const getOverallStatusConfig = (status: string) => {
        switch (status) {
            case 'good':
                return {
                    label: 'Kondisi Baik',
                    color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
                    icon: <Check className="h-5 w-5 text-emerald-600" />,
                };
            case 'needs_attention':
                return {
                    label: 'Perlu Perhatian',
                    color: 'bg-amber-50 border-amber-200 text-amber-800',
                    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
                };
            case 'critical':
                return {
                    label: 'Kondisi Kritis',
                    color: 'bg-rose-50 border-rose-200 text-rose-800',
                    icon: <X className="h-5 w-5 text-rose-600" />,
                };
            default:
                return {
                    label: 'Tidak Diketahui',
                    color: 'bg-slate-50 border-slate-200 text-slate-800',
                    icon: <AlertTriangle className="h-5 w-5 text-slate-600" />,
                };
        }
    };

    return (
        <>
            <Head title="Inspeksi Baru - Sistem Monitoring APAR" />

            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Modern Header */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                                <Link href="/inspections">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Daftar Inspeksi
                                </Link>
                            </Button>
                        </div>
                        <div className="text-center">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <FireExtinguisher className="h-8 w-8 text-blue-600" />
                            </div>
                            <h1 className="mb-2 text-3xl font-bold text-slate-900">Inspeksi APAR Baru</h1>
                            <p className="text-lg text-slate-600">Lakukan pemeriksaan rutin sesuai standar keselamatan</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Card */}
                        <Card className="border-0 bg-white shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="flex items-center text-slate-900">
                                    <Settings className="mr-3 h-5 w-5 text-slate-600" />
                                    Informasi Inspeksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label htmlFor="apar_id" className="text-sm font-medium text-slate-700">
                                            Pilih APAR <span className="text-rose-500">*</span>
                                        </Label>
                                        <Select value={data.apar_id} onValueChange={(value) => setData('apar_id', value)}>
                                            <SelectTrigger
                                                className={`h-11 ${errors.apar_id ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'}`}
                                            >
                                                <SelectValue placeholder="Pilih APAR yang akan diinspeksi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {apars.map((apar) => (
                                                    <SelectItem key={apar.id} value={apar.id.toString()}>
                                                        <div className="flex items-center py-2">
                                                            <FireExtinguisher className="mr-3 h-4 w-4 text-slate-500" />
                                                            <div>
                                                                <div className="font-medium">{apar.number}</div>
                                                                <div className="text-sm text-slate-500">{apar.location}</div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.apar_id && (
                                            <p className="flex items-center text-sm text-rose-600">
                                                <AlertTriangle className="mr-1 h-4 w-4" />
                                                {errors.apar_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="inspection_date" className="text-sm font-medium text-slate-700">
                                            Tanggal Inspeksi <span className="text-rose-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                            <Input
                                                id="inspection_date"
                                                type="date"
                                                value={data.inspection_date}
                                                onChange={(e) => setData('inspection_date', e.target.value)}
                                                className={`h-11 pl-10 ${errors.inspection_date ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'}`}
                                            />
                                        </div>
                                        {errors.inspection_date && (
                                            <p className="flex items-center text-sm text-rose-600">
                                                <AlertTriangle className="mr-1 h-4 w-4" />
                                                {errors.inspection_date}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {selectedApar && (
                                    <div className="mt-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                                        <h4 className="mb-4 flex items-center font-semibold text-blue-900">
                                            <Package className="mr-2 h-5 w-5" />
                                            Detail APAR Terpilih
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                                            <div className="space-y-1">
                                                <div className="text-xs font-medium tracking-wider text-blue-600 uppercase">Nomor</div>
                                                <div className="text-sm font-semibold text-slate-900">{selectedApar.number}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-medium tracking-wider text-blue-600 uppercase">Lokasi</div>
                                                <div className="flex items-center text-sm font-semibold text-slate-900">
                                                    <MapPin className="mr-1 h-3 w-3 text-slate-500" />
                                                    {selectedApar.location}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-medium tracking-wider text-blue-600 uppercase">Jenis</div>
                                                <div className="text-sm font-semibold text-slate-900">{selectedApar.type}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-medium tracking-wider text-blue-600 uppercase">Kapasitas</div>
                                                <div className="text-sm font-semibold text-slate-900">{selectedApar.capacity}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Inspection Checklist */}
                        <Card className="border-0 bg-white shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-slate-900">Checklist Pemeriksaan</CardTitle>
                                <p className="mt-2 text-sm text-slate-600">Periksa setiap komponen dan tentukan kondisinya</p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {data.items.map((item, index) => (
                                        <div key={item.item_type} className="rounded-xl border border-slate-100 bg-slate-50/30 p-6">
                                            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                                <h4 className="text-lg font-semibold text-slate-900">{itemTypes[item.item_type]}</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        type="button"
                                                        variant={item.status === 'good' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => handleItemStatusChange(index, 'good')}
                                                        className={`transition-all duration-200 ${
                                                            item.status === 'good'
                                                                ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                                                                : 'hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                                                        }`}
                                                    >
                                                        <Check className="mr-1 h-4 w-4" />
                                                        Baik
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={item.status === 'needs_repair' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => handleItemStatusChange(index, 'needs_repair')}
                                                        className={`transition-all duration-200 ${
                                                            item.status === 'needs_repair'
                                                                ? 'bg-amber-600 text-white shadow-sm hover:bg-amber-700'
                                                                : 'hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700'
                                                        }`}
                                                    >
                                                        <AlertTriangle className="mr-1 h-4 w-4" />
                                                        Perlu Perbaikan
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={item.status === 'damaged' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => handleItemStatusChange(index, 'damaged')}
                                                        className={`transition-all duration-200 ${
                                                            item.status === 'damaged'
                                                                ? 'bg-rose-600 text-white shadow-sm hover:bg-rose-700'
                                                                : 'hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700'
                                                        }`}
                                                    >
                                                        <X className="mr-1 h-4 w-4" />
                                                        Rusak
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="mb-4 flex items-center space-x-3">
                                                {getStatusIcon(item.status)}
                                                <Badge className={`${getStatusColor(item.status)} px-3 py-1 font-medium`}>
                                                    {getStatusLabel(item.status)}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`notes-${index}`} className="text-sm font-medium text-slate-700">
                                                    Catatan Tambahan
                                                </Label>
                                                <Textarea
                                                    id={`notes-${index}`}
                                                    value={item.notes}
                                                    onChange={(e) => handleItemNotesChange(index, e.target.value)}
                                                    placeholder={`Berikan catatan detail untuk ${itemTypes[item.item_type].toLowerCase()}...`}
                                                    rows={2}
                                                    className="resize-none border-slate-200 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Overall Status Summary */}
                        <Card className="border-0 bg-white shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-slate-900">Ringkasan Inspeksi</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-6">
                                    <div
                                        className={`rounded-xl border-2 p-6 ${getOverallStatusConfig(data.overall_status).color} transition-all duration-200`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {getOverallStatusConfig(data.overall_status).icon}
                                            <div>
                                                <div className="text-sm font-medium opacity-75">Status Keseluruhan</div>
                                                <div className="text-xl font-bold">{getOverallStatusConfig(data.overall_status).label}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                                            Catatan Inspeksi
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Tambahkan catatan menyeluruh tentang inspeksi ini..."
                                            rows={4}
                                            className="resize-none border-slate-200 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:justify-end">
                            <Button asChild variant="outline" size="lg" className="sm:min-w-32">
                                <Link href="/inspections">Batal</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.apar_id}
                                size="lg"
                                className="bg-blue-600 text-white transition-all duration-200 hover:bg-blue-700 sm:min-w-40"
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Menyimpan...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Simpan Inspeksi
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

InspectionCreate.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
