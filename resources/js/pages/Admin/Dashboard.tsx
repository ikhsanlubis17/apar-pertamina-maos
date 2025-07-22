import CreateUserModal from '@/components/admin/CreateUserModal';
import EditUserModal from '@/components/admin/EditUserModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminGuard } from '@/hooks/use-admin-guard';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, BarChart3, CheckCircle, ClipboardCheck, Edit, FireExtinguisher, Plus, Trash2, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label: string;
    created_at: string;
    inspections_count: number;
}

interface Apar {
    id: number;
    number: string;
    location: string;
    type: string;
    capacity: string;
    status: 'active' | 'inactive' | 'expired' | 'maintenance';
    fill_date: string;
    expiry_date: string;
    last_inspection: string;
    inspections_count: number;
}

interface Inspection {
    id: number;
    apar_number: string;
    apar_location: string;
    inspector_name: string;
    inspector_role: string;
    created_at: string;
    items_count: number;
    passed_items: number;
}

interface AdminDashboardProps {
    stats: {
        total_apar: number;
        total_users: number;
        total_inspections: number;
        apar_baik: number;
        apar_rusak: number;
        apar_belum_cek: number;
    };
    users: User[];
    apars: Apar[];
    inspections: Inspection[];
    recent_inspections: any[];
    apar_by_location: { location: string; count: number }[];
}

