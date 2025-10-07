<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
        <title>DGE</title>
        <meta content="Admin Dashboard" name="description" />
        <meta content="Mannatthemes" name="author" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />

        <link rel="shortcut icon" href="assets/images/favicon.ico">

        <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css">
        <link href="{{ asset('assets/css/icons.css') }}" rel="stylesheet" type="text/css">
        <link href="{{ asset('assets/css/style.css') }}" rel="stylesheet" type="text/css">

    </head>

    <body>


    <!-- Begin page -->
    <div class="content" style="padding: 1%">
        <div class="row" style="background-image: url({{ asset('images/image_background.png') }}); padding:1%; ">
            <div class="col-md-2">
                <img src="{{ asset('images/image_drapeau.png') }}" class="img">
            </div>
            <div class="col-md-1">
                <img src="{{ asset('images/armoirie_senegal.png') }}" class="img" width="60" height="60">
            </div>

        </div>
        <div class="row">

            <div class="col-12">
                <div class="card ">
                    <div class="card-header text-center"><h5>Vérification du Statut de votre Demande – Révision Ordinaire 2025</h5></div>
                        <div class="card-body">
                             <form action="{{ route('getByParametre') }}" method="POST" enctype="multipart/form-data">
                                @csrf

                                @if ($message = Session::get('error'))
                                    <div class="alert alert-danger">
                                        <p>{{ $message }}</p>
                                    </div>
                                @endif
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
                                    <div class="col-lg-4">
                                        <label>NIN</label>
                                        <input type="text" class="form-control" id="nom" name="nin"  required>
                                    </div>

                                    <div class="col-lg-4">
                                        <label>Prenom</label>
                                        <input type="text" class="form-control"  id="prenom" name="prenom" >
                                    </div>
                                    <div class="col-lg-4">
                                        <label>Nom</label>
                                        <input type="text" class="form-control" id="nom" name="nom"  >


                                    </div>




                                    </div>
                                    <div class="row text-center" style="margin-top: 5px;">
                                        <div class="col-lg-12">
                                            <input type="submit" value="Chercher" class="btn btn-success">
                                        </div>

                                    </div>
                                    <div class="row" >
                                        <div class="col-md-12">
                                            @if(!empty($erreur))
                                                <div class="alert alert-danger">
                                                <center> {!! $erreur !!}</center>
                                                </div>
                                            @endif
                                            @if(!empty($revision))
                                                @if ($revision->type=="inscription")
                                                    <p>Votre demande  d'inscription a été accepté</p>
                                                @elseif ($revision->type=="modification")
                                                    <p>Votre demande de modification a été accepté</p>
                                                @elseif ($revision->type=="changement")
                                                    <p>Votre demande de changement de statut a été accepté</p>
                                                 @elseif ($revision->type=="radiation")
                                                    <p>Votre demande de radiation a été accepté</p>
                                                  @elseif ($revision->type=="rejet")
                                                    <p>Votre demande a rejeté pour motif :  {{ $revision->motif }}</p>
                                                @endif
                                                <div class="col-md-6">
                                                <h6> [ Etat Civil ]</h6>
                                                    Prenom : <strong>{{ $revision->prenom  }}</strong><br>
                                                    Nom : <strong>{{ $revision->nom  }}</strong><br>
                                                   {{--  Date de Naissance : <strong>{{ $revision->datenaiss }}</strong><br>
                                                    Lieu de Naissance : <strong>{{ $revision->lieunaiss }}</strong><br> --}}
                                                </div>
                                                <div class="col-md-6">
                                                    <h6> [ Liste Electorale ]</h6>
                                                    Commune  : <strong>{{ $revision->commune  }}</strong><br>
                                                </div>

                                            @endif
                                        </div>
                                    </div>


                                </form>

                            </div>
                        </div>
                    </div>


                </div>
            </div>



        <!-- jQuery  -->
        <script src="{{ asset('js/jquery.min.js') }}"></script>



        <script>
            url_app = '{{ config('app.url') }}';
            $("#region_id").change(function () {
               // alert("ibra");
               $("#rts").empty();
               $("#centrevote_id").empty();
               $("#lieuvote_id").empty();
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

                        $.each(data.departements,function(index,row){
                            //alert(row.nomd);
                            departement +="<option value="+row.id+">"+row.nom+"</option>";

                        });
                        $("#rts").append("<div class='col-md-4'><h5>Nombre de lieu de vote : "+data.nbCentre+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre de bureau de vote : "+data.nbbureau+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre d'revisions : "+data.revision+"</h5></div>");
                        $("#departement_id").empty();
                        $("#commune_id").empty();
                        $("#departement_id").append(departement);
                    }
                });
            });
            $("#departement_id").change(function () {
                $("#rts").empty();
                $("#centrevote_id").empty();
                $("#lieuvote_id").empty();
                var departement_id =  $("#departement_id").children("option:selected").val();
                $(".departement").val(departement_id);
                $(".commune").val("");
                    var commune = "<option value=''>Veuillez selectionner</option>";
                    $.ajax({
                        type:'GET',
                        url:url_app+'/commune/by/departement/'+departement_id,

                        data:'_token = <?php echo csrf_token() ?>',
                        success:function(data) {
                            console.log(data)
                            $.each(data.communes,function(index,row){
                                //alert(row.nomd);
                                commune +="<option value="+row.id+">"+row.nom+"</option>";

                            });
                            $("#rts").append("<div class='col-md-4'><h5>Nombre de lieu de vote : "+data.nbCentre+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre de bureau de vote : "+data.nbbureau+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre d'revisions : "+data.revision+"</h5></div>");
                            $("#commune_id").empty();


                            $("#commune_id").append(commune);
                        }
                    });
                });


                $("#commune_id").change(function () {
            var commune_id =  $("#commune_id").children("option:selected").val();
                var centrevote = "<option value=''>Veuillez selectionner</option>";
                var rts="";
                $.ajax({
                    type:'GET',
                    url:url_app+'/centrevote/by/commune/'+commune_id,

                    data:'_token = <?php echo csrf_token() ?>',
                    success:function(data) {
                        console.log(data);
                        $.each(data.centrevotes,function(index,row){
                            //alert(row.nomd);
                            centrevote +="<option value="+row.id+">"+row.nom+"</option>";

                        });
                        $("#centrevote_id").empty();
                        $("#centrevote_id").append(centrevote);

                        $("#rts").empty();
                        $("#rts").append("<div class='col-md-4'><h5>Nombre de lieu de vote : "+data.nbCentre+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre de bureau de vote : "+data.nbbureau+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre d'revisions : "+data.revision+"</h5></div>");
                    }
                });
            });
            $("#centrevote_id").change(function () {
                var centrevote_id =  $("#centrevote_id").children("option:selected").val();
                    var lieuvote = "<option value=''>Veuillez selectionner</option>";
                    $.ajax({
                        type:'GET',
                        url:url_app+'/lieuvote/by/centrevote/'+centrevote_id,

                        data:'_token = <?php echo csrf_token() ?>',
                        success:function(data) {
                            console.log(data);
                            $.each(data.centrevotes,function(index,row){
                              //  alert(row.id);
                                lieuvote +="<option value="+row.id+"> Bureau N°"+row.nom+" Implantation : "+row.implantation+" Revisions: "+row.nb+"</option>";

                            });
                            $("#lieuvote_id").empty();
                            $("#lieuvote_id").append(lieuvote);
                            $("#rts").empty();
                        $("#rts").append("<div class='col-md-4'><h5>Nombre de bureau de vote : "+data.nbbureau+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre d'revisions : "+data.revision+"</h5></div>");
                        }
                    });
                });

                $("#lieuvote_id").change(function () {
                var lieuvote_id =  $("#lieuvote_id").children("option:selected").val();
                    $.ajax({
                        type:'GET',
                        url:url_app+'/revision/by/lieuvote/'+lieuvote_id,

                        vdata:'_token = <?php echo csrf_token() ?>',
                        success:function(data) {
                            console.log(data);
                            $("#rts").empty();
                        $("#rts").append("<div class='col-md-4'><h5>Nombre d'revision: "+data+"</h5></div>");


                        }
                    });
                });

                        //Etrangers

        $("#juridiction_id").change(function () {
                //alert("ibra");
            var juridiction_id =  $("#juridiction_id").children("option:selected").val();
            $(".juridiction").val(juridiction_id);
            $(".pays").val("");
            $(".localite").val("");
                var pays = "<option value=''>Veuillez selectionner</option>";
                $.ajax({
                    type:'GET',
                    url:url_app+'/pays/by/juridiction/'+juridiction_id,

                    data:'_token = <?php echo csrf_token() ?>',
                    success:function(data) {

                        $.each(data.pays,function(index,row){
                            //alert(row.nomd);
                            pays +="<option value="+row.id+">"+row.nom+"</option>";

                        });
                        $("#pays_id").empty();
                        $("#localite_id").empty();
                        $("#centrevotee_id").empty();
                        $("#lieuvotee_id").empty();
                        $("#pays_id").append(pays);
                        $("#rtse").empty();
                        $("#rtse").append("<div class='col-md-4'><h5>Nombre de lieu de vote : "+data.nbCentre+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre de bureau de vote : "+data.nbbureau+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre d'revisions : "+data.revision+"</h5></div>");

                    }
                });
            });
            $("#pays_id").change(function () {
                $("#rtse").empty();
                var pays_id =  $("#pays_id").children("option:selected").val();
                $(".pays").val(pays_id);
                $(".localite").val("");
                    var localite = "<option value=''>Veuillez selectionner</option>";
                    $.ajax({
                        type:'GET',
                        url:url_app+'/localite/by/pays/'+pays_id,

                        data:'_token = <?php echo csrf_token() ?>',
                        success:function(data) {
                            console.log(data)
                            $.each(data.localites,function(index,row){
                                //alert(row.nomd);
                                localite +="<option value="+row.id+">"+row.nom+"</option>";

                            });
                            $("#localite_id").empty();
                            $("#centrevotee_id").empty();
                            $("#lieuvotee_id").empty();
                            $("#localite_id").append(localite);
                            $("#rtse").empty();
                        $("#rtse").append("<div class='col-md-4'><h5>Nombre de lieu de vote : "+data.nbCentre+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre de bureau de vote : "+data.nbbureau+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre d'revisions : "+data.revision+"</h5></div>");

                        }
                    });
                });
                $("#localite_id").change(function () {
            var localite_id =  $("#localite_id").children("option:selected").val();
                var centrevotee = "<option value=''>Veuillez selectionner</option>";
                $.ajax({
                    type:'GET',
                    url:url_app+'/centrevotee/by/localite/'+localite_id,

                    data:'_token = <?php echo csrf_token() ?>',
                    success:function(data) {
                        console.log(data);
                        $.each(data.centrevotes,function(index,row){
                            //alert(row.nomd);
                            centrevotee +="<option value="+row.id+">"+row.nom+"</option>";

                        });
                        $("#centrevotee_id").empty();
                        $("#lieuvotee_id").empty();
                        $("#centrevotee_id").append(centrevotee);
                        $("#rtse").empty();
                        $("#rtse").append("<div class='col-md-4'><h5>Nombre de lieu de vote : "+data.nbCentre+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre de bureau de vote : "+data.nbbureau+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre d'revisions : "+data.revision+"</h5></div>");

                    }
                });
            });

            $("#centrevotee_id").change(function () {
                var centrevotee_id =  $("#centrevotee_id").children("option:selected").val();
                    var lieuvotee = "<option value=''>Veuillez selectionner</option>";
                    $.ajax({
                        type:'GET',
                        url:url_app+'/lieuvotee/by/centrevotee/'+centrevotee_id,

                        vdata:'_token = <?php echo csrf_token() ?>',
                        success:function(data) {
                            console.log(data)
                            $.each(data.lieuvotes,function(index,row){
                              //  alert(row.id);
                                lieuvotee +="<option value="+row.id+">"+row.nom+"</option>";

                            });
                            $("#lieuvotee_id").empty();

                            $("#lieuvotee_id").append(lieuvotee);

                        $("#rtse").empty();
                        $("#rtse").append("<div class='col-md-4'><h5>Nombre de bureau de vote : "+data.nbbureau+"</h5></div>"+
                        "<div class='col-md-4'><h5>Nombre d'revisions : "+data.revision+"</h5></div>");
                        }
                    });
                });
                $("#lieuvotee_id").change(function () {
                var lieuvotee_id =  $("#lieuvotee_id").children("option:selected").val();
                    $.ajax({
                        type:'GET',
                        url:'/revision/by/lieuvotee/'+lieuvotee_id,

                        vdata:'_token = <?php echo csrf_token() ?>',
                        success:function(data) {
                            console.log(data)
                            $("#rtse").empty();
                        $("#rtse").append("<div class='col-md-4'><h5>Nombre d'revisions : "+data+"</h5></div>");


                        }
                    });
                });

                      </script>
    </body>
</html>
