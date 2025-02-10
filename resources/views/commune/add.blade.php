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
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Commune </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Commune</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <form action="{{ route('commune.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
             <div class="card ">
                        <div class="card-header text-center">FORMULAIRE D'ENREGISTREMENT D'UNE Commune</div>
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
                                        <label>Nom Commune</label>
                                        <input type="text" name="nom"  value="{{ old('nom') }}" class="form-control"  required>
                                    </div>
                                </div>
                                    <div class="col-lg-6">
                                        <label>Nom Département</label>
                                        <select class="form-control" id="departement_id" name="departement_id" required="">
                                            <option value="">Selectionner</option>
                                            @foreach ($departements as $departement)
                                            <option value="{{$departement->id}}">{{$departement->nom}}</option>
                                                @endforeach

                                        </select>
                                    </div>
                                    <div class="col-lg-6">
                                        <label>Arrondissement</label>
                                        <select class="form-control" name="arrondissement_id" id="arrondissement_id" required="">
        
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

@section('js')
    <script>
        url_app = '{{ config('app.url') }}';
        url_api = '{{ config('app.api') }}';
       
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
