import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define interfaces
interface Topping {
  name: string;
  price: number;
  selected: boolean;
}

interface Pizza {
  selectedSize: 'Small' | 'Medium' | 'Large' | 'Extra Large' | null;
  vegToppings: Topping[];
  nonVegToppings: Topping[];
  total: number;
  quantity: number;
  isOffer: boolean;
  offerPrice: number; // Price set by the offer
}

@Component({
  selector: 'app-pizza',
  standalone: true,
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class PizzaComponent {
  pizzas: Pizza[] = []; // Declare pizzas as an array of Pizza objects
  finalTotal: number = 0;
  appliedOffer: string = '';

  // Quantities for each offer
  offer1Quantity: number = 1;
  offer2Quantity: number = 1;
  offer3Quantity: number = 1;

  // Sample toppings for each pizza
  vegToppingsSample: Topping[] = [
    { name: 'Tomatoes', price: 1.00, selected: false },
    { name: 'Onions', price: 0.50, selected: false },
    { name: 'Bell pepper', price: 1.00, selected: false },
    { name: 'Mushrooms', price: 1.20, selected: false },
    { name: 'Pineapple', price: 0.75, selected: false }
  ];

  nonVegToppingsSample: Topping[] = [
    { name: 'Sausage', price: 1.00, selected: false },
    { name: 'Pepperoni', price: 2.00, selected: false },
    { name: 'Barbecue chicken', price: 3.00, selected: false }
  ];

  // Add Offer 1 to the order
  addOffer1() {
    for (let i = 0; i < this.offer1Quantity; i++) {
      const newPizza: Pizza = {
        selectedSize: 'Medium', // Fixed size for Offer 1
        vegToppings: JSON.parse(JSON.stringify(this.vegToppingsSample)),
        nonVegToppings: JSON.parse(JSON.stringify(this.nonVegToppingsSample)),
        total: 5, // Fixed price for Offer 1
        quantity: 1,
        isOffer: true,
        offerPrice: 5
      };
      this.pizzas.push(newPizza);
    }
    this.updateTotal();
  }

  // Add Offer 2 to the order
  addOffer2() {
    for (let i = 0; i < this.offer2Quantity; i++) {
      const newPizza: Pizza = {
        selectedSize: 'Medium', // Fixed size for Offer 2
        vegToppings: JSON.parse(JSON.stringify(this.vegToppingsSample)),
        nonVegToppings: JSON.parse(JSON.stringify(this.nonVegToppingsSample)),
        total: 9, // Fixed price for Offer 2
        quantity: 2,
        isOffer: true,
        offerPrice: 9
      };
      this.pizzas.push(newPizza);
    }
    this.updateTotal();
  }

  // Add Offer 3 to the order
addOffer3() {
  for (let i = 0; i < this.offer3Quantity; i++) {
    const newPizza: Pizza = {
      selectedSize: 'Large', // Fixed size for Offer 3
      vegToppings: JSON.parse(JSON.stringify(this.vegToppingsSample)),
      nonVegToppings: JSON.parse(JSON.stringify(this.nonVegToppingsSample)),
      total: 0, // Price to be calculated with discount
      quantity: 1, // Quantity represents one order of Offer 3
      isOffer: true,
      offerPrice: 8, // Assume the regular price is $16 and discount is 50%
    };
    newPizza.total = newPizza.offerPrice; // Correct the logic here
    this.pizzas.push(newPizza);
  }
  this.updateTotal();
}

  // Method to handle increasing the quantity of an offer
  incrementOfferQuantity(offer: string) {
    if (offer === 'offer1') {
      this.offer1Quantity++;
    } else if (offer === 'offer2') {
      this.offer2Quantity++;
    } else if (offer === 'offer3') {
      this.offer3Quantity++;
    }
  }

  // Method to handle decreasing the quantity of an offer (min 1)
  decrementOfferQuantity(offer: string) {
    if (offer === 'offer1' && this.offer1Quantity > 1) {
      this.offer1Quantity--;
    } else if (offer === 'offer2' && this.offer2Quantity > 1) {
      this.offer2Quantity--;
    } else if (offer === 'offer3' && this.offer3Quantity > 1) {
      this.offer3Quantity--;
    }
  }

  // Method to add a new custom pizza
  addPizza() {
    this.pizzas.push({
      selectedSize: null,
      vegToppings: JSON.parse(JSON.stringify(this.vegToppingsSample)),
      nonVegToppings: JSON.parse(JSON.stringify(this.nonVegToppingsSample)),
      total: 0,
      quantity: 1,
      isOffer: false,
      offerPrice: 0
    });
  }

  // Quantity controls for custom pizzas
  incrementCustomPizzaQuantity(index: number) {
    this.pizzas[index].quantity++;
    this.updateTotal();
  }

  decrementCustomPizzaQuantity(index: number) {
    if (this.pizzas[index].quantity > 1) {
      this.pizzas[index].quantity--;
      this.updateTotal();
    }
  }

  // Method to update the total cost
  updateTotal() {
    this.finalTotal = 0;
    this.pizzas.forEach((pizza: Pizza) => {
      let pizzaTotal = 0;

      // Calculate price based on whether it's an offer or a custom pizza
      if (pizza.isOffer) {
        pizzaTotal = pizza.offerPrice; // Fixed price for offer pizzas
      } else {
        // Custom pizza - calculate base price based on size
        if (pizza.selectedSize === 'Small') pizzaTotal += 5;
        if (pizza.selectedSize === 'Medium') pizzaTotal += 7;
        if (pizza.selectedSize === 'Large') pizzaTotal += 8;
        if (pizza.selectedSize === 'Extra Large') pizzaTotal += 9;

        // Add the prices of the selected toppings
        pizza.vegToppings.forEach((topping: Topping) => {
          if (topping.selected) pizzaTotal += topping.price;
        });
        pizza.nonVegToppings.forEach((topping: Topping) => {
          if (topping.selected) pizzaTotal += topping.price;
        });
      }

      // Multiply by quantity
      pizza.total = pizzaTotal * pizza.quantity;
      this.finalTotal += pizza.total;
    });
  }

  // Method to enforce topping limits only for offer pizzas
  checkToppingLimit(pizza: Pizza) {
    if (pizza.isOffer) {
      const maxToppingsAllowed = this.getMaxToppingsAllowed(pizza);
      const selectedToppingsCount = this.getSelectedToppingsCount(pizza.vegToppings, pizza.nonVegToppings);

      if (selectedToppingsCount > maxToppingsAllowed) {
        alert(`You can only select up to ${maxToppingsAllowed} toppings for this offer.`);
        pizza.vegToppings.forEach(topping => {
          if (topping.selected && selectedToppingsCount > maxToppingsAllowed) {
            topping.selected = false;
          }
        });
        pizza.nonVegToppings.forEach(topping => {
          if (topping.selected && selectedToppingsCount > maxToppingsAllowed) {
            topping.selected = false;
          }
        });
      }
    }
  }

  // Get the total number of selected toppings
  getSelectedToppingsCount(vegToppings: Topping[], nonVegToppings: Topping[]): number {
    let count = 0;
    vegToppings.forEach(topping => {
      if (topping.selected) count++;
    });
    nonVegToppings.forEach(topping => {
      if (topping.selected && (topping.name === 'Pepperoni' || topping.name === 'Barbecue chicken')) {
        count += 2; // These count as 2 each
      } else if (topping.selected) {
        count++;
      }
    });
    return count;
  }

  // Maximum number of toppings allowed for offer pizzas
  getMaxToppingsAllowed(pizza: Pizza): number {
    if (pizza.selectedSize === 'Medium' && pizza.quantity === 1) return 2; // Offer 1
    if (pizza.selectedSize === 'Medium' && pizza.quantity === 2) return 4; // Offer 2
    if (pizza.selectedSize === 'Large') return 4; // Offer 3 (Pepperoni/BBQ count as 2)
    return Infinity; // No limit for custom pizzas
  }
}
