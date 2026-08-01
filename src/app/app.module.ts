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
import { MoneyComponent } from './money/money.component';
import { HouseComponent } from './house/house.component';
import { WeightComponent } from './weight/weight.component';
import { BackupListComponent } from './backup/backup-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DatePipe, NgOptimizedImage} from '@angular/common';
import { BackupSummaryComponent } from './backup/summary/backup-summary.component';
import { BackupLogComponent } from './backup/log/backup-log.component';
import { BackupPrintsComponent } from './backup/prints/backup-prints.component';
import { BackupPrintSizeSelectComponent } from './backup/prints/backup-print-size-select.component';
import { BackupPrintImageComponent } from './backup/prints/backup-print-image.component';
import { WifiComponent } from './wifi/wifi.component';
import { GridTransaction } from './money/grid/grid-transaction';
import { ImportGrid } from './backup/import-grid/import-grid';
import {Map} from './backup/map/map';
import {BackupDisplayInfoComponent} from './backup/display/info/backup-display-info.component';
import {BackupSummaryGrid} from './backup/summary/source/backup-summary-grid';
import {ImportGridHeaderExpand} from './backup/import-grid/header/import-grid-header-expand';
import {ActionGridHeaderName} from './backup/action/header/action-grid-header-name';
import {ActionGridDataName} from './backup/action/data/action-grid-data-name';
import {BackupActionComponent} from './backup/action/backup-action.component';
import {BackupDisplayComponent} from './backup/display/backup-display.component';
import {BackupPhotoComponent} from './backup/display/photo/backup-photo.component';
import {MoneyToolbarComponent} from './money/toolbar/money-toolbar.component';
import {MoneyFilterComponent} from './money/filter/money-filter.component';
import {MoneyAddComponent} from './money/add/money-add.component';
import {MoneyTransferComponent} from './money/transfer/money-transfer.component';
import {MobileAddComponent} from './money/mobile/mobile-add.component';
import {MobileRecentComponent} from './money/mobile/mobile-recent.component';

@NgModule({
    declarations: [
        AppComponent,
        WelcomeComponent,
        MoneyAddCalcComponent,
        MoneyComponent,
        HouseComponent,
        WeightComponent,
        BackupListComponent,
        BackupSummaryComponent,
        BackupLogComponent,
        BackupPrintSizeSelectComponent,
        BackupPrintsComponent,
        BackupPrintImageComponent,
        WifiComponent
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
            {path: 'money', component: MoneyComponent},
            {path: 'house', component: HouseComponent},
            {path: 'bup', component: BackupListComponent},
            {path: 'weight', component: WeightComponent},
            {path: 'wifi', component: WifiComponent},
            {path: 'money-add', component: MobileAddComponent},
            {path: 'money-recent', component: MobileRecentComponent},
            {path: '', redirectTo: 'welcome', pathMatch: 'full'},
            {path: '**', redirectTo: 'welcome', pathMatch: 'full'}
        ]),
        GridTransaction,
        ImportGrid,
        Map,
        BackupDisplayInfoComponent,
        BackupSummaryGrid,
        ImportGridHeaderExpand,
        ActionGridHeaderName,
        ActionGridDataName,
        BackupActionComponent,
        NgOptimizedImage,
        BackupDisplayComponent,
        BackupPhotoComponent,
        MoneyToolbarComponent,
        MoneyFilterComponent,
        MoneyAddComponent,
        MoneyTransferComponent,
        MobileAddComponent,
        MobileRecentComponent
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
