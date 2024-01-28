import {ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle} from '@angular/router';

export class CustomRouteReuseStrategy extends BaseRouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig?.data?.reuse == true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRoutes.set(route.routeConfig?.path, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig && this.storedRoutes?.get(route.routeConfig?.path) != null;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.storedRoutes.get(route.routeConfig?.path);
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
