{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Modifier Région')

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
            <h4 class="page-title">Enregistrer un Departement</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        {!! Form::model($comptage, ['method'=>'PATCH','route'=>['comptage.update', $comptage->id],'enctype'=>'multipart/form-data']) !!}
            @csrf
             <div class="card ">
                        <div class="card-header text-center">FORMULAIRE DE MODIFICATION D'une Comptage</div>
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

                                <div class="row">
                                    <div class="col-lg-6">
                                        <label>Nom Commune</label>
                                        <select class="form-control" name="commune_id" required="">
                                           <option value="">Selectionnez</option>
                                            @foreach ($communes as $commune)
                                            <option value="{{$commune->id}}" {{$comptage->commune_id==$commune->id ? 'selected' : ''}}>{{$commune->nom}}</option>
                                                @endforeach

                                        </select>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Date Debut</label>
                                            <input type="date" name="debut"  value="{{ $comptage->debut }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Date Fin</label>
                                            <input type="date" name="fin"  value="{{ $comptage->fin }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Nombre d'inscriptiopn</label>
                                            <input type="number" name="inscription"  value="{{ $comptage->inscription }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Nombre de Modification</label>
                                            <input type="number" name="modification"  value="{{ $comptage->modification }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Nombre de Changement</label>
                                            <input type="number" name="changement"  value="{{ $comptage->changement }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Nombre de Radiation</label>
                                            <input type="number" name="radiation"  value="{{ $comptage->radiation }}" class="form-control"  required>
                                        </div>
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
