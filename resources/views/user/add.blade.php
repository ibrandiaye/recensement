{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Enregister Utilisateur')

@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Utilisateur </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Utilisateur</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <form action="{{ route('user.store') }}" method="POST">
            @csrf
            <div class="card">
                <div class="card-header  text-center">FORMULAIRE D'ENREGISTREMENT D'UN Utilisateur</div>
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
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Nom </label>
                            <input type="text" name="name"  value="{{ old('name') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>email </label>
                            <input type="email" name="email"  value="{{ old('email') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Mot de Passe </label>
                            <input id="password" type="password" name="password"  value="{{ old('password') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Confirmer Mot de passe </label>
                            <input id="password-confirm" type="password"  name="password_confirmation" value="{{ old('name') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <label>Region</label>
                        <select class="form-control" name="region_id" id="region_id" >
                            <option value="">Selectionnez</option>
                            @foreach ($regions as $region)
                            <option value="{{$region->id}}">{{$region->nom}}</option>
                                @endforeach

                        </select>
                    </div>
                        <div class="col-lg-6">
                            <label>Departement</label>
                            <select class="form-control" id="departement_id" name="departement_id" >


                            </select>
                        </div>
                        <div class="col-lg-6">
                            <label>Arrondissement</label>
                            <select class="form-control" name="arrondissement_id" id="arrondissement_id">

                            </select>
                        </div>
                        <div class="col-lg-6">
                            <label>Role</label>
                            <select class="form-control" name="role" required="">
                                <option value="">Selectionner</option>
                                <option value="admin">Admin</option>
                                <option value="prefet">Prefet</option>
                                <option value="sous_prefet">Sous Prefet</option>
                                <option value="gouverneur">gouverneur</option>
                                <option value="superviseur">superviseur</option>
                                <option value="correcteur">correcteur</option>
                                <option value="collecteur">collecteur</option>
                                  <option value="rejet">rejet</option>
                            </select>
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


@section("js")
<script>
      url_app = '{{ config('app.url') }}';
      $("#region_id").change(function () {
        // alert("ibra");
        var region_id =  $("#region_id").children("option:selected").val();

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
        $("#arrondissement_id").empty();
        var departement_id =  $("#departement_id").children("option:selected").val();
        $(".departement").val(departement_id);
        var arrondissement = "<option value=''>Veuillez selectionner</option>";
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
</script>

@endsection
