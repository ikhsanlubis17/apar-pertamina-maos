import { FireExtinguisher } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <FireExtinguisher className="h-8 w-8 text-blue-400 mr-3" />
                        <h4 className="text-xl font-bold">Sistem Monitoring APAR</h4>
                    </div>
                    <p className="text-gray-400">
                        Digitalisasi checklist pemeriksaan APAR untuk efisiensi dan dokumentasi yang lebih baik
                    </p>
                    <div className="mt-6 text-sm text-gray-500">
                        © 2024 Sistem Monitoring APAR. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
} 