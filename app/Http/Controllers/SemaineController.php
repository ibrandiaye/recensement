<?php

namespace App\Http\Controllers;

use App\Repositories\SemaineRepository;
use Illuminate\Http\Request;

class SemaineController extends Controller
{
    protected $semaineRepository;

    public function __construct(SemaineRepository $semaineRepository){
        $this->semaineRepository =$semaineRepository;
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
        $this->semaineRepository->destroy($id);
        return redirect('semaine');
    }

}
