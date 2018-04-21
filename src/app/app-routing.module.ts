import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [

    // Unauthenticated routes
    // { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },

    // Authenticated routes
    {
        path: 'dashboard', children: [
            { path: '', component: DashboardComponent },
            // { path: 'logout', component: LogoutComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
