import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SwarmCreateComponent } from './pages/swarm-create/swarm-create.component';
import { SwarmDetailComponent } from './pages/swarm-detail/swarm-detail.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { BillingComponent } from './pages/billing/billing.component';
import { SiteOwnershipVerificationComponent } from './pages/site-ownership-verification/site-ownership-verification.component';
import { SiteOwnershipVerificationAddComponent } from './pages/site-ownership-verification-add/site-ownership-verification-add.component';
import { TemplatesComponent} from './pages/templates/templates.component';
import { TemplatesAddEditComponent } from './pages/templates-add-edit/templates-add-edit.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { WooCommerceTemplateComponent } from './pages/woo-commerce-template/woo-commerce-template.component';
import { WooTemplateAddEditComponent } from './pages/woo-template-add-edit/woo-template-add-edit.component';
import { TemplateFlowComponent } from './pages/template-flow/template-flow.component';

const routes: Routes = [

    // Unauthenticated routes
    { path: 'auth', children: [
        { path: 'register', component: RegisterComponent },
        { path: 'login', component: LoginComponent },
        { path: 'logout', component: LogoutComponent },
        { path: 'password-reset', children: [
            { path: '', component: PasswordResetComponent },
            { path: ':id', component: ChangePasswordComponent }
        ]}
    ]},

    // Authenticated routes
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: FooterComponent, outlet: 'header' },
            { path: '', component: NavigationComponent, outlet: 'footer' },
            { path: '', component: DashboardComponent },
            {
                path: 'swarm',
                children: [
                    { path: 'create', component: SwarmCreateComponent },
                    {
                        path: ':id',
                        children: [
                            { path: '', component: SwarmDetailComponent },
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
            {
                path: 'template',
                children: [
                    {
                        path: 'edit',
                        children: [
                            { path: ':id', component: TemplatesAddEditComponent }
                        ]
                    },
                    { path: 'add', component: TemplateFlowComponent },
                    { path: '', component: TemplatesComponent }
                ]
            },
            {
                path: 'woocommerce-template',
                children: [
                    {
                        path: 'edit',
                        children: [
                            { path: ':id', component: WooTemplateAddEditComponent }
                        ]
                    },
                    { path: 'add', component: WooTemplateAddEditComponent },
                    { path: '', component: WooCommerceTemplateComponent }
                ]
            },
            { path: 'plans-and-billing', component: BillingComponent },
        ]
    },

    // Home redirect.
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false, relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