type AparStatus = 'active' | 'inactive' | 'expired' | 'maintenance';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, users, apars, inspections, recent_inspections, apar_by_location }) => {
    const { isAdmin } = useAdminGuard();
    const [activeTab, setActiveTab] = useState('overview');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if (!isAdmin) {
        return null;
    }

    const handleDeleteUser = (userId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<AparStatus, string> = {
            active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
            inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
            expired: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
        };

        const labels: Record<AparStatus, string> = {
            active: 'Aktif',
            inactive: 'Tidak Aktif',
            expired: 'Kadaluarsa',
            maintenance: 'Pemeliharaan',
        };

        const key: AparStatus = (Object.keys(variants) as AparStatus[]).includes(status as AparStatus) ? (status as AparStatus) : 'inactive';

        return (
            <Badge variant="outline" className={`${variants[key]} px-2.5 py-0.5 font-medium`}>
                {labels[key]}
            </Badge>
        );
    };

    const getPassRateBadge = (passed: number, total: number) => {
        const rate = total === 0 ? 0 : Math.round((passed / total) * 100);
        let className = '';

        if (rate >= 80) {
            className = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
        } else if (rate >= 60) {
            className = 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
        } else {
            className = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        }

        return (
            <Badge variant="outline" className={`${className} px-2.5 py-0.5 font-medium`}>
                {rate}%
            </Badge>
        );
    };

    const formatDate = (dateStr: string) =>
        dateStr ? new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

    return (
        <AppLayout>
            <Head title="Dashboard Admin" />

            <div className="min-h-screen bg-background">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-foreground">Dashboard Admin</h1>
                        <p className="text-muted-foreground">Kelola sistem inspeksi APAR dengan mudah</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                        {/* Tab Navigation */}
                        <div className="rounded-xl border bg-card p-1.5 shadow-sm">
                            <TabsList className="grid w-full grid-cols-4 gap-1 bg-transparent">
                                <TabsTrigger
                                    value="overview"
                                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Ringkasan</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="users"
                                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                                >
                                    <Users className="h-4 w-4" />
                                    <span className="hidden sm:inline">Pengguna</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="apar"
                                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                                >
                                    <FireExtinguisher className="h-4 w-4" />
                                    <span className="hidden sm:inline">APAR</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="inspections"
                                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                                >
                                    <ClipboardCheck className="h-4 w-4" />
                                    <span className="hidden sm:inline">Inspeksi</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-8">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="mb-1 text-sm font-medium text-blue-700 dark:text-blue-400">Total APAR</p>
                                                <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{stats.total_apar}</p>
                                            </div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                                                <FireExtinguisher className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="mb-1 text-sm font-medium text-emerald-700">Total Pengguna</p>
                                                <p className="text-3xl font-bold text-emerald-900">{stats.total_users}</p>
                                            </div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
                                                <Users className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-sm hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="mb-1 text-sm font-medium text-purple-700">Total Inspeksi</p>
                                                <p className="text-3xl font-bold text-purple-900">{stats.total_inspections}</p>
                                            </div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500">
                                                <ClipboardCheck className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* APAR Status Cards */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <Card className="border-0 shadow-sm hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">APAR Baik</p>
                                                <p className="text-2xl font-bold text-emerald-600">{stats.apar_baik}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">APAR Rusak</p>
                                                <p className="text-2xl font-bold text-red-600">{stats.apar_rusak}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                                                <TrendingUp className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Belum Diperiksa</p>
                                                <p className="text-2xl font-bold text-amber-600">{stats.apar_belum_cek}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Location & Recent Inspections */}
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                <Card className="border-0 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-slate-900">APAR Berdasarkan Lokasi</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {apar_by_location.map((item) => (
                                            <div
                                                key={item.location}
                                                className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 hover:bg-slate-100"
                                            >
                                                <span className="font-medium text-slate-700">{item.location}</span>
                                                <Badge variant="secondary" className="bg-blue-100 font-medium text-blue-700">
                                                    {item.count}
                                                </Badge>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-slate-900">Inspeksi Terbaru</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {recent_inspections.slice(0, 5).map((insp, idx) => (
                                                <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-slate-900">{insp.apar?.number}</p>
                                                        <p className="text-sm text-slate-500">{insp.apar?.location}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-slate-700">{insp.inspector?.name}</p>
                                                        <p className="text-xs text-slate-500">{formatDate(insp.created_at)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Users Tab */}
                        <TabsContent value="users" className="space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-6">
                                    <div>
                                        <CardTitle className="text-xl font-semibold text-slate-900">Manajemen Pengguna</CardTitle>
                                        <p className="mt-1 text-sm text-slate-600">Kelola akun pengguna sistem</p>
                                    </div>
                                    <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 text-white shadow-sm hover:bg-blue-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Pengguna
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="border-t bg-muted/50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Nama
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Peran
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Tanggal Dibuat
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Inspeksi
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {users.map((user) => (
                                                    <tr key={user.id} className="transition-colors hover:bg-muted/50">
                                                        <td className="px-6 py-4 font-semibold text-foreground">{user.name}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                                                        <td className="px-6 py-4">
                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                                                {user.role_label}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 text-muted-foreground">{formatDate(user.created_at)}</td>
                                                        <td className="px-6 py-4 font-medium text-muted-foreground">{user.inspections_count}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEditUser(user)}
                                                                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                                                >
                                                                    <Edit className="mr-1 h-3 w-3" />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="mr-1 h-3 w-3" />
                                                                    Hapus
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* APAR Tab */}
                        <TabsContent value="apar" className="space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-6">
                                    <CardTitle className="text-xl font-semibold text-slate-900">Data APAR</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="border-t bg-muted/50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Nomor
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Lokasi
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Tipe
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Kapasitas
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Terakhir Isi
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Kadaluarsa
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Terakhir Inspeksi
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Total Inspeksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {apars.map((apar) => (
                                                    <tr key={apar.id} className="transition-colors hover:bg-muted/50">
                                                        <td className="px-6 py-4 font-semibold text-foreground">{apar.number}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{apar.location}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{apar.type}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{apar.capacity}</td>
                                                        <td className="px-6 py-4">{getStatusBadge(apar.status)}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{formatDate(apar.fill_date)}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{formatDate(apar.expiry_date)}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{formatDate(apar.last_inspection)}</td>
                                                        <td className="px-6 py-4 font-medium text-muted-foreground">{apar.inspections_count}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Inspections Tab */}
                        <TabsContent value="inspections" className="space-y-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-6">
                                    <CardTitle className="text-xl font-semibold text-slate-900">Riwayat Inspeksi</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="border-t bg-muted/50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Nomor APAR
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Lokasi
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Petugas
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Peran
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Tanggal
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Total Item
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Lulus
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Persentase
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {inspections.map((insp) => (
                                                    <tr key={insp.id} className="transition-colors hover:bg-muted/50">
                                                        <td className="px-6 py-4 font-semibold text-foreground">{insp.apar_number}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{insp.apar_location}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{insp.inspector_name}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{insp.inspector_role}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{formatDate(insp.created_at)}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{insp.items_count}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{insp.passed_items}</td>
                                                        <td className="px-6 py-4">{getPassRateBadge(insp.passed_items, insp.items_count)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            {selectedUser && <EditUserModal user={selectedUser} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />}
        </AppLayout>
    );
};

export default AdminDashboard;
