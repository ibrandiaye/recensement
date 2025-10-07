<?php

namespace App\Http\Controllers;

use App\Models\Revision;
use App\Repositories\CommuneRepository;
use App\Repositories\DepartementRepository;
use App\Repositories\RegionRepository;
use App\Repositories\RevisionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\SimpleExcel\SimpleExcelReader;

class RevisionController extends Controller
{
    protected $revisionRepository;
    protected $regionRepository;
    protected $departementRepository;
    protected $communeRepository;

    public function __construct(RevisionRepository $revisionRepository, RegionRepository $regionRepository,
    DepartementRepository $departementRepository,CommuneRepository $communeRepository){
        $this->revisionRepository =$revisionRepository;
        $this->regionRepository = $regionRepository;
        $this->departementRepository = $departementRepository;
        $this->communeRepository = $communeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
       /* //getByDepartement
        $user = Auth::user();

        if($user->role=="prefet" || $user->role=="collecteur")
        {
            $revisions = $this->revisionRepository->getByDepartement($user->departement_id);
            $nbRevision = $this->revisionRepository->countByDepartement($user->departement_id);
            $communes = $this->communeRepository->getByDepartement($user->departement_id);
           //dd($revisions);
        }
        else
        {
            $revisions = $this->revisionRepository->getAll();
            $nbRevision = $this->revisionRepository->countAll();
            $communes = $this->communeRepository->getAllOnLy();


        }*/
            $nbRevision='';
            $search = $request->input('search');
            $revisions = Revision::where('numcni', 'like', "%$search%")
                  ->paginate(10)
                  ->appends(['search' => $search]);

        return view('revision.index',compact('revisions'));
    }

    public function revisionByLocalisationAnUser($user)
    {


        $revisions = $this->revisionRepository->getByUserAndLocalisation($user,false);
        $nbRevision = $this->revisionRepository->countByUserAndLocalisation($user,false);

        return view('revision.horsdepartement',compact('revisions','nbRevision'));
    }
    public function indexByCommune(Request $request)
    {
        //getByDepartement
        $user = Auth::user();
       // dd($request->commune_id);
        $revisions = $this->revisionRepository->getByCommune($request->commune_id);
        $nbRevision = $this->revisionRepository->countBycommune($request->commune_id);
        if( $user->role=="collecteur")
        {

            $communes = $this->communeRepository->getByDepartement($user->departement_id);
        }
        else
        {
            $communes = $this->communeRepository->getAllOnLy();


        }
        return view('revision.index',compact('revisions','nbRevision','communes'));
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
        return view('revision.add',compact('regions','departements'));
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
            $revisions = $this->revisionRepository->store($request->all());
            //return redirect('revision');
            if($localisation==false)
            {

                return redirect()->back()->withErrors("Revision Enregistre mais appartenant à un commune d'un autre department  : ".$departement->nom);

            }
            else
            {
                return redirect()->back()->with("success","Revision enregistre avec succés");
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
        $revision = $this->revisionRepository->getById($id);
        return view('revision.show',compact('revision'));
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
        $revision = $this->revisionRepository->getById($id);
        $departements = $this->departementRepository->getAll();
        return view('revision.edit',compact('revision','regions','departements'));
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
        $this->revisionRepository->update($id, $request->all());
        return redirect('revision');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->revisionRepository->destroy($id);
        return redirect('revision');
    }

    public function destroyAll()
    {
        $this->revisionRepository->deleteAll();
        return redirect('revision');
    }

    public function importExcel(Request $request)
    {
         /*  Excel::import(new CommuneImport,$request['file']);
       //  dd($data);
        return redirect()->back()->with('success', 'Données importées avec succès.'); */
        ini_set('max_execution_time', 30000);
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
       $communes = $this->communeRepository->getAll();
        foreach ($rows as $key => $carte)
        {
            /*foreach ($communes as $key1 => $commune)
            {
                if($carte["commune"]==$commune->nom)
                {
                    Revision::create([
                        "commune"=>$carte['commune'],
                        "nom"=>$carte["nom"],
                        "prenom"=>$carte["prenom"],
                        "numcni"=>$carte["cni"],
                        "electeur"=>$carte["numelec"],
                        "sexe"=>$carte["sexe"],
                        "type"=>$carte["type"],
                         "lieunaiss"=>$carte["lieunaiss"],
                        "datenaiss"=>$carte["datenaiss"],
                        "commune_id"=>$commune->id,
                        "departement_id"=>$commune->departement->id ,
                        "region_id"=>$commune->departement->region_id,
                        "motif" =>$carte['motif']
                    ]);
                }
            }*/
                Revision::create([
                        "commune"=>$carte['commune'],
                        "nom"=>$carte["nom"],
                        "prenom"=>$carte["prenom"],
                        "numcni"=>$carte["cni"],
                        "electeur"=>$carte["numelec"],
                        "sexe"=>$carte["sexe"],
                        "type"=>$carte["type"],
                         "lieunaiss"=>$carte["lieunaiss"] ?? null,
                        "datenaiss"=>$carte["datenaiss"] ?? null,
                        "motif" =>$carte['motif']
                    ]);

        }
        // 5. On supprime le fichier uploadé
        $reader->close(); // On ferme le $reader
        // unlink($fichier);

        // 6. Retour vers le formulaire avec un message $msg
        return redirect()->back()->with('success', 'Données importées avec succès.');
    }

    public function getByParametre(Request $request)
    {
        $erreur = "";
         if((empty($request->nom) && empty($request->prenom)) || empty($request->nin) )
        {
            return redirect()->back()->with(["error"=>" le Champ NIN et le nom ou le prenom doivent être  renseignés"])->withInput();
        }
        if($request->nin && $request->nom)
        {
            $revision = $this->revisionRepository->getByNinAndNom($request->nom,$request->nin);
             if(empty($revision))
            {
                $erreur = "Aucun résultat ne correspond à votre recherche .<br>Réessayez, vérifier les informations saisies";

            }
            $nom = $request->nom;
            $prenom = $request->prenom;
            $nin = $request->nin;
            return view('revision', compact('revision','erreur','nom','prenom','nin'));

        }
        if($request->nin && $request->prenom)
        {
            $revision = $this->revisionRepository->getByNinAndPrenom($request->prenom,$request->nin);
            if(empty($revision))
            {
                $erreur = "Aucun résultat ne correspond à votre recherche .<br>Réessayez, vérifier les informations saisies";

            }
                $nom = $request->nom;
                $prenom = $request->prenom;
                $nin = $request->nin;
             return view('revision', compact('revision','erreur','nom','prenom','nin'));

        }



    }
}
