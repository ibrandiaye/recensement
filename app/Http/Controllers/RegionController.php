<?php

namespace App\Http\Controllers;

use App\Exports\CniExport;
use App\Models\Region;
use App\Repositories\RegionRepository;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\SimpleExcel\SimpleExcelReader;

class RegionController extends Controller
{

    protected $regionRepository;

    public function __construct(RegionRepository $regionRepository){
        $this->regionRepository =$regionRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       
        $regions = $this->regionRepository->getAll();
        return view('region.index',compact('regions'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('region.add');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $regions = $this->regionRepository->store($request->all());
        return redirect('region');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $region = $this->regionRepository->getById($id);
        return view('region.show',compact('region'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $region = $this->regionRepository->getById($id);
        return view('region.edit',compact('region'));
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
        $this->regionRepository->update($id, $request->all());
        return redirect('region');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->regionRepository->destroy($id);
        return redirect('region');
    }
    public function    allRegionapi(){
        $regions = $this->regionRepository->getRegionAsc();
        return response()->json($regions);
    }
    public function importExcel(Request $request)
{

   /*   $data =  Excel::import(new RegionImport,$request['file']);
 //   dd($data);

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
    $status = Region::insert($rows->toArray());

    // Si toutes les lignes sont insérées
    if ($status) {

        // 5. On supprime le fichier uploadé
        $reader->close(); // On ferme le $reader
       // unlink($fichier);

        // 6. Retour vers le formulaire avec un message $msg
        return back()->withMsg("Importation réussie !");

    } else { abort(500); }
}



}
