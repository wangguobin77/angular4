import { NgModule, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../+common/header/header.module';
import { sellerinformation } from './sellerinformation/sellerinformation';
import { staffmanagement } from './staffmanagement/staffmanagement';
import { stafflist } from './staffList/stafflist';
import { jurmanage } from './jurmanage/jurmanage';
import { accountsecurity } from './accountsecurity/accountsecurity';
import { enterpriseannouncement } from './enterpriseannouncement/enterpriseannouncement';
import { newenterpriseannouncement } from './newenterpriseannouncement/newenterpriseannouncement';
import { businesshallannouncement } from './businesshallannouncement/businesshallannouncement';
import { newenterprise } from './newenterprise/newenterprise';
import { baseinfor } from './baseinfor/baseinfor';
import { LayoutModule } from '../+common/layout/layout.module';
import { newhallannouncement } from './newhallannouncement/newhallannouncement';




declare var $: any;

@Component({
    selector: 'enterprisesset',
    template: '<slidebar></slidebar><router-outlet></router-outlet>',
})
export class enterprisessetComponent {
    ngOnInit() {
        $.showMenu(1);
    }
      ngAfterViewInit(){
            //$.showSide(11001);
        }
}
const router: Routes = [
    {
        path: '',
        component: enterprisessetComponent,
        children: [

            {
                path: '',
                loadChildren: './sellerinformation/sellerinformation.module#sellerinformationModule'
            },

            {
                path: 'sellerinformation',
                loadChildren: './sellerinformation/sellerinformation.module#sellerinformationModule'
            },

            {
                path: 'staffmanagement',
                loadChildren: './staffmanagement/staffmanagement.module#staffmanagementModule'

            },

            {
                path: 'accountsecurity',
                loadChildren: './accountsecurity/accountsecurity.module#accountsecurityModule'

            },

            {
                path: 'stafflist',
                loadChildren: './staffList/stafflist.module#StafflistModule'

            },

            {
                path: 'enterpriseannouncement',
                loadChildren: './enterpriseannouncement/enterpriseannouncement.module#enterpriseannouncementModule'

            },

            {
                path: 'jurmanage',
                loadChildren: './jurmanage/jurmanage.module#jurmanageModule'

            },
            {
                path: 'editenterpriseannouncement',
                loadChildren: './editenterpriseannouncement/editenterpriseannouncement.module#editenterpriseannouncementModule'

            },
             {
                path: 'detailenter',
                loadChildren: './detailenter/detailenter.module#detailenterModule'

            }, {
                path: 'businesshallannouncement',
                loadChildren: './businesshallannouncement/businesshallannouncement.module#businesshallannouncementModule'

            }, {
                path: 'baseinfor',
                loadChildren: './baseinfor/baseinfor.module#baseinforModule'

            },

            {
                path: 'newenterpriseannouncement',
                component: newenterpriseannouncement,


            },


            {
                path: 'newenterprise',
                component: newenterprise,


            },
            {
                path: 'newhallannouncement',
                component: newhallannouncement,

            },
            {
                path: 'editoraddbusinesshallannouncement',
                loadChildren: './editoraddbusinesshallannouncement/editoraddbusinesshallannouncement.module#editoraddbusinesshallannouncementModule'

            },
        ]

    },



];
@NgModule({

    imports: [
        LayoutModule,
        CommonModule,
        FormsModule, HeaderModule, RouterModule.forChild(router)],
    declarations: [
        enterprisessetComponent, newenterpriseannouncement, newenterprise,newhallannouncement,

    ]
})
export class enterprisessetModule { }


