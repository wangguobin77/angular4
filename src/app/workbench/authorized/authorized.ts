import { Component, OnInit, ViewEncapsulation, Injectable, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../+common/services/auth.service';
import { AuthHttpService } from '../../+common/services/auth-http.service';
import { DataService } from '../work.service';
import { State } from '@progress/kendo-data-query';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../../environments/environment';


declare var $: any;
declare var kendo: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'authorized',
    templateUrl: './authorized.html',
    styleUrls: ['./sb.scss']
})


export class AuthorizedComponent implements OnInit, OnDestroy {
    sub1;
    sub2;
    sub3;
    sub4;
    sub5;
    sub6;
    sub7;
    sub8;

    public data = {};
    public items = [];
    public messages = [];
    public htdata = {};
    public nydata = {};
    public kht = {};
    public workdata = {};
    public show=false;
    rolenames = '';

    share = {
        tcpy: this.authService.currentTradingCenter == null ? null : this.authService.currentTradingCenter.pingYin,
        apiCrm: environment.sellerUserProfileApi + 'api/',

    };

    vRole = {
        data: [
            { role: 'ITAdmin', funs: [] },
            { role: 'SellerAgent', funs: [100, 102, 201, 202] },
            { role: 'CustomerService', funs: [100, 102, 103, 107, 201, 202, 203] },
            { role: 'Purchaser', funs: [105] },
            { role: 'RiskOfficer', funs: [101, 104, 204] },
            { role: 'FinancialOfficer', funs: [106] }
        ],
        funs: [],
        getCurrent: () => {
            return (this.authService.currentUser.profile.evsroles as string).split(',');
        },
        hasFun: (id) => {
            return this.vRole.funs.indexOf(id) > -1;
        },
        init: () => {
            const data = this.vRole.data;
            const curs = <Array<string>>this.vRole.getCurrent();
            for (let kCur = 0; kCur < curs.length; kCur++) {
                for (let kCole = 0; kCole < data.length; kCole++) {
                    if (curs[kCur].indexOf(data[kCole].role) > -1) {
                        this.vRole.funs = this.vRole.funs.concat(data[kCole].funs);
                        break;
                    }
                }
            }
        },
        getUrl:(url,id)=>{
            return this.vRole.hasFun(id)?url:'';
        },
        url: {
            createCustomer: this.share.tcpy=='shanxi'?`/client/${this.share.tcpy}/build/0`:`/client/${this.share.tcpy}/build`,
            createContract: `/sale/contracts/${this.share.tcpy}/create`,
            createPurchasePlan: `/purchase/plan/${this.share.tcpy}/create`,
            bidRespone: ``,
            listCustomer: `/client/${this.share.tcpy}`,
            listContract: `/sale/contracts/${this.share.tcpy}/list`,
            listPurchasePlan: `/purchase/plan/${this.share.tcpy}/list`,
            listPurchaseExec: `/purchase/execute/${this.share.tcpy}/list`,
            listContractExec: `/sale/contractexecute/${this.share.tcpy}/list`,
            bidSmart : ``,
            bidForecast: `/riskManage/bid`,
            listSettlement: `/settlement/purchase/${this.share.tcpy}/list`,
        }
    };

    task = {
        data: [],
        dates: [],
        customers: [],
        init: () => {
            for (let i = 0; i < 24 * 30 * 2; i += 30) {
                this.task.dates.push(kendo.toString(new Date(new Date(2017, 1, 1).setMinutes(i)), 'HH:mm'));
            }

            this.sub8 = this.authService.AuthGet(`${this.share.apiCrm}WorkbenchUser/GetCustomers`).subscribe(res => {
                this.task.customers = res.json();
            });
        }
    }

    constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute) {

    }

    // 点击消息进入详情
        doclick(e,item){
            e.preventDefault();
            console.log(item);
            let id = item.id;
            let type = item.type;
            this.router.navigate([`/messageDetail`,id,type]);
        }
    ngOnInit() {
        $.showMenu(0);

        this.vRole.init();
        this.task.init();

        const the = this;
        const url = `api/WorkbenchUser/GetUserInfo/`;
        const totalurl = `${environment.sellerUserProfileApi}${url}`;

        the.sub1 = this.authService.AuthGet(totalurl).subscribe((res) => {
            const result = res.json();
            this.data = result;
            this.items = result.roles;
            this.messages = result.announcements;
            for(let i=0;i<this.items.length;i++){
                if(i==this.items.length-1){
                    the.rolenames +=(this.items[i].nameCN);
                }else{
                    the.rolenames +=(this.items[i].nameCN+',');
                }
            }
            // console.log( this.messages.length);
            if (this.messages.length >= 3) {
                this.messages.length = 3;
                return (this.messages.length);
            }

        });

        // GET合约管理api
        const urlsaleht = `api/WorkbenchContract/GetContractManage `;
        const totalurlht = `${environment.sellerContractApi}${urlsaleht}`;
        the.sub2 = this.authService.AuthGet(totalurlht).subscribe((res) => {
            this.htdata = res.json();

        });

        // 能源管理
        const urlht = `api/WorkbenchContract/GetPurchasePlan `;
        const totalny = `${environment.sellerContractApi}${urlht}`;
        the.sub3 = this.authService.AuthGet(totalny).subscribe((res) => {
            this.nydata = res.json();

        });
        // 客户管理
        const urlkht = `api/WorkbenchContract/GetCustomerManage `;
        const totalkh = `${environment.sellerContractApi}${urlkht}`;
        the.sub4 = this.authService.AuthGet(totalkh).subscribe((res) => {
            this.kht = res.json();
        });
        // 最新工作台信息
        const urlWorkbenchInfo = `api/WorkbenchContract/GetWorkbenchModuleinfo`;
        const totalWorkbench = `${environment.sellerContractApi}${urlWorkbenchInfo}`;
        the.sub5 = this.authService.AuthGet(totalWorkbench).subscribe((res) => {
            this.workdata = res.json();
        });

        $('#calendar').kendoCalendar({
            value: new Date(),
            weekNumber: false,
            month: {
                content: '<div class="task">#= data.value #</div>',
                weekNumber: '<a class="italic">#= data.weekNumber #</a>'
            },
            footer: false,
            width: '400px',
            navigate: function () {
                console.log(this);

                // var tasks = [{ date: "2017/03/14", amount: 3 }, { date: "2017/3/24", amount: 2 }, { date: "2017/2/24", amount: 2 }];
                const currentDate = kendo.toString(this.current(), 'yyyy/MM/dd');

                the.sub6 = the.authService.AuthGet(`${the.share.apiCrm}WorkbenchUser/GetTaskCount/`, { date: currentDate })
                    .subscribe(res => {
                        const tasks = res.json();
                        if (tasks.length === 0) { return false; }
                        $('#calendar').find('td[role=gridcell]').each(function () {
                            const $this = $(this);
                            const sDate = $this.find('a').attr('title').replace(/[年月]/g, '/').replace('日', '');
                            const date = new Date(sDate);
                            // date.setMonth(date.getMonth() + 1);
                            $.each(tasks, function (i, item) {
                                if (+new Date(item.date) === +date) {
                                    $this.find('div.task').append('<span>' + item.amount + '</span>');
                                    $this.find('a').attr('href', '/workbench/tasks/' + kendo.toString(date, 'yyyy-MM-dd'));
                                    return false;
                                }
                            });
                            if ($this.find('a').attr('href') === '#') {
                                $this.find('a').attr('href', '/workbench/tasks/' + kendo.toString(date, 'yyyy-MM-dd'));
                            }
                        });
                    });
            }
        });

        $('#spTaskAdd').click(function () {
            $('#divTaskAdd').show();
        });

        $('a.cancel-button,span.pop-del').click(function () {
            $(this).closest('div.popup-cart').hide();
        });

        $('#txtTaskTime').kendoDatePicker({
            format: 'yyyy-MM-dd'
        });

        const nameChecker = $('#txtTaskName').TChecker({
            required: { rule: true, error: '请输入任务名称' }
        });
        const timeChecker = $('#txtTaskTime').TChecker({
            ele: '#tsTaskTime',
            required: { rule: true, error: '请选择任务时间' }
        });









        $('#divTaskAdd').find('a.confirm-button').click(function () {
            if (!nameChecker.check()) { return false; }
            if (!timeChecker.check()) { return false; }
            const model = {
                Title: $('#txtTaskName').val(),
                TaskLevel: $('#ckbLevel:checked').val(),
                TaskTime: $('#txtTaskTime').val() + ' ' + $('#selTime').val(),
                SellerSubjectId: $('#selCustomer').val(),
                Description: $('#txtDescription').val()
            };
            if (model.TaskLevel === undefined) { model.TaskLevel = 0; }
            if (model.SellerSubjectId === '0') { model.SellerSubjectId = null; }

            the.sub7 = the.authService.AuthPost(`${the.share.apiCrm}WorkbenchUser/AddTask`, model).subscribe((res) => {
                const result = res.json();
                if (result.result) {
                    // alert('创建成功');
                    $('#divTaskAdd').hide();
                    const calendar = $('#calendar').data('kendoCalendar');
                    calendar.navigate();
                } else {
                    return;
                }

            });

            return false;
        });

    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe(); }
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe(); }
        if (this.sub6 !== undefined && this.sub6 !== null) { this.sub6.unsubscribe(); }
        if (this.sub7 !== undefined && this.sub7 !== null) { this.sub7.unsubscribe(); }
        if (this.sub8 !== undefined && this.sub8 !== null) { this.sub8.unsubscribe(); }
    }
}
