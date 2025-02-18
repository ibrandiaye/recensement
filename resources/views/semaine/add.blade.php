{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Enregister semaine')

@section('content')

<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Semaine </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Semaine</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">

        <form action="{{ route('semaine.store') }}" method="POST">
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
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Date Debut</label>
                            <input type="date" name="debut"  value="{{ old('debut') }}" class="form-control"  required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Fin</label>
                            <input type="date" name="fin"  value="{{ old('fin') }}" class="form-control"  required>
                        </div>
                    </div>
                    <div>

                            <button type="submit" id="enregistrer" class="btn btn-success btn btn-lg "> ENREGISTRER</button>

                    </div>
                </div>

            </div>

        </form>
    </div>
</div>
@endsection

@section("js")
<script>
 $(document).ready(function() { 
        $('#enregistrer').click(function() { 
            $.blockUI(
               { 
                message: "<h3>Enregistrement en cours ...<h3>", 
                css: { color: 'green', borderColor: 'green' } ,
            }
            ); 
    
            setTimeout($.unblockUI, 2000); 
        }); 
    });  
</script>
@endsection


