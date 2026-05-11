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
    Schema::create('case_templates', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('symptoms')->nullable();
        $table->text('diagnosis')->nullable();
        $table->text('examination_notes')->nullable();
        $table->text('treatment_plan')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('case_templates');
}
};
