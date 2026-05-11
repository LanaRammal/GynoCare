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
    Schema::create('billing_records', function (Blueprint $table) {
        $table->id();
        $table->foreignId('patient_id')->constrained()->onDelete('cascade');
        $table->foreignId('visit_id')->nullable()->constrained()->onDelete('set null');
        $table->decimal('amount', 10, 2)->default(0);
        $table->text('description')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('billing_records');
}
};
