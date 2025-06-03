import { Component } from "@angular/core";

@Component({
  selector: 'app-layout',
  template: `
    <div class="flex">
      <app-sidebar></app-sidebar>
      <div class="flex-1">
        <app-navbar></app-navbar>
        <div class="p-4">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
})
export class LayoutComponent {}
