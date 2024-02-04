import { Component } from '@angular/core';
import NavComponent from '../nav/nav.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    RouterModule, 
    NavComponent],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.css'
})
export default class DashComponent {

}
