{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Enregister Commune')

@section('content')
 <!-- Breadcrumb -->
 <nav class="hk-breadcrumb" aria-label="breadcrumb">
    <ol class="breadcrumb breadcrumb-light bg-transparent">
        <li class="breadcrumb-item"><a href="#">Commune</a></li>
        <li class="breadcrumb-item active" aria-current="page">ENREGISTREMENT D'UN COMMUNE</li>
    </ol>
</nav>
<!-- /Breadcrumb -->

<!-- Container -->
<div class="container">


    <form action="{{ route('radiation.store') }}" method="POST">
        @csrf
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
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        Identification
                    </div>
                    <div class="card-body">

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Numero Carte d'identite (CNI)</label>
                                    <input type="text" name="cni" id="cni" value="{{ old('cni') }}" class="form-control"  required>
                                    <span class="input-group-append">
                                        <button type="button" id="btnnumelec" class="btn  btn-primary"><i class="fa fa-search"></i> Rechercher</button>
                                        </span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Prenom</label>
                                    <input type="text" name="prenom" id="prenom"  value="{{ old('prenom') }}" class="form-control"  required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>nom</label>
                                    <input type="text" name="nom" id="nom" value="{{ old('nom') }}" class="form-control"  required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Date de Naissance</label>
                                    <input type="date" name="datenaiss" id="datenaiss"  value="{{ old('datenaiss') }}" class="form-control"  required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Lieu de Naissance</label>
                                    <input type="text" name="lieunaiss" id="lieunaiss"  value="{{ old('lieunaiss') }}" class="form-control"  required>
                                </div>
                            </div>
                          
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Tel</label>
                                    <input type="text" name="tel"  value="{{ old('tel') }}" class="form-control"  required>
                                </div>
                            </div>
                           
                           
                           {{--  <div class="col-md-6">
                                <div class="form-group">
                                    <label>Domicile</label>
                                    <input type="text" name="domicile"  value="{{ old('domicile') }}" class="form-control"  required>
                                </div>
                            </div> --}}
                            <div class="col-md-12">
                                <div class="row">
                                    <label>Le demandeur est-il un électeur ayant un handicap réduisant sa mobilité ?   </label>
                                    <div class="col-md-4 mt-15">
                                        <div class="custom-control custom-radio">
                                            <input type="radio" id="customRadio1" value="1" name="handicap" class="custom-control-input" required>
                                            <label class="custom-control-label" for="customRadio1">Oui</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mt-15">
                                        <div class="custom-control custom-radio">
                                            <input type="radio" id="customRadio2" value="0" name="handicap" checked class="custom-control-input" required>
                                            <label class="custom-control-label" for="customRadio2">Non</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <label>Demande Radiation </label>
                                <select class="form-control" name="statut" id="statut" required="">
                                    <option value="">Selectionnez</option>
                                   <option value="Electeur civil passant dans un corps militaire ou paramilitaire">Electeur civil passant dans un corps militaire ou paramilitaire</option>
                                    <option value="Electeur militaire ou paramilitaire redevenu civil">Electeur militaire ou paramilitaire redevenu civil</option>
                                </select>
                            </div>
                           
                         
                        </div>


                    </div>

                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        Carte ELectorale
                    </div>
                    <div class="card-body">
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
                          {{--   <div class="col-lg-6">
                                <label>Centre de vote</label>
                                <select class="form-control" name="centrevote_id" id="centrevote_id" >

                                </select>
                            </div> --}}
                            <div>
                                <br>
                                    <button type="submit" class="btn btn-success btn btn-lg "> ENREGISTRER</button>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    </form>
</div>
@endsection
@section('js')
    <script>
        url_app = '{{ config('app.url') }}';
        url_api = '{{ config('app.api') }}';
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
       
      

     /*    $("#commune_id").change(function () {

            var commune_id =  $("#commune_id").children("option:selected").val();
            var departement_id =  $("#departement_id").children("option:selected").val();

            var centrevote = "<option value=''>Veuillez selectionner</option>";
            $.ajax({
                type:'GET',
                url:url_app+'/centrevote/by/commune/'+commune_id,
                data:'_token = <?php echo csrf_token() ?>',
                success:function(data) {
                    console.log(data)
                    $.each(data,function(index,row){
                        //alert(row.nomd);
                        centrevote +="<option value="+row.id+">"+row.nom+"</option>";

                    });

                    $("#centrevote_id").empty();


                    $("#centrevote_id").append(centrevote);
                }
            });
        });
 */
        $("#btnnumelec").click(function () {
            cni =  $("#cni").val();
           // alert(cni);
           $("#electeur_id").val('');
            contenu = '';
            $.ajax({
                type:'GET',
                url:url_api+'/cartes/get/by/nin?nin='+cni,
                data:'_token = <?php echo csrf_token() ?>',
                success:function(data) {
                    console.log(data)
                    if(data[0])
                     {
                       /* contenu = "Region : <strong>"+data.region+"</strong><br>"+
                            "Commune ou Departement : <strong> "+data.departement+"</strong><br>"+
                            "Commune : <strong>"+data.commune +"</strong><br>"+
                           "Siege : <strong>"+data.siege+"</strong><br>"+
                            "Centre de vote : <strong>"+data.centrevote +"</strong><br>";
                            $("#electeur_id").val(data.id);*/
                            $("#nom").val(data[0].ELEC_NOM);
                            $("#prenom").val(data[0].ELEC_PRENOM);
                            $("#datenaiss").val(convertDateFormat(data[0].ELEC_DATE_NAISSANCE));
                            $("#lieunaiss").val(data[0].ELEC_LIEU_NAISSANCE);
                     }
                     else
                     {
                        contenu = "<div class='alert alert-danger'> Donnees non trouvé</div>"
                     }


                    console.log(contenu);
            $("#ancienne").html(contenu);
                }
            });

        });
       
// Exemple d'utilisation

    </script>
@endsection

