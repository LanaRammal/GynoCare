<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pregnant_visit_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('week')->nullable();
            $table->string('weight')->nullable();
            $table->enum('presentation', ['Cephalic', 'Breech', 'Transverse'])->nullable();
            $table->enum('fhr', ['+', '-'])->nullable();
            $table->enum('fetal_movement', ['+', '-'])->nullable();
            $table->enum('preterm_labor_signs', ['G', 'O'])->nullable();
            $table->text('symptoms')->nullable();
            $table->string('cervix_exam_wl')->nullable();
            $table->string('cervix_exam_eff')->nullable();
            $table->string('cervix_exam_sa')->nullable();
            $table->string('blood_pressure')->nullable();
            $table->enum('edema', ['+', '-'])->nullable();
            $table->enum('urine', ['+', '-'])->nullable();
            $table->decimal('cost', 10, 2)->nullable();
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pregnant_visit_details');
    }
};
