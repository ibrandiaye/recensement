@extends('welcome')
@section('title', '| user')


@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Region </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Region</h4>
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

        <div class="card ">
            <div class="card-header">DEPARTEMENT D'ENREGISTREMENT DES UTILISATEURS</div>
            <div class="card-body">
                
                <table id="example1" class="table table-bordered table-responsive-md table-striped text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom </th>
                            <th>EMAIL</th>
                            <th>DEPARTEMENT</th>
                            <th>ROLE</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($users as $user)
                        <tr>
                            <td>{{ $user->id }}</td>
                            <td>{{ $user->name }}</td>
                            <td>{{ $user->email}}</td>
                            <td>@if(!empty($user->departement)){{ $user->departement->nom}} @endif</td>
                            <td>{{ $user->role}}</td>
                            <td>
                                <a href="{{ route('user.edit', $user->id) }}" role="button" class="btn btn-primary"><i class="fas fa-edit"></i></a>
                                {!! Form::open(['method' => 'DELETE', 'route'=>['user.destroy', $user->id], 'style'=> 'display:inline', 'onclick'=>"if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]) !!}
                                <button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
                                {!! Form::close() !!}

                                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModalform2{{$user->id}}">
                                    modifier Mot de passe
                                </button>
                                    <!-- Modal -->
                                    <div class="modal fade" id="exampleModalform2{{$user->id}}" tabindex="-1" role="dialog">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Modification mot de passe</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <form action="{{ route('user.password.update') }}" method="POST">
                                                @csrf
                                            <div class="modal-body">
                                                
                                                <input type="hidden" name="id" value="{{$user->id}}">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="form-group">
                                                            <label for="field-3" class="control-label">Mot de passe</label>
                                                            <input type="password" class="form-control" id="field-3" placeholder="Mot de passe"  name="password">
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="form-group no-margin">
                                                            <label for="field-7" class="control-label">Repetez Mot de passe</label>
                                                            <input type="password" name="password_confirmation" class="form-control" id="field-3" placeholder="Address">                                                        </div>
                                                    </div>
                                                </div>
                                            </div>                                          
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger" data-dismiss="modal">Annuler</button>
                                                <button type="submint" class="btn btn-primary">Modifier mot de passe</button>
                                            </div>
                                            </form>
                                        </div>
                                    </div>
                                </div> 

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
