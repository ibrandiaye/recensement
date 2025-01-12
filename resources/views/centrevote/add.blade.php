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
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Centre de vote </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Centre de Vote</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <form action="{{ route('centrevote.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
             <div class="card ">
                        <div class="card-header text-center">FORMULAIRE D'ENREGISTREMENT D'UNE Commune</div>
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
                                        <input type="text" name="nom"  value="{{ old('nom') }}" class="form-control"  required>
                                    </div>
                                </div>
                                    <div class="col-lg-6">
                                        <label>Nom Commune</label>
                                        <select class="form-control" name="commune_id" required="">
                                            @foreach ($communes as $commune)
                                            <option value="{{$commune->id}}">{{$commune->nom}}</option>
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


