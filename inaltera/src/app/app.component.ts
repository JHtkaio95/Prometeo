import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from './routes-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: []
})
export class AppComponent {
  title = 'inaltera';
}
