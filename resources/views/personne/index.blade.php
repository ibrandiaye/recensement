@extends('welcome')
@section('title', '| personne')


@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Personne </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer une Rejêt</h4>
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

    <div class="card ">
        <div class="card-header  text-center">LISTE D'ENREGISTREMENT DES PERSONNES
             <div class="float-right">
                @if(Auth::user()->role!="superviseur") <a href="{{ route('personne.create') }}" class="btn btn-primary">Ajouter une personne</a> @endif
            </div>
        </div>
            <div class="card-body">

                <table id="datatable-buttons" class="table table-striped table-bordered " style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                    <thead>
                        <tr>
                            <th>Région </th>
                            <th>Département</th>
                            <th>Arrondissement </th>
                            <th>Commune </th>

                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Date  <br>de Naissance</th>
                            <th>N° CNI</th>
                            <th>Motif <br> de Rejêt</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($personnes as $personne)
                        <tr>
                            <td>{{ $personne->region }}</td>
                            <td>{{ $personne->departement }}</td>
                            <td>{{ $personne->arrondissement }} </td>
                            <td>{{ $personne->commune }} </td>
                            <td>{{ $personne->prenom }}</td>
                            <td>{{ $personne->nom }}</td>
                             <td>{{ $personne->datenaiss }}</td>
                            <td>{{ $personne->cni }}</td>
                            <td>{{ $personne->commentaire }}</td>
                            <td>
                                <a href="{{ route('personne.edit', $personne->id) }}" role="button" class="btn btn-primary"><i class="fas fa-edit"></i></a>
                                {!! Form::open(['method' => 'DELETE', 'route'=>['personne.destroy', $personne->id], 'style'=> 'display:inline', 'onclick'=>"if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]) !!}
                                <button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
                                {!! Form::close() !!}


                                {{-- <a href="{{ route('personne.show', $personne->id) }}" role="button" class="btn btn-warning"><i toolip="B" class="fas fa-file"></i></a> --}}

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
