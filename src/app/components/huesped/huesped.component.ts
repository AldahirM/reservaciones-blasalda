import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HuespedesService } from '../../services/huespedes.service';
import { HuespedRequest, HuespedResponse } from '../../models/Huesped.model';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  CodigoTipoDocumento,
  TipoDocumento,
} from '../../constants/TipoDocumento';

@Component({
  selector: 'app-huesped',
  standalone: false,
  templateUrl: './huesped.component.html',
  styleUrl: './huesped.component.css',
})
export class HuespedComponent implements OnInit {
  idHuesped: number | null = null;
  huespedForm: FormGroup;
  isEditingMod: boolean = false;
  tipoAccion: string = 'Creando huesped';
  huesped: HuespedResponse | null = null;
  tipoDocumentos: TipoDocumento[] = Object.values(TipoDocumento);

  constructor(
    private route: ActivatedRoute,
    private huespedService: HuespedesService,
    private fb: FormBuilder,
  ) {
    this.huespedForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      apellidoPaterno: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      apellidoMaterno: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      fechaNacimiento: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      tipoDocumento: ['', [Validators.required]],
      documento: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      nacionalidad: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.idHuesped = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditingMod = !!this.idHuesped;

    if (this.isEditingMod) {
      this.obtenerHuesped();
      this.tipoAccion = 'Editando huesped';
    }
  }

  obtenerHuesped(): void {
    this.huespedService.getHuesped(this.idHuesped!).subscribe({
      next: (resp) => {
        this.huesped = resp;
        console.log(this.huesped);
        this.huespedForm.patchValue({
          nombre: resp.nombre,
          apellidoPaterno: resp.apellidoPaterno,
          apellidoMaterno: resp.apellidoMaterno,
          fechaNacimiento: this.convertirAFecha(resp.edad),
          email: resp.email,
          telefono: resp.telefono,
          tipoDocumento: resp.tipoDocumento,
          documento: resp.documento,
          nacionalidad: resp.nacionalidad,
        });
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudo cargar al', 'error');
      },
    });
  }

  onSubmit(): void {
    if (this.huespedForm.invalid) return;

    const datosHuesped = this.generarHuespedRequest();

    console.log(datosHuesped);

    if (this.isEditingMod) {
      this.huespedService.putHuesped(datosHuesped, this.idHuesped!).subscribe({
        next: (huesped) => {
          Swal.fire(
            'Actualizado',
            'Huesped actualizado correctamente',
            'success',
          );
        },
        error: (error) => {
          console.log(error);
          Swal.fire('Error', 'No se pudo actualizar el huesped', 'error');
        },
      });
      return;
    }
    this.huespedService.postHuesped(datosHuesped).subscribe({
      next: (huesped) => {
        Swal.fire(
          'Registrado',
          'Huesped registrado correctamente',
          'success',
        );
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudo registrar el huesped', 'error');
      },
    });
  }

  generarHuespedRequest(): HuespedRequest {
    const tipoDocumentoSeleccionado = this.huespedForm.value
      .tipoDocumento as TipoDocumento;
    const tipoDocumento = CodigoTipoDocumento[tipoDocumentoSeleccionado];

    const datos: HuespedRequest = {
      nombre: this.huespedForm.value.nombre,
      apellidoPaterno: this.huespedForm.value.apellidoPaterno,
      apellidoMaterno: this.huespedForm.value.apellidoMaterno,
      fechaNacimiento: this.formatearFecha(this.huespedForm.value.fechaNacimiento),
      email: this.huespedForm.value.email,
      telefono: this.huespedForm.value.telefono,
      documento: this.huespedForm.value.documento,
      nacionalidad: this.huespedForm.value.nacionalidad,
      tipoDocumento,
    };
    return datos;
  }

  private convertirAFecha(valor: Date | string): Date | null {
    if (valor instanceof Date) return valor;

    const partes = valor.split('T')[0].split('-').map(Number);
    if (partes.length === 3) {
      return new Date(partes[0], partes[1] - 1, partes[2]);
    }

    return null;
  }

  private formatearFecha(valor: Date): string {
    const dia = String(valor.getDate()).padStart(2, '0');
    const mes = String(valor.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${valor.getFullYear()}`;
  }
}
