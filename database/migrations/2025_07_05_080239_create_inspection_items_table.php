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
        Schema::create('inspection_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_id')->constrained()->onDelete('cascade');
            $table->enum('item_type', [
                'hose',           // Selang
                'safety_pin',     // Pin pengaman
                'content',        // Isi tabung
                'handle',         // Handle
                'pressure',       // Tekanan gas
                'funnel',         // Corong bawah
                'cleanliness'     // Kebersihan
            ]);
            $table->enum('status', ['good', 'damaged', 'needs_repair'])->default('good');
            $table->text('notes')->nullable()->comment('Catatan untuk item ini');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_items');
    }
};
