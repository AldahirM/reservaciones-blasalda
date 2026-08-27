import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsuarioRequest, UsuarioResponse } from '../../models/Usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DescripcionesRoles, Roles } from '../../constants/Roles';
import { UsuariosService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  usuarios: UsuarioResponse[] = [];
  textoModal: string = 'Registrar usuario';
  usuarioForm: FormGroup;
  roles: string[] = Object.values(Roles);
  isEditMode: boolean = false;
  selectedUsuario: UsuarioResponse | null = null;

  @ViewChild('usuarioModalRef') usuarioModalEl!: ElementRef;

  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
  ) {
    this.usuarioForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roles: [[], [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(
      this.usuarioModalEl.nativeElement,
      { keyboard: false },
    );
    this.usuarioModalEl.nativeElement.addEventListener(
      'hidden.bs.modal',
      () => {
        this.resetForm();
      },
    );
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;

    const datoUsuario: UsuarioRequest = this.usuarioForm.value;

    if (this.isEditMode && this.selectedUsuario) {
    } else {
      // REGISTRADO
      this.usuariosService.postUsuario(datoUsuario).subscribe({
        next: (nuevoUsuario) => {
          this.usuarios.push(nuevoUsuario);
          Swal.fire(
            'Registrado',
            'Usuario, registrado correctamente',
            'success',
          );
          this.modalInstance.hide();
        },
      });
    }
  }

  resetForm(): void {
    this.usuarioForm.reset();
    this.isEditMode = false;
    this.usuarioForm.get('roles')?.setValue([]);
  }

  toggleForm(): void {
    this.resetForm();
    this.textoModal = 'Registrar usuario';
    this.modalInstance.show();
  }

  editarUsuario(usuario: UsuarioResponse): void {
    this.isEditMode = true;
    this.selectedUsuario = usuario;
    this.textoModal = 'Actualizando usuario: ' + usuario.username;

    this.usuarioForm.patchValue({ ...usuario });
    this.modalInstance.show();
  }

  transformarRol(rol: string): string {
    return DescripcionesRoles[rol as Roles] || 'Desconocido';
  }

  eliminarUsuario(username: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `El usuario ${username} será eliminado permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteUsuario(username).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter(
              (u) => u.username !== username,
            );
            Swal.fire(
              'Eliminado',
              `Usuario ${username} eliminado correctamente`,
              'success',
            );
          },
        });
      }
    });
  }

  listarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (resp) => {
        this.usuarios = resp;
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      },
    });
  }
}
