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
        Schema::table('cartes', function (Blueprint $table) {
            $table->string("sexe");
           
            $table->string("commune");
            $table->boolean("localisation")->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cartes', function (Blueprint $table) {

            $table->dropColumn("sexe");
            $table->dropColumn("commune");
            $table->dropColumn("localisation");

        });
    }
};
