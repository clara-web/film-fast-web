import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidebarComponent} from './sidebar.component';
import {MatIcon} from "@angular/material/icon";
import {MatIconAnchor} from "@angular/material/button";

@NgModule({
  imports: [RouterModule, CommonModule, MatIcon, MatIconAnchor],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule {
}
