import {environment} from 'enviroment/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {SidebarModule} from './ui/components/sidebar/sidebar.module';

import {AppComponent} from './app.component';
import {AppRoutes} from './app.routing';

import {HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {ReactiveFormsModule} from '@angular/forms';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {VideoPlayerModule} from "./ui/components/video-player/video-player.module";
import {MainLayoutComponent} from "./ui/main-layout/main-layout.component";
import {CustomRouteReuseStrategy} from "./shared/router/custom-route-reuse-strategy";

@NgModule({
  declarations: [AppComponent, MainLayoutComponent],
  providers: [
    {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy}
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    SidebarModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    YouTubePlayerModule,
    VideoPlayerModule
  ],
})
export class AppModule {
}
