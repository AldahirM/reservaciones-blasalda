import { Component, OnInit } from '@angular/core';
import { ReservacionesService } from '../../services/reservaciones.service';
import {
  ReservacionRequest,
  ReservacionResponse,
} from '../../models/Reservaciones.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reservacion',
  standalone: false,
  templateUrl: './reservacion.component.html',
  styleUrl: './reservacion.component.css',
})
export class ReservacionComponent implements OnInit {
  isEditingMode: boolean = false;
  tipoAccion: string = 'Creando reservación';
  reservacionForm: FormGroup;

  idReservacion: number | null = null;
  reservaActual?: ReservacionResponse;

  constructor(
    private reservacionesService: ReservacionesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.reservacionForm = this.fb.group({
      idHuesped: [null, [Validators.required, Validators.min(1)]],
      idHabitacion: [null, [Validators.required, Validators.min(1)]],
      fechaEntrada: [null, Validators.required],
      fechaSalida: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.idReservacion = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditingMode = !!this.idReservacion;
    if (this.isEditingMode) {
      this.obtenerReservacion();
      this.tipoAccion = 'Editando reservación';
    }
  }

  obtenerReservacion(): void {
    this.reservacionesService.getReservacion(this.idReservacion!).subscribe({
      next: (resp) => {
        console.log(resp);
        // CORRECCIÓN: Asignar la respuesta directamente a reservaActual
        this.reservaActual = resp;

        this.reservacionForm.patchValue({
          idHuesped: resp.datosHuesped?.id || null,
          idHabitacion: resp.datosHabitacion?.id || null,
          fechaEntrada: this.convertirAFecha(resp.fechaEntrada),
          fechaSalida: this.convertirAFecha(resp.fechaSalida),
        });
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudo cargar la reservación', 'error');
      },
    });
  }

  procesarCambioEstado(nuevoIdEstado: number): void {
    if (!this.reservaActual?.id) {
      Swal.fire('Error', 'No se encontró la información de la reserva', 'error');
      return;
    }

    this.reservacionesService
      .cambiarEstadoReservacion(this.reservaActual.id, nuevoIdEstado)
      .subscribe({
        next: () => {
          // Actualización de estado en tiempo real
          this.reservaActual!.idEstadoReserva = nuevoIdEstado;

          const esCheckIn = nuevoIdEstado === 2;
          const accion = esCheckIn ? 'Check-In' : 'Check-Out';

          // Mostrar alerta y esperar al clic en "OK" para redirigir
          Swal.fire({
            title: '¡Éxito!',
            text: `Se ha realizado el ${accion} correctamente.`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.router.navigate(['/dashboard/reservaciones']);
            }
          });
        },
        error: (err) => {
          console.error('Error al cambiar el estado', err);
          Swal.fire('Error', 'No se pudo cambiar el estado de la reservación', 'error');
        }
      });
  }

  onSubmit(): void {
    if (this.reservacionForm.invalid) {
      this.reservacionForm.markAllAsTouched();
      return;
    }

    const datosReservacion: ReservacionRequest = {
      idHuesped: this.reservacionForm.value.idHuesped,
      idHabitacion: this.reservacionForm.value.idHabitacion,
      fechaEntrada: this.formatearFecha(
        this.reservacionForm.value.fechaEntrada,
      ),
      fechaSalida: this.formatearFecha(this.reservacionForm.value.fechaSalida),
    };
    console.log(datosReservacion);
    const request = this.isEditingMode
      ? this.reservacionesService.putReservacion(
        datosReservacion,
        this.idReservacion!,
      )
      : this.reservacionesService.postReservacion(datosReservacion);

    request.subscribe({
      next: () => {
        Swal.fire(
          this.isEditingMode ? 'Actualizada' : 'Registrada',
          `Reservación ${this.isEditingMode ? 'actualizada' : 'registrada'} correctamente`,
          'success',
        );
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudo guardar la reservación', 'error');
      },
    });
  }

  private convertirAFecha(valor: Date | string): Date | null {
    if (valor instanceof Date) return valor;
    if (!valor) return null;

    const partes = String(valor).split('T')[0].split('-').map(Number);
    if (partes.length === 3) {
      return new Date(partes[0], partes[1] - 1, partes[2]);
    }

    return null;
  }

  private formatearFecha(valor: Date | null | undefined): string {
    if (!(valor instanceof Date) || Number.isNaN(valor.getTime())) {
      return '';
    }

    const dia = String(valor.getDate()).padStart(2, '0');
    const mes = String(valor.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${valor.getFullYear()}`;
  }
}