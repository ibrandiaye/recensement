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
            
            $table->unsignedBigInteger("commune_id")->nullable();
            $table->foreign("commune_id")->references("id")->on("communes");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cartes', function (Blueprint $table) {
            $table->dropForeign("commune_id");
            $table->dropColumn("commune_id");

        });
    }
};
