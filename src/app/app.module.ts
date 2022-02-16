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
import { LogsComponent } from './logs/logs.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PodcastComponent } from './podcast/podcast.component';
import { MoneyAddCalcComponent } from './money/calculator/money-add-calc.component';
import { MoneyCategoryPickerComponent } from './money/category-picker/money-cat-picker.component';
import { MoneyCategoryFilterComponent } from './money/category-picker/money-cat-filter.component';
import { MoneyListComponent } from './money/money-list.component';
import { HouseComponent } from './house/house.component';
import { WeightComponent } from './weight/weight.component';
import { BackupListComponent } from './backup/backup-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BackupSummaryComponent } from "./backup/summary/backup-summary.component";
import { DatePipe } from '@angular/common';
import {BackupSummarySourceComponent} from "./backup/summary/source/backup-summary-source.component";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LogsComponent,
    PodcastComponent,
    MoneyAddCalcComponent,
    MoneyCategoryPickerComponent,
    MoneyCategoryFilterComponent,
    MoneyListComponent,
    HouseComponent,
    WeightComponent,
    BackupListComponent,
    BackupSummaryComponent,
    BackupSummarySourceComponent
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
      {path: 'logs', component: LogsComponent},
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
