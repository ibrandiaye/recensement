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
        Schema::create('modifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("centrevote_id")->index();
            $table->foreign("centrevote_id")->references("id")->on("centrevotes");
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
        Schema::dropIfExists('modifications');
    }
};
