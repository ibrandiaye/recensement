@extends('welcome')
@section('title', '| renseigne')


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
            <h4 class="page-title">Liste Renseigne</h4>
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
        @php
         $user = Auth::user();
        @endphp

        <div class="card ">
            <div class="card-header">LISTE D'ENREGISTREMENT DES Renseignes</div>
            <div class="card-body">
                <form method="POST" action="{{ route('search.renseignement') }}">

                <div class="row">
                        @csrf
                        <input type="hidden" name="semaine" value="{{$semaine}}">
                        <div class="col-lg-2">
                            <label>Region</label>
                            <select class="form-control" name="region_id" id="region_id" required="">
                                <option value="">Selectionnez</option>
                                @foreach ($regions as $region)
                                <option value="{{$region->id}}"  {{$region->id==$region_id ? 'selected' : ''}} >{{$region->nom}}</option>
                                    @endforeach
            
                            </select>
                        </div>
                        
                        <div class="col-lg-2">
                            <label>Departement</label>
                            <select class="form-control" name="departement_id" id="departement_id" >
                                <option value="">Selectionner</option>
                                @foreach ($departements as $departement)
                                    <option value="{{$departement->id}}" {{$departement->id==$departement_id ? 'selected' : ''}}>{{$departement->nom}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-lg-3">
                            <label>Arrondissement</label>
                            <select class="form-control" name="arrondissement_id" id="arrondissement_id" >
                                <option value="">Selectionner</option>
                                @foreach ($arrondissements as $arrondissement)
                                    <option value="{{$arrondissement->id}}" {{$arrondissement->id==$arrondissement_id ? 'selected' : ''}}>{{$arrondissement->nom}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-lg-3">
                            <label>Commune</label>
                            <select class="form-control" name="commune_id" id="commune_id" >
                                <option value="">Selectionner</option>
                                @foreach ($communes as $commune)
                                    <option value="{{$commune->id}}"  {{$commune->id==$commune_id ? 'selected' : ''}}>{{$commune->nom}}</option>
                                @endforeach
                            </select>
                        
                            
                        </div>
                        <div class="col-lg-2"> <input style="margin-top: 32px;" type="submit" class="btn btn-primary" value="Chercher"></div>
                   
                </div>
            </form>   
            <br> 
                <table id="datatable-buttons" class="table table-striped table-bordered dt-responsive nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                    <thead>
                        <tr>
                            <th>Region </th>
                            <th>Departement </th>
                            <th>Arrondissement</th>
                            <th>commune</th>
                            <th>Etant</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($communes as $renseigne)
                        <tr>
                            <td>{{ $renseigne->region }}</td>
                            <td>{{ $renseigne->departement }}</td>
                            <td>{{ $renseigne->arrondissement }}</td>
                            <td>{{ $renseigne->nom }}</td>

                            <td>
                                @if ($renseigne->renseigne)
                                
                                  <span class=" alert-success">Renseigner</span>
                                @else
                                <span class=" alert-danger">Non rempli</span>
                                @endif

                            

                            </td>

                        </tr>
                        @endforeach

                    </tbody>
                </table>



            </div>

        </div>
    </div>
</div>


@endsection
@section('js')
    <script>
        url_app = '{{ config('app.url') }}';

        $("#region_id").change(function () {
            // alert("ibra");
            var region_id =  $("#region_id").children("option:selected").val();
            $("#commune_id").empty();
            $("#departement_id").empty();
            $("#arrondissement_id").empty();

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

                    $("#departement_id").append(departement);
                }
            });
        });
        $("#departement_id").change(function () {
            $("#commune_id").empty();
            $("#arrondissement_id").empty();
            var departement_id =  $("#departement_id").children("option:selected").val();
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