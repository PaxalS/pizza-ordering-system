import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PizzaComponent } from './pizza/pizza.component';
import { PizzaSizeComponent } from './pizza-size/pizza-size.component';
import { ToppingsComponent } from './toppings/toppings.component';
import { PromotionalOffersComponent } from './promotional-offers/promotional-offers.component';

@NgModule({
  declarations: [
    AppComponent,
    PizzaComponent,
    PizzaSizeComponent,
    ToppingsComponent,
    PromotionalOffersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
