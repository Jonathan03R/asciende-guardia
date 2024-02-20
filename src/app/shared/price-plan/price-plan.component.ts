import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-price-plan',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './price-plan.component.html',
  styleUrl: './price-plan.component.css',
})
export default class PricePlanComponent { }
