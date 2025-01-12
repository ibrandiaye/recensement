<?php

namespace App\Http\Controllers;

use App\Imports\DepartementImport;
use App\Models\Departement;
use App\Repositories\DepartementRepository;
use App\Repositories\RegionRepository;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\SimpleExcel\SimpleExcelReader;

class DepartementController extends Controller
{
    protected $departementRepository;
    protected $regionRepository;

    public function __construct(DepartementRepository $departementRepository, RegionRepository $regionRepository){
        $this->departementRepository =$departementRepository;
        $this->regionRepository = $regionRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $departements = $this->departementRepository->getAllWithRegion();
        return view('departement.index',compact('departements'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $regions = $this->regionRepository->getAll();
        return view('departement.add',compact('regions'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $departements = $this->departementRepository->store($request->all());
        return redirect('departement');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $departement = $this->departementRepository->getById($id);
        return view('departement.show',compact('departement'));
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
        $departement = $this->departementRepository->getById($id);
        return view('departement.edit',compact('departement','regions'));
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
        $this->departementRepository->update($id, $request->all());
        return redirect('departement');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->departementRepository->destroy($id);
        return redirect('departement');
    }
    public function    byRegion($region){
        $departements = $this->departementRepository->getByRegion($region);
        return response()->json($departements);
    }
    public function importExcel(Request $request)
    {
         /*  Excel::import(new DepartementImport,$request['file']);
       //  dd($data);
        return redirect()->back()->with('success', 'Données importées avec succès.'); */
        $this->validate($request, [
            'file' => 'bail|required|file|mimes:xlsx'
        ]);

        // 2. On déplace le fichier uploadé vers le dossier "public" pour le lire
        $fichier = $request->file->move(public_path(), $request->file->hashName());

        // 3. $reader : L'instance Spatie\SimpleExcel\SimpleExcelReader
        $reader = SimpleExcelReader::create($fichier);

        // On récupère le contenu (les lignes) du fichier
        $rows = $reader->getRows();

        // $rows est une Illuminate\Support\LazyCollection

        // 4. On insère toutes les lignes dans la base de données
      //  $rows->toArray());
      $regions = $this->regionRepository->getAll();
      foreach ($rows as $key => $departement) {
        foreach ($regions as $key1 => $region) {
            if($departement["region"]==$region->nom){
                Departement::create([
                    "nom"=>$departement['departement'],
                    "region_id"=>$region->id,
                   /*  "latitude"=>$departement['latitude'],
                     "longitude"=>$departement['longitude'] */
                ]);

            }
        }

    }
            // 5. On supprime le fichier uploadé
            $reader->close(); // On ferme le $reader
           // unlink($fichier);

            // 6. Retour vers le formulaire avec un message $msg
            return redirect()->back()->with('success', 'Données importées avec succès.');

    }
    public function getByRegion($region){
        $departements = $this->departementRepository->getByRegion($region);
        return response()->json($departements);
    }

    public function getByIdDepartement($id)
    {
        $departement = $this->departementRepository->getById($id);
        return response()->json($departement);
    }
    
}
