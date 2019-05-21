import { Component, ViewEncapsulation , OnDestroy} from '@angular/core';
import { DataService } from '../work.service';
declare var $: any;
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'workbenchOfGrantedSchedule',
  templateUrl: './workbenchOfGrantedSchedule.html',
  styleUrls: ['./workbenchOfGrantedSchedule.scss']
})


export class workbenchOfGrantedSchedule implements OnDestroy {
  sub1;
  public products = [];
  constructor(public dataService: DataService) { }
  public loadData() {
    this.sub1= this.dataService.getPostList().subscribe(
      res => {
        this.products = res;
        // this.createGrid();
        console.log(this.products);
      },
      error => { console.log(error) },
      () => { }
    );
    return this.sub1;
  }

  ngOnInit() {

    this.loadData();

    $(document).ready(function () {

      $('#txtTaskTime').kendoDatePicker({
        format: 'yyyy-MM-dd'
      });

      let dataElectricityUserType = [
        { text: '一般工商业用电', value: '1' },
        { text: '大工业用电', value: '2' },
        { text: '居民生活用电', value: '3' },
        { text: '农业生产用电', value: '4' }
      ];
      $('#electricityUserType').kendoDropDownList({
        dataTextField: 'text',
        dataValueField: 'value',
        optionLabel: '--选择用电类型--',
        dataSource: dataElectricityUserType,
        index: 1
      });
      $('#calendarBtn').click(function () {
        $('#calendarBox').show();
      });
      // 高度计算
      let rightheight = $('.main-c-r').height();
      let leftheight = $('.main-c-l').height();
      if (rightheight > leftheight) {
        $('.main-c-l').height(rightheight);
      } else {
        $('.main-c-r').height(leftheight);
      }
    });
    $('#calendar').kendoCalendar({
      weekNumber: true,
      month: {
        content: // '# if ($.inArray(+data.date, data.dates) != -1) { #' +
        '<div class="' +
        '# if (data.value == 24) { #' +
        'task' +
        '# } #' +
        '">#= data.value #<span>3</span></div>',
        //                 '# } else { #' +
        //                 '#= data.value #' +
        //                 '# } #',
        weekNumber: '<a class="italic">#= data.weekNumber #</a>'
      },
      footer: false,
      width: '400px'
    });





  }

  ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}
