import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ConvertToSpacesPipe } from './shared/example/convert-to-spaces.pipe';
import { WelcomeComponent } from './home/welcome.component'
import { StarComponent } from "./shared/example/star.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule} from "ngx-bootstrap/modal";
import { ButtonsModule } from "ngx-bootstrap";
import { LogsComponent } from "./logs/logs.component";
import { TooltipModule } from "ngx-bootstrap";
import { PodcastComponent } from "./podcast/podcast.component";
import { MoneyAddComponent } from "./money/money-add.component";
import { MoneyAddCalcComponent } from "./money/calculator/money-add-calc.component";
import { MoneyCatagoryPickerComponent } from "./money/category-picker/money-cat-picker.component";
import { PairsPipe } from "./shared/example/pairs.pipe";
import { DatePipe } from "@angular/common";
import { MoneyListComponent } from "./money/money-list.component";
import { MoneyRecComponent } from "./money/money-rec.component";
import { MoneyRegularComponent } from "./money/money-regular.component";
import { HouseComponent } from "./house/house.component";
import { WeightComponent } from "./weight/weight.component";

@NgModule({
  declarations: [
    AppComponent,
    ConvertToSpacesPipe,
    WelcomeComponent,
    StarComponent,
    PairsPipe,
    LogsComponent,
    PodcastComponent,
    MoneyAddComponent,
    MoneyAddCalcComponent,
    MoneyCatagoryPickerComponent,
    MoneyListComponent,
    MoneyRecComponent,
    HouseComponent,
    WeightComponent,
    MoneyRegularComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    [BsDropdownModule.forRoot()],
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'podcast', component: PodcastComponent },
      { path: 'add', component: MoneyAddComponent },
      { path: 'regular', component: MoneyRegularComponent },
      { path: 'list', component: MoneyListComponent },
      { path: 'rec', component: MoneyRecComponent },
      { path: 'house', component: HouseComponent },
      { path: 'weight', component: WeightComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
    ] )
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
