import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Calendar, Check, CheckCircle, FireExtinguisher, Info, MapPin, Save, Settings, X } from 'lucide-react';
import { useEffect } from 'react';

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

interface Inspection {
    id: number;
    apar_id: number;
    inspection_date: string;
    overall_status: string;
    notes?: string;
    digital_signature?: string;
    apar: Apar;
    items: InspectionItem[];
}

interface InspectionEditProps {
    inspection: Inspection;
    apars: Apar[];
    itemTypes: Record<string, string>;
}

const INSPECTION_ITEMS = ['hose', 'safety_pin', 'content', 'handle', 'pressure', 'funnel', 'cleanliness'];

export default function InspectionEdit({ inspection, apars, itemTypes }: InspectionEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        apar_id: inspection.apar_id.toString(),
        inspection_date: inspection.inspection_date,
        digital_signature: inspection.digital_signature || '',
        overall_status: inspection.overall_status,
        notes: inspection.notes || '',
        items: inspection.items.map((item) => ({
            item_type: item.item_type,
            status: item.status,
            notes: item.notes || '',
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
        put(`/inspections/${inspection.id}`);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'good':
                return <Check className="h-4 w-4 text-emerald-600" />;
            case 'damaged':
            case 'needs_repair':
                return <X className="h-4 w-4 text-red-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-amber-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'damaged':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'needs_repair':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
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
                return 'Tidak Diketahui';
        }
    };

    const getOverallStatusColor = (status: string) => {
        switch (status) {
            case 'good':
                return 'bg-emerald-500 text-white';
            case 'needs_attention':
                return 'bg-amber-500 text-white';
            case 'critical':
                return 'bg-red-500 text-white';
            default:
                return 'bg-slate-500 text-white';
        }
    };

    const getOverallStatusLabel = (status: string) => {
        switch (status) {
            case 'good':
                return 'Baik';
            case 'needs_attention':
                return 'Perlu Perhatian';
            case 'critical':
                return 'Kritis';
            default:
                return 'Tidak Diketahui';
        }
    };

    const selectedApar = apars.find((apar) => apar.id.toString() === data.apar_id);

    return (
        <>
            <Head title={`Edit Inspeksi APAR ${inspection.apar.number} - Sistem Monitoring APAR`} />

            <div className="min-h-screen bg-slate-50/50">
                <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center space-x-4">
                                <Button asChild variant="outline" size="sm" className="shrink-0">
                                    <Link href="/inspections" className="flex items-center gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Kembali
                                    </Link>
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Edit Inspeksi APAR</h1>
                                    <p className="mt-1 text-sm text-slate-600">Perbarui hasil pemeriksaan untuk APAR {inspection.apar.number}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={getOverallStatusColor(data.overall_status)} variant="secondary">
                                    {getOverallStatusLabel(data.overall_status)}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information Card */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="flex items-center gap-2 text-slate-900">
                                    <Info className="h-5 w-5 text-blue-600" />
                                    Informasi Inspeksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label htmlFor="apar_id" className="text-sm font-medium text-slate-700">
                                            APAR yang Diperiksa
                                        </Label>
                                        <Select value={data.apar_id} onValueChange={(value) => setData('apar_id', value)}>
                                            <SelectTrigger
                                                className={`h-11 ${errors.apar_id ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'}`}
                                            >
                                                <SelectValue placeholder="Pilih APAR untuk diperiksa" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {apars.map((apar) => (
                                                    <SelectItem key={apar.id} value={apar.id.toString()}>
                                                        <div className="flex items-center gap-3">
                                                            <FireExtinguisher className="h-4 w-4 text-red-600" />
                                                            <div>
                                                                <div className="font-medium">{apar.number}</div>
                                                                <div className="text-xs text-slate-500">{apar.location}</div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.apar_id && <p className="text-sm text-red-600">{errors.apar_id}</p>}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="inspection_date" className="text-sm font-medium text-slate-700">
                                            Tanggal Inspeksi
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                            <Input
                                                id="inspection_date"
                                                type="date"
                                                value={data.inspection_date}
                                                onChange={(e) => setData('inspection_date', e.target.value)}
                                                className={`h-11 pl-10 ${errors.inspection_date ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'}`}
                                            />
                                        </div>
                                        {errors.inspection_date && <p className="text-sm text-red-600">{errors.inspection_date}</p>}
                                    </div>
                                </div>

                                {selectedApar && (
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-900">
                                            <FireExtinguisher className="h-4 w-4" />
                                            Detail APAR Terpilih
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                                            <div>
                                                <div className="text-xs font-medium tracking-wider text-blue-600 uppercase">Nomor</div>
                                                <div className="mt-1 text-sm font-semibold text-blue-900">{selectedApar.number}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium tracking-wider text-blue-600 uppercase">Lokasi</div>
                                                <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-blue-900">
                                                    <MapPin className="h-3 w-3" />
                                                    {selectedApar.location}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium tracking-wider text-blue-600 uppercase">Jenis</div>
                                                <div className="mt-1 text-sm font-semibold text-blue-900">{selectedApar.type}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium tracking-wider text-blue-600 uppercase">Kapasitas</div>
                                                <div className="mt-1 text-sm font-semibold text-blue-900">{selectedApar.capacity}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Inspection Checklist */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="flex items-center gap-2 text-slate-900">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                    Checklist Pemeriksaan
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-600">Periksa setiap komponen dan tentukan kondisinya</p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid gap-4">
                                    {data.items.map((item, index) => (
                                        <div key={item.item_type} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                                            <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                                                    <h4 className="text-lg font-semibold text-slate-900">{itemTypes[item.item_type]}</h4>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant={item.status === 'good' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => handleItemStatusChange(index, 'good')}
                                                        className={`flex items-center gap-2 ${item.status === 'good' ? 'bg-emerald-600 hover:bg-emerald-700' : 'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'}`}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                        Baik
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={item.status === 'damaged' ? 'destructive' : 'outline'}
                                                        size="sm"
                                                        onClick={() => handleItemStatusChange(index, 'damaged')}
                                                        className={`flex items-center gap-2 ${item.status !== 'damaged' ? 'hover:border-red-300 hover:bg-red-50 hover:text-red-700' : ''}`}
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Rusak
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={item.status === 'needs_repair' ? 'destructive' : 'outline'}
                                                        size="sm"
                                                        onClick={() => handleItemStatusChange(index, 'needs_repair')}
                                                        className={`flex items-center gap-2 ${item.status !== 'needs_repair' ? 'hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700' : ''}`}
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        Perlu Perbaikan
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="mb-4 flex items-center gap-2">
                                                {getStatusIcon(item.status)}
                                                <Badge className={getStatusColor(item.status)} variant="outline">
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
                                                    placeholder={`Tambahkan catatan untuk ${itemTypes[item.item_type].toLowerCase()}...`}
                                                    rows={3}
                                                    className="resize-none border-slate-300 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Overall Notes */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="flex items-center gap-2 text-slate-900">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                    Catatan Inspeksi Keseluruhan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                        {getStatusIcon(data.overall_status)}
                                        <div>
                                            <div className="text-sm text-slate-600">Status Keseluruhan</div>
                                            <Badge className={getOverallStatusColor(data.overall_status)} variant="secondary">
                                                {getOverallStatusLabel(data.overall_status)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                                            Catatan Tambahan
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Tambahkan catatan umum tentang inspeksi ini..."
                                            rows={4}
                                            className="resize-none border-slate-300 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Actions */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col justify-end gap-3 sm:flex-row">
                                <Button asChild variant="outline" className="border-slate-300 hover:bg-slate-50">
                                    <Link href="/inspections">Batalkan</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.apar_id}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

InspectionEdit.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
