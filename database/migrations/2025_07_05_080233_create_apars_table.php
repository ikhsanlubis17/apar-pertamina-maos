<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('apars', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique()->comment('Nomor APAR');
            $table->string('location')->comment('Lokasi APAR');
            $table->enum('type', ['powder', 'co2', 'foam', 'liquid'])->comment('Jenis APAR');
            $table->string('capacity')->comment('Kapasitas APAR');
            $table->date('fill_date')->comment('Tanggal isi ulang');
            $table->date('expiry_date')->comment('Tanggal kadaluarsa');
            $table->enum('status', ['active', 'inactive', 'expired', 'maintenance'])->default('active');
            $table->text('notes')->nullable()->comment('Catatan tambahan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apars');
    }
};
