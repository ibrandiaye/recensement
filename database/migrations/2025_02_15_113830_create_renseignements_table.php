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
        Schema::create('renseignements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("commune_id");
            $table->foreign("commune_id")->references("id")->on("communes");
            $table->unsignedBigInteger("departement_id")->nullable();
            $table->foreign("departement_id")->references("id")->on("departements");
            $table->unsignedBigInteger("arrondissement_id")->nullable();
            $table->foreign("arrondissement_id")->references("id")->on("arrondissements");
            $table->unsignedBigInteger("semaine_id");
            $table->foreign("semaine_id")->references("id")->on("semaines");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('renseignements');
    }
};
