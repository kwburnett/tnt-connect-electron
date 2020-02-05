import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './core/services';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public activeRoute: string = 'home';

	constructor(
		public electronService: ElectronService,
		private translate: TranslateService,
		public router: Router
	) {
		translate.setDefaultLang('en');
		console.log('AppConfig', AppConfig);

		if (electronService.isElectron) {
			console.log(process.env);
			console.log('Mode electron');
			console.log('Electron ipcRenderer', electronService.ipcRenderer);
			console.log('NodeJS childProcess', electronService.childProcess);
		} else {
			console.log('Mode web');
		}
	}

	public navigate(route: string): void {
		if (this.activeRoute !== route) {
			this.router.navigate([route]);
		}
		this.activeRoute = route;
	}
}
