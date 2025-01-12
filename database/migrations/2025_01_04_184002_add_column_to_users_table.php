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
        Schema::table('users', function (Blueprint $table) {
            $table->string("role");
            $table->unsignedBigInteger("departement_id")->nullable();
            $table->foreign("departement_id")
            ->references("id")
            ->on("departements");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn("role");
            $table->dropForeign("departement_id");
            $table->dropColumn("departement_id");

        });
    }
};
