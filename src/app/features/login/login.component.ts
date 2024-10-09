import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,  // Se este componente for standalone
  imports: [FormsModule, CommonModule],  // Certifique-se de importar FormsModule aqui
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email!: string;
  password!: string;
  errorMessage: string | null = null;
  //resetMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async onSignIn() {
    const { error } = await this.authService.signIn(this.email, this.password);
    if (error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = null;
      this.router.navigate(['/home']);  // Assumindo que você tenha uma rota '/home' configurada
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Novo método para solicitar a redefinição de senha
  /*async onForgotPassword() {
    if (!this.email) {
      this.resetMessage = 'Por favor, informe seu email para redefinir a senha.';
      return;
    }

    const { error } = await this.authService.resetPassword(this.email);
    if (error) {
      this.resetMessage = 'Erro ao enviar email de redefinição de senha. Tente novamente.';
    } else {
      this.resetMessage = 'Email de redefinição de senha enviado. Verifique sua caixa de entrada.';
    }
  }*/
}
