<?php

namespace App\Http\Controllers;

use App\Models\Arrondissement;
use App\Repositories\ArrondissementRepository;
use App\Repositories\DepartementRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\SimpleExcel\SimpleExcelReader;
use Vtiful\Kernel\Excel;

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

      /*   $this->validate($request, [
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
                    "departement_id"=>$departement->id
                ]);
            }
        }

    } */
   // 1. Vérification et déplacement du fichier uploadé
        if (!$request->hasFile('file')) {
                return response()->json(['error' => 'Aucun fichier trouvé'], 400);
        }

            $file = $request->file('file');
            $filePath = public_path($file->hashName());
            $file->move(public_path(), $file->hashName());

            // 2. Lecture du fichier avec Spatie SimpleExcelReader
            $reader = SimpleExcelReader::create($filePath);
            $rows = $reader->getRows(); // Illuminate\Support\LazyCollection

            // 3. Récupération des données existantes
            $arrondissements = $this->arrondissementRepository->getAllOnLy()->pluck('nom')->map(fn($n) => trim(strtolower($n)))->toArray();
            $departements = $this->departementRepository->getAll()->keyBy(fn($d) => trim(strtolower($d->nom)));

            $nouveauxArrondissements = [];

            // 4. Traitement des données
            foreach ($rows as $arrondissement) {
                $nomArrondissement = trim(strtolower($arrondissement['arrondissement']));
                $nomDepartement = trim(strtolower($arrondissement['departement']));

                // Vérifier si l'arrondissement existe déjà
                if (!in_array($nomArrondissement, $arrondissements)) {
                    // Vérifier si le département existe
                    if (isset($departements[$nomDepartement])) {
                        $nouveauxArrondissements[] = [
                            'nom' => $arrondissement['arrondissement'],
                            'departement_id' => $departements[$nomDepartement]->id,
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                    }
                }
            }

                        // 5. Insertion en base de données en une seule requête
            if (!empty($nouveauxArrondissements)) {
                Arrondissement::insert($nouveauxArrondissements);
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

    public function updateArrondissement(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'Aucun fichier trouvé'], 400);
        }

        $file = $request->file('file');
        $filePath = public_path($file->hashName());
        $file->move(public_path(), $file->hashName());

        // 2. Lecture du fichier avec Spatie SimpleExcelReader
        $reader = SimpleExcelReader::create($filePath);
        $rows = $reader->getRows(); // Illuminate\Support\LazyCollection
        // $rows est une Illuminate\Support\LazyCollection

        // 4. On insère toutes les lignes dans la base de données
      //  $rows->toArray());
      $arrondissements = $this->arrondissementRepository->getAllOnLy();

        foreach ($rows as $key => $arrondissement) {
            foreach ($arrondissements as $key1 => $data) {
                if($arrondissement["arrondissement"]==$data->nom){
                    DB ::table("arrondissements")->where("nom",$data->nom)->update(["is_arrondissement"=>false]);
                }
            }

        
        }
        return redirect()->back()->with('success', 'Données importées avec succès.');

    }


    public function getByDepartement($departement)
    {
        $arrondissements = $this->arrondissementRepository->getByDepartement($departement);
        return response()->json($arrondissements);
    }
}
