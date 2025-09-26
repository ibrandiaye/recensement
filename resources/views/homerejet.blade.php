{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Enregister Utilisateur')

@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">

            <h4 class="page-title">Tableau de bords</h4>
        </div>
    </div>
</div>

<div class="row">
      <div class="col-xl-12 col-md-12">
        <div class="card widget-box-one border border-danger bg-soft-danger">
            <div class="card-body">
                <div class="float-right avatar-lg rounded-circle mt-3">
                    <i class="mdi mdi-account-switch font-30 widget-icon rounded-circle avatar-title text-danger"></i>
                </div>
                <div class="wigdet-one-content">
                    <p class="m-0 text-uppercase font-weight-bold text-muted" title="Statistics">Nombre de Rejet</p>
                    <h2><span data-plugin="counterup" id="personne">{{  $nbPersonne}}</span> <i class="mdi mdi-account-switch text-danger font-30"></i></h2>
                </div>
            </div>
        </div>
    </div>




    <!-- end col -->


</div>
<div class="row">
    <div class="col-12">

    @php
        $user = Auth::user();
    @endphp
    <div class="card">
        <div class="card-header">
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-lg-3">
                    <label>Region</label>
                    <select class="form-control" name="region_id" id="region_id" required="">
                        <option value="">Selectionnez</option>
                        @foreach ($regions as $region)
                        <option value="{{$region->id}}">{{$region->nom}}</option>
                            @endforeach

                    </select>
                </div>

                <div class="col-lg-3">
                    <label>Departement</label>
                    <select class="form-control" name="departement_id" id="departement_id" required="">
                        <option value="">Selectionner</option>
                        @foreach ($departements as $departement)
                            <option value="{{$departement->id}}">{{$departement->nom}}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-lg-3">
                    <label>Arrondissement</label>
                    <select class="form-control" name="arrondissement_id" id="arrondissement_id" required="">
                        @foreach ($arrondissements as $arrondissement)
                            <option value="{{$arrondissement->id}}">{{$arrondissement->nom}}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-lg-3">
                    <label>Commune</label>
                    <select class="form-control" name="commune_id" id="commune_id" >
                        @foreach ($communes as $commune)
                            <option value="{{$commune->id}}">{{$commune->nom}}</option>
                        @endforeach
                    </select>


                </div>
            </div>
            </div>
        </div>
    </div>
</div>


    <div class="row">
        <div class="col-12">
            <div class="card ">
                <div class="card-header  text-center">Situation National</div>
                <div class="card-body">

                    <table id="datatable-buttons" class="table table-striped table-bordered  nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                        <thead>
                            <tr>
                                @if ($user->role=="admin")<td>Region</td>@endif
                                @if ( $user->role=="admin" || $user->role=="gouverneur")<th>Departement</th>@endif
                                @if ($user->role=="admin" || $user->role=="gouverneur" || $user->role=="prefet")<th>Arrondissement</th>@endif
                                <th>Commune</th>
                                <th>Prenom</th>
                                <th>Nom</th>
                                <th>Date de Naissance</th>
                                <th>CNI</th>
                                <th>Commentaire</th>

                            </tr>
                        </thead>
                        <tbody>
                        @foreach ($tabStats as $key=> $tabStat)
                            <tr>
                                @if ($user->role=="admin")<td>{{ $tabStat->region }}</td>@endif
                                @if ( $user->role=="admin" || $user->role=="gouverneur")<td>{{ $tabStat->departement }}</td>@endif
                                @if ( $user->role=="admin" || $user->role=="gouverneur" || $user->role=="prefet")<td>{{ $tabStat->arrondissement }}</td>@endif
                                <td>{{ $tabStat->commune }}</td>
                                <td>{{ $tabStat->prenom }}</td>
                                <td>{{ $tabStat->nom }}</td>
                                <td>{{ $tabStat->datenaiss }}</td>
                                <td>{{ $tabStat->cni }}</td>
                                <td>{{ $tabStat->commentaire }}</td>

                            </tr>
                            @endforeach

                        </tbody>
                    </table>



                </div>
            </div>
        </div>
    <div>
     @if ($user->role=="admin")
        <div class="row">
            <div class="col-md-8">
                <canvas id="myChartbar"></canvas>
            </div>
            <div class="col-md-2">
                <canvas id="myChart"></canvas>
            </div>

        </div>

    @endif
@endsection
@section("js")
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
      const ctx = document.getElementById('myChart');
      const ctxbar = document.getElementById('myChartbar');
      url_app = '{{ config('app.url') }}';
    url_api = '{{ config('app.api') }}';
    localite = 0;
    operateur = 0;
    personne = 0;
    montant = 0;
    sinistre = 0;
    nonsinistre = 0;
    don = 0;
    dece = 0;
    let chart;
    let myChartbar;
    $(document).ready(function() {
        char(localite, operateur, personne, radiation);
    });
    $("#region_id").change(function () {
    // alert("ibra");
    var region_id =  $("#region_id").children("option:selected").val();
        var departement = "<option value=''>Veuillez selectionner</option>";
        $("#commune_id").empty();
        $("#arrondissement_id").empty();
        $("#departement_id").empty();

        $("#localite").empty();
        $("#operateur").empty();
        $("#personne").empty();
        $("#montant").empty();
        $("#sinistre").empty();
        $("#nonsinistre").empty();
        $("#don").empty();
        $("#dece").empty();
        montant
        localite = 0;
        operateur = 0;
        personne =  0;
        radiation = 0;
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

        $.ajax({
            type:'GET',
            url:url_app+'/api/by/region/'+region_id,
            data:'_token = <?php echo csrf_token() ?>',
            success:function(data) {

               console.log(data);
                $("#localite").append(data.localite);
                $("#operateur").append(data.operateur);
                $("#personne").append(data.personne);
                $("#montant").append(data.sommeCout);
                 $("#sinistre").append(data.localite - data.nonSinistre);
                $("#nonsinistre").append(data.nonSinistre);
                $("#don").append(data.don);
                $("#dece").append(data.dece);

                localite = data.localite;
                operateur = data.operateur;
                personne =  data.personne;

                radiation = data.radiation;
                chart.destroy();
                myChartbar.destroy();
                char(localite, operateur, personne, radiation);
                console.log(localite);

            }
        });
    });
    $("#departement_id").change(function () {
        $("#commune_id").empty();
        $("#arrondissement_id").empty();
        var departement_id =  $("#departement_id").children("option:selected").val();
        var commune = "<option value=''>Veuillez selectionner</option>";
        var arrondissement = "<option value=''>Veuillez selectionner</option>";
        $("#localite").empty();
        $("#operateur").empty();
        $("#personne").empty();
        $("#montant").empty();
        $("#sinistre").empty();
        $("#nonsinistre").empty();
        $("#don").empty();
        $("#dece").empty();

        localite = 0;
        operateur = 0;
        personne =  0;
        radiation = 0;
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
        $.ajax({
            type:'GET',
            url:url_app+'/api/by/departement/'+departement_id,
            data:'_token = <?php echo csrf_token() ?>',
            success:function(data) {

               console.log(data);
                $("#localite").append(data.localite);
                $("#operateur").append(data.operateur);
                $("#personne").append(data.personne);
                 $("#montant").append(data.sommeCout);
                 $("#sinistre").append(data.localite - data.nonSinistre);
                $("#nonsinistre").append(data.nonSinistre);
                 $("#don").append(data.don);
                $("#dece").append(data.dece);


                localite = data.localite;
                operateur = data.operateur;
                personne =  data.personne;

                radiation = data.radiation;
                chart.destroy();
                myChartbar.destroy();
                char(localite, operateur, personne, radiation);
            }
        });
    });

    $("#arrondissement_id").change(function () {

        $("#commune_id").empty();
        $("#localite").empty();
        $("#operateur").empty();
        $("#personne").empty();
        $("#montant").empty();
         $("#sinistre").empty();
        $("#nonsinistre").empty();
        $("#don").empty();
        $("#dece").empty();

        localite = 0;
        operateur = 0;
        personne =  0;
        radiation = 0;
        var arrondissement_id =  $("#arrondissement_id").children("option:selected").val();

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
        $.ajax({
            type:'GET',
            url:url_app+'/api/by/arrondissement/'+arrondissement_id,
            data:'_token = <?php echo csrf_token() ?>',
            success:function(data) {

               console.log(data);
                $("#localite").append(data.localite);
                $("#operateur").append(data.operateur);
                $("#personne").append(data.personne);
                $("#montant").append(data.sommeCout);
                $("#sinistre").append(data.localite - data.nonSinistre);
                $("#nonsinistre").append(data.nonSinistre);
                 $("#don").append(data.don);
                $("#dece").append(data.dece);

                localite = data.localite;
                operateur = data.operateur;
                personne =  data.personne;

                radiation = data.radiation;
                chart.destroy();
                myChartbar.destroy();
                char(localite, operateur, personne, radiation);


            }
        });
    });




    $("#commune_id").change(function () {

        var commune_id =  $("#commune_id").children("option:selected").val();
        var departement_id =  $("#departement_id").children("option:selected").val();
        $("#localite").empty();
        $("#operateur").empty();
        $("#personne").empty();
        $("#montant").empty();
         $("#sinistre").empty();
        $("#nonsinistre").empty();
        $("#don").empty();
        $("#dece").empty();

        localite = 0;
        operateur = 0;
        personne =  0;
        radiation = 0;
        $.ajax({
            type:'GET',
            url:url_app+'/api/by/commune/'+commune_id,
            data:'_token = <?php echo csrf_token() ?>',
            success:function(data) {

               console.log(data);
                $("#localite").append(data.localite);
                $("#operateur").append(data.operateur);
                $("#personne").append(data.personne);
                $("#montant").append(data.sommeCout);
                $("#sinistre").append(data.localite - data.nonSinistre);
                $("#nonsinistre").append(data.nonSinistre);
                 $("#don").append(data.don);
                $("#dece").append(data.dece);

                localite = data.localite;
                operateur = data.operateur;
                personne =  data.personne;

                radiation = data.radiation;
                chart.destroy();
                myChartbar.destroy();
                char(localite, operateur, personne, radiation);


            }
        });
    });
  /*  function char(localite, operateur, personne, radiation)
    {


        myChartbar = new Chart(ctxbar, {
            type: 'bar',
            data: {
            labels: ['Localite', 'Operateur', 'Personne', 'Radiation'],
            datasets: [{
                label: 'nb personnes ',
                data: [localite, operateur, personne, radiation],
                borderWidth: 1,
                backgroundColor: [
                'rgb(161, 255, 165)',
                'rgb(255, 252, 161)',
                'rgb(103, 167, 253)',
                'rgb(253, 103, 103)',

                ],
            }]
            },
            options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
            }
        });
    }

  */
</script>
@endsection


