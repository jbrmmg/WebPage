import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule} from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MoneyAddCalcComponent } from './money/calculator/money-add-calc.component';
import { MoneyCategoryPickerComponent } from './money/category-picker/money-cat-picker.component';
import { MoneyCategoryFilterComponent } from './money/category-picker/money-cat-filter.component';
import { MoneyListComponent } from './money/money-list.component';
import { HouseComponent } from './house/house.component';
import { WeightComponent } from './weight/weight.component';
import { BackupListComponent } from './backup/backup-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { BackupSummaryComponent } from "./backup/summary/backup-summary.component";
import { BackupSummarySourceComponent } from "./backup/summary/source/backup-summary-source.component";
import { BackupDisplayComponent } from "./backup/display/backup-display.component";
import { BackupActionComponent } from "./backup/action/backup-action.component";
import { BackupImportComponent } from "./backup/import/backup-import.component";
import { BackupLogComponent } from "./backup/log/backup-log.component";
import { BackupPhotoComponent } from "./backup/photo/backup-photo.component";
import { BackupPrintsComponent } from "./backup/prints/backup-prints.component";
import { MoneyRowDisplay } from "./money/exp/money-row-display";
import { MoneyRowDispDate } from "./money/exp/money-row-disp-date";
import { MoneyFiles } from "./money/files/money-files";
import { MoneyFile } from "./money/files/money-file";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    MoneyAddCalcComponent,
    MoneyCategoryPickerComponent,
    MoneyCategoryFilterComponent,
    MoneyRowDisplay,
    MoneyRowDispDate,
    MoneyListComponent,
    MoneyFiles,
    MoneyFile,
    HouseComponent,
    WeightComponent,
    BackupListComponent,
    BackupSummaryComponent,
    BackupSummarySourceComponent,
    BackupDisplayComponent,
    BackupActionComponent,
    BackupImportComponent,
    BackupLogComponent,
    BackupPhotoComponent,
    BackupPrintsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CollapseModule,
    BsDatepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forRoot([
      {path: 'welcome', component: WelcomeComponent},
      {path: 'money', component: MoneyListComponent},
      {path: 'house', component: HouseComponent},
      {path: 'bup', component: BackupListComponent},
      {path: 'weight', component: WeightComponent},
      {path: '', redirectTo: 'welcome', pathMatch: 'full'},
      {path: '**', redirectTo: 'welcome', pathMatch: 'full'}
    ])
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
