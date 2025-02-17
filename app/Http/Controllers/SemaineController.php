<?php

namespace App\Http\Controllers;

use App\Repositories\ComptageRepository;
use App\Repositories\SemaineRepository;
use Illuminate\Http\Request;

class SemaineController extends Controller
{
    protected $semaineRepository;
    protected $comptageRepository;
    public function __construct(SemaineRepository $semaineRepository,ComptageRepository $comptageRepository){
        $this->semaineRepository =$semaineRepository;
        $this->comptageRepository = $comptageRepository;
        $this->middleware("admin")->except("index");
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       
        $semaines = $this->semaineRepository->getAll();
        return view('semaine.index',compact('semaines'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('semaine.add');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $semaines = $this->semaineRepository->store($request->all());
        return redirect('semaine');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $semaine = $this->semaineRepository->getById($id);
        return view('semaine.show',compact('semaine'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $semaine = $this->semaineRepository->getById($id);
        return view('semaine.edit',compact('semaine'));
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
        $this->semaineRepository->update($id, $request->all());
        return redirect('semaine');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comptage = $this->comptageRepository->getOneBySemaine($id);
        if(empty($comptage))
        {
            $this->semaineRepository->destroy($id);
            return redirect('semaine');
        }
        else
        {
            return redirect()->back()->withErrors('Impossible de supprimer. Il faut d\'abord supprimer les statistiques de cette semaine ')->withInput();

        }
        
    }

}
