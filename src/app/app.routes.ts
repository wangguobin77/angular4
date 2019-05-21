import { Routes } from '@angular/router';
import { AppStore } from './+common/constants/appstore';
import { AuthService } from './+common/services/auth.service';
import { AuthGuardService } from './+common/services/auth-guard.service';
import { AuthHttpService } from './+common/services/auth-http.service';
import { RoleGuardService } from './+common/services/role-guard.service';
import { TCGuardService } from './+common/services/tc-guard.service';
import { AppGuardService } from './+common/services/app-guard.service';

export const shareRouter: Routes =
    [
        {
            path: '',
            loadChildren: './workbench/workbench.module#workbenchModule',
            canActivate: [AuthGuardService/*,RoleGuardService,TCGuardService,AppGuardService*/],
            data: {
                authorizedRoles: [
                    'ITAdmin',
                    'Traders',
                    'SellerAgent',
                    'RiskOfficer',
                    'CompanyManager',
                    'PricingOfficer',
                    'Supervisor',
                    'CustomerCare',
                    'FinancialOfficer',
                    'CustomerService',
                    'SalesDirector'
                ],
                enabledApplications: [
                    AppStore.Applications.BasicSet.Workbench.Id
                ],
                enabledTradingCenters: [
                    AppStore.Applications.TradingCenters.AnHui.Id,
                    AppStore.Applications.TradingCenters.GhuangDong.Id,
                    AppStore.Applications.TradingCenters.ShanXi.Id
                ]
            }
        },
        {
            path: 'auth',
            loadChildren: './auth/auth.module#AuthModule'
        },
        {
            path: 'silent-renew',
            loadChildren: './auth/silent-renew.module#SilentRenewModule'
        },
        {
            path: 'authcode',
            loadChildren: './authcode/authcode.module#AuthCodeModule'
        },
        {
            path: 'logout',
            loadChildren: './auth/logout.module#LogoutModule'
        },
        {
            path: 'helpers',
            loadChildren: './account/helpers/helpers.module#HelpersModule',
            canActivate: [AuthGuardService]
        },
        {
            path: 'workbench',
            loadChildren: './workbench/workbench.module#workbenchModule',
            canActivate: [AuthGuardService]
        },
        {
            path: 'workbench/unauthorized',
            loadChildren: './workbench/unauthorized/unauthorized',
            canActivate: [AuthGuardService]
        }, {
            path: 'workbench/authorized',
            loadChildren: './workbench/authorized/authorized',
            canActivate: [AuthGuardService]
        },
        {
            path: 'workbench/messageDetail',
            loadChildren: './workbench/messageDetail/messageDetail',
            canActivate: [AuthGuardService]
        }, {
            path: 'workbench/messagelist',
            loadChildren: './workbench/messagelist/messagelist',
            canActivate: [AuthGuardService]
        },
    ];

/*export const rootRouterConfig: Routes = [
    {
        path: 'store',
        loadChildren: './store/store.module#StoreModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'enterprisesset',
        loadChildren: './enterprisesset/enterprisesset.module#enterprisessetModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'client',
        loadChildren: './client/client.module#ClientModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'park',
        loadChildren: './park/park.module#ParkModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'myaccount',
        loadChildren: './account/settings/settings.module#SettingsModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'sale/contracts',
        loadChildren: './sale/contracts/contracts.module#ContractsModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'purchase/plan',
        loadChildren: './purchase/plan/plan.module#PlanModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'purchase/execute',
        loadChildren: './purchase/execute/execute.module#ExecuteModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'purchase/contract',
        loadChildren: './purchase/contract/contract.module#PurchaseContractModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'purchase/eFactory',
        loadChildren: './purchase/electricityFactory/electricityFactory.module#PurchaseElectricityFactoryModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'settlement/purchase',
        loadChildren: './settlement/purchase/purchase.module#PurchaseModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'settlement/sale',
        loadChildren: './settlement/sale/sale.module#SaleModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'sale/contractexecute',
        loadChildren: './sale/contractExecute/contractExecute.module#ContractExecuteModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'enterpriseinfo',
        loadChildren: './enterpriseinfo/enterpriseinfo.module#enterpriseinfoModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'energyefficiency',
        loadChildren: './energyefficiency/energyefficiency.module#EnergyEfficiencyModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'sale/contractkeep',
        loadChildren: './sale/contractKeep/contractKeep.module#ContractKeepModule',
        canActivate: [AuthGuardService]
    },
    {
        //   风险管理
        path: 'riskManage',
        loadChildren: './riskManage/riskManage.module#RiskManageModule',
        canActivate: [AuthGuardService]
    },
    {
        // 业绩总览与统计(销售)
        path: 'sale/performance',
        loadChildren: './sale/performance/performance.module#PerformanceModule',
        canActivate: [AuthGuardService]
    },
    {
        path: 'sale/packages',
        loadChildren: './sale/packages/packages.module#PackagesModule',
        canActivate: [AuthGuardService]
    },
];*/


export const rootRouterConfig: Routes = [
     {
        path: 'client',
        loadChildren: './client/client.module#ClientModule',
        canActivate: [AuthGuardService]
    },




]