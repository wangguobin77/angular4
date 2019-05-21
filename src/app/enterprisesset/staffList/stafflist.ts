import { Input, Component, Output, EventEmitter, ViewEncapsulation, Injectable, OnInit,OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { AuthHttpService } from '../../+common/services/auth-http.service';
import { AuthService } from '../../+common/services/auth.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import {
    FormGroup,
    FormControl
} from '@angular/forms';
declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'stafflist',
    templateUrl: './stafflist.html',
    styleUrls: ['./stafflist.scss']
})

export class stafflist implements OnInit ,OnDestroy{
    sub1;sub2;sub3;sub4;sub5;sub6;sub7;sub8;sub9;
    // 弹框设置
    opened = false;
    // 共享数据
    share = {
        api: `${environment.sellerUserProfileApi}api/`,
        tcId: this.authService.currentTradingCenter.id,
    }

    tcs = {
        data: [],
        grid: null,
        value: this.share.tcId,
        init: () => {
            this.tcs.data = this.authService.currentSeller.tradingCenters;
        },
        change: () => {
            this.tcs.grid.dataSource.filter('');
        }
    };

    // 分配角色
    allot = {
        data: { un: [], has: [] },
        roleId: null,
        rolename: null,
        rolefname:null,
        isSaler: true,
        checked: {
            un: false,
            has: false
        },
        unSelected: [],
        hasSelected: [],
        selectedUn: [],
        selectedHas: [],
        terminalCount: null,
        filterKey: {
            un: null,
            has: null
        },
        isSellerAgent: () => {
            return this.allot.rolename === 'SellerAgent';
        },
        switch: (isSaler) => {
            this.allot.isSaler = isSaler;
            this.allot.init();
        },
        filter: (v) => {
            if (v === 0) {
                if (this.allot.filterKey.un != null) {
                    this.allot.unSelected = this.allot.data.un.filter(item => {
                        return item.fullName.indexOf(this.allot.filterKey.un) > -1 || item.userName.indexOf(this.allot.filterKey.un) > -1;
                    });
                } else {
                    this.allot.unSelected = this.allot.data.un;
                }
            } else {
                if (this.allot.filterKey.has != null) {
                    this.allot.hasSelected = this.allot.data.has.filter(item => {
                        return item.fullName.indexOf(this.allot.filterKey.has) > -1 || item.userName.indexOf(this.allot.filterKey.has) > -1;
                    });
                } else {
                    this.allot.hasSelected = this.allot.data.has;
                }
            }
            this.allot.selectedUn.length = 0;
            this.allot.selectedHas.length = 0;
        },
        init: () => {
            const req = this.allot.rolename + '%23' + this.tcs.value;
            if (this.allot.isSaler) {
                this.sub1=this.authService.AuthGet(`${this.share.api}UserRoles/GetNoSelectedRoles/${req}`).subscribe(res => {
                    const data = res.json().data;
                    this.allot.unSelected = data;
                    this.allot.data.un = data;
                    this.allot.selectedUn.length = 0;
                });
                this.sub2=this.authService.AuthGet(`${this.share.api}UserRoles/GetSelectedRoles/${req}`).subscribe(res => {
                    const data = res.json().data;
                    this.allot.hasSelected = data;
                    this.allot.data.has = data;
                    this.allot.selectedHas.length = 0;
                });
            } else {
                this.sub3=this.authService.AuthGet(`${this.share.api}UserRoles/AlterCount`).subscribe(res => {
                    this.allot.terminalCount = res.text();
                });
                this.sub4=this.authService.AuthGet(`${this.share.api}UserRoles/GetSelectedRoles/${req}`).subscribe(res => {
                    const data = res.json().data;
                    this.allot.unSelected = data;
                    this.allot.data.un = data;
                    this.allot.selectedUn.length = 0;
                });
                this.sub5=this.authService.AuthGet(`${this.share.api}UserRoles/GetAdmeasureSales`).subscribe(res => {
                    const data = res.json().data;
                    this.allot.hasSelected = data;
                    this.allot.data.has = data;
                    this.allot.selectedHas.length = 0;
                });
            }
        },
        select: (item, ele, t) => {
            const data = t === 0 ? this.allot.selectedUn : this.allot.selectedHas;
            if (ele.target.checked) {
                data.push(item);
            } else {
                if (t === 0) {
                    this.allot.selectedUn = data.filter(m => {
                        return m.userId !== item.userId;
                    });
                } else {
                    this.allot.selectedHas = data.filter(m => {
                        return m.userId !== item.userId;
                    });
                }
            }
        },
        selectAll: (t) => {
            if (t === 0) {
                if (this.allot.checked.un) {
                    this.allot.selectedUn = this.allot.unSelected;
                } else {
                    this.allot.selectedUn = [];
                }
            } else {
                if (this.allot.checked.has) {
                    this.allot.selectedHas = this.allot.hasSelected;
                } else {
                    this.allot.selectedHas = [];
                }
            }
        },
        add: () => {
            const req = {
                addOrRemove: 'Add',
                roleName: this.allot.rolename + '#' + this.tcs.value,
                roleId: this.allot.roleId,
                idToAdd: this.allot.selectedUn.map(item => {
                    return item.userId;
                }),
                idToDelete: null
            };
            if (req.idToAdd.length !== 0) {

                if (this.allot.isSaler) {
                    this.sub6=this.authService.AuthPost(`${this.share.api}UserRoles/AddOrRemove/`, req).subscribe(res => {
                        this.allot.init();
                    });
                } else {
                    const isExist = req.idToAdd.some(id => {
                        return this.allot.hasSelected.some(has => {
                            return has.userId === id;
                        });
                    });
                    if (isExist) {
                        // alert('此员工已分配销售工具');
                        return;
                    }
                    this.sub7=this.authService.AuthPost(`${this.share.api}UserRoles/InsertAdmeasureSales/`,
                        { userIdLsit: req.idToAdd }).subscribe(res => {
                            this.allot.init();
                        });
                }
            }
        },
        remove: () => {
            const req = {
                addOrRemove: 'Remove',
                roleName: this.allot.rolename + '#' + this.tcs.value,
                roleId: this.allot.roleId,
                idToAdd: null,
                idToDelete: this.allot.selectedHas.map(item => {
                    return item.userId;
                })
            };
            if (req.idToDelete.length !== 0) {
                this.sub8=this.authService.AuthPost(`${this.share.api}UserRoles/AddOrRemove/`, req).subscribe(res => {
                    this.allot.init();
                });
            }
        }
    }
    public datas = {};

