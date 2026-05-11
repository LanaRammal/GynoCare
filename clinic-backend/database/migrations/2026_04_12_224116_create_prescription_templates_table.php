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
    Schema::create('prescription_templates', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->json('medications');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('prescription_templates');
}
};
