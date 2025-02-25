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
    <div class="col-xl-3 col-md-6">
        <div class="card widget-box-one border border-success bg-soft-success">
            <div class="card-body">
                <div class="float-right avatar-lg rounded-circle mt-3">
                    <i class="mdi mdi-account-multiple-plus font-30 widget-icon rounded-circle avatar-title text-success"></i>
                </div>
                <div class="wigdet-one-content">
                    <p class="m-0 text-uppercase font-weight-bold text-muted" title="User Today">Inscription</p>
                    <h2><span data-plugin="counterup" id="inscription">{{$inscription}}</span> <i class="mdi mdi-arrow-up text-success font-24"></i></h2>
                </div>
            </div>
        </div>
    </div>
    <!-- end col -->
    <div class="col-xl-3 col-md-6">
        <div class="card widget-box-one border border-warning bg-soft-warning">
            <div class="card-body">
                <div class="float-right avatar-lg rounded-circle mt-3">
                    <i class="mdi mdi-account-edit font-30 widget-icon rounded-circle avatar-title text-warning"></i>
                </div>
                <div class="wigdet-one-content">
                    <p class="m-0 text-uppercase font-weight-bold text-muted" title="User This Month">Modification</p>
                    <h2><span data-plugin="counterup" id="modification">{{$modification}} </span> <i class="mdi mdi-arrow-collapse text-success font-24"></i></h2>
                </div>
            </div>
        </div>
    </div>
    <!-- end col -->
    <div class="col-xl-3 col-md-6">
        <div class="card widget-box-one border border-primary bg-soft-primary">
            <div class="card-body">
                <div class="float-right avatar-lg rounded-circle mt-3">
                    <i class="mdi mdi-account-switch font-30 widget-icon rounded-circle avatar-title text-primary"></i>
                </div>
                <div class="wigdet-one-content">
                    <p class="m-0 text-uppercase font-weight-bold text-muted" title="Statistics">Changement</p>
                    <h2><span data-plugin="counterup" id="changement">{{$changement}}</span> <i class="mdi mdi-account-switch text-success font-24"></i></h2>
                </div>
            </div>
        </div>
    </div>
    <!-- end col -->

    

    <div class="col-xl-3 col-md-6">
        <div class="card widget-box-one border border-danger bg-soft-danger">
            <div class="card-body">
                <div class="float-right avatar-lg rounded-circle mt-3">
                    <i class="mdi mdi-account-minus font-30 widget-icon rounded-circle avatar-title text-danger"></i>
                </div>
                <div class="wigdet-one-content">
                    <p class="m-0 text-uppercase font-weight-bold text-muted" title="Statistics">Radiation</p>
                    <h2><span data-plugin="counterup" id="radiation">{{$radiation}} </span> <i class="mdi mdi-arrow-down text-danger font-24"></i></h2>
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
            Carte ELectorale
        </div>
        <div class="card-body">
            <div class="row">
                @if ($user->role=="admin" || $user->role=='superviseur' || $user->role=="correcteur")
                <div class="col-lg-3">
                    <label>Region</label>
                    <select class="form-control" name="region_id" id="region_id" required="">
                        <option value="">Selectionnez</option>
                        @foreach ($regions as $region)
                        <option value="{{$region->id}}">{{$region->nom}}</option>
                            @endforeach

                    </select>
                </div>
                
                @endif
                @if ($user->role=="admin"  || $user->role=="gouverneur" || $user->role=='superviseur' || $user->role=="correcteur")
                <div class="col-lg-3">
                    <label>Departement</label>
                    <select class="form-control" name="departement_id" id="departement_id" required="">
                        <option value="">Selectionner</option>
                        @foreach ($departements as $departement)
                            <option value="{{$departement->id}}">{{$departement->nom}}</option>
                        @endforeach
                    </select>
                </div>
                @endif
                @if ($user->role=="admin" || $user->role=="prefet" || $user->role=="gouverneur" || $user->role=='superviseur' || $user->role=="correcteur")
                <div class="col-lg-3">
                    <label>Arrondissement</label>
                    <select class="form-control" name="arrondissement_id" id="arrondissement_id" required="">
                        @foreach ($arrondissements as $arrondissement)
                            <option value="{{$arrondissement->id}}">{{$arrondissement->nom}}</option>
                        @endforeach
                    </select>
                </div>
                @endif
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
<div>
    <div class="row">
        <div class="col-md-8">
            <canvas id="myChartbar"></canvas>
        </div>
        <div class="col-md-2">
            <canvas id="myChart"></canvas>
        </div>
       
    </div>
  </div>
   @if ($user->role=="admin")
    <div class="row">
        <div class="col-12">
            <div class="card ">
                <div class="card-header  text-center">LISTE D'ENREGISTREMENT DES Comptages</div>
                    <div class="card-body">
                    
                        <table id="datatable-" class="table table-striped table-bordered dt-responsive nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                            <thead>
                                <tr>
                                    <th>Departement</th>
                                    <th>Inscription</th>
                                    <th>Modification</th>
                                    <th>Changement</th>
                                    <th>Radiation</th>
                                </tr>
                            </thead>
                            <tbody>
                            @foreach ($situationPasDepartements as $comptage)
                                <tr>
                                    <td>{{ $comptage->nom }}</td>
                                    <td>{{ $comptage->inscription }}</td>
                                    <td>{{ $comptage->modification }}</td>
                                    <td>{{ $comptage->changement }}</td>
                                    <td>{{ $comptage->radiation }}</td>
                                   
        
                                </tr>
                                @endforeach
        
                            </tbody>
                        </table>
        
        
        
                    </div>
                </div>
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
    inscription = {{$inscription}};
    modification = {{$modification}};
    changement = {{$changement}};
    radiation = {{$radiation}};
    let chart;
    let myChartbar;
    $(document).ready(function() {
        char(inscription, modification, changement, radiation);
    });
    $("#region_id").change(function () {
    // alert("ibra");
    var region_id =  $("#region_id").children("option:selected").val();
        var departement = "<option value=''>Veuillez selectionner</option>";
        $("#commune_id").empty();
        $("#arrondissement_id").empty();
        $("#departement_id").empty();

        $("#inscription").empty();
        $("#modification").empty();
        $("#changement").empty();
        $("#radiation").empty();
        inscription = 0;
        modification = 0;
        changement =  0;
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
                $("#inscription").append(data.inscription);
                $("#modification").append(data.modification);
                $("#changement").append(data.changement);
                $("#radiation").append(data.radiation);

                inscription = data.inscription;
                modification = data.modification;
                changement =  data.changement;

                radiation = data.radiation;
                chart.destroy();
                myChartbar.destroy();
                char(inscription, modification, changement, radiation);
                console.log(inscription);

            }
        });
    });
    $("#departement_id").change(function () {
        $("#commune_id").empty();
        $("#arrondissement_id").empty();
        var departement_id =  $("#departement_id").children("option:selected").val();
        var commune = "<option value=''>Veuillez selectionner</option>";
        var arrondissement = "<option value=''>Veuillez selectionner</option>";
        $("#inscription").empty();
        $("#modification").empty();
        $("#changement").empty();
        $("#radiation").empty();
        inscription = 0;
        modification = 0;
        changement =  0;
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
                $("#inscription").append(data.inscription);
                $("#modification").append(data.modification);
                $("#changement").append(data.changement);
                $("#radiation").append(data.radiation);

                inscription = data.inscription;
                modification = data.modification;
                changement =  data.changement;

                radiation = data.radiation;
                chart.destroy();
                myChartbar.destroy();
                char(inscription, modification, changement, radiation);
            }
        });
    });

    $("#arrondissement_id").change(function () {
       
        $("#commune_id").empty();
        $("#inscription").empty();
        $("#modification").empty();
        $("#changement").empty();
        $("#radiation").empty();
        inscription = 0;
        modification = 0;
        changement =  0;
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
                $("#inscription").append(data.inscription);
                $("#modification").append(data.modification);
                $("#changement").append(data.changement);
                $("#radiation").append(data.radiation);

                inscription = data.inscription;
                modification = data.modification;
                changement =  data.changement;

                radiation = data.radiation;
                chart.destroy();
                myChartbar.destroy();
                char(inscription, modification, changement, radiation);


            }
        });
    });

   
  

    $("#commune_id").change(function () {

        var commune_id =  $("#commune_id").children("option:selected").val();
        var departement_id =  $("#departement_id").children("option:selected").val();
        $("#inscription").empty();
        $("#modification").empty();
        $("#changement").empty();
        $("#radiation").empty();
        inscription = 0;
        modification = 0;
        changement =  0;
        radiation = 0;
        $.ajax({
            type:'GET',
            url:url_app+'/api/by/commune/'+commune_id,
            data:'_token = <?php echo csrf_token() ?>',
            success:function(data) {

               console.log(data);
                $("#inscription").append(data.inscription);
                $("#modification").append(data.modification);
                $("#changement").append(data.changement);
                $("#radiation").append(data.radiation);

                inscription = data.inscription;
                modification = data.modification;
                changement =  data.changement;

                radiation = data.radiation;
                chart.destroy();
                myChartbar.destroy();
                char(inscription, modification, changement, radiation);


            }
        });
    });
    function char(inscription, modification, changement, radiation)
    {
        
        /*    chart =   new Chart(ctx, {
            type: 'pie',
            data: {
            labels: ['Inscription', 'Modification', 'Changement', 'Radiation'],
            datasets: [{
                label: 'nb personnes ',
                data: [inscription, modification, changement, radiation],
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
        });*/
        myChartbar = new Chart(ctxbar, {
            type: 'bar',
            data: {
            labels: ['Inscription', 'Modification', 'Changement', 'Radiation'],
            datasets: [{
                label: 'nb personnes ',
                data: [inscription, modification, changement, radiation],
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

  
</script>
@endsection


