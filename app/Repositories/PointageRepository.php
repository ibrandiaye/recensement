<?php
namespace App\Repositories;

use App\Models\Pointage;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class PointageRepository extends RessourceRepository{
    public function __construct(Pointage $pointage){
        $this->model = $pointage;
    }

    public function countByLot($lot)
    {
        return DB::table("pointages")->where("lot_id",$lot)->count();
    }


}
