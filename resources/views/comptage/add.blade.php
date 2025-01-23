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
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Comptage </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Comptage</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <form action="{{ route('comptage.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
             <div class="card ">
                        <div class="card-header text-center">FORMULAIRE D'ENREGISTREMENT D'UNE Comptage</div>
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
                                <div class="row" id="rtse">
                                                    
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <label>Nom Commune</label>
                                        <select class="form-control" name="commune_id" id="commune_id" required="">
                                           <option value="">Selectionnez</option>
                                            @foreach ($communes as $commune)
                                            <option value="{{$commune->id}}">{{$commune->nom}}</option>
                                                @endforeach

                                        </select>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Date Debut</label>
                                            <input type="date" name="debut"  value="{{ old('debut') }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Date Fin</label>
                                            <input type="date" name="fin"  value="{{ old('fin') }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Nombre d'inscriptiopn</label>
                                            <input type="number" name="inscription"  value="{{ old('inscription') }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Nombre de Modification</label>
                                            <input type="number" name="modification"  value="{{ old('modification') }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Nombre de Changement</label>
                                            <input type="number" name="changement"  value="{{ old('changement') }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Nombre de Radiation</label>
                                            <input type="number" name="radiation"  value="{{ old('radiation') }}" class="form-control"  required>
                                        </div>
                                    </div>

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


@section('js')
    <script>
        url_app = '{{ config('app.url') }}';


        $("#commune_id").change(function () {

            var commune_id =  $("#commune_id").children("option:selected").val();
            $("#rtse").empty();
            $.ajax({
                type:'GET',
                url:url_app+'/stat/by/commune/'+commune_id,
                //data:'_token = <?php echo csrf_token() ?>',
                success:function(data) {
                    console.log(data)
                 
                      
                        $("#rtse").append("<div class='col-md-4'><h6>Periode de  : "+data.debut+" à "+data.fin+" </h6></div>"+
                        "<div class='col-md-2'><h6>Inscription : "+data.inscription+"</h6></div>"+
                        "<div class='col-md-2'><h6>Modification : "+data.modification+"</h6></div>"+
                        "<div class='col-md-2'><h6>Changement : "+data.changement+"</h6></div>"+
                        "<div class='col-md-2'><h6>Radiation : "+data.radiation+"</h6></div>");
                  
                }
            });
        });

       
// Exemple d'utilisation

    </script>
@endsection

