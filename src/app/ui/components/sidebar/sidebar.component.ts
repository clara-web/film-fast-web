import {Component, OnInit} from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  className: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: 'list/movie',
    title: 'Movies',
    icon: 'movie',
    className: ''
  },
  {
    path: 'list/show',
    title: 'TV Shows',
    icon: 'tv',
    className: ''
  }
];

@Component({
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public menuItems: any[] = [];

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
}
