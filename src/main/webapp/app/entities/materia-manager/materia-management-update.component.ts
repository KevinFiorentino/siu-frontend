import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { JhiEventManager } from 'ng-jhipster';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Carrera } from 'app/core/carrera/carrera.model';
import { CarreraService } from 'app/core/carrera/carrera.service';

import { Materia } from 'app/core/materia/materia.model';
import { MateriaService } from 'app/core/materia/materia.service';
import { FormaAprobacionService } from 'app/core/formaaprobacion/formaaprobacion.service';
import { FormaAprobacion } from 'app/core/formaaprobacion/formaaprobacion.model';
import { Plan } from 'app/core/plan/plan.model';
import { PlanService } from 'app/core/plan/plan.service';

@Component({
  selector: 'jhi-materia-mgmt-update',
  templateUrl: './materia-management-update.component.html',
})
export class MateriaManagementUpdateComponent implements OnInit, OnDestroy {
  materia!: Materia;
  carreras: Carrera[] | null = null;
  formasaprobacion: FormaAprobacion[] | null = null;
  planes: Plan[] | null = null;
  carreraListSubscription?: any;
  formasaprobacionListSubscription?: any;
  planesListSubscription?: any;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  isSaving = false;

  editForm = this.fb.group({
    idMaterias: [],
    nombre: ['', [Validators.maxLength(50)]],
    inicioInscripcion: ['', [Validators.required]],
    finInscripcion: ['', [Validators.required]],
    CarrerasIdCarreras: [],
    idPlan: [],
    idFormaAprobacion: [],
  });

  constructor(
    private materiaService: MateriaService,
    private carreraService: CarreraService,
    private formaaprobacionService: FormaAprobacionService,
    private planService: PlanService,
    private eventManager: JhiEventManager,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadAllMaterias();
    this.loadAllPlanes();
    this.route.data.subscribe(({ materia }) => {
      if (materia) {
        this.materia = materia;
        this.updateForm(materia);
      }
    });
  }

  ngOnDestroy(): void {
    this.carreraListSubscription.unsubscribe();
    this.formasaprobacionListSubscription.unsubscribe();
    this.planesListSubscription.unsubscribe();
  }

  private loadAll(): void {
    this.carreraListSubscription = this.carreraService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<Carrera[]>) => this.onSuccess(res.body, res.headers));
  }

  private onSuccess(carreras: Carrera[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.carreras = carreras;
  }

  private loadAllMaterias(): void {
    this.formasaprobacionListSubscription = this.formaaprobacionService
      .query()
      .subscribe((res: HttpResponse<FormaAprobacion[]>) => this.onSuccessFormaAprobacion(res.body, res.headers));
  }

  private onSuccessFormaAprobacion(formasaprobacion: FormaAprobacion[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.formasaprobacion = formasaprobacion;
  }

  private loadAllPlanes(): void {
    this.planesListSubscription = this.planService
      .query()
      .subscribe((res: HttpResponse<Plan[]>) => this.onSuccessPlan(res.body, res.headers));
  }

  private onSuccessPlan(planes: Plan[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.planes = planes;
  }

  private sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.updateMateria(this.materia);
    if (this.materia.idMaterias !== undefined) {
      this.materiaService.update(this.materia).subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    } else {
      this.materiaService.create(this.materia).subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    }
  }

  private updateForm(materia: Materia): void {
    this.editForm.patchValue({
      idMaterias: materia.idMaterias,
      nombre: materia.nombre,
      inicioInscripcion: materia.inicioInscripcion,
      finInscripcion: materia.finInscripcion,
      CarrerasIdCarreras: materia.CarrerasIdCarreras,
      idPlan: materia.planIdPlan,
      idFormaAprobacion: materia.formaAprobacionIdformaAprobacion,
    });
  }

  private updateMateria(materia: Materia): void {
    materia.nombre = this.editForm.get(['nombre'])!.value;
    materia.inicioInscripcion = this.editForm.get(['inicioInscripcion'])!.value;
    materia.finInscripcion = this.editForm.get(['finInscripcion'])!.value;
    materia.CarrerasIdCarreras = this.editForm.get(['CarrerasIdCarreras'])!.value;
    materia.planIdPlan = this.editForm.get(['idPlan'])!.value;
    materia.formaAprobacionIdformaAprobacion = this.editForm.get(['idFormaAprobacion'])!.value;
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError(): void {
    this.isSaving = false;
  }
}
