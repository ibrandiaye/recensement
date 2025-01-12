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
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Region </a></li>
                </ol>
            </div>
            <h4 class="page-title">Modifier un Region</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">

        {!! Form::model($region, ['method'=>'PATCH','route'=>['region.update', $region->id]]) !!}
            @csrf
             <div class="card">
                <div class="card-header text-center">FORMULAIRE DE MODIFICATION REGION</div>
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

                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Nom de la région</label>
                        <input type="text" name="nom" class="form-control" value="{{$region->nom}}"  min="1" required>
                        </div>
                    </div>
                    <div>

                            <button type="submit" class="btn btn-success btn btn-lg "> MODIFIER</button>

                    </div>


                </div>
            </div>
        {!! Form::close() !!}
    </div>
</div>

@endsection
