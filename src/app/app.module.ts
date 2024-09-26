import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './features/login/login.component'; // Importa o LoginComponent
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from './environments/environment';  // Caminho pode variar
//import { HomeComponent } from './features/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    //HomeComponent  // Declara o LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
