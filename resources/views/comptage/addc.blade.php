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
        @if ($message = Session::get('success'))
        <div class="alert alert-success">
            <p>{{ $message }}</p>
        </div>
        @endif
        @if ($message = Session::get('error'))
            <div class="alert alert-danger">
                <p>{{ $message }}</p>
            </div>
        @endif
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
                                        <label>Region</label>
                                        <select class="form-control" name="region_id" id="region_id" required="">
                                            <option value="">Selectionnez</option>
                                            @foreach ($regions as $region)
                                            <option value="{{$region->id}}">{{$region->nom}}</option>
                                                @endforeach
        
                                        </select>
                                    </div>
                                    <div class="col-lg-6">
                                        <label>Departement</label>
                                        <select class="form-control" name="departement_id" id="departement_id" required="">
        
                                        </select>
                                    </div>
                                    <div class="col-lg-6">
                                        <label>Arrondissement</label>
                                        <select class="form-control" name="arrondissement_id" id="arrondissement_id" required="">
        
                                        </select>
                                    </div>
                                    <div class="col-lg-6">
                                        <label>Commune</label>
                                        <select class="form-control" name="commune_id" id="commune_id" >
        
                                        </select>
                                    </div>
                                    <div class="col-lg-6">
                                        <label> Semaine</label>
                                        <select class="form-control" name="semaine_id" id="semaine_id" required="">
                                           <option value="">Selectionnez</option>
                                            @foreach ($semaines as $semaine)
                                            <option value="{{$semaine->id}}">{{$semaine->nom}} de {{date('d/m/Y', strtotime($semaine->debut))}} à {{date('d/m/Y', strtotime($semaine->fin))}}</option>
                                                @endforeach

                                        </select>
                                    </div>
                                   {{--  <div class="col-lg-6">
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
                                    </div> --}}
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
                                        <button id="enregistrer" type="submit" class="btn btn-success btn btn-lg "> ENREGISTRER</button>
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

        $("#region_id").change(function () {
        // alert("ibra");
        var region_id =  $("#region_id").children("option:selected").val();
        $(".region").val(region_id);
        $(".departement").val("");
        $(".commune").val("");
            var departement = "<option value=''>Veuillez selectionner</option>";
            $.ajax({
                type:'GET',
                url:url_app+'/departement/by/region/'+region_id,
                data:'_token = <?php echo csrf_token() ?>',
                success:function(data) {

                    $.each(data,function(index,row){
                        //alert(row.nomd);
                        departement +="<option value="+row.id+">"+row.nom+"</option>";

                    });

                    $("#departement_id").empty();
                    $("#departement_id").append(departement);
                }
            });
        });
        $("#departement_id").change(function () {
            $("#rts").empty();
            $("#centrevote_id").empty();
            $("#commune_id").empty();
            $("#arrondissement_id").empty();
            var departement_id =  $("#departement_id").children("option:selected").val();
            $(".departement").val(departement_id);
            $(".commune").val("");
            var commune = "<option value=''>Veuillez selectionner</option>";
            var arrondissement = "<option value=''>Veuillez selectionner</option>";
            $.ajax({
                type:'GET',
                url:url_app+'/commune/by/departement/'+departement_id,
                data:'_token = <?php echo csrf_token() ?>',
                success:function(data) {
                    console.log(data)
                    $.each(data,function(index,row){
                        //alert(row.nomd);
                        commune +="<option value="+row.id+">"+row.nom+"</option>";

                    });

                  


                    $("#commune_id").append(commune);
                }
            });
            $.ajax({
                type:'GET',
                url:url_app+'/arrondissement/by/departement/'+departement_id,
                data:'_token = <?php echo csrf_token() ?>',
                success:function(data) {
                    console.log(data)
                    $.each(data,function(index,row){
                        //alert(row.nomd);
                        arrondissement +="<option value="+row.id+">"+row.nom+"</option>";

                    });

                 


                    $("#arrondissement_id").append(arrondissement);
                }
            });
        });

        $("#arrondissement_id").change(function () {
            $("#rts").empty();
            $("#centrevote_id").empty();
            $("#commune_id").empty();
         
            var arrondissement_id =  $("#arrondissement_id").children("option:selected").val();
            $(".departement").val(departement_id);
            $(".commune").val("");
            var commune = "<option value=''>Veuillez selectionner</option>";
            $.ajax({
                type:'GET',
                url:url_app+'/commune/by/arrondissement/'+arrondissement_id,
                data:'_token = <?php echo csrf_token() ?>',
                success:function(data) {
                    console.log(data)
                    $.each(data,function(index,row){
                        //alert(row.nomd);
                        commune +="<option value="+row.id+">"+row.nom+"</option>";

                    });

                  


                    $("#commune_id").append(commune);
                }
            });
          
        });

       

        $("#commune_id").change(function () {

            var commune_id =  $("#commune_id").children("option:selected").val();
            $("#rtse").empty();
            $.ajax({
                type:'GET',
                url:url_app+'/stat/by/commune/'+commune_id,
                //data:'_token = <?php echo csrf_token() ?>',
                success:function(data) {
                    console.log(data)
                 
                    if(data.id)
                    {
                        $("#rtse").append("<div class='col-md-4'><h6>Periode de  : "+data.debut+" à "+data.fin+" </h6></div>"+
                        "<div class='col-md-2'><h6>Inscription : "+data.inscription+"</h6></div>"+
                        "<div class='col-md-2'><h6>Modification : "+data.modification+"</h6></div>"+
                        "<div class='col-md-2'><h6>Changement : "+data.changement+"</h6></div>"+
                        "<div class='col-md-2'><h6>Radiation : "+data.radiation+"</h6></div>");
                  
                    }  
                        
                }
            });
        });

       
// Exemple d'utilisation

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



