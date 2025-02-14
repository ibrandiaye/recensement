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
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Region </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Region</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">

        {!! Form::model($user, ['method'=>'PATCH','route'=>['user.update', $user->id]]) !!}
            @csrf
             <div class="card ">
                <div class="card-header text-center">FORMULAIRE DE MODIFICATION Département</div>
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
                            <label>Nom</label>
                        <input type="text" name="name" class="form-control" value="{{$user->name}}"   required>
                        </div>

                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>email </label>
                            <input type="email" name="email"  value=" {{$user->email }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <label>Region</label>
                        <select class="form-control" name="region_id" id="region_id">
                            <option value="">Selectionnez</option>
                            @foreach ($regions as $region)
                            <option value="{{$region->id}}" {{$region->id==$user->region_id  ? 'selected' : ''}}>{{$region->nom}}</option>
                                @endforeach

                        </select>
                    </div>
                        <div class="col-lg-6">
                            <label>Departement</label>
                            <select class="form-control" id="departement_id" name="departement_id" >
                                <option value="">Selectionnez</option>
                                @foreach ($departements as $departement)
                                <option value="{{$departement->id}}" {{$departement->id==$user->departement_id ? 'selected' : ''}}>{{$departement->nom}}</option>
                                    @endforeach
                            </select>
                        </div>
                        <div class="col-lg-6">
                            <label>Arrondissement</label>
                            <select class="form-control" name="arrondissement_id" id="arrondissement_id">
                                <option value="">Selectionnez</option>
                                @foreach ($arrondissements as $arrondissement)
                                <option value="{{$arrondissement->id}}" {{$arrondissement->id==$user->arrondissement_id ? 'selected' : ''}}>{{$arrondissement->nom}}</option>
                                    @endforeach
                            </select>
                        </div>
                    <div class="col-lg-6">
                        <label>Role</label>
                        <select class="form-control" name="role" required="">
                            <option value="">Selectionner</option>
                            <option value="admin" {{$user->role=="admin" ? 'selected' : ''}}>Admin</option>
                            <option value="prefet" {{$user->role=="prefet" ? 'selected' : ''}}>Prefet</option> 
                            <option value="sous_prefet" {{$user->role=="sous_prefet" ? 'selected' : ''}}>Sous Prefet</option>
                            <option value="gouverneur" {{$user->role=="gouverneur" ? 'selected' : ''}}>gouverneur</option>
                            <option value="superviseur" {{$user->role=="superviseur" ? 'selected' : ''}}>superviseur</option>                        </select>
                        </select>
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
