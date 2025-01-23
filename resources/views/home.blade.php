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
                    <h2><span data-plugin="counterup">{{$inscription}}</span> <i class="mdi mdi-arrow-up text-success font-24"></i></h2>
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
                    <h2><span data-plugin="counterup">{{$modification}} </span> <i class="mdi mdi-arrow-collapse text-success font-24"></i></h2>
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
                    <h2><span data-plugin="counterup">{{$changement}}</span> <i class="mdi mdi-account-switch text-success font-24"></i></h2>
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
                    <h2><span data-plugin="counterup">{{$radiation}} </span> <i class="mdi mdi-arrow-down text-danger font-24"></i></h2>
                </div>
            </div>
        </div>
    </div>
    <!-- end col -->

   
</div>

@endsection


