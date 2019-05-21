export const dataAH = [
{
    id: 102,
    parent: 1,
    name: '销售管理',
    icon: 'icon-gongwenbaoxian',
    roleRequired: 'CustomerService',
    childs: [{
        id: 10201,
        name: '业绩总览与统计',
        url: '/sale/performance/anhui/list',
        roleRequired: 'CustomerService',
    }, /*{
        id: 10202,
        name: '客户转移记录',
        url: '/',
        roleRequired: 'CustomerService',
    }*/
    ]
}, 
{
    id: 111,
    parent: 1,
    name: '报价工具',
    icon: 'icon-gongwenbaoxian',
    roleRequired: 'CustomerService',
    childs: [{
        id: 11101,
        name: '售电套餐管理',
        url: '/sale/packages',
        roleRequired: 'CustomerService',
    },
    ]
}, 
{
    id: 101,
    parent: 1,
    name: '客户档案',
    icon: 'icon-kehuguanli',
    roleRequired: 'SellerAgent,CustomerService',
    childs: [{
        id: 10101,
        name: '电力客户',
        url: '/client/anhui/list',
        roleRequired: 'SellerAgent,CustomerService',
    },
    {
        id: 10102,
        name: '客户统计分析',
        url: '/client/Performance',
        roleRequired: 'SellerAgent,CustomerService',
    }, 
    // {
    //     id: 10103,
    //     name: '客户转移记录',
    //     url: '',
    //     roleRequired: 'CustomerService',
    // }
    ]
}, 
{
    id: 105,
    parent: 1,
    name: '售电合约',
    icon: 'icon-shoudianheyueguanli',
    roleRequired: 'SellerAgent,CustomerService',
    childs: [{
        id: 10501,
        name: '售电合约管理',
        url: '/sale/contracts/anhui/list',
        roleRequired: 'SellerAgent,CustomerService',
    }, {
        id: 10502,
        name: '售电合约执行',
        url: '/sale/contractexecute/anhui/list',
        roleRequired: 'CustomerService',
    }, {
        id: 10503,
        name: '售电合约文本管理',
        url: '/sale/contractkeep/anhui/list',
        roleRequired: 'SellerAgent,CustomerService',
    }, {
        id: 10504,
        name: '售电合约统计分析',
        url: '/sale/contractkeep/anhui/report',
        roleRequired: 'SellerAgent,CustomerService',
    }
    ]
}, {
    id: 106,
    parent: 1,
    name: '购电管理',
    icon: 'icon-nengyuancaigou1',
    roleRequired: 'CustomerService,Purchaser',
    childs: [{
        id: 10601,
        name: '采购计划管理',
        url: '/purchase/plan/anhui/list',
        roleRequired: 'CustomerService',
    }, {
        id: 10602,
        name: '采购执行',
        url: '/purchase/execute/anhui/list',
        roleRequired: 'CustomerService,Purchaser',
    }, {
        id: 10603,
        name: '购电合约管理',
        url: '/purchase/contract/anhui/list',
        roleRequired: 'CustomerService,Purchaser',
    }, {
        id: 10604,
        name: '合作电厂管理',
        url: '/purchase/eFactory/list',
        roleRequired: 'CustomerService,Purchaser',
    }
    ]
}, {
    id: 107,
    parent: 1,
    name: '结算管理',
    icon: 'icon-jiesuanguanli2',
    roleRequired: 'FinancialOfficer',
    childs: [{
        id: 10701,
        name: '结算明细',
        url: '/settlement/purchase/anhui/list',
        roleRequired: 'FinancialOfficer',
    }
    ]
}, 
// {
//     id: 108,
//     parent: 1,
//     name: '能效监测',
//     icon: 'icon-nengxiaojiance',
//     roleRequired: 'RiskOfficer',
//     childs: [{
//         id: 10801,
//         name: '能耗在线监测',
//         url: '/energyefficiency/online',
//         roleRequired: 'RiskOfficer',
//     }, {
//         id: 10802,
//         name: '能耗分析',
//         url: '/energyefficiency/analyze',
//         roleRequired: 'RiskOfficer',
//     }, {
//         id: 10803,
//         name: '基础负荷预测',
//         url: '/energyefficiency/basicforecasting',
//         roleRequired: 'RiskOfficer',
//     }, {
//         id: 10804,
//         name: '高级负荷预测',
//         url: '/energyefficiency/advforecasting',
//         roleRequired: 'RiskOfficer',
//     }, {
//         id: 10805,
//         name: '偏差预警',
//         url: '/energyefficiency/departureprewarning',
//         roleRequired: 'RiskOfficer',
//     }, {
//         id: 10806,
//         name: '数据增值服务',
//         url: '/energyefficiency/service',
//         roleRequired: 'RiskOfficer',
//     }
//     ]
// }, 
// {
//     id: 103,
//     parent: 1,
//     name: '报价工具',
//     icon: 'icon-zhinengbaojia',
//     roleRequired: 'RiskOfficer',
//     childs: [{
//         id: 10301,
//         name: '报价模板',
//         url: '/',
//         roleRequired: 'RiskOfficer',
//     }, {
//         id: 10302,
//         name: '报价响应',
//         url: '/',
//         roleRequired: 'RiskOfficer',
//     }, {
//         id: 10301,
//         name: '响应历史',
//         url: '/',
//         roleRequired: 'RiskOfficer',
//     }
//     ]
// }, 
// {
//     id: 109,
//     parent: 1,
//     name: '辅助决策',
//     icon: 'icon-san',
//     roleRequired: 'RiskOfficer',
//     childs: [
//     // {
//     //     id: 10901,
//     //     name: '运营风险计算',
//     //     url: '/',
//     //     roleRequired: 'RiskOfficer',
//     // }, {
//     //     id: 10902,
//     //     name: '电价预测',
//     //     url: '/',
//     //     roleRequired: 'RiskOfficer',
//     // },
//     {
//         id: 10903,
//         name: '竞价价格预测',
//         url: '/riskManage/bid',
//         roleRequired: 'RiskOfficer',
//     }
//     ]
// }, 
{
    id: 110,
    parent: 1,
    name: '企业设置',
    icon: 'icon-iconshezhi01',
    roleRequired: 'ITAdmin',
    childs: [{
        id: 11001,
        name: '企业信息',
        url: '/enterprisesset/sellerinformation',
        roleRequired: 'ITAdmin',
    }, {
        id: 11002,
        name: '员工信息',
        url: '/enterprisesset/staffmanagement',
        roleRequired: 'ITAdmin',
    }, {
        id: 11003,
        name: '角色管理',
        url: '/enterprisesset/stafflist',
        roleRequired: 'ITAdmin',
    }, {
        id: 11004,
        name: '登录日志',
        url: '/enterprisesset/accountsecurity',
        roleRequired: 'ITAdmin',
    }, {
        id: 11005,
        name: '企业公告',
        url: '/enterprisesset/enterpriseannouncement',
        roleRequired: 'ITAdmin',
    }
    ]
}, {
    id: 104,
    parent: 1,
    name: '营业厅配置',
    icon: 'icon-yingyeting',
    roleRequired: 'ITAdmin',
    childs: [{
        id: 10401,
        name: '基础配置',
        url: '/enterprisesset/baseinfor',
        roleRequired: 'ITAdmin',
    }, {
        id: 10402,
        name: '营业厅公告',
        url: '/enterprisesset/businesshallannouncement',
        roleRequired: 'ITAdmin',
    }
    ]
}
];
