{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Enregister Département')

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
        <form action="{{ route('departement.store') }}" method="POST">
            @csrf
             <div class="card">
                <div class="card-header  text-center">FORMULAIRE D'ENREGISTREMENT D'UN Département</div>
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
                            <label>Nom Département</label>
                            <input type="text" name="nom"  value="{{ old('nom') }}" class="form-control" min="1" required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <label>Nom Région</label>
                        <select class="form-control" name="region_id" required="">
                            @foreach ($regions as $region)
                            <option value="{{$region->id}}">{{$region->nom}}</option>
                                @endforeach

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


