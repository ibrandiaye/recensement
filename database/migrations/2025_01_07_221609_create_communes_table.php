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
        Schema::create('communes', function (Blueprint $table) {
            $table->id();
            $table->string("nom");
            $table->unsignedBigInteger("departement_id");
            $table->foreign("departement_id")
            ->references("id")
            ->on("departements");
            $table->unsignedBigInteger("arrondissement_id")->nullable();
            $table->foreign("arrondissement_id")
            ->references("id")
            ->on("arrondissements");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('communes');
    }
};
