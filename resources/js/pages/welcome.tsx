import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    FireExtinguisher, 
    CheckCircle, 
    BarChart3, 
    Shield,
    ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/ui/footer';

export default function Welcome() {
    return (
        <>
            <Head title="Sistem Monitoring APAR - Digitalisasi Checklist Pemeriksaan" />
            <Navbar />
            
            <div className="min-h-screen bg-background text-foreground">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-foreground mb-6">
                            Digitalisasi Checklist Pemeriksaan APAR
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                            Sistem berbasis website untuk mendigitalisasi proses checklist pemeriksaan 
                            Alat Pemadam Api Ringan (APAR) yang menggantikan form manual tradisional.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Button asChild size="lg">
                                <Link href="/login">
                                    Mulai Sekarang
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="#features">Pelajari Lebih Lanjut</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                            Fitur Utama
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            Sistem yang dirancang untuk memudahkan monitoring dan pemeliharaan APAR
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                                    <FireExtinguisher className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <CardTitle>Manajemen APAR</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Pendaftaran, monitoring, dan pengelolaan data APAR secara terpusat. 
                                    Informasi lengkap termasuk lokasi, jenis, kapasitas, dan tanggal kadaluarsa.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle>Inspeksi Digital</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Checklist digital untuk 7 item pemeriksaan utama dengan status 
                                    Baik (✔) atau Rusak/Perlu Perbaikan (✘). Tanda tangan digital petugas.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <CardTitle>Dashboard & Laporan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Statistik real-time, grafik inspeksi bulanan, dan peringatan 
                                    APAR kadaluarsa. Laporan komprehensif untuk analisis dan audit.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-card py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Keuntungan Sistem Digital
                            </h3>
                            <p className="text-lg text-muted-foreground">
                                Mengapa beralih dari form manual ke sistem digital?
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-foreground mb-2">Efisiensi</h4>
                                <p className="text-muted-foreground">
                                    Proses inspeksi lebih cepat dan terstruktur
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-foreground mb-2">Akurasi</h4>
                                <p className="text-muted-foreground">
                                    Data terjamin akurat dan tidak ada kesalahan input
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-foreground mb-2">Monitoring</h4>
                                <p className="text-muted-foreground">
                                    Pantau status APAR secara real-time
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FireExtinguisher className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-foreground mb-2">Kepatuhan</h4>
                                <p className="text-muted-foreground">
                                    Memenuhi standar keselamatan dan regulasi
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-primary py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-3xl font-bold text-primary-foreground mb-4">
                            Siap untuk Digitalisasi?
                        </h3>
                        <p className="text-xl text-blue-100 dark:text-primary-foreground/80 mb-8">
                            Mulai gunakan sistem monitoring APAR digital sekarang
                        </p>
                        <Button asChild size="lg" variant="secondary">
                            <Link href="/register">
                                Daftar Gratis
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
