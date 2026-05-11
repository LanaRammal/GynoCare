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
    Schema::create('appointments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('patient_id')->constrained()->onDelete('cascade');
        $table->date('appointment_date');
        $table->time('appointment_time')->nullable();
        $table->string('status')->default('scheduled');
        $table->text('notes')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('appointments');
}
};
