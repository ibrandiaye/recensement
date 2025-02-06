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
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Pointage </a></li>
                </ol>
            </div>
            <div class="page-title">@if ($oneLot->nombre==$nbPointage && $oneLot->validation==0 )
                <a href="{{ route('update.validation', ['id'=>1,"etat"=>1]) }}" class="btn btn-success" onclick="if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }">Valider</a>
            @endif
            @if ($oneLot->nombre==$nbPointage && $oneLot->validation==1)
                <span class="badge badge-success">déjà Validé</span>
            @endif   
        </div>
        </div>
    </div>
</div>
@if ($message = Session::get('success'))
<div class="alert alert-success">
    <p>{{ $message }}</p>
</div>
@endif

<div class="row">
   
    <div class="col-xl-4 col-md-6">
        <div class="card widget-box-one border border-warning bg-soft-warning">
            <div class="card-body">
                <div class="float-right avatar-lg rounded-circle mt-3">
                    <i class="mdi mdi-account-edit font-30 widget-icon rounded-circle avatar-title text-warning"></i>
                </div>
                <div class="wigdet-one-content">
                    <p class="m-0 text-uppercase font-weight-bold text-muted" title="User This Month">Total</p>
                    <h2><span data-plugin="counterup" id="modification">{{$oneLot->nombre}} </span> <i class="mdi mdi-arrow-collapse text-success font-24"></i></h2>
                </div>
            </div>
        </div>
    </div>
    <!-- end col -->
    <div class="col-xl-4 col-md-6">
        <div class="card widget-box-one border border-success bg-soft-success">
            <div class="card-body">
                <div class="float-right avatar-lg rounded-circle mt-3">
                    <i class="mdi mdi-account-multiple-plus font-30 widget-icon rounded-circle avatar-title text-success"></i>
                </div>
                <div class="wigdet-one-content">
                    <p class="m-0 text-uppercase font-weight-bold text-muted" title="User Today">Pointe</p>
                    <h2><span data-plugin="counterup" id="inscription">{{$nbPointage}}</span> <i class="mdi mdi-arrow-up text-success font-24"></i></h2>
                </div>
            </div>
        </div>
    </div>
    <!-- end col -->
    <div class="col-xl-4 col-md-6">
        <div class="card widget-box-one border border-primary bg-soft-danger">
            <div class="card-body">
                <div class="float-right avatar-lg rounded-circle mt-3">
                    <i class="mdi mdi-account-switch font-30 widget-icon rounded-circle avatar-title text-primary"></i>
                </div>
                <div class="wigdet-one-content">
                    <p class="m-0 text-uppercase font-weight-bold text-muted" title="Statistics">Reste a Pointe</p>
                    <h2><span data-plugin="counterup" id="changement">{{$oneLot->nombre - $nbPointage}}</span> <i class="mdi mdi-account-switch text-success font-24"></i></h2>
                </div>
            </div>
        </div>
    </div>
    <!-- end col -->
</div>
<div class="row">
    <div class="col-12">
        <form action="{{ route('pointage.store') }}" method="POST">
            @csrf
             <div class="card">
                <div class="card-header  text-center">FORMULAIRE D'ENREGISTREMENT D'UN Département</div>
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
                    {{-- <input type="text" id="barcode" name="barcode" > --}}
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label>Numero</label>
                                <input type="text" id="barcode"  name="barcode"  value="{{ old('barcode') }}" class="form-control" min="1" required autofocus>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label>Lot</label>
                                <input type="text"   name="lot_id"  value="{{ $lot }}" class="form-control"  required readonly>
                            </div>    
                        </div>
                    </div>
                   

                    <div>
                        @if($nbPointage <= $oneLot->nombre)
                        <center>
                            <button type="submit" class="btn btn-success btn btn-lg "> ENREGISTRER</button>
                        </center>
                        @endif
                    </div>
                </div>

            </div>

        </form>
    </div>
</div>


@endsection


@section("js")
<script>
    const barcodeInput = document.getElementById('barcode');
    let barcode = "";
    let timeout;

    // Fonction de correction des caractères
    function correctCharacters(input) {
        return input.replace(/&/g, '1')
                    .replace(/é/g, '2')
                    .replace(/"/g, '3')
                    .replace(/'/g, '4')
                    .replace(/\(/g, '5')
                    .replace(/-/g, '6')
                    .replace(/è/g, '7')
                    .replace(/_/g, '8')
                    .replace(/ç/g, '9')
                    .replace(/à/g, '0');
    }
    

    document.addEventListener('keypress', function (e) {
        barcode += e.key;

        clearTimeout(timeout);

        timeout = setTimeout(function () {
            let correctedBarcode = correctCharacters(barcodeInput.value);
            console.log('Code-barres corrigé:', correctedBarcode);

            if (barcodeInput) {
                barcodeInput.value = correctedBarcode;
            }

            barcode = "";
        }, 300);
    });
</script>

@endsection