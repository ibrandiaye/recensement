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
        Schema::create('comptages', function (Blueprint $table) {
            $table->id();
            $table->date("debut");
            $table->date("fin");
            $table->integer("inscription")->default(0);
            $table->integer("modification")->default(0);
            $table->integer("changement")->default(0);
            $table->integer("radiation")->default(0);
            $table->unsignedBigInteger("commune_id");
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
        Schema::dropIfExists('comptages');
    }
};
