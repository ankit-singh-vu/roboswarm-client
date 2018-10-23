import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SwarmCreateComponent } from './pages/swarm-create/swarm-create.component';
import { LocustWebUiComponent } from './pages/locust-web-ui/locust-web-ui.component';
import { SwarmDetailComponent } from './pages/swarm-detail/swarm-detail.component';

const routes: Routes = [

    // Unauthenticated routes
    // { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },

    // Authenticated routes
    { path: 'dashboard', component: DashboardComponent },
    {
        path: 'swarm',
        children: [
            { path: 'create', component: SwarmCreateComponent },
            {
                path: ':id',
                children: [
                    { path: '', component: SwarmDetailComponent },
                    { path: 'locust-web-ui', component: LocustWebUiComponent }
                ]
            }
        ]
    },
    // { path: 'swarm/create', component: SwarmCreateComponent },
    // { path: 'swarm/:id/locust-web-ui', component: LocustWebUiComponent }
    // { path: 'logout', component: LogoutComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
