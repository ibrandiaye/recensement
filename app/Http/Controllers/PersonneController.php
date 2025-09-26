<?php

namespace App\Http\Controllers;

use App\Repositories\ArrondissementRepository;
use App\Repositories\CommuneRepository;
use App\Repositories\LocaliteRepository;
use App\Repositories\PersonneRepository;
use App\Repositories\RegionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PersonneController extends Controller
{
    protected $communeRepository;
    protected $regionRepository;
    protected $personneRepository;
    protected $arrondissementRepository;
    protected $localiteRepository;

    public function __construct( CommuneRepository $communeRepository,RegionRepository $regionRepository,
    PersonneRepository $personneRepository,ArrondissementRepository $arrondissementRepository){
        $this->communeRepository = $communeRepository;
        $this->regionRepository = $regionRepository;
        $this->personneRepository = $personneRepository;
        $this->arrondissementRepository = $arrondissementRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
          $personnes = $this->personneRepository->get();
       // dd($personnes);
       $arrondissements = $this->arrondissementRepository->getAllOnLy();
       foreach($personnes as $personne)
       {
        foreach($arrondissements as $arrondissement)
        {
            if($personne->arrondissement_id==$arrondissement->id)
            {
                $personne->arrondissement = $arrondissement->nom;
            }
        }
       }
       // dd($personnes);
        return view('personne.index',compact('personnes'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
       /*  $user = Auth::user();
        if($user->role=="correcteur" || $user->role=="admin" )
        { */
            $regions = $this->regionRepository->getAllOnLy();
            //  dd(Auth::user()->arrondissement_id);
              return view('personne.addc',compact('regions'));
       /*  }
        else
        {
            $communes = $this->communeRepository->getByArrondissement($user->arrondissement_id);
            //  dd(Auth::user()->arrondissement_id);
              return view('personne.add',compact('communes',));
        } */

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       /*  $this->validate($request, [
            'commune_id' => 'required',

        ]); */


        $personnes = $this->personneRepository->store($request->all());

        return redirect('personne');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $personne = $this->personneRepository->getById($id);
        $user = Auth::user();
        return view('personne.bordereau',compact('personne','user'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = Auth::user();
         if( $user->role=="sous_prefet")
        {
            $communes = $this->communeRepository->getByArrondissement($user->arrondissement_id);

        }
        else if($user->role=="prefet" )
        {
            $communes = $this->communeRepository->getByDepartement($user->departement_id);

        }
        else
        {
            $communes =$this->communeRepository->getAllOnLy();
        }
        $personne = $this->personneRepository->getById($id);
        return view('personne.edit',compact('personne','communes'));
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
        if($request->document)
        {
            $this->validate($request, [
                'document' => 'required|mimes:pdf,doc,docx',
            ] );
            $imageName = time().'.'.$request->document->extension();
            $request->document->move(public_path('document'), $imageName);
            $request->merge(['doc'=>$imageName]);
        }
        $this->personneRepository->update($id, $request->all());
        return redirect('personne');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $this->personneRepository->destroy($id);
        return redirect('personne');
    }
    public function    byCommune($commune){
        $personnes = $this->personneRepository->getByCommune($commune);
        return response()->json($personnes);
    }

    public function createWithLocalite()
    {
        $user = Auth::user();
        if($user->role=="correcteur" || $user->role=="admin" )
        {
            $regions = $this->regionRepository->getAllOnLy();
            //  dd(Auth::user()->arrondissement_id);
              return view('personne.addc',compact('regions',));
        }
        else
        {
            $communes = $this->communeRepository->getByArrondissement($user->arrondissement_id);
            //  dd(Auth::user()->arrondissement_id);
              return view('personne.add',compact('communes'));
        }

    }
}
