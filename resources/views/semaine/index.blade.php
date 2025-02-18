@extends('welcome')
@section('title', '| semaine')


@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Departement </a></li>
                </ol>
            </div>
            <h4 class="page-title">Liste Semaine</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        @if ($message = Session::get('success'))
            <div class="alert alert-success">
                <p>{{ $message }}</p>
            </div>
        @endif
        @if ($message = Session::get('error'))
            <div class="alert alert-danger">
                <p>{{ $message }}</p>
            </div>
        @endif
        @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
        @php
         $user = Auth::user();
        @endphp

        <div class="card ">
            <div class="card-header">LISTE D'ENREGISTREMENT DES Semaines</div>
            <div class="card-body">
              
                <table id="example1" class="table table-bordered table-responsive-md table-striped text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom </th>
                            <th>Date </th>
                            <th>Fin </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($semaines as $semaine)
                        <tr>
                            <td>{{ $semaine->id }}</td>
                            <td>{{ $semaine->nom }}</td>
                            <td>{{ $semaine->debut }}</td>
                            <td>{{ $semaine->fin }}</td>

                            <td>
                                @if ($user->role=="admin")
                                
                                    <a href="{{ route('semaine.edit', $semaine->id) }}" role="button" class="btn btn-primary"><i class="fas fa-edit"></i></a>
                                    {!! Form::open(['method' => 'DELETE', 'route'=>['semaine.destroy', $semaine->id], 'style'=> 'display:inline', 'onclick'=>"if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]) !!}
                                    <button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
                                    {!! Form::close() !!}
                                @endif

                                @if ($user->role=='sous_prefet')
                                <a href="{{ route('message.arrondissement', ["id"=>$user->arrondissement_id,"date"=>$semaine->debut]) }}" role="button" class="btn btn-info"><i toolip="BORDEREAU DE TRANSMISSION" class="fas fa-file"></i></a>
                                @elseif($user->role=='prefet')
                                <a href="{{ route('message.departement', ["id"=>$user->departement_id,"date"=>$semaine->debut]) }}" role="button" class="btn btn-info"><i toolip="BORDEREAU DE TRANSMISSION" class="fas fa-file"></i></a>
                                @elseif($user->role=='gouverneur')
                                <a href="{{ route('message.region', ["id"=>$user->region_id,"date"=>$semaine->debut]) }}" role="button" class="btn btn-info"><i toolip="BORDEREAU DE TRANSMISSION" class="fas fa-file"></i></a>
                                @elseif($user->role=='admin' || $user->role=='superviseur' || $user->role=='correcteur' )
                                <a href="{{ route('message.national', ["date"=>$semaine->debut]) }}" role="button" class="btn btn-info"><i toolip="BORDEREAU DE TRANSMISSION" class="fas fa-file"></i></a>
                                 
                                <a href="{{ route('commune.renseigne', ["semaine"=>$semaine->id]) }}" role="button" class="btn btn-primary"><i toolip="Rapport" class="fas fa-database"></i></a>

                                @endif


                            </td>

                        </tr>
                        @endforeach

                    </tbody>
                </table>



            </div>

        </div>
    </div>
</div>


@endsection
