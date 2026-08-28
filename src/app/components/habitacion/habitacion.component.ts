import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitacionesService } from '../../services/habitaciones.service';
import { HabitacionRequest, HabitacionResponse } from '../../models/Habitacion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitacion',
  standalone: false,
  templateUrl: './habitacion.component.html',
  styleUrl: './habitacion.component.css'
})
export class HabitacionComponent implements OnInit {
  habitacionForm: FormGroup;
  isEditingMode: boolean = false;
  tipoAccion: string = 'Creando habitación';
  idHabitacion: number | null = null;
  habitacionActual?: HabitacionResponse;

  // Opciones alineadas al enum TipoHabitacion del Backend
  tiposHabitacion = [
    { codigo: 1, descripcion: 'INDIVIDUAL' },
    { codigo: 2, descripcion: 'DOBLE' },
    { codigo: 3, descripcion: 'SUITE' },
    { codigo: 4, descripcion: 'DELUXE' },
    { codigo: 5, descripcion: 'PRESIDENCIAL' }
  ];

  constructor(
    private fb: FormBuilder,
    private habitacionesService: HabitacionesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.habitacionForm = this.fb.group({
      numeroHabitacion: [null, [Validators.required, Validators.min(1)]],
      tipo: [null, [Validators.required]],
      precio: [null, [Validators.required, Validators.min(1)]],
      capacidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idHabitacion = Number(idParam);
      this.isEditingMode = true;
      this.tipoAccion = 'Editando habitación';
      this.obtenerHabitacion();
    }
  }

  obtenerHabitacion(): void {
    this.habitacionesService.getHabitacion(this.idHabitacion!).subscribe({
      next: (resp: HabitacionResponse) => {
        if (resp) {
          this.habitacionActual = resp;
          this.habitacionForm.patchValue({
            numeroHabitacion: resp.numeroHabitacion,
            tipo: resp.idTipoHabitacion,
            precio: resp.precio,
            capacidad: resp.capacidad
          });
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo obtener la información de la habitación', 'error');
      }
    });
  }

  cambiarEstadoHabitacion(idEstado: 3 | 4, nombreEstado: string): void {
    if (!this.idHabitacion) {
      return;
    }

    Swal.fire({
      title: '¿Cambiar estado?',
      text: `La habitación pasará a ${nombreEstado}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.habitacionesService.cambiarEstadoHabitacion(this.idHabitacion!, idEstado).subscribe({
          next: () => {
            if (this.habitacionActual) {
              this.habitacionActual.idEstadoHabitacion = idEstado;
              this.habitacionActual.estadoHabitacion = nombreEstado;
            }
            Swal.fire('Actualizada', `La habitación ahora está en ${nombreEstado}.`, 'success');
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'No se pudo cambiar el estado de la habitación', 'error');
          },
        });
      }
    });
  }

  onSubmit(): void {
    if (this.habitacionForm.invalid) {
      this.habitacionForm.markAllAsTouched();
      return;
    }

    const datosHabitacion: HabitacionRequest = {
      numeroHabitacion: Number(this.habitacionForm.value.numeroHabitacion),
      tipo: Number(this.habitacionForm.value.tipo),
      precio: Number(this.habitacionForm.value.precio),
      capacidad: Number(this.habitacionForm.value.capacidad)
    };

    const request = this.isEditingMode
      ? this.habitacionesService.putHabitacion(datosHabitacion, this.idHabitacion!)
      : this.habitacionesService.postHabitacion(datosHabitacion);

    request.subscribe({
      next: () => {
        Swal.fire(
          this.isEditingMode ? 'Actualizada' : 'Registrada',
          `Habitación ${this.isEditingMode ? 'actualizada' : 'registrada'} correctamente`,
          'success'
        );
        this.router.navigate(['/dashboard/habitaciones']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar la habitación', 'error');
      }
    });
  }
}
