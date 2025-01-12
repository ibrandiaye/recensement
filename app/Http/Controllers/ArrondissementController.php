<?php

namespace App\Http\Controllers;

use App\Models\Arrondissement;
use App\Repositories\ArrondissementRepository;
use App\Repositories\DepartementRepository;
use Illuminate\Http\Request;
use Spatie\SimpleExcel\SimpleExcelReader;

class ArrondissementController extends Controller
{
    protected $arrondissementRepository;
    protected $departementRepository;

    public function __construct(ArrondissementRepository $arrondissementRepository, DepartementRepository $departementRepository){
        $this->arrondissementRepository =$arrondissementRepository;
        $this->departementRepository = $departementRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $arrondissements = $this->arrondissementRepository->getAllWithdepartement();
        return view('arrondissement.index',compact('arrondissements'));
    }

    public function allArrondissementApi()
    {
        $arrondissements = $this->arrondissementRepository->getAllOnLy();
        return response()->json($arrondissements);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $departements = $this->departementRepository->getAll();
        return view('arrondissement.add',compact('departements'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $arrondissements = $this->arrondissementRepository->store($request->all());
        return redirect('arrondissement');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $arrondissement = $this->arrondissementRepository->getById($id);
        return view('arrondissement.show',compact('arrondissement'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $departements = $this->departementRepository->getAll();
        $arrondissement = $this->arrondissementRepository->getById($id);
        return view('arrondissement.edit',compact('arrondissement','departements'));
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

        $this->arrondissementRepository->update($id, $request->all());
        return redirect('arrondissement');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->arrondissementRepository->destroy($id);
        return redirect('arrondissement');
    }
    public function byDepartement($departement){
        $arrondissements = $this->arrondissementRepository->getByDepartement($departement);
        return response()->json($arrondissements);
    }
    public function importExcel(Request $request)
    {
         /*  Excel::import(new ArrondissementImport,$request['file']);
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
      $departements = $this->departementRepository->getAll();
      foreach ($rows as $key => $arrondissement) {
        foreach ($departements as $key1 => $departement) {
            if($arrondissement["departement"]==$departement->nom){
                Arrondissement::create([
                    "nom"=>$arrondissement['arrondissement'],
                    "departement_id"=>$departement->id/* ,
                    "latitude"=>$arrondissement['latitude'],
        "longitude"=>$arrondissement['longitude'] */
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

    /* public function getByDepartement($departement){
        $arrondissements = $this->arrondissementRepository->getByDepartement($departement);
        return response()->json($arrondissements);
    }
 public function getArrondissementByNom(){
        $arrondissements = $this->arrondissementRepository->getArrondissementByNom($_GET['q']);
        return response()->json($arrondissements);
    } */

    public function getByDepartement($departement)
    {
        $arrondissements = $this->arrondissementRepository->getByDepartement($departement);
        return response()->json($arrondissements);
    }
}
