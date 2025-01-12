{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Enregister region')

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

        <form action="{{ route('region.store') }}" method="POST">
            @csrf
            <div class="card">
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
                            <label>Nom</label>
                            <input type="text" name="nom"  value="{{ old('nom') }}" class="form-control"  required>
                        </div>
                    </div>
                    <div>

                            <button type="submit" class="btn btn-success btn btn-lg "> ENREGISTRER</button>

                    </div>
                </div>

            </div>

        </form>
    </div>
</div>
@endsection


