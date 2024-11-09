import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:'',
        redirectTo:'products-list',
        pathMatch:'full'
    },
    {
        path:'products-list',
        loadComponent:()=>import('./product-management/product-management.component').then((c)=>c.ProductManagementComponent)
    }
];
