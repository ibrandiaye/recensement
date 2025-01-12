{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Modifier Département')

@section('content')
<div class="row">
    <div class="col-12">
      <div class="page-title-box">
          <div class="page-title-right">
              <ol class="breadcrumb m-0">
                  <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                  <li class="breadcrumb-item active"><a href="javascript: void(0);">Carte </a></li>
              </ol>
          </div>
          <h4 class="page-title">Modifier un Carte</h4>
      </div>
    </div>
  </div>

<div class="row">
    <div class="col-12">
        {!! Form::model($carte, ['method'=>'PATCH','route'=>['carte.update', $carte->id]]) !!}
            @csrf
             <div class="card ">
                <div class="card-header text-center">FORMULAIRE DE MODIFICATION Utilisateur</div>
                <div class="card-body">
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                    <div class="col-lg-6 offset-lg-3">
                        <div class="form-group">
                            <label>Nom </label>
                            <input type="text" name="nom"  value="{{ $carte->nom}}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Prenom </label>
                            <input type="text" name="prenom"  value="{{ $carte->prenom}}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Date de Naissance </label>
                            <input type="text" name="date_naiss"  value="{{ $carte->date_naiss}}" class="form-control"required>
                        </div>
                    </div>

                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Lieu de Naissance </label>
                            <input type="text" name="lieu_naiss"  value="{{ $carte->lieu_naiss}}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Date D'espiration </label>
                            <input type="text" name="date_expiration"  value="{{ $carte->date_expiration}}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Sexte </label>
                            <input type="text" name="sexe"  value="{{ $carte->sexe}}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Numero </label>
                            <input type="text" name="numero"  value="{{ $carte->numero}}" class="form-control"required>
                        </div>
                    </div>
                    <div>
                        <center>
                            <button type="submit" class="btn btn-success btn btn-lg "> MODIFIER</button>
                        </center>
                    </div>


                </div>
            </div>
        {!! Form::close() !!}
    </div>
</div>

@endsection
