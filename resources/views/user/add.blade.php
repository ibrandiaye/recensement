{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Enregister Utilisateur')

@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Utilisateur </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Utilisateur</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <form action="{{ route('user.store') }}" method="POST">
            @csrf
            <div class="card">
                <div class="card-header  text-center">FORMULAIRE D'ENREGISTREMENT D'UN Utilisateur</div>
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
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Nom </label>
                            <input type="text" name="name"  value="{{ old('name') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>email </label>
                            <input type="email" name="email"  value="{{ old('email') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Mot de Passe </label>
                            <input id="password" type="password" name="password"  value="{{ old('password') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Confirmer Mot de passe </label>
                            <input id="password-confirm" type="password"  name="password_confirmation" value="{{ old('name') }}" class="form-control"required>
                        </div>
                    </div>
                    
                        <div class="col-lg-6">
                            <label>Departement</label>
                            <select class="form-control" name="departement_id" >
                                <option value="">Selectionner</option>
                                @foreach ($departements as $departement)
                                <option value="{{$departement->id}}">{{$departement->nom}}</option>
                                    @endforeach

                            </select>
                        </div>
                        <div class="col-lg-6">
                            <label>Role</label>
                            <select class="form-control" name="role" required="">
                                <option value="">Selectionner</option>
                                <option value="admin">Admin</option>
                                <option value="candidats">candidats</option> 
                                <option value="controlleur">controlleur</option>
                            </select>
                        </div>

                    <div>
                        <center>
                            <button type="submit" class="btn btn-success btn btn-lg "> ENREGISTRER</button>
                        </center>
                    </div>
                </div>

            </div>

        </form>
    </div>
</div>

@endsection


