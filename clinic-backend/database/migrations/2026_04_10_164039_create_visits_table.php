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
       Schema::create('visits', function (Blueprint $table) {
    $table->id();
    $table->foreignId('patient_id')->constrained()->onDelete('cascade');
    $table->date('visit_date');
    $table->text('symptoms')->nullable();
    $table->text('diagnosis')->nullable();
    $table->text('examination_notes')->nullable();
    $table->text('treatment_plan')->nullable();
    $table->date('follow_up_date')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
