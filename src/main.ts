import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('Angular application bootstrap successfully');
  })
  .catch((err) => console.error('Error bootstrapping Angular application:', err));
