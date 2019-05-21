import { NgModule, OnInit, AfterViewInit, Component } from '@angular/core';
import { sampleProducts } from '../../../assets/script/product';
declare var $: any;
declare var kendo: any;

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.scss']
})
export class OnlineComponent implements OnInit {
    gridData:any[] = sampleProducts;
  constructor() { }

  ngOnInit() {

    var gridElement = $("#grid")
var pagingIncrement = 20;
var scrollbarWidth = kendo.support.scrollbar();
var dataBindingFlag = true;


 var series = [{
    name: "历史负荷",
    data: [56000, 63000, 74000, 91000, 117000, 138000],
    type:null,
    // Line chart marker type
    markers: { type: "circle" },
    color:"#3399ff"
}];
var categories = [2016.01,2016.02,2016.03,2016.04,2016.05,2016.06];
 var seriesT = [{
    name: "历史负荷",
    data: [56000, 63000, 74000, 91000, 117000, 138000,56000, 63000, 74000, 91000, 117000, 138000,56000, 63000, 74000, 91000, 117000, 138000,56000, 63000, 74000, 91000, 117000, 138000],
    markers: { visible: false },
    // Line chart marker type
    type:null,
    color:"#3399ff"
}];
var categoriesT = [2016.01,2016.02,2016.03,2016.04,2016.05,2016.06,2016.07,2016.08,2016.09,2016.10,2016.11,2016.12,2017.01,2017.02,2017.03,2017.04,2017.05,2017.06,2017.07,2017.08,2017.09,2017.10,2017.11,2017.12];

function createChart() {
    // $("#chart").kendoChart({
    //     legend: {
    //         position: "top",
    //         labels:{
    //             template:kendo.template($("#labels").html())
    //         }
    //     },
    //     seriesDefaults: {
    //         type: "line"
    //     },
    //     series: series,
    //     valueAxis: {
    //         line: {
    //             visible: true
    //         },
    //         title: { text: "负荷/kw" ,font: "12px sans-serif",position:"top",rotation: 0,margin:{top:-30,right:-70}}
    //     },
    //     categoryAxis: {
    //         categories: categories,
    //         majorGridLines: {
    //             visible: false
    //         },
    //         step:4,
    //         autoBaseUnitSteps: {
    //             days: [3]
    //         },
    //         title: {
    //           text: "时间",
    //           font:"12px sans-serif",
    //           position:"right",
    //           margin:{
    //                top:-16
    //           }
    //         }
    //     },
    //     // tooltip: {
    //     //     visible: true,
    //     //     template: "#: value#"
    //     //   }
    //     tooltip: {
    //         visible: true,
    //         background:"#fff",
    //         shared: true,
    //         color:"#333",
    //         border: {
    //           width: 0,
    //         },
    //         sharedTemplate:kendo.template($("#template").html())
    //         //sharedTemplate: "<div><p><span class='color-9'>时间：</span>#: category # </p><p><span class='color-9'>用电量：</span> #: value #万千瓦时</p></div>"
    //     }
    // });
}
function createSmallChart() {
    // $("#chartSmall").kendoChart({
    //     // title: {
    //     //     text: "Site Visitors Stats /thousands/"
    //     // },
    //     legend: {
    //         visible: false,
    //         position: "top"
    //     },
    //     seriesDefaults: {
    //         type: "line"
    //     },
    //     series: seriesT,
    //     valueAxis: {
    //         visible: false,
    //         majorGridLines: {
    //          visible: false
    //        }
    //     },
    //     categoryAxis: {
    //         categories: categoriesT,
    //         majorGridLines: {
    //             visible: false
    //         },
    //         select: {
    //             from: 0,
    //             to: 6
    //         }
    //     },
    //     selectEnd: onSelectEnd
    // });
}

function onSelectEnd(e) {
    // e.form  e.to e.axis.categories
    var v = e.to,j = e.from;
    var m = v-j;
    categories = [];
    for(var k = 0;k < series.length;k ++){
    	series[k].data = [];
	    for(var i = 0;i < m;i ++){
	        series[k].data.push(seriesT[k].data[j+i]);
	    }
    }
    for(var i = 0;i < m;i ++){
        categories.push(categoriesT[j+i]);
    }
    createChart();
    
}
var echartType = "line";
$(document).ready(function() {
    createChart();
    createSmallChart();
    $(document).bind("kendo:skinChange", createChart);
    $(".options").bind("change", refresh);
});

function refresh() {
    var chart = $("#chart").data("kendoChart"),
        chartSmall = $("#chartSmall").data("kendoChart"),
        type = echartType;

    for (var i = 0, length = series.length; i < length; i++) {
        series[i].type = type;
        seriesT[i].type = type;
    };

    // chart.setOptions({
    //     series: series
    // });
    chartSmall.setOptions({
        seriesT: seriesT
    });
}
$(window).resize(function(){
    refresh();
})

$(document).on("click",".changeType",function(){
    echartType = $(this).data("type");
    refresh();
    $(this).addClass("active").siblings(".changeType").removeClass("active");
})
$(".export-pdf").click(function() {
    $("#chart").getKendoChart().exportImage().done(function(data) {
        kendo.saveAs({
            dataURI: data,
            fileName: "chart.png"
        });
    });
});

function onOK(){
  
}
// var dialog = $("#dialog");
// var addNew = '<div class="text-center dialog-box">'
//                     +'<img src="/images/pic-okla.png" class="pd-b20">'
//                     +'<div>申请续费成功，请联系企业管理员进行购买</div>'
//               +'</div>'
// dialog.kendoDialog({
//     width: "450px",
//     title: "提示",
//     closable: true,
//     modal: false,
//     visible: false,
//     content: addNew,
//     actions: [
//         { text: '确认', primary: true, action: onOK,className:"a-button"}
//     ]
// });
// $(document).on("click",".renew",function(){
//     dialog.data("kendoDialog").open();
// })



$("#saveTable").click(function() {
    // Convert the DOM element to a drawing using kendo.drawing.drawDOM
    kendo.drawing.drawDOM($(".table-c"))
    .then(function(group) {
        // Render the result as a PNG image
        return kendo.drawing.exportImage(group);
    })
    .done(function(data) {
        // Save the image file
        kendo.saveAs({
            dataURI: data,
            fileName: "HR-Dashboard.png",
            proxyURL: "//demos.telerik.com/kendo-ui/service/export"
        });
    });
});
  }

}
