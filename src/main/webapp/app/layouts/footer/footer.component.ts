import { Component } from '@angular/core';

import { APP_NAME } from 'app/app.constants';
import { VERSION } from 'app/app.constants';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  version = '';
  appName = '';

  constructor() {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION;
    }
    if (APP_NAME) {
      this.appName = APP_NAME.toLowerCase();
    }
  }
}
