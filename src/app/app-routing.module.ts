import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SwarmCreateComponent } from './pages/swarm-create/swarm-create.component';
import { LocustWebUiComponent } from './pages/locust-web-ui/locust-web-ui.component';
import { SwarmDetailComponent } from './pages/swarm-detail/swarm-detail.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { BillingComponent } from './pages/billing/billing.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { SiteOwnershipVerificationComponent } from './pages/site-ownership-verification/site-ownership-verification.component';
import { SiteOwnershipVerificationAddComponent } from './pages/site-ownership-verification-add/site-ownership-verification-add.component';

const routes: Routes = [

    // Unauthenticated routes
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },

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
    {
        path: 'site-ownership-verification',
        children: [
            { path: 'add', component: SiteOwnershipVerificationAddComponent },
            { path: '', component: SiteOwnershipVerificationComponent }
        ]
    },
    { path: 'plans-and-billing', component: BillingComponent },
    { path: 'documentation', component: DocumentationComponent },

    // Home redirect.
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
