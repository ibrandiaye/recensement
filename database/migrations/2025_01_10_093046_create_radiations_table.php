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
        Schema::create('radiations', function (Blueprint $table) {
            $table->id();
            $table->string("motif");
            $table->unsignedBigInteger("identification_id")->index();
            $table->foreign("identification_id")->references("id")->on("identifications")->onDelete("cascade");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('radiations');
    }
};
