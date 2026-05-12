<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('previous_labors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_visit_id')->constrained()->onDelete('cascade');
            $table->date('date')->nullable();
            $table->string('location')->nullable();
            $table->string('pregnancy_progress')->nullable();
            $table->enum('delivery_type', ['NVD', 'C/S'])->nullable();
            $table->enum('term_status', ['On term', 'Preterm'])->nullable();
            $table->enum('newborn_gender', ['Male', 'Female'])->nullable();
            $table->string('newborn_weight')->nullable();
            $table->enum('apgar', ['5', '6', '7', '8'])->nullable();
            $table->text('postpartum')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('previous_labors');
    }
};
