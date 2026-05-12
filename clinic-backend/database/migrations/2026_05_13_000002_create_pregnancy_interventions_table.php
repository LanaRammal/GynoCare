<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pregnancy_interventions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_visit_id')->constrained()->onDelete('cascade');
            $table->date('date')->nullable();
            $table->string('type')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pregnancy_interventions');
    }
};
