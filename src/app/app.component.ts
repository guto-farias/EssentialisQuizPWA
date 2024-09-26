import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],  // Garante que RouterOutlet esteja disponível para roteamento
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Correção de 'styleUrl' para 'styleUrls'
})
export class AppComponent {
  title = 'essentialis';
}

