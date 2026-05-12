<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pregnancy_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('family_name');
            $table->string('family_name_before_marriage')->nullable();
            $table->string('nssf')->nullable();
            $table->string('blood_type')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->time('time_of_birth')->nullable();
            $table->text('address')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('profession')->nullable();
            $table->string('husband_name')->nullable();
            $table->string('husband_profession')->nullable();
            $table->enum('hiv', ['Positive', 'Negative', 'Unknown'])->default('Unknown');
            $table->enum('hbs', ['Positive', 'Negative', 'Unknown'])->default('Unknown');
            $table->date('lmp')->nullable();
            $table->date('edd')->nullable();
            $table->unsignedTinyInteger('g')->nullable();
            $table->unsignedTinyInteger('pare')->nullable();
            $table->unsignedTinyInteger('ab')->nullable();
            $table->text('family_history')->nullable();
            $table->text('medical_history')->nullable();
            $table->text('surgical_history')->nullable();
            $table->string('pr')->nullable();
            $table->string('contraception')->nullable();
            $table->enum('cycle', ['Regular', 'Irregular'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pregnancy_visits');
    }
};
