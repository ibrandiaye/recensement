{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Modifier Région')

@section('content')

<nav class="hk-breadcrumb" aria-label="breadcrumb">
    <ol class="breadcrumb breadcrumb-light bg-transparent">
        <li class="breadcrumb-item"><a href="#">Arrondissement</a></li>
        <li class="breadcrumb-item active" aria-current="page">MODIFICATION D'UN ARRONDISSEMENT</li>
    </ol>
</nav>
<!-- /Breadcrumb -->

<!-- Container -->
<div class="container">

    {!! Form::model($arrondissement, ['method'=>'PATCH','route'=>['arrondissement.update', $arrondissement->id]]) !!}
        @csrf
        <div class="card">
            <div class="card-header text-center">FORMULAIRE DE MODIFICATION ARRONDISSEMENT</div>
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
                        <label>Arrondissement</label>
                    <input type="text" name="arrondissement" class="form-control" value="{{$arrondissement->arrondissement}}"  min="1" required>
                    </div>
                </div>
                <div>

                        <button type="submit" class="btn btn-success btn btn-lg "> MODIFIER</button>

                </div>


            </div>
        </div>
    {!! Form::close() !!}
</div>

@endsection
