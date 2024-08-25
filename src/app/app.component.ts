import { Component } from '@angular/core';
import { PizzaComponent } from './pizza/pizza.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [PizzaComponent]
})
export class AppComponent {
  title = 'Pizza Ordering System';
}
