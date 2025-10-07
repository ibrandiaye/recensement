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
        Schema::table('revisions', function (Blueprint $table) {
             $table->string("numelec")->nullable()->change();
            $table->string("numcni")->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('revisions', function (Blueprint $table) {
             $table->bigInteger("numelec")->nullable()->unique()->change();
            $table->bigInteger("numcni")->nullable()->unique()->change();
        });
    }
};
