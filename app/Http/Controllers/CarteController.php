<?php

namespace App\Http\Controllers;

use App\Repositories\CarteRepository;
use App\Repositories\CommuneRepository;
use App\Repositories\DepartementRepository;
use App\Repositories\RegionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CarteController extends Controller
{
    protected $carteRepository;
    protected $regionRepository;
    protected $departementRepository;
    protected $communeRepository;

    public function __construct(CarteRepository $carteRepository, RegionRepository $regionRepository,
    DepartementRepository $departementRepository,CommuneRepository $communeRepository){
        $this->carteRepository =$carteRepository;
        $this->regionRepository = $regionRepository;
        $this->departementRepository = $departementRepository;
        $this->communeRepository = $communeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //getByDepartement
        $user = Auth::user();

        if($user->role=="prefet" || $user->role=="collecteur")
        {
            $cartes = $this->carteRepository->getByDepartement($user->departement_id);
            $nbCarte = $this->carteRepository->countByDepartement($user->departement_id);
            $communes = $this->communeRepository->getByDepartement($user->departement_id);
           //dd($cartes);
        }
        else
        {
            $cartes = $this->carteRepository->getAll();
            $nbCarte = $this->carteRepository->countAll();
            $communes = $this->communeRepository->getAllOnLy();


        }
        return view('carte.index',compact('cartes','nbCarte','communes'));
    }

    public function carteByLocalisationAnUser($user)
    {
       
      
        $cartes = $this->carteRepository->getByUserAndLocalisation($user,false);
        $nbCarte = $this->carteRepository->countByUserAndLocalisation($user,false);
       
        return view('carte.horsdepartement',compact('cartes','nbCarte'));
    }
    public function indexByCommune(Request $request)
    {
        //getByDepartement
        $user = Auth::user();
       // dd($request->commune_id);
        $cartes = $this->carteRepository->getByCommune($request->commune_id);
        $nbCarte = $this->carteRepository->countBycommune($request->commune_id);
        if( $user->role=="collecteur")
        {
            
            $communes = $this->communeRepository->getByDepartement($user->departement_id);
        }
        else
        {
            $communes = $this->communeRepository->getAllOnLy();


        }
        return view('carte.index',compact('cartes','nbCarte','communes'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $regions = $this->regionRepository->getAll();
        $departements = $this->departementRepository->getAll();
        return view('carte.add',compact('regions','departements'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $commune = $this->communeRepository->getOnlyByName($request->commune);

        if($commune)
        {
            $user =Auth::user();
            $communes = $this->communeRepository->getByDepartement($user->departement_id);
            $localisation = false;
            foreach ($communes as $key => $commu) {
                 if($commu->nom==$request->commune)
                 {
                    $localisation = true;
                 }
            }
           
            $departement = $this->departementRepository->getOnlyOne($commune->departement_id);
            $request->merge(["departement_id"=>$commune->departement_id,"localisation"=>$localisation,'region_id'=>$departement->region_id,
        "commune_id"=>$commune->id]);
            $cartes = $this->carteRepository->store($request->all());
            //return redirect('carte');
            if($localisation==false)
            {
                
                return redirect()->back()->withErrors("Carte Enregistre mais appartenant à un commune d'un autre department  : ".$departement->nom);

            }
            else
            {
                return redirect()->back()->with("success","Carte enregistre avec succés");
            }
        }
        else
        {
            return redirect()->back()->withErrors("Commune non trouvé");
        }
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $carte = $this->carteRepository->getById($id);
        return view('carte.show',compact('carte'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $regions = $this->regionRepository->getAll();
        $carte = $this->carteRepository->getById($id);
        $departements = $this->departementRepository->getAll();
        return view('carte.edit',compact('carte','regions','departements'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->carteRepository->update($id, $request->all());
        return redirect('carte');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->carteRepository->destroy($id);
        return redirect('carte');
    }

}
