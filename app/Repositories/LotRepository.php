<?php
namespace App\Repositories;

use App\Models\Lot;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class LotRepository extends RessourceRepository{
    public function __construct(Lot $lot){
        $this->model = $lot;
    }


}
