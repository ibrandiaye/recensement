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
        Schema::create('cartes', function (Blueprint $table) {
            $table->id();
            $table->string("nom");
            $table->string("prenom");
            $table->string("datenaiss");
            $table->string("lieunaiss");
            $table->bigInteger("numelec")->unique();
            $table->bigInteger("numcni")->unique();
            $table->unsignedBigInteger("departement_id");
            $table->foreign("departement_id")
            ->references("id")
            ->on("departements");
            $table->unsignedBigInteger("region_id")->nullable();
            $table->foreign("region_id")
            ->references("id")
            ->on("regions");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cartes');
    }
};
