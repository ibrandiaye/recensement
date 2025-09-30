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
        Schema::create('revisions', function (Blueprint $table) {
            $table->id();
             $table->string("nom");
            $table->string("prenom");
            $table->string("datenaiss");
            $table->string("lieunaiss");
             $table->string("type");
            $table->bigInteger("numelec")->nullable()->unique();
            $table->bigInteger("numcni")->nullable()->unique();
             $table->string("commune")->nullable();
             $table->string("sexe")->nullable();
            $table->unsignedBigInteger("departement_id")->nullable();
            $table->foreign("departement_id")
            ->references("id")
            ->on("departements");
            $table->unsignedBigInteger("region_id")->nullable();
            $table->foreign("region_id")
            ->references("id")
            ->on("regions");
             $table->unsignedBigInteger("commune_id")->nullable();
            $table->foreign("commune_id")
            ->references("id")
            ->on("communes");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revisions');
    }
};
