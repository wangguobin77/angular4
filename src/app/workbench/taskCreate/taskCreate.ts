import {Component,OnInit} from '@angular/core';
declare var $:any;
@Component({
  selector: 'taskCreate',
  templateUrl: './taskCreate.html',
  styleUrls:['./taskCreate.scss']
})

export class taskCreate{
    
    ngOnInit(){ 
        $(document).ready(function(){
    
    $("#txtTaskTime").kendoDatePicker({
        format: "yyyy-MM-dd"
    });
    
    var dataElectricityUserType = [
        { text: "一般工商业用电", value: "1" },
        { text: "大工业用电", value: "2" },
        { text: "居民生活用电", value: "3" },
        { text: "农业生产用电", value: "4" }
    ];
    $("#electricityUserType").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        optionLabel: "--选择用电类型--",
        dataSource: dataElectricityUserType,
        index:1
    });
    $("#calendarBtn").click(function(){
        $("#calendarBox").show();
    });
    //高度计算
    var rightheight=$(".main-c-r").height();
    var leftheight=$(".main-c-l").height();
    if(rightheight>leftheight)
    {
        $(".main-c-l").height(rightheight);
    }else{
        $(".main-c-r").height(leftheight);
    }
    })


    }
}