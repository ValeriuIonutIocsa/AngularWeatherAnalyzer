import { bootstrapApplication } from '@angular/platform-browser';
import { provideAppInitializer, inject } from '@angular/core';

import { AppComponent } from './app/app.component';
import { EnvService } from './app/services/env.service';

bootstrapApplication(AppComponent, {

  providers: [

    provideAppInitializer(() => {

      const envService = inject(EnvService);
      return envService.loadConfig();
    }),
  ],
}).catch(err => console.error(err));
