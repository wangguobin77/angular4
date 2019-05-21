// import * as Raven from 'raven-js'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'rxjs/Rx';
import { rootRouterConfig, shareRouter } from './app.routes';
import { RouterModule } from '@angular/router';
import { HeaderModule } from './+common/header/header.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './+common/services/auth.service';
import { AuthGuardService } from './+common/services/auth-guard.service';
import { AuthHttpService } from './+common/services/auth-http.service';
import { RoleGuardService } from './+common/services/role-guard.service';
import { TCGuardService } from './+common/services/tc-guard.service';
import { AppGuardService } from './+common/services/app-guard.service';
import { FooterModule } from './+common/footer/footer.module';

/*
Raven
  .config('https://<key>@sentry.io/<project>')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError);
  }
}
*/

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HeaderModule,
    FooterModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(shareRouter),
    RouterModule.forRoot(rootRouterConfig)
  ],
  providers: [/*{ provide: ErrorHandler, useClass: RavenErrorHandler },*/
    AuthGuardService,
    AuthService,
    AuthHttpService,
    RoleGuardService,
    TCGuardService,
    AppGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
