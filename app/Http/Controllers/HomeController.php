<?php

namespace App\Http\Controllers;

use App\Repositories\ComptageRepository;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    protected $comptageRepository; 
    public function __construct(ComptageRepository $comptageRepository)
    {
        $this->middleware('auth');
        $this->comptageRepository = $comptageRepository;
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $inscription = $this->comptageRepository->nbGroupByInscription();
        $modification = $this->comptageRepository->nbGroupByModification();

        $changement = $this->comptageRepository->nbGroupByChangement();

        $radiation = $this->comptageRepository->nbGroupRadiation();

        return view('home',compact("inscription","modification","changement","radiation"));
    }

    public function statByCommune($commune)
    {
       $data = $this->comptageRepository->getById($commune);
        return response()->json($data);
    }
}
