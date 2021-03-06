import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UnLaSiuSharedModule } from 'app/shared/shared.module';
import { ExamenesManagementComponent } from './examenes.component';
import { CalificarComponent } from './calificar.component';
import { AlumnoMateriasManagementComponent } from './alumnomateria.component';
import { examenesManagementRoute } from './examenes.route';
import { ExportAsModule } from 'ngx-export-as';
import { CalificarExcelComponent } from './calificar-excel.component';

@NgModule({
  imports: [UnLaSiuSharedModule, ExportAsModule, RouterModule.forChild(examenesManagementRoute)],
  declarations: [ExamenesManagementComponent, AlumnoMateriasManagementComponent, CalificarComponent, CalificarExcelComponent],
  entryComponents: [CalificarComponent, CalificarExcelComponent],
})
export class ExamenesManagementModule {}
