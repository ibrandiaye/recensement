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
        Schema::create('identifications', function (Blueprint $table) {
            $table->id();
            $table->string("prenom");
            $table->string("nom");
            $table->string("lieunaiss");
            $table->string("tel");
            $table->string("cni");
            $table->date("datenaiss");
            $table->boolean("handicap");
            $table->unsignedBigInteger("commune_id")->nullable()->index();
            $table->foreign("commune_id")->references("id")->on("communes");
            $table->unsignedBigInteger("departement_id")->index();
            $table->foreign("departement_id")->references("id")->on("departements");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('identifications');
    }
};
