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
        Schema::table('lots', function (Blueprint $table) {
            $table->boolean("verification")->default(0);
            $table->boolean("validation")->default(0);
            $table->boolean("retour")->default(0);
            $table->text("commentaire")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lots', function (Blueprint $table) {
            $table->dropColumn("verification");
            $table->dropColumn("validation");
            $table->dropColumn("retour");
            $table->dropColumn("commentaire");
        });
    }
};