    close(v) {
        this.opened = false;
    }
    constructor(private authService: AuthService, private http: Http) { }

    ngOnInit() {
        $.showSide(11003);
        let the = this;
        let api = this.share.api;
        // environment.sellerUserProfileApi+"api";

        this.tcs.init();

        // 角色列表
        this.tcs.grid = $('#grid').kendoGrid({
            dataSource: {
                transport: {
                    read: function (f) {
                        const paras = new RequestOptions();
                        const url = `${api}UserRoles/GetRoleUsersCount/${the.tcs.value}`;
                        this.sub9=the.authService.AuthGet(url).subscribe((res) => {
                            const result = res.json();
                            this.datas = result.data;
                            f.success(result);
                        });
                    }
                },
                serverFiltering: true
            },
            pageable: false,
            noRecords: true,
            messages: {
                noRecords: '暂无角色数据'
            },
            columns: [
                { field: 'roleId', hidden: true },
                { field: 'formatName', title: '角色',width:'15%' },
                { field: 'number', title: ' 授权数', width:'15%' },
                { field: 'roleLimits', title: ' 权限',width:'30%'},
                { field: 'roleDes', title: ' 说明',width:'30%' },
                {
                    command: [
                        {
                            name: 'edit', text: '分配',
                            click: function (e, d) {
                                e.preventDefault();
                                const item = this.dataItem($(e.currentTarget).closest('tr'));
                                the.opened = true;
                                the.allot.roleId = item.roleId;
                                the.allot.rolename = item.name;
                                the.allot.rolefname = item.formatName;
                                the.allot.init();
                            }
                        },
                    ], title: '操作', width: '10%'
                }],
        }).data('kendoGrid');
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe();}
        if (this.sub6 !== undefined && this.sub6 !== null) { this.sub6.unsubscribe();}
        if (this.sub7 !== undefined && this.sub7 !== null) { this.sub7.unsubscribe();}
        if (this.sub8 !== undefined && this.sub8 !== null) { this.sub8.unsubscribe();}
        if (this.sub9 !== undefined && this.sub9 !== null) { this.sub9.unsubscribe();}
    }
}
