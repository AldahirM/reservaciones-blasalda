import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HuespedesService } from '../../services/huespedes.service';
import { HuespedResponse } from '../../models/Huesped.model';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-huesped',
  standalone: false,
  templateUrl: './huesped.component.html',
  styleUrl: './huesped.component.css',
})
export class HuespedComponent implements OnInit {
  idHuesped: number | null = null;
  isEditingMod: boolean = false;
  huespedForm: FormGroup;
  tipoAccion: string = 'Creando huesped';
  huesped: HuespedResponse | null = null;

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
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ],
      telefono: [
        '',
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ],
      tipoDocumento: ['', [Validators.required]],
      documento: [
        '',
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ],
      nacionalidad: [
        '',
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
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
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudo cargar al', 'error');
      },
    });
  }
}
