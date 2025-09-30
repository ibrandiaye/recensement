@extends('welcome')
@section('title', '| revision')


@section('content')
<style>
#pag p {
    padding: 10px;
}

</style>
<div class="row">
    <div class="col-sm-12">
        <div class="page-title-box">
            <div class="btn-group float-right">

                                <ol class="breadcrumb hide-phone p-0 m-0">
                                <li class="breadcrumb-item"><a href="{{ route('home') }}" >ACCUEIL</a></li>

                                </ol>
                            </div>

                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>

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

<div class="col-12">
    <div class="card ">
        <div class="card-header">DEMANDE D'ENREGISTREMENT DES REVISION</div>
            <div class="card-body">
                {{-- <h4>Nombre de revisions collectés : {{$nbRevision}}</h4>
                <form action="{{ route('indexByCommune') }}" method="post">
                    @csrf
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label>Commune</label>
                                <select class="form-control" name="commune_id" id="commune_id" required="">
                                    <option value="">Selectionnez</option>
                                    @foreach ($communes as $commune)
                                    <option value="{{$commune->id}}">{{$commune->nom}}</option>
                                        @endforeach

                                </select>

                            </div>
                        </div>
                        <div class="col-md-2">
                            <br>
                            <button type="submit" class="btn btn-success btn btn-lg "> Valider</button>
                        </div>
                    </div>

                </form> --}}
                <div class="row">
                    <div class="col-md-4">
                        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#exampleModalform2">
                            importer
                        </button>
                    </div>
                     <div class="col-md-4">
                        <a class="btn btn-danger" onclick="if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }" href="{{ route('delete.all.revision') }}"> <i class="far fa-trash-alt"></i> Suprimer</a>

                    </div>
                     <div class="col-md-4">
                        <form method="GET" action="{{ route('revision.index') }}">
                                <input type="text" name="search" value="{{ request('search') }}" placeholder="Rechercher Par nin...">
                                <button type="submit" class="btn btn-info">Rechercher</button>
                            </form>
                    </div>
                </div>


                <table id="example1" class="table table-bordered table-responsive-md table-striped text-center">
                    <thead>
                        <tr>
                            <th>type</th>
                            <th>Prenom </th>
                            <th>Nom</th>
                            <th>Sexe</th>
                            <th>Date Naiss </th>
                            <th>NIN </th>
                            <th>Commune </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($revisions as $revision)
                        <tr>
                            <td>{{ $revision->type }}</td>
                            <td>{{ $revision->prenom }}</td>
                            <td>{{ $revision->nom}}</td>
                            <td>{{ $revision->sexe }}</td>
                            <td>{{ $revision->datenaiss }} à  {{$revision->lieunaiss}}</td>
                            <td>{{ $revision->numcni}}</td>
                            <td>{{ $revision->commune}}</td>
                            <td>
                               {{--  <a href="{{ route('revision.edit', $revision->id) }}" role="button" class="btn btn-primary"><i class="fa fa-edit"></i></a>
                                {!! Form::open(['method' => 'DELETE', 'route'=>['revision.destroy', $revision->id], 'style'=> 'display:inline', 'onclick'=>"if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]) !!}
                                <button class="btn btn-danger"><i class="fa fa-trash"></i></button>
                                {!! Form::close() !!}
 --}}
                            </td>

                        </tr>
                        @endforeach

                    </tbody>
                </table>

                 <div id="pag">
                    {{ $revisions->links() }}
                </div>

            </div>
    </div>
</div>
<div class="modal fade" id="exampleModalform2" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form action="{{ route('importer.revision') }}" method="POST" enctype="multipart/form-data">
                @csrf
            <div class="modal-header">
                <h5 class="modal-title">Importer données revision</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group no-margin">
                            <label for="field-7" class="control-label">Document</label>
                            <input type="file" name="file" class="form-control" required>
                            </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Fermer</button>
                <button type="submit" class="btn btn-primary">Valider</button>
            </div>
            </form>
        </div>
    </div>
</div>
@endsection
