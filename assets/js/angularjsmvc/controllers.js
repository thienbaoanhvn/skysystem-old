/*
 *  Document   : controllers.js
 *  Author     : Anh tran
 *  Description: controllers for pages
   (F R U) (R� U� F')
 * (R U) (R� U) (R U2) R� 
   (R U R' F') (R U R' U') (R' F) (R2 U') (R' U')
   (R2 U)(R U R' U')(R' U')(R' U R') | (R U' R U)(R U)(R U')(R' U' R2)
   
   r2 B2 U2 l U2 r' U2 r U2 F2 r F2 l' B2 r2
  
 */
// 9704366812950132013 07/17 
//================================== Dashboard Content Controller==========================================================
App.controller('DashboardCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDashboard");
        set_date_time($scope, '7');
        $scope.loadData = function() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            } else {                
                getDataInforSale(fromdate, todate);
                getData(fromdate, todate, "all", "total_daily_sale","total");
              /*  getData(fromdate, todate, "0", "daily_sale_customer");
                getData(fromdate, todate, "7", "daily_sale_wholesaler");
                getData(fromdate, todate, "10", "daily_sale_shoppe");
                getData(fromdate, todate, "66", "daily_sale_shoppe_hince");
                getData(fromdate, todate, "46", "daily_sale_bbiavn");                
                getData(fromdate, todate, "64", "daily_sale_hince");
                getData(fromdate, todate, "22", "daily_sale_eglips_wholesaler");
                getData(fromdate, todate, "20", "daily_sale_lazada");
                getData(fromdate, todate, "68", "daily_sale_lazada_hince");
                getData(fromdate, todate, "36", "daily_sale_tiki");
                getData(fromdate, todate, "48", "daily_sale_mixsoon");           
                getData(fromdate, todate, "70", "daily_sale_tiktok_hince");
                getData(fromdate, todate, "52", "daily_sale_shopee_mixsoon");
                getData(fromdate, todate, "54", "daily_sale_lazada_mixsoon");
                getData(fromdate, todate, "58", "daily_sale_tiktok_sky007");
                getData(fromdate, todate, "60", "daily_sale_tiktok_mixsoon");*/
               
            }


        };
        //////////////////////////////////////////////////////////////////////////////////////////////////
        // liblary function
        //generate date 
       
        function generate_date(start, end) {
            var datesArray = [];
            var startDate = new Date(start);
            var endDate = new Date(end);
            while (startDate <= endDate) {
                // var curr = year + "-" + month + "-" + day;
                var newdate = new Date(startDate);
                var year = newdate.getFullYear();
                var month = ("0" + (newdate.getMonth() + 1)).slice(-2);
                var day = ("0" + newdate.getDate()).slice(-2);
                var curr = year + "-" + month + "-" + day;
                datesArray.push(curr);
                startDate.setDate(startDate.getDate() + 1);
            }
            return datesArray;
        }
        // Get data info
        function getDataInforSale(fromdate, todate) {
            var dataSent = {
                fromdate: fromdate,
                todate: todate
            };
            $http({
                method: "POST",
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_dashboard_get_info_sale",
                dataType: 'json',
                data: dataSent
            }).then(function mySucces(response) {
                var data = response["data"];

                var total_order = data["total_order"][0]["total_order"];
                var product_sale = data["product_sale"][0]["qty"];
                var total_money = data["total_money"][0]["total_money"];
                //  console.log(data["total_order"]);
                $scope.txt_total_order = total_order;
                $scope.txt_total_item_sale = product_sale;
                $scope.txt_total_money = total_money;
            }, function myError(response) {

            });
        }
        // Get data from database
        function getData(fromdate, todate, category, idchart,brand_name) {
            $scope.model_from_to_date = "(" + fromdate + " ~ " + todate + ")";
            var dataSent = {
                fromdate: fromdate,
                todate: todate,
                category: category
            };
            $http({
                method: "POST",
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_dashboard_get_data_chart",
                dataType: 'json',
                data: dataSent
            }).then(function mySucces(response) {
                var data = response["data"];
                var arr_category =[""]
               // console.log(data); //return;
              if(category=="all"){               
                get_data_report_forchart(fromdate, todate, data, category, idchart);               
                
              }else{              
            //    get_data_report_forchart_by_brand(fromdate, todate, data, category, idchart,brand_name);
              }
                
                // console.log(response);
            }, function myError(response) {

            });
        }
        // prepare data for chart
        function get_data_report_forchart(fromdate, todate, data, category, idchart) {

            if (data.length > 0) {
              //  var arr_date = generate_date(fromdate, todate);
                var arr_bbia = [];
                var arr_mixsoon = [];
                var arr_hince = [];
                var arr_date= [];
                for (var i = 0; i < data.length; i++) {
                    arr_bbia.push(parseInt(data[i]["bbia"]))
                    arr_mixsoon.push(parseInt(data[i]["mixsoon"]))
                    arr_hince.push(parseInt(data[i]["hince"]))
                    arr_date.push(data[i]["time"])
                    
                }

               /* for (var i = 0; i < arr_date.length; i++) {
                    var real_time = arr_date[i];
                
                  
                    for (var j = 0; j < data.length; j++) {
                        var sale_time = data[j]["time"];
                        var caregory = data[j]['category'];
                        if (real_time == sale_time && caregory == "1") {
                            flag_hince = "true";
                            index_hince = j;
                        } else if (real_time == sale_time && caregory == "0") {
                            flag_bbia = "true";
                            index_bbia = j;
                        } else if (real_time == sale_time && caregory == "2") {
                            flag_mixsoon = "true";
                            index_mixsoon = j;
                        }

                    }
                    if (flag_mixsoon == "false") {
                        arr_mixsoon.push(0);
                    } else if (flag_mixsoon == "true") {
                        var tprice = parseInt(data[index_mixsoon]['total_price']);
                        arr_mixsoon.push(tprice);
                    }
                    if (flag_bbia == "false") {
                        arr_bbia.push(0);
                    } else if (flag_bbia == "true") {
                        var tprice = parseInt(data[index_bbia]['total_price']);
                        arr_bbia.push(tprice);
                    }
                    if (flag_hince == "false") {
                        arr_hince.push(0);
                    } else if (flag_hince == "true") {
                        var tprice = parseInt(data[index_hince]['total_price']);
                        arr_hince.push(tprice);
                    }

                }*/
                set_graph(arr_date, arr_bbia, arr_mixsoon, arr_hince, idchart);
            }
        }

        function set_graph(dataarray, bbia, mixsoon, hince, idchart) {
            $('#' + idchart).highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: dataarray
                },
                yAxis: {
                    title: {
                        text: 'Total Price (vnd)'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                      //  enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'Bbia',
                    data: bbia
                }, {
                    name: 'Mixsoon',
                    data: mixsoon
                }, {
                    name: 'Hince',
                    data: hince
                }]
            });

        }

        //////////////////////////////////////////////////
        
         function get_data_report_forchart_by_brand(fromdate, todate, data, category, idchart,brand_name) {

            if (data.length > 0) {
                var arr_date = generate_date(fromdate, todate);
                var arr_data = [];  
                for (var i = 0; i < arr_date.length; i++) {
                    var real_time = arr_date[i];
                    var flag_data = "false";
             
                    var index_data= 0;
              
                    for (var j = 0; j < data.length; j++) { 
                         var sale_time = data[j]["time"];
                        if (real_time == sale_time) {
                            flag_data = "true";
                            index_data = j;
                        }
                       
                    }
                    if (flag_data == "false") {
                        arr_data.push(0);
                    } else if (flag_data == "true") {
                        var tprice = parseInt(data[index_data]['total_price']);
                        arr_data.push(tprice);
                    }
                           

                }
              //  console.log(arr_date);
                set_graph_data(arr_date,arr_data, idchart,brand_name);
            }
        }

        function set_graph_data(dataarray, arr_data, idchart,brand_name) {
            $('#' + idchart).highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: dataarray
                },
                yAxis: {
                    title: {
                        text: 'Total Price (vnd)'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },                       
                    }
                },
                series: [{
                    name: brand_name,
                    data: arr_data
                }]
            });

        }

    }
]);

//====================== End Dashboard Content Controller================================================================== 

//====================== Chart Report ===================================================================================== 


//============================ Customer ================================== 
App.controller('RCCustomerCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkCRCustomer");
        set_date_time($scope, '7');
        $scope.loadData = function() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            } else {
                getData(fromdate, todate, "all", "total_customer");
               // getData(fromdate, todate, "time", "customer_by_time");
              
            }


        };
        // Get data from database
        function getData(fromdate, todate, category, idchart) {
            var dataSent = {
                fromdate: fromdate,
                todate: todate,
                category: category
            };
            $http({
                method: "POST",
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_customer",
                dataType: 'json',
                data: dataSent
            }).then(function mySucces(response) {
                var data_total = response["data"]["data_total"];
                var data_by_time = response["data"]["data_by_time"];              
                var arr_by_time = [];
                var arr_total = [];    
              //  console.log(data_total)   ;             
                for (var i = 0; i < data_total.length; i++) {
                    var shop_type = data_total[i]["shop"];
                   
                    var oder_number = parseInt(data_total[i]["total_user"]);
                //    total_number+=oder_number;
                    var obj_item = {
                        "name": shop_type,
                        "y": oder_number
                    };
                    arr_total.push(obj_item);
                }                    
                chart_column_single("total_customer", arr_total, "Number register", "Shop Type", " User", "");
                //-----------------------
                for (var i = 0; i < data_by_time.length; i++) {
                    var shop_type = data_by_time[i]["shop"];
                   
                    var oder_number = parseInt(data_by_time[i]["total_user"]);
                //    total_number+=oder_number;
                    var obj_item = {
                        "name": shop_type,
                        "y": oder_number
                    };
                    arr_by_time.push(obj_item);
                }                    
                chart_column_single("customer_by_time", arr_by_time, "Number register", "Shop Type", " User", "");
            }, function myError(response) {

            });
        }

    }
]);

//============================ Category ==================================

App.controller('RCCategoryCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkCRCategory");
        set_date_time($scope, '7');
        $scope.loadData = function() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            } else {
                getData(fromdate, todate, "all", "total_categories_sale");
                getData(fromdate, todate, "0", "categories_sale_customer");
                getData(fromdate, todate, "7", "categories_sale_wholesaler");
                getData(fromdate, todate, "10", "categories_sale_shoppe");
                getData(fromdate, todate, "24", "categories_sale_shoppe_eglips");
                getData(fromdate, todate, "14", "categories_sale_lotte");
                getData(fromdate, todate, "16", "categories_sale_sendo");               
                getData(fromdate, todate, "18", "categories_sale_eglips");
                getData(fromdate, todate, "22", "categories_sale_eglips_wholesaler");
                getData(fromdate, todate, "20", "categories_sale_lazada");
                getData(fromdate, todate, "26", "categories_sale_lazada_eglips");
                getData(fromdate, todate, "30", "categories_sale_watsons");
                getData(fromdate, todate, "34", "categories_sale_beautybox");
                getData(fromdate, todate, "36", "categories_sale_tiki");
                getData(fromdate, todate, "38", "categories_sale_shopee_c2c");
                getData(fromdate, todate, "40", "categories_sale_lazada_c2c");
                getData(fromdate, todate, "42", "categories_sale_tiki_eglips");
            }


        };
        // Get data from database
        function getData(fromdate, todate, category, idchart) {
            var dataSent = {
                fromdate: fromdate,
                todate: todate,
                category: category
            };
            $http({
                method: "POST",
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_category",
                dataType: 'json',
                data: dataSent
            }).then(function mySucces(response) {
                var data = response["data"]["data_main"];
                var data_drilldown = response["data"]["data_drilldown"];
                var m_data = [];
                var drill_data = [];
                //order_item_name category  qty
                for (var i = 0; i < data.length; i++) {
                    var m_category = data[i]["category"];
                    var m_qty = parseInt(data[i]["qty"]);
                    var m_each_data = {
                        "name": m_category,
                        "y": m_qty,
                        "drilldown": m_category
                    }
                    m_data.push(m_each_data);
                    var drill_value = [];
                    for (var j = 0; j < data_drilldown.length; j++) {

                        if (m_category == data_drilldown[j]["category"]) {
                            var drill_each_data = [];
                            drill_each_data.push(data_drilldown[j]["order_item_name"]);
                            drill_each_data.push(parseInt(data_drilldown[j]["qty"]));
                            drill_value.push(drill_each_data);

                        }
                    }
                    drill_data.push({
                        "name": m_category,
                        "id": m_category,
                        "data": drill_value
                    });
                }
                chart_column_drilldown(idchart, m_data, drill_data);
            }, function myError(response) {

            });
        }

    }
]);

//============================ End Category ==============================

//============================ Location ==================================

App.controller('RCLocationCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkCRLocation");
        set_date_time($scope, '7');
        $scope.loadData = function() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            } else {
                 $("#divEachshop").show();
                 $("#divCompare").hide();
                 $("#div_barchart").hide();
                 load_each_shop(fromdate,todate);
               
            }
        }
        $("#btnCompare").click(function(){
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            } else {            
             var location_report= $('#duallistbox_location').val();
             if(location_report==null){
                alert("Please choose province .");
             }else{   
                load_data_compare(fromdate,todate);     
             }
            }             
               
        })
        function filter_data(from_date, to_date, shop_sale, id_chart, y_label, series_name, end_label) {
            var obj = {
                "fromdate": from_date,
                "todate": to_date,
                "shop_sale": shop_sale
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_location",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                    var arr_data = [];
                    for (var i = 0; i < data.length; i++) {
                        var city = data[i]["city"];
                        var qty = parseInt(data[i]["qty"]);
                        var obj_item = {
                            "name": city,
                            "y": qty
                        };
                        arr_data.push(obj_item);
                    }
                    chart_column_single(id_chart, arr_data, y_label, series_name, end_label, "");
                },
                error: function(e) {
                    alert(e);
                }
            }); 

        }
        function load_each_shop(fromdate,todate){
            filter_data(fromdate, todate, "all", "location_sale", "Number Order", "Location", "order");
            filter_data(fromdate, todate, "0", "location_sale_customer", "Number Order", "Location", "order");
            filter_data(fromdate, todate, "7", "location_sale_wholesaler", "Number Order", "Location", "order");
            filter_data(fromdate, todate, "10", "location_sale_shoppe", "Number Order", "Location", "order");
            filter_data(fromdate, todate, "24", "location_sale_shopee_eglips", "Number Order", "Location", "order");   
            filter_data(fromdate, todate, "18", "location_sale_eglips", "Number Order", "Location", "order");
            filter_data(fromdate, todate, "22", "location_sale_eglips_wholesaler", "Number Order", "Location", "order");
            filter_data(fromdate, todate, "20", "location_sale_lazada", "Number Order", "Location", "order");
            filter_data(fromdate, todate, "26", "location_sale_lazada_eglips", "Number Order", "Location", "order");
            filter_data(fromdate, todate, "46", "location_sale_bbiavn", "Number Order", "Location", "order");
            filter_data(fromdate, todate, "48", "location_sale_mixsoon", "Number Order", "Location", "order");
            
          
        } 
        $("#cboLocationType").change(function(){
            var cbovalue=$("#cboLocationType").val();
            if(cbovalue==0){
                $("#divEachshop").show();
                $("#divCompare").hide();
                $("#btnSearch").show();
               
            }else if(cbovalue==1){
                $("#divEachshop").hide();
                $("#divCompare").show();
                $("#btnSearch").hide();
                $("#div_barchart").hide();
                //load_data_compare();
            }
        })
        $("#cboChart").change(function(){
             var cbovalue=$("#cboChart").val();
            if(cbovalue==0){
                 $("#div_linechart").show();
                 $("#div_barchart").hide();
                 $("#btnCompare").show();
            }else{
                $("#div_linechart").hide();
                $("#div_barchart").show();
                $("#btnCompare").hide();
            }
        })
        function load_data_compare(fromdate,todate){
             var list_location=$("#duallistbox_location").val();
            var obj = {
                "fromdate": fromdate,
                "todate": todate,
                "list_location":list_location
            };
           $("#btnCompare").text("Big Data Please Wait ..");
           $("#btnCompare").attr("disabled", true);
         
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_location_compare",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   // console.log(d);return;
                    var data = $.parseJSON(d);
                    var data_total=data["location_total"];
                    var data_sky007=data["location_sky007"];
                    var data_shopee=data["location_shopee"];
                    var data_lazada=data["location_lazada"];
                    var data_eglips=data["location_eglips"];
                    
                    
                    
                    var st = new Date(fromdate);
                    var sm = st.getMonth();
                    var et = new Date(todate);
                    var em = et.getMonth();
                    var sy = st.getFullYear();
                    var ey = et.getFullYear();
    
                    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    var arr_date = [];
                    var arr_date_char = [];
                    
                    var arr_total = [];
                    var arr_sky007 = [];
                    var arr_shopee = [];
                    var arr_lazada = [];
                    var arr_eglips = [];
                    if (sy == ey) {
                        for (var i = sm; i <= em; i++) {
                            arr_date.push(i);
                            arr_date_char.push(monthNames[i]);   
                        }
                                                   
                   
                    }else{
                        for (var i = sm; i <= 11; i++) {
                            arr_date.push((i + 1) + "_" + sy);
                            arr_date_char.push(monthNames[i] + "(" + sy + ")");
                        }
                        for (var i = 0; i <= em; i++) {
                            arr_date.push((i + 1) + "_" + ey);
                            arr_date_char.push(monthNames[i] + "(" + ey + ")");
                        }
                    }                  
                    for( var i=0;i<list_location.length;i++ ){
                            var province=list_location[i];   
                            var arr_list_qty_total=[];
                            var arr_list_qty_sky007=[];
                            var arr_list_qty_shopee=[];
                            var arr_list_qty_lazada=[];
                            var arr_list_qty_eglips=[];                         
                            for(var j=0;j<arr_date.length;j++){
                                var date_month=arr_date[j];                               
                                var qty_order_total=0;
                                var qty_order_sky007=0;
                                var qty_order_shopee=0;
                                var qty_order_lazada=0;
                                var qty_order_eglips=0;
                                //-------------total-----------------------------------------------------------
                                for(var k=0;k<data_total.length;k++){
                                    var province_total=data_total[k]["city"];
                                   
                                    var date_month_total="";
                                    if (sy == ey) {
                                         date_month_total=parseInt(data_total[k]["date_month"]) -1;
                                    }else{
                                         date_month_total=data_total[k]["date_month"];
                                    }
                                    if(province==province_total && date_month==date_month_total){                                     
                                        qty_order_total = parseInt(data_total[k]["qty"]);                                       
                                    }
                                } 
                                arr_list_qty_total.push(qty_order_total);
                                //-------------sky007-----------------------------------------------------------
                                for(var k=0;k<data_sky007.length;k++){
                                    var province_sky007=data_sky007[k]["city"];
                                    var date_month_sky007="";
                                    if (sy == ey) {
                                         date_month_sky007=parseInt(data_sky007[k]["date_month"]) -1;
                                    }else{
                                         date_month_sky007=data_sky007[k]["date_month"];
                                    }
                                    
                                    if(province==province_sky007 && date_month==date_month_sky007){                                     
                                        qty_order_sky007 = parseInt(data_sky007[k]["qty"]);                                       
                                    }
                                } 
                                arr_list_qty_sky007.push(qty_order_sky007);
                                //-------------shopee-----------------------------------------------------------
                                for(var k=0;k<data_shopee.length;k++){
                                    var province_shopee=data_shopee[k]["city"];
                                   
                                    var date_month_shopee="";
                                    if (sy == ey) {
                                         date_month_shopee=parseInt(data_shopee[k]["date_month"]) -1;
                                    }else{
                                         date_month_shopee=data_shopee[k]["date_month"];
                                    }
                                    if(province==province_shopee && date_month==date_month_shopee){                                     
                                        qty_order_shopee = parseInt(data_shopee[k]["qty"]);                                       
                                    }
                                } 
                                arr_list_qty_shopee.push(qty_order_shopee);
                                //-------------lazada-----------------------------------------------------------
                                for(var k=0;k<data_lazada.length;k++){
                                    var province_lazada=data_lazada[k]["city"];
                                   
                                    var date_month_lazada="";
                                    if (sy == ey) {
                                         date_month_lazada=parseInt(data_lazada[k]["date_month"]) -1;
                                    }else{
                                         date_month_lazada=data_lazada[k]["date_month"];
                                    }
                                    if(province==province_lazada && date_month==date_month_lazada){                                     
                                        qty_order_lazada = parseInt(data_lazada[k]["qty"]);                                       
                                    }
                                } 
                                arr_list_qty_lazada.push(qty_order_lazada);
                                //-------------eglips-----------------------------------------------------------
                                for(var k=0;k<data_eglips.length;k++){
                                    var province_eglips=data_eglips[k]["city"];
                                   
                                    var date_month_eglips="";
                                    if (sy == ey) {
                                         date_month_eglips=parseInt(data_eglips[k]["date_month"]) -1;
                                    }else{
                                         date_month_eglips=data_eglips[k]["date_month"];
                                    }
                                    if(province==province_eglips && date_month==date_month_eglips){                                     
                                        qty_order_eglips = parseInt(data_eglips[k]["qty"]);                                       
                                    }
                                } 
                                arr_list_qty_eglips.push(qty_order_eglips);
                                
                            }
                            //-------------total-----------------------------------------------------------
                            var obj_qty_total={"name":province,"data":arr_list_qty_total};
                            arr_total.push(obj_qty_total);
                            //-------------sky007-----------------------------------------------------------
                            var obj_qty_sky007={"name":province,"data":arr_list_qty_sky007};
                            arr_sky007.push(obj_qty_sky007);
                            //-------------shopee-----------------------------------------------------------
                            var obj_qty_shopee={"name":province,"data":arr_list_qty_shopee};
                            arr_shopee.push(obj_qty_shopee);
                            //-------------lazada-----------------------------------------------------------
                            var obj_qty_lazada={"name":province,"data":arr_list_qty_lazada};
                            arr_lazada.push(obj_qty_lazada);
                            //-------------eglips-----------------------------------------------------------
                            var obj_qty_eglips={"name":province,"data":arr_list_qty_eglips};
                            arr_eglips.push(obj_qty_eglips);                          
                        } 
                        linechart_location(arr_date_char,arr_total,"location_total","","Total Order");
                        linechart_location(arr_date_char,arr_sky007,"location_sky007","","Total Order");
                        linechart_location(arr_date_char,arr_shopee,"location_shopee","","Total Order");
                        linechart_location(arr_date_char,arr_lazada,"location_lazada","","Total Order");
                        linechart_location(arr_date_char,arr_eglips,"location_eglips","","Total Order");
                        $("#btnCompare").text("Compare");
                        $("#btnCompare").removeAttr("disabled");
                       // console.log(arr_total);
                
                },
                error: function(e) {
                    alert(e);
                }
            });
        }
    $("#btnCompareRate").click(function(){
        var fromdate = $scope.txtfromdate;
        var todate = $scope.txttodate;
        fromdate = formatDate(fromdate);
        todate = formatDate(todate);
        if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
            alert("Please check date .");
            return;
        } else {            
         var location_report= $('#duallistbox_location').val();
         if(location_report==null){
            alert("Please choose province .");
         }else{   
             load_data_rate(fromdate,todate);    
         }
        }
           
    });
    function load_data_rate(fromdate,todate){
        var shop_sale = $("#cboShopSale").val();
        var list_location=$("#duallistbox_location").val();  
            var obj_rate = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shop_sale,
                "list_location":list_location
            };  
             $("#btnCompareRate").text("Loading Big Data Please Wait.");
             $("#btnCompareRate").attr("disabled",true);
             
             $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_location_compare",
                type: "POST",
                data: {
                    "obj": obj_rate
                },
                success: function(d) {
                    //console.log(d);return;
                    var data_obj = $.parseJSON(d);
                    var data = data_obj["list_main_area"];
                    var data_total = data_obj["list_total"];
                   // console.log(data_total);
                        //-------------------------rate------------------
                        var st = new Date(fromdate);
                        var sm = st.getMonth();
                        var et = new Date(todate);
                        var em = et.getMonth();
                        var sy = st.getFullYear();
                        var ey = et.getFullYear();
        
                        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        var arr_date = [];
                        var arr_date_char = [];
                        
                        var arr_total = [];
                        var arr_sky007 = [];
                        var arr_shopee = [];
                        var arr_lazada = [];
                        var arr_eglips = [];
                        if (sy == ey) {
                            for (var i = sm; i <= em; i++) {
                                arr_date.push(i);
                                arr_date_char.push(monthNames[i]);   
                            }
                                                       
                       
                        }else{
                            for (var i = sm; i <= 11; i++) {
                                arr_date.push((i + 1) + "_" + sy);
                                arr_date_char.push(monthNames[i] + "_" + sy);
                            }
                            for (var i = 0; i <= em; i++) {
                                arr_date.push((i + 1) + "_" + ey);
                                arr_date_char.push(monthNames[i] + "_" + ey);
                            }
                        }  
                        var arr_data=[];
                        for(var i=0;i<list_location.length;i++)   {
                           var province=list_location[i];                           
                           var arr_data_province=[];  
                           for(var k=0;k<arr_date_char.length;k++){
                            var m_date_name=arr_date_char[k];
                            var qty=0;
                                for(var j=0;j<data.length;j++){
                                    var obj_province_name="";
                                    var province_name=data[j]["city"];
                                    var mdate=data[j]["date_month"];                                                               
                                    if(province==province_name && m_date_name==mdate){
                                        qty=parseInt(data[j]["qty"]);                                         
                                    }
                                }
                                arr_data_province.push(qty);
                           }                     
                           var obj_data_arr={"name":province,"data":arr_data_province};
                           arr_data.push(obj_data_arr);
                        }
                        //-----------------------------------
                       
                        var arr_data_total_province=[];
                        for(var i=0;i<arr_date_char.length;i++){                          
                             var total_qty_area=0;
                             var qty_total=0;
                             var date_month=arr_date_char[i];
                             for(var j=0;j<data.length;j++){
                                var date_month_area=data[j]["date_month"];
                                var qty_area=parseInt(data[j]["qty"]);
                                if(date_month==date_month_area){
                                    total_qty_area+=qty_area;
                                }
                             }
                             for(var k=0;k<data_total.length;k++){
                                var date_month_total=data_total[k]["date_month"];
                                if(date_month==date_month_total){
                                    qty_total=parseInt(data_total[k]["qty"]);
                                }                                
                             }                            
                             arr_data_total_province.push((qty_total-total_qty_area))                         
                        }
                         var obj_data_arr_other={"name":"Other","data":arr_data_total_province};
                         arr_data.push(obj_data_arr_other);
                       //  console.log(obj_data_arr_other);                    
                        //-----------------------------------
                        $('#location_city_compare').highcharts({
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                categories: arr_date_char
                            },
                            yAxis: {
                                title: {
                                    text: 'Total Order '
                                }
                            ,
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: ( // theme
                                        Highcharts.defaultOptions.title.style &&
                                        Highcharts.defaultOptions.title.style.color
                                    ) || 'gray'
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{point.x}</b><br/>',
                            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                            shared: true
                           //pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        },
                            series: arr_data
                        });
                   
                        $('#location_city_compare_rate').highcharts({
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                categories: arr_date_char
                            },
                            yAxis: {
                                title: {
                                    text: 'Total Order '
                                }
                            ,
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: ( // theme
                                        Highcharts.defaultOptions.title.style &&
                                        Highcharts.defaultOptions.title.style.color
                                    ) || 'gray'
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b><b>{point.x}</b><br/>',
                            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                            shared: true
                           //pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                        },
                        plotOptions: {
                            series: {
                            stacking: 'percent',
                            dataLabels: {
                                enabled: true,
                                style: {
                                    color: 'black'
                                },
                                formatter: function () {                       
            
                                    return  this.percentage.toFixed(0) + '%';
                                }
                            }
            }
                        },
                            series: arr_data
                        });
                        $("#btnCompareRate").text("Compare");
                        $("#btnCompareRate").removeAttr("disabled");
                        //------------------------- End rate------------------
                    
                },
                error: function(e) {
                    alert(e);
                }
        });
    }
  }      
]);
//============================ End Location ===============================

//============================ Items ======================================

App.controller('RCItemsCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {

        var index_page = 1;
        var number_navigation = 0;
        var data_top_sale = "";       
        var data_private_list_name="";        
        //load_navigation($compile,$scope);
        checkCookie($scope);
        limit_permisstion_menu("chkCRItems");
        set_date_time($scope, '7');
        var number_items_show = 0;
        $("#navigation_top_sale").hide();
        $.session.remove("list_item_search");
        load_list_item();

        function load_navigation($compile, $scope) {
            $("#navigation_best_sale").empty();
            var navigation_space = '<li class="disabled">\
                                     <a href="javascript:void(0)">...</a>\
                                  </li>';
            var navigation_top = '';
            var navigation_center = '';
            var naviagation_bottom = '';
            // number_navigation=9;
            var html = "";
            ///////////////////////////////
            // first load navigation
            if (number_navigation > 8) {
                html = '<nav>\
                                <ul class="pagination pagination-lg">\
                                    <li id="btn_navigation_previous" ng-click="navigation_previous_next(\'previous\')" class="previous disabled">\
                                        <a href="javascript:void(0)">Previous</a>\
                                    </li>\
                                    <li class="active" id="n_body_1"  ng-click="navigation_body(1)">\
                                        <a href="javascript:void(0)">1</a>\
                                    </li>\
                                    <li id="n_body_2"  ng-click="navigation_body(2)">\
                                        <a href="javascript:void(0)">2</a>\
                                    </li>\
                                    <li id="n_body_3"  ng-click="navigation_body(3)">\
                                        <a href="javascript:void(0)">3</a>\
                                    </li>\
                                    <li id="n_body_4" ng-click="navigation_body(4)">\
                                        <a href="javascript:void(0)">4</a>\
                                    </li>\
                                    <li id="n_body_5" ng-click="navigation_body(5)">\
                                        <a href="javascript:void(0)">5</a>\
                                    </li>\
                                    ' + navigation_space + '\
                                    <li id="n_body_' + number_navigation + '" ng-click="navigation_body(' + number_navigation + ')">\
                                        <a href="javascript:void(0)">' + number_navigation + '</a>\
                                    </li>\
                                    <li id="btn_navigation_next" ng-click="navigation_previous_next(\'next\')" class="next">\
                                        <a href="javascript:void(0)">Next</a>\
                                    </li>\
                                </ul>\
                            </nav>';

            } else {
                if (number_navigation > 1) {
                    for (var i = 2; i <= number_navigation; i++) { // i=1 we create with active class
                        navigation_top += ' <li id="n_body_' + i + '" ng-click="navigation_body(' + i + ')">\
                                            <a href="javascript:void(0)">' + i + '</a>\
                                          </li>'
                    }
                    html = '<nav>\
                                        <ul class="pagination pagination-lg">\
                                           <li id="btn_navigation_previous" id="btn_navigation_previous" ng-click="navigation_previous_next(\'previous\')" class="previous disabled">\
                                                <a href="javascript:void(0)">Previous</a>\
                                            </li>\
                                            <li id="n_body_1" class="active " ng-click="navigation_body(1)"">\
                                                <a href="javascript:void(0)">1</a>\
                                            </li>\
                                           ' + navigation_top + '\
                                           <li  id="btn_navigation_next" ng-click="navigation_previous_next(\'next\')" class="next">\
                                                <a href="javascript:void(0)">Next</a>\
                                           </li>\
                                        </ul>\
                                    </nav>';
                } else {
                    html = '<nav>\
                            <ul class="pagination pagination-lg">\
                                 <li class="active">\
                                      <a href="javascript:void(0)">1</a>\
                                 </li>\
                            </ul>\
                          </nav>';
                }


            }
            ///////////////////////////////          
            $("#navigation_best_sale").append($compile(html)($scope));
        }
        $scope.navigation_previous_next = function(even_action) {
            // index_page  
            if (even_action == "previous") {
                if (index_page != 1) {
                    index_page--;
                }
            } else {
                if (index_page != number_navigation) {
                    index_page++;
                }
            }
            if (number_navigation > 8) {
                var navigation_space = '<li class="disabled">\
                                         <a href="javascript:void(0)">...</a>\
                                      </li>';
                // var minb=parseInt(index_page)-3;
                var maxb = index_page + 3;
                if (index_page < 5) {
                    $("#navigation_best_sale").empty();
                    var html = '<nav>\
                                <ul class="pagination pagination-lg">\
                                    <li id="btn_navigation_previous" ng-click="navigation_previous_next(\'previous\')" class="previous disabled">\
                                        <a href="javascript:void(0)">Previous</a>\
                                    </li>\
                                    <li  id="n_body_1"  ng-click="navigation_body(1)">\
                                        <a href="javascript:void(0)">1</a>\
                                    </li>\
                                    <li id="n_body_2"  ng-click="navigation_body(2)">\
                                        <a href="javascript:void(0)">2</a>\
                                    </li>\
                                    <li id="n_body_3"  ng-click="navigation_body(3)">\
                                        <a href="javascript:void(0)">3</a>\
                                    </li>\
                                    <li id="n_body_4" ng-click="navigation_body(4)">\
                                        <a href="javascript:void(0)">4</a>\
                                    </li>\
                                    <li id="n_body_5" ng-click="navigation_body(5)">\
                                        <a href="javascript:void(0)">5</a>\
                                    </li>\
                                    ' + navigation_space + '\
                                    <li id="n_body_' + number_navigation + '" ng-click="navigation_body(' + number_navigation + ')">\
                                        <a href="javascript:void(0)">' + number_navigation + '</a>\
                                    </li>\
                                    <li id="btn_navigation_next" ng-click="navigation_previous_next(\'next\')" class="next">\
                                        <a href="javascript:void(0)">Next</a>\
                                    </li>\
                                </ul>\
                            </nav>';
                    $("#navigation_best_sale").append($compile(html)($scope));
                }
                if ((index_page >= 5) && (maxb >= number_navigation)) {
                    $("#navigation_best_sale").empty();
                    var html = '<nav>\
                                <ul class="pagination pagination-lg">\
                                    <li id="btn_navigation_previous" ng-click="navigation_previous_next(\'previous\')" class="previous disabled">\
                                        <a href="javascript:void(0)">Previous</a>\
                                    </li>\
                                    <li  id="n_body_1"  ng-click="navigation_body(1)">\
                                        <a href="javascript:void(0)">1</a>\
                                    </li>\
                                    ' + navigation_space + '\
                                    <li id="n_body_' + (number_navigation - 4) + '"  ng-click="navigation_body(' + (number_navigation - 4) + ')">\
                                        <a href="javascript:void(0)">' + (number_navigation - 4) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (number_navigation - 3) + '"  ng-click="navigation_body(' + (number_navigation - 3) + ')">\
                                        <a href="javascript:void(0)">' + (number_navigation - 3) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (number_navigation - 2) + '" ng-click="navigation_body(' + (number_navigation - 2) + ')">\
                                        <a href="javascript:void(0)">' + (number_navigation - 2) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (number_navigation - 1) + '" ng-click="navigation_body(' + (number_navigation - 1) + ')">\
                                        <a href="javascript:void(0)">' + (number_navigation - 1) + '</a>\
                                    </li>\
                                    <li id="n_body_' + number_navigation + '" ng-click="navigation_body(' + number_navigation + ')">\
                                        <a href="javascript:void(0)">' + number_navigation + '</a>\
                                    </li>\
                                    <li id="btn_navigation_next" ng-click="navigation_previous_next(\'next\')" class="next">\
                                        <a href="javascript:void(0)">Next</a>\
                                    </li>\
                                </ul>\
                            </nav>';
                    $("#navigation_best_sale").append($compile(html)($scope));
                }
                if ((index_page >= 5) && (maxb < number_navigation)) {
                    $("#navigation_best_sale").empty();
                    var html = '<nav>\
                                <ul class="pagination pagination-lg">\
                                    <li id="btn_navigation_previous" ng-click="navigation_previous_next(\'previous\')" class="previous disabled">\
                                        <a href="javascript:void(0)">Previous</a>\
                                    </li>\
                                    <li  id="n_body_1"  ng-click="navigation_body(1)">\
                                        <a href="javascript:void(0)">1</a>\
                                    </li>\
                                    ' + navigation_space + '\
                                    <li id="n_body_' + (index_page - 1) + '"  ng-click="navigation_body(' + (index_page - 1) + ')">\
                                        <a href="javascript:void(0)">' + (index_page - 1) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (index_page) + '"  ng-click="navigation_body(' + (index_page) + ')">\
                                        <a href="javascript:void(0)">' + (index_page) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (index_page + 1) + '" ng-click="navigation_body(' + (index_page + 1) + ')">\
                                        <a href="javascript:void(0)">' + (index_page + 1) + '</a>\
                                    </li>\
                                     ' + navigation_space + '\
                                    <li id="n_body_' + number_navigation + '" ng-click="navigation_body(' + number_navigation + ')">\
                                        <a href="javascript:void(0)">' + number_navigation + '</a>\
                                    </li>\
                                    <li id="btn_navigation_next" ng-click="navigation_previous_next(\'next\')" class="next">\
                                        <a href="javascript:void(0)">Next</a>\
                                    </li>\
                                </ul>\
                            </nav>';
                    $("#navigation_best_sale").append($compile(html)($scope));
                }
            }


            $('#navigation_best_sale li').removeClass('active');
            $("#n_body_" + index_page + "").addClass('active');
            if (index_page == number_navigation) {
                $("#btn_navigation_next").addClass('disabled');
            } else {
                $("#btn_navigation_next").removeClass('disabled');
            }

            if (index_page == "1") {
                $("#btn_navigation_previous").addClass('disabled');
            } else {
                $("#btn_navigation_previous").removeClass('disabled');
            }
            var name_shop_sale = $('#cboShopSaleTop option:selected').text();
            var objdata_20item_hancarry = [];
            var objdata_20item_regular = [];
            var objdata_20item="";
            var list_name_20item=[];
            if (index_page != 1 && index_page != number_navigation) {
                //var length_item= data_top_sale.length;
                var start_item = (index_page * 20) - 20;
                var end_item = (index_page * 20);
                for (var i = start_item; i < end_item; i++) { 
                    var arr_data_handcarry=data_top_sale[0];  // 0: handcarry , 1: regular
                    var arr_data_regular=data_top_sale[1];
                    var data_handcarry=arr_data_handcarry["data"][i];
                    var data_regular=arr_data_regular["data"][i];
                    var product_name=data_private_list_name[i];
                    objdata_20item_hancarry.push(data_handcarry);
                    objdata_20item_regular.push(data_regular);
                    list_name_20item.push(product_name);
                }
                objdata_20item=[
                                    {
                                       data: objdata_20item_hancarry,
                                       name:"Hand carry"
                                    },
                                    {
                                       data: objdata_20item_regular,
                                       name:"Regular"
                                    }                
               ];

            } else {
                if (index_page == 1) {
                    for (var i = 0; i < 20; i++) {                
                        
                        var arr_data_handcarry=data_top_sale[0];  // 0: handcarry , 1: regular
                        var arr_data_regular=data_top_sale[1];
                        var data_handcarry=arr_data_handcarry["data"][i];
                        var data_regular=arr_data_regular["data"][i];
                        var product_name=data_private_list_name[i];
                        objdata_20item_hancarry.push(data_handcarry);
                        objdata_20item_regular.push(data_regular);
                        list_name_20item.push(product_name);    
                    }
                    objdata_20item=[
                                    {
                                       data: objdata_20item_hancarry,
                                       name:"Hand carry"
                                    },
                                    {
                                       data: objdata_20item_regular,
                                       name:"Regular"
                                    }                
               ];
                } else if (index_page == number_navigation) {
                    var start_item = (index_page * 20) - 20;
                    for (var i = start_item; i < data_top_sale.length; i++) {
                        var arr_data_handcarry=data_top_sale[0];  // 0: handcarry , 1: regular
                        var arr_data_regular=data_top_sale[1];
                        var data_handcarry=arr_data_handcarry["data"][i];
                        var data_regular=arr_data_regular["data"][i];
                        var product_name=data_private_list_name[i];
                        objdata_20item_hancarry.push(data_handcarry);
                        objdata_20item_regular.push(data_regular);
                        list_name_20item.push(product_name);
                    }
                    objdata_20item=[
                                    {
                                       data: objdata_20item_hancarry,
                                       name:"Hand carry"
                                    },
                                    {
                                       data: objdata_20item_regular,
                                       name:"Regular"
                                    }                
                                   ];
                }
            }

           // chart_column_single("chart_top_sale", objdata_20item, "Number Item Order", "Number Item Sale", "item", "Top Item Best Sale(" + name_shop_sale + ")")
            chart_column_single_chart_report_item(objdata_20item,list_name_20item);

            // alert(index_page);
        }
        $scope.navigation_body = function(current_index) {

            index_page = current_index;
            if (number_navigation > 8) {
                var navigation_space = '<li class="disabled">\
                                         <a href="javascript:void(0)">...</a>\
                                      </li>';
                // var minb=parseInt(index_page)-3;
                var maxb = index_page + 3;
                if (index_page < 5) {
                    $("#navigation_best_sale").empty();
                    var html = '<nav>\
                                <ul class="pagination pagination-lg">\
                                    <li id="btn_navigation_previous" ng-click="navigation_previous_next(\'previous\')" class="previous disabled">\
                                        <a href="javascript:void(0)">Previous</a>\
                                    </li>\
                                    <li  id="n_body_1"  ng-click="navigation_body(1)">\
                                        <a href="javascript:void(0)">1</a>\
                                    </li>\
                                    <li id="n_body_2"  ng-click="navigation_body(2)">\
                                        <a href="javascript:void(0)">2</a>\
                                    </li>\
                                    <li id="n_body_3"  ng-click="navigation_body(3)">\
                                        <a href="javascript:void(0)">3</a>\
                                    </li>\
                                    <li id="n_body_4" ng-click="navigation_body(4)">\
                                        <a href="javascript:void(0)">4</a>\
                                    </li>\
                                    <li id="n_body_5" ng-click="navigation_body(5)">\
                                        <a href="javascript:void(0)">5</a>\
                                    </li>\
                                    ' + navigation_space + '\
                                    <li id="n_body_' + number_navigation + '" ng-click="navigation_body(' + number_navigation + ')">\
                                        <a href="javascript:void(0)">' + number_navigation + '</a>\
                                    </li>\
                                    <li id="btn_navigation_next" ng-click="navigation_previous_next(\'next\')" class="next">\
                                        <a href="javascript:void(0)">Next</a>\
                                    </li>\
                                </ul>\
                            </nav>';
                    $("#navigation_best_sale").append($compile(html)($scope));
                }
                if ((index_page >= 5) && (maxb >= number_navigation)) {
                    $("#navigation_best_sale").empty();
                    var html = '<nav>\
                                <ul class="pagination pagination-lg">\
                                    <li id="btn_navigation_previous" ng-click="navigation_previous_next(\'previous\')" class="previous disabled">\
                                        <a href="javascript:void(0)">Previous</a>\
                                    </li>\
                                    <li  id="n_body_1"  ng-click="navigation_body(1)">\
                                        <a href="javascript:void(0)">1</a>\
                                    </li>\
                                    ' + navigation_space + '\
                                    <li id="n_body_' + (number_navigation - 4) + '"  ng-click="navigation_body(' + (number_navigation - 4) + ')">\
                                        <a href="javascript:void(0)">' + (number_navigation - 4) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (number_navigation - 3) + '"  ng-click="navigation_body(' + (number_navigation - 3) + ')">\
                                        <a href="javascript:void(0)">' + (number_navigation - 3) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (number_navigation - 2) + '" ng-click="navigation_body(' + (number_navigation - 2) + ')">\
                                        <a href="javascript:void(0)">' + (number_navigation - 2) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (number_navigation - 1) + '" ng-click="navigation_body(' + (number_navigation - 1) + ')">\
                                        <a href="javascript:void(0)">' + (number_navigation - 1) + '</a>\
                                    </li>\
                                    <li id="n_body_' + number_navigation + '" ng-click="navigation_body(' + number_navigation + ')">\
                                        <a href="javascript:void(0)">' + number_navigation + '</a>\
                                    </li>\
                                    <li id="btn_navigation_next" ng-click="navigation_previous_next(\'next\')" class="next">\
                                        <a href="javascript:void(0)">Next</a>\
                                    </li>\
                                </ul>\
                            </nav>';
                    $("#navigation_best_sale").append($compile(html)($scope));
                }
                if ((index_page >= 5) && (maxb < number_navigation)) {
                    $("#navigation_best_sale").empty();
                    var html = '<nav>\
                                <ul class="pagination pagination-lg">\
                                    <li id="btn_navigation_previous" ng-click="navigation_previous_next(\'previous\')" class="previous disabled">\
                                        <a href="javascript:void(0)">Previous</a>\
                                    </li>\
                                    <li  id="n_body_1"  ng-click="navigation_body(1)">\
                                        <a href="javascript:void(0)">1</a>\
                                    </li>\
                                    ' + navigation_space + '\
                                    <li id="n_body_' + (index_page - 1) + '"  ng-click="navigation_body(' + (index_page - 1) + ')">\
                                        <a href="javascript:void(0)">' + (index_page - 1) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (index_page) + '"  ng-click="navigation_body(' + (index_page) + ')">\
                                        <a href="javascript:void(0)">' + (index_page) + '</a>\
                                    </li>\
                                    <li id="n_body_' + (index_page + 1) + '" ng-click="navigation_body(' + (index_page + 1) + ')">\
                                        <a href="javascript:void(0)">' + (index_page + 1) + '</a>\
                                    </li>\
                                     ' + navigation_space + '\
                                    <li id="n_body_' + number_navigation + '" ng-click="navigation_body(' + number_navigation + ')">\
                                        <a href="javascript:void(0)">' + number_navigation + '</a>\
                                    </li>\
                                    <li id="btn_navigation_next" ng-click="navigation_previous_next(\'next\')" class="next">\
                                        <a href="javascript:void(0)">Next</a>\
                                    </li>\
                                </ul>\
                            </nav>';
                    $("#navigation_best_sale").append($compile(html)($scope));
                }
            }
            $('#navigation_best_sale li').removeClass('active');
            $("#n_body_" + index_page + "").addClass('active');
            if (index_page == number_navigation) {
                $("#btn_navigation_next").addClass('disabled');
            } else {
                $("#btn_navigation_next").removeClass('disabled');
            }

            if (index_page == "1") {
                $("#btn_navigation_previous").addClass('disabled');
            } else {
                $("#btn_navigation_previous").removeClass('disabled');
            }

            var name_shop_sale = $('#cboShopSaleTop option:selected').text();           
            var objdata_20item_hancarry = [];
            var objdata_20item_regular = [];
            var objdata_20item="";
            var list_name_20item=[];
            if (index_page != 1 && index_page != number_navigation) {
                //var length_item= data_top_sale.length;
                var start_item = (index_page * 20) - 20;
                var end_item = (index_page * 20);
                for (var i = start_item; i < end_item; i++) {                   
                    
                    var arr_data_handcarry=data_top_sale[0];  // 0: handcarry , 1: regular
                        var arr_data_regular=data_top_sale[1];
                        var data_handcarry=arr_data_handcarry["data"][i];
                        var data_regular=arr_data_regular["data"][i];
                        var product_name=data_private_list_name[i];
                        objdata_20item_hancarry.push(data_handcarry);
                        objdata_20item_regular.push(data_regular);
                        list_name_20item.push(product_name);
                }
                objdata_20item=[
                                    {
                                       data: objdata_20item_hancarry,
                                       name:"Hand carry"
                                    },
                                    {
                                       data: objdata_20item_regular,
                                       name:"Regular"
                                    }                
                                   ];

            } else {
                if (index_page == 1) {
                    for (var i = 0; i < 20; i++) {                       
                        
                        var arr_data_handcarry=data_top_sale[0];  // 0: handcarry , 1: regular
                        var arr_data_regular=data_top_sale[1];
                        var data_handcarry=arr_data_handcarry["data"][i];
                        var data_regular=arr_data_regular["data"][i];
                        var product_name=data_private_list_name[i];
                        objdata_20item_hancarry.push(data_handcarry);
                        objdata_20item_regular.push(data_regular);
                        list_name_20item.push(product_name);
                    }
                    objdata_20item=[
                                    {
                                       data: objdata_20item_hancarry,
                                       name:"Hand carry"
                                    },
                                    {
                                       data: objdata_20item_regular,
                                       name:"Regular"
                                    }                
                                   ];
                } else if (index_page == number_navigation) {
                    var start_item = (index_page * 20) - 20;
                    for (var i = start_item; i < data_top_sale.length; i++) {
                         var arr_data_handcarry=data_top_sale[0];  // 0: handcarry , 1: regular
                        var arr_data_regular=data_top_sale[1];
                        var data_handcarry=arr_data_handcarry["data"][i];
                        var data_regular=arr_data_regular["data"][i];
                        var product_name=data_private_list_name[i];
                        objdata_20item_hancarry.push(data_handcarry);
                        objdata_20item_regular.push(data_regular);
                        list_name_20item.push(product_name);
                    }
                    objdata_20item=[
                                    {
                                       data: objdata_20item_hancarry,
                                       name:"Hand carry"
                                    },
                                    {
                                       data: objdata_20item_regular,
                                       name:"Regular"
                                    }                
                                   ];
                }
            }
        //    console.log(data_top_sale); return;

     //   chart_column_single("chart_top_sale", objdata_20item, "Number Item Order", "Number Item Sale", "item", "Top Item Best Sale(" + name_shop_sale + ")");
            chart_column_single_chart_report_item(objdata_20item,list_name_20item);
        }
        /*   var selector = '#navigation_best_sale li';
           $(selector).on('click', function(){           
               $(selector).removeClass('active');
               $(this).addClass('active');
               $("#btn_navigation_previous").removeClass('active');
               $("#btn_navigation_next").removeClass('active');
              
           });*/
        function load_list_item() {
            var product_type = $("#cboProductType").val();
            var table = $('#tb_list_product').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_item_get_list_product",
                type: "POST",
                data: {
                    "product_type": product_type
                },
                success: function(d) {

                    var data = $.parseJSON(d);
                    //  console.log(data);return;                  
                    var table = $('#tb_list_product').DataTable({
                        /* dom: 'Bfrtip',
                            buttons: [
                                'copy', 'csv', 'excel', 'pdf', 'print'
                            ],*/
                        "order": [
                            [1, "desc"]
                        ],
                        pageLength: 5,
                        data: data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "100px"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var name = full[1].replace(/"/g, " ");
                                    var html = '<button class="btn btn-info" ng-click="add_order_html(\'' + id + '\',\'' + name + '\')">Add</button>';
                                    return html;
                                }
                            },
                        ]
                    });



                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        $("#cboProductType").change(function() {
            load_list_item();
        })
        //-------------------------------------------------------------
        $scope.add_order_html = function(id, name) {
            var ss_id = id;
            var flag_duplicate_p_id = true;
            if (typeof $.session.get('list_item_search') !== 'undefined' && $.session.get('list_item_search') !== null) {
                var arr_list = $.session.get('list_item_search');
                var splitString = arr_list.split(',');
                for (var i = 0; i < splitString.length; i++) {
                    if (id == splitString[i]) {
                        flag_duplicate_p_id = false;
                        break;
                    }
                }
                if (flag_duplicate_p_id == true) {
                    ss_id = $.session.get('list_item_search') + "," + id;
                    $.session.set('list_item_search', ss_id);
                    var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                        <div class="col-md-11">\
                                                            <input id="txtItem' + id + '" class="form-control" value="' + name + '" />\
                                                        </div>\
                                                        <div class="col-md-1">\
                                                            <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                        </div>\
                                                       </div>   ';
                    $("#div_list_item_search").append($compile(html)($scope));
                }
            } else {

                $.session.set('list_item_search', ss_id);
                var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                            <div class="col-md-11">\
                                                                <input id="txtItem' + id + '" class="form-control" value="' + name + '" />\
                                                            </div>\
                                                            <div class="col-md-1">\
                                                                <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                            </div>\
                                                           </div>   ';
                $("#div_list_item_search").append($compile(html)($scope));


            }
            var arr_list = $.session.get('list_item_search');

        }
        $scope.delete_item = function(product_id) {
            var arr_list = $.session.get('list_item_search');
            var splitString = arr_list.split(',');
            var arr_order = [];
            for (var i = 0; i < splitString.length; i++) {
                arr_order.push(splitString[i]);
            }
            var index = arr_order.indexOf(product_id);
            if (index != -1) {
                arr_order.splice(index, 1);
            }
            var strss = "";
            for (var i = 0; i < arr_order.length; i++) {
                if (i == 0) {
                    strss += arr_order[i];
                } else {
                    strss = strss + "," + arr_order[i];
                }
            }
            $.session.set('list_item_search', strss);
            $("#div_item" + product_id).remove();
            arr_list = $.session.get('list_item_search');
            if (arr_list.length == 0) {
                $.session.remove('list_item_search');
            }
        }
        //-------------------------------------------------------------
        $scope.daily_fillter = function() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            if (typeof $.session.get('list_item_search') == 'undefined' && $.session.get('list_item_search') == null) {
                alert("Please add item for check .");
                return;
            }
            var html = '<table id="tb_list_daily_item" class="table table-bordered table-striped table-hover js-dataTable-full display responsive nowrap" cellspacing="0" width="100%">\
                            </table>\
                            <div class="block-content">\
						<div id="daily_sale" style="height: 400px; min-width: 310px"></div>\
					</div> ';

            $("#divGTotalSaleItem").empty();
            $("#divGTotalSaleItem").append(html);
          
            report_line_item_sale(fromdate, todate);


        }

        function report_line_item_sale(fromdate, todate) {
            var arr_list = $.session.get('list_item_search');
            var startdate = fromdate;
            var enddate = todate;
            var type_customer_buy = $("#cboShopSaleDaily").val();

            var obj = {
                "start_date": startdate,
                "end_date": enddate,
                "item_list": arr_list,
                "type_customer_buy": type_customer_buy
            }
            var objdataline = "";
            var arr_name_item = "";
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_item_get_list_daily_sale",
                type: "POST",
                async: false,
                data: {
                    "obj": obj
                },
                success: function(d) {
                   //  console.log(d);return;
                    var data = $.parseJSON(d);
                    objdataline = data["datafilter"];
                    arr_name_item = data["list_item_name"];
                },
                error: function(e) {
                    alert(e);
                }
            });

            var objdata_reportline = [];
            var arrdate = generate_date(startdate, enddate);

            if (objdataline.length == 0) {
                for (var i = 0; i < arr_name_item.length; i++) {
                    var obj_1_line = "";
                    var name_item = arr_name_item[i]["name"];
                    var id_item = arr_name_item[i]["id"];
                    var arr_quantity_item = [];
                    for (var j = 0; j < arrdate.length; j++) {
                        var quantity_item = 0;
                        arr_quantity_item.push(quantity_item);
                    }
                    obj_1_line = {
                        "name": name_item,
                        "data": arr_quantity_item
                    };
                    objdata_reportline.push(obj_1_line);
                }
            } else {
                for (var i = 0; i < arr_name_item.length; i++) {
                    var obj_1_line = "";
                    var name_item = arr_name_item[i]["name"];
                    var id_item = arr_name_item[i]["id"];
                    var arr_quantity_item = [];

                    for (var j = 0; j < arrdate.length; j++) {
                        var quantity_item = 0;
                        for (var k = 0; k < objdataline.length; k++) {
                            var id_item_filter = objdataline[k]["product_id"];
                            var date_filter = objdataline[k]["post_date"];
                            if (id_item_filter == id_item && date_filter == arrdate[j]) {
                                quantity_item = parseInt(objdataline[k]["quantity"]);
                                break;
                            }
                        }
                        arr_quantity_item.push(quantity_item);
                    }
                    obj_1_line = {
                        "name": name_item,
                        "data": arr_quantity_item
                    };
                    objdata_reportline.push(obj_1_line);
                }
            }
            //set_total_daily(arrdate,objdata_reportline);
            generate_gridview(arrdate, objdata_reportline);
          generate_chart_daily(arrdate,objdata_reportline,"daily_sale","","Total Item");
         
           
        }
        function generate_chart_daily(date, arr_data, idchart, title, name_line) {
           $('#' + idchart).highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: 'Source: Sky007.vn'
                },
                xAxis: {
                    categories: date
                },
                yAxis: {
                    title: {
                        text: title
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: arr_data

            });
        }
        function generate_gridview(arrdate, objdata_reportline) {
            var json_data = [];
            for (var i = 0; i < arrdate.length; i++) {
                var date_time = arrdate[i];
                var quantity = [];
                quantity.push(date_time);
                for (var j = 0; j < objdata_reportline.length; j++) {
                    var quantity_1_item = (objdata_reportline[j]["data"][i]).toString();
                    quantity.push(quantity_1_item);
                }

                json_data.push(quantity);
            }

            var title_table = [];
            title_table.push({
                "title": "Date Time"
            });
            for (var i = 0; i < objdata_reportline.length; i++) {

                var name_item = objdata_reportline[i]["name"];
                var tite_1_row = {
                    "title": name_item
                };
                title_table.push(tite_1_row);
            }



            $('#tb_list_daily_item').DataTable({

                data: json_data,
                dom: 'Bfrtip',
                buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                ],
                "order": [
                    [0, "desc"]
                ],
                pageLength: 20,
                lengthMenu: [
                    [5, 10, 20, 30, 50, -1],
                    [5, 10, 20, 30, 50, "ALL"]
                ],
                columns: title_table
            });
        }

        function generate_date(start, end) {
            var datesArray = [];
            var startDate = new Date(start);


            var endDate = new Date(end);
            while (startDate <= endDate) {
                // var curr = year + "-" + month + "-" + day;
                var newdate = new Date(startDate);
                var year = newdate.getFullYear();
                var month = ("0" + (newdate.getMonth() + 1)).slice(-2);
                var day = ("0" + newdate.getDate()).slice(-2);
                var curr = year + "-" + month + "-" + day;
                datesArray.push(curr);
                startDate.setDate(startDate.getDate() + 1);
            }
            return datesArray;
        }

        function generate_month(start, end) {
            var datesArray = [];
            var startDate = new Date(start);
            var endDate = new Date(end);

            var sy = startDate.getFullYear();
            var ey = endDate.getFullYear();
            var month_c = new Array();
            month_c[0] = "January";
            month_c[1] = "February";
            month_c[2] = "March";
            month_c[3] = "April";
            month_c[4] = "May";
            month_c[5] = "June";
            month_c[6] = "July";
            month_c[7] = "August";
            month_c[8] = "September";
            month_c[9] = "October";
            month_c[10] = "November";
            month_c[11] = "December";
            var month_start = parseInt(startDate.getMonth());
            var month_end = parseInt(endDate.getMonth());
            if (sy == ey) {


                for (var i = month_start; i <= month_end; i++) {
                    datesArray.push(month_c[i] + '(' + ey + ')');
                    month_start++;
                }
                return datesArray;
            } else if (sy < ey) {
                for (var i = month_start; i < 12; i++) {
                    datesArray.push(month_c[i] + '(' + sy + ')');
                }
                for (var i = 0; i <= month_end; i++) {
                    datesArray.push(month_c[i] + '(' + ey + ')');
                }
                return datesArray;
            }

        }
        //-------------------------------------------------------------------------------
        $scope.txtfromdate_monthly = lastWeek(60);
        $scope.txtfromdate_top = lastWeek(7);
        $scope.txttodate_monthly = new Date();
        $scope.txttodate_top = new Date();


        $scope.clear = function() {
            $scope.txtfromdate_monthly = null;
            $scope.txtfromdate_top = null;
        };
        $scope.open_f_monthly = function() {
            $scope.popup_f_monthly.opened = true;
        };

        $scope.open_t_monthly = function() {
            $scope.popup_t_monthly.opened = true;
        };

        $scope.open_f_top = function() {
            $scope.popup_f_top.opened = true;
        };

        $scope.open_t_top = function() {
            $scope.popup_t_top.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.txttodate_monthly = new Date(year, month, day);
            $scope.txttodate_top = new Date(year, month, day);
        };

        $scope.format = 'yyyy/MM/dd';


        $scope.popup_f_monthly = {
            opened: false
        };

        $scope.popup_t_monthly = {
            opened: false
        };

        $scope.popup_f_top = {
            opened: false
        };

        $scope.popup_t_top = {
            opened: false
        };

        function lastWeek($date) {
            var today = new Date();
            var lastweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - $date);
            return lastweek;
        }
        //-------------------------------------------------------------------------------
        $scope.monthly_fillter = function() {
            var fromdate = $scope.txtfromdate_monthly;
            var todate = $scope.txttodate_monthly;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            if (typeof $.session.get('list_item_search') == 'undefined' && $.session.get('list_item_search') == null) {
                alert("Please add item for check .");
                return;
            }
            var shop_sale = $("#cboShopSaleMonthly").val();
            var arr_list = $.session.get('list_item_search');
            var html = "";
            if (shop_sale == "0" || shop_sale == "2" || shop_sale == "7") {
                html = '<div id="chart_monthly_sale" style="height: 400px; min-width: 310px"></div>';

            } else {
                html = '<div id="chart_monthly_sale" style="height: 400px; min-width: 310px"></div><div id="chart_monthly_sale_marketing" style="height: 400px; min-width: 310px"></div>';
            }
            $("#div_item_monthly_sale").empty();
            $("#div_item_monthly_sale").append(html);
            load_chart_monthly(fromdate, todate, shop_sale, arr_list);
        }

        function load_chart_monthly(fromdate, todate, shop_sale, arr_list) {
            var name_shop_sale = $('#cboShopSaleMonthly option:selected').text();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "item_list": arr_list,
                "shop_sale": shop_sale
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_item_get_list_monthly_sale",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                    var arr_name_item = data["list_item_name"];
                    if (shop_sale == "0" || shop_sale == "2" || shop_sale == "7") { // 0: all, 2: wholesaler                   
                        var data_chart = data["data"];
                        filter_data_for_monthly(fromdate, todate, arr_name_item, data_chart, "chart_monthly_sale", "Monthly Sale For " + name_shop_sale, "Number Order", "item");

                    } else {
                        var data_chart = data["data"];
                        var data_chart_marketing = data["data_marketing"];
                        filter_data_for_monthly(fromdate, todate, arr_name_item, data_chart, "chart_monthly_sale", "Monthly Sale For " + name_shop_sale, "Number Order", "order");
                        filter_data_for_monthly(fromdate, todate, arr_name_item, data_chart_marketing, "chart_monthly_sale_marketing", "Monthly Sale For " + name_shop_sale + " Marketing", "Number Order", "order");

                    }

                    //  console.log(data);return;                
                },
                error: function(e) {
                    alert(e);
                }
            });
        }

        function filter_data_for_monthly(startdate, enddate, arr_name_item, objdata, idreport, titlereport, name_yaxis, label_end) {
            var objdata_report = [];
            var arrmonth = generate_month(startdate, enddate);

            if (objdata.length == 0) {
                for (var i = 0; i < arr_name_item.length; i++) {
                    var obj_1_line = "";
                    var name_item = arr_name_item[i]["name"];
                    var id_item = arr_name_item[i]["id"];
                    var arr_quantity_item = [];
                    for (var j = 0; j < arrmonth.length; j++) {
                        var quantity_item = 0;
                        arr_quantity_item.push(quantity_item);
                    }
                    obj_1_line = {
                        "name": name_item,
                        "data": arr_quantity_item
                    };
                    objdata_report.push(obj_1_line);
                }
            } else {
                for (var i = 0; i < arr_name_item.length; i++) {
                    var obj_1_line = "";
                    var name_item = arr_name_item[i]["name"];
                    var id_item = arr_name_item[i]["id"];
                    var arr_quantity_item = [];

                    for (var j = 0; j < arrmonth.length; j++) {
                        var quantity_item = 0;
                        for (var k = 0; k < objdata.length; k++) {
                            var id_item_filter = objdata[k]["product_id"];
                            var date_filter = objdata[k]["post_date"];
                            if (id_item_filter == id_item && date_filter == arrmonth[j]) {
                                quantity_item = parseInt(objdata[k]["quantity"]);
                                break;
                            }
                        }
                        arr_quantity_item.push(quantity_item);
                    }
                    obj_1_line = {
                        "name": name_item,
                        "data": arr_quantity_item
                    };
                    objdata_report.push(obj_1_line);
                }
            }
            //  console.log(objdata_report);
            chart_column_multi(idreport, titlereport, arrmonth, objdata_report, name_yaxis, label_end);
        }
        //---------------------------------------------------------------------------------
        $scope.top_fillter = function() {
            var fromdate = $scope.txtfromdate_top;
            var todate = $scope.txttodate_top;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var name_shop_sale = $('#cboShopSaleTop option:selected').text();
            var shop_sale = $("#cboShopSaleTop").val();
           
            var html = '<div id="chart_top_sale" style="height: 400px; min-width: 310px"></div>';
            $("#div_item_top_sale").empty();
            $("#div_item_top_sale").append(html);
            $("#navigation_top_sale").show();
            load_chart_top(fromdate, todate, shop_sale, "chart_top_sale", "Number Item Order", "Number Item Sale", "item", "Top Item Best Sale(" + name_shop_sale + ")", number_items_show);
         
        }


        function load_chart_top(fromdate, todate, shop_sale, id_chart, y_label, serries_name, string_end_label, title_chart) {
            index_page = 1;
            number_navigation = 0;
            var brand_name = $("#cboBrand").val();
            var city = $("#cboCity").val();
            var choose_item=$("#cboCheckEachItem").val();
            var arr_list = $.session.get('list_item_search');
            var str_items="";
            if(choose_item==1){
                str_items=arr_list;
            } 
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shop_sale,
                "brand_name": brand_name,
                "list_items":str_items,
                "city": city,
                "number_items_show": number_items_show
            };
          //  console.log(obj); return;
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_item_get_list_top_sale",
                type: "POST",
                async: false,
                data: {
                    "obj": obj
                },
                success: function(d) {
                //   console.log(d); return;
                    var data = $.parseJSON(d);                  
                    number_navigation = parseInt(data.length / 20);
                    if ((data.length % 20) != 0) {
                        number_navigation = number_navigation + 1;
                    }                    
                    load_navigation($compile, $scope);
                    var total_number=0;
                    
                   /* var objdata_20item = [];
                    if (data.length >= 20) {
                        for (var i = 0; i < 20; i++) {
                            var name_item = data[i]["product_name"];
                            var quantity = parseInt(data[i]["quantity"]);
                            var obj_1_item = [name_item, quantity];
                            objdata_20item.push(obj_1_item);
                          
                        }
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            var name_item = data[i]["product_name"];
                            var quantity = parseInt(data[i]["quantity"]);
                            var obj_1_item = [name_item, quantity];
                            objdata_20item.push(obj_1_item);                         
                        }
                    }*/
            /*-------------------------------------------------------------------------*/        
                     var arr_name_product=[];
                     var arr_qty_regular=[];
                     var arr_qty_handcarry=[]; 
                     var arr_data_regular=[];
                     var arr_data_handcarry=[];
                     for (var i = 0; i < data.length; i++) {
                        var name_item = data[i]["product_name"];
                        var quantity = parseInt(data[i]["quantity"]);
                        var product_type=data[i]["product_type"];
                        var obj_1_item = [name_item, quantity];
                        if(product_type==0){
                            arr_data_handcarry.push(obj_1_item);
                        }else{
                            arr_data_regular.push(obj_1_item);
                        }
                     }
                     for(var i = 0; i < arr_data_handcarry.length; i++ ){
                        var product_name=arr_data_handcarry[i][0];
                        arr_name_product.push(product_name);
                     }
                     
                     for(var i = 0; i < arr_data_regular.length; i++ ){
                        var product_name_regular=arr_data_regular[i][0];
                        var flat_check_exits=0;
                     //   var n_position=0;
                        for(var j=0;j<arr_name_product.length;j++){
                            var product_name=arr_name_product[j];
                            if(product_name_regular==product_name){
                                flat_check_exits=1;
                            }
                        }
                        if(flat_check_exits==0){
                            arr_name_product.push(product_name_regular);
                        }
                        
                     }
                     
                     for(var i=0;i<arr_name_product.length;i++){
                         var product_name=arr_name_product[i];
                         var f_check_handcarry=0;
                         var p_handcarry=0; // p:position
                         var f_check_regular=0;
                         var p_regular=0;
                         
                         for(var j = 0; j < arr_data_regular.length; j++ ){
                            var product_name_regular=arr_data_regular[j][0];
                            var qty_regular=arr_data_regular[j][1];
                            if(product_name==product_name_regular){
                               f_check_regular=1;
                               p_regular=j;
                               break;
                            }
                            
                         }
                         for(var j = 0; j < arr_data_handcarry.length; j++ ){
                            var product_name_handcarry=arr_data_handcarry[j][0];
                            var qty_handcarry=arr_data_handcarry[j][1];
                            if(product_name==product_name_handcarry){
                               f_check_handcarry=1;
                               p_handcarry=j;
                               break;
                            }
                            
                         }
                         if(f_check_regular==1){
                            var qty_p_regular=arr_data_regular[p_regular][1];
                            arr_qty_regular.push(qty_p_regular);
                         }else{
                            arr_qty_regular.push(0);
                         }
                         if(f_check_handcarry==1){
                            var qty_p_handcarry=arr_data_handcarry[p_handcarry][1];
                            arr_qty_handcarry.push(qty_p_handcarry);
                         }else{
                            arr_qty_handcarry.push(0);
                         }
            
                     }
          /*----------------------------------Insertion-sort---------------------------------------*/     
                /*---------- Combine data--------------------*/   
                var arr_data_combine=[];
                for(var i=0;i<arr_qty_regular.length;i++){
                    var data_regular=arr_qty_regular[i];
                    var data_handcarry=arr_qty_handcarry[i];
                    var data_combine=data_regular+data_handcarry;
                    arr_data_combine.push(data_combine);
                    
                }    
                     
                /*-----------END Combine data----------------*/    
                for(var i=1;i<arr_data_combine.length;i++){
                    var max_value=arr_data_combine[i];
                    var data_handcarry=arr_qty_handcarry[i];
                    var data_regular=arr_qty_regular[i];
                    var data_name_item=arr_name_product[i];
                    var j=i-1;
                    while(j>=0 && arr_data_combine[j]<max_value ){
                        arr_data_combine[j+1]=arr_data_combine[j];
                        arr_qty_handcarry[j+1]=arr_qty_handcarry[j];
                        arr_qty_regular[j+1]=arr_qty_regular[j];
                        arr_name_product[j+1]=arr_name_product[j];
                        j=j-1;
                    }
                    arr_data_combine[j+1]=max_value;
                    arr_qty_handcarry[j+1]=data_handcarry;
                    arr_qty_regular[j+1]=data_regular;
                    arr_name_product[j+1]=data_name_item;
                }       
              //    console.log(arr_data_combine)   ;  // return;   
                 
                var obj_data= [
                      { 
                        name: 'Hand carry',
                        data: arr_qty_handcarry
                      },
                      {
                        name: 'Regular',
                        data: arr_qty_regular
                 }] ;
                 
                 data_top_sale=obj_data;
                 data_private_list_name=arr_name_product;
          /*-------------------------------------------------------------------------*/           
                     
                     for (var i = 0; i < data.length; i++) {                          
                            var quantity = parseInt(data[i]["quantity"]);
                           total_number+=quantity;
                         
                        }
                     $("#txtTotalAllItemBestSale").empty();
                     $("#txtTotalAllItemBestSale").append(total_number);
                //     chart_column_single(id_chart, objdata_20item, y_label, serries_name, string_end_label, title_chart);
                                          
                     chart_column_single_chart_report_item( obj_data, arr_name_product);
                    // console.log(total_number);//return;                
                },
                error: function(e) {
                    alert(e);
                }
            });
        }
    }
]);
//============================ End Items ===================================
//============================ Heat Map ==================================

App.controller('RCHeatmapCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
      //  limit_permisstion_menu("chkCRHeatmap");
        set_date_time($scope, '7');
        $scope.loadData = function() {
            load_data();
            load_heatmap();
        }
        $scope.data_fillter = function() {
            load_data();
        }
        function generateData(count, yrange) {
            var i = 0;
            var series = [];
            while (i < count) {
              var x = (i + 1).toString();
              var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
          
              series.push({
                x: x,
                y: y
              });
              i++;
            }
            return series;
          }
        function load_heatmap()
        {
              var options = {
          series: [{
          name: 'Metric1',
          data: generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric2',
          data: generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric3',
          data: generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric4',
          data: generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric5',
          data: generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric6',
          data: generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric7',
          data: generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric8',
          data: generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'Metric9',
          data: generateData(18, {
            min: 0,
            max: 90
          })
        }
        ],
          chart: {
          height: 350,
          type: 'heatmap',
        },
        dataLabels: {
          enabled: false
        },
        colors: ["#008FFB"],
        title: {
          text: 'HeatMap Chart (Single color)'
        },
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
      
        }
        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
         //   get_data_heat_map(fromdate,todate);
            get_data_column("customer_by_time",fromdate,todate,"1");
            get_data_column("customer_by_time_eglips",fromdate,todate,"2");
      //      get_chart_column();
          
        }
        
        function getPointCategoryName(point, dimension) {
              var series = point.series,
                isY = dimension === 'y',
                axis = series[isY ? 'yAxis' : 'xAxis'];
              return axis.categories[point[isY ? 'y' : 'x']];
            }
        function get_chart_column(id_chart,arr_total,arr_detail){
            // Create the chart
            Highcharts.chart(id_chart, {
              chart: {
                type: 'column'
              },
              title: {
                text: ''
              },
              accessibility: {
                announceNewData: {
                  enabled: true
                }
              },
              xAxis: {
                type: 'category'
              },
              yAxis: {
                title: {
                  text: 'Total percent market share'
                }
            
              },
              legend: {
                enabled: false
              },
              plotOptions: {
                series: {
                  borderWidth: 0,
                  dataLabels: {
                    enabled: true,
                    format: '{point.y}'
                  }
                }
              },
            
              tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
              },
            
              series:[ {
                      name: "Sky007",
                      colorByPoint: true,
                      data: arr_total
                     }] ,
              drilldown: {
                series: arr_detail,
              }
            });
        }
      
        function get_data_column(id_chart,fromdate, todate,brand_number) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_type":brand_number
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_heat_map",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   
                    var data = $.parseJSON(d);
                 // console.log(data); 
                    var arr_total=[];                               
                    
                    //---------------------
                    var arr_list_tone=[];                   
                    
                   
                   // -------------------- 
                    var arr_total_detail = [];
                    var arr_group_color=[];
                   
                     var check_tone="";                     
                    for (var i = 0; i < data.length; i++) {                         
                        var product_name = data[i]["product_name"];
                        var color_detail=data[i]["color_detail"];
                        var color_tone=data[i]["color_tone"];
                        var qty=parseInt(data[i]["quantity"]);
                        var obj_y_detail ={
                            "name": product_name,
                            "y": qty,
                            "color":color_detail,
                            
                          };                       
                      // console.log(obj_y_detail);
                        if(color_tone!=null&&color_tone!=""){                           
                        //  var  p_color_tone=color_tone.substring(0, color_tone.length - 2);
                        
                        if(check_tone==color_tone){
                           window['total_' + color_tone] +=qty;                        
                           window['arr_y_' + color_tone +"detail"].push(obj_y_detail);
                           for(var k=0;k<arr_group_color.length;k++)
                           {
                             var color_tone_detail=arr_group_color[k]["color_tone"];
                             var color_detail_max_qty=arr_group_color[k]["max_qty"];
                            if(color_tone==color_tone_detail && qty>color_detail_max_qty ){
                                arr_group_color[k]["max_qty"]=qty;
                                arr_group_color[k]["color_detail"]=color_detail;
                            }
                           }
                          
                        }else{                          
                                                    
                            arr_list_tone.push(color_tone);
                            window['total_' + color_tone]=0
                            window['total_' + color_tone] +=qty;
                            var obj_color_detail ={
                                "color_tone": color_tone,                               
                                "color_detail":color_detail,
                                "max_qty":qty
                                
                              };  
                            arr_group_color.push(obj_color_detail);//color_detail
                            
                            window['arr_y_' + color_tone +"detail"] = [];
                            window['arr_y_' + color_tone +"detail"].push(obj_y_detail);
                        }  
                      
                        check_tone=color_tone;
                    
                     }
                    }
                  //  console.log(arr_group_color); 
                    for(var i=0;i<arr_list_tone.length;i++){
                        var color_tone=arr_list_tone[i];
                     
                        var obj_x_tone=           {
                                      name: color_tone,
                                      y: window['total_' + color_tone],
                                      color:arr_group_color[i]["color_detail"],
                                      drilldown: "X"+color_tone
                                    }
                     //   console.log(obj_x_tone);
                        arr_total.push(obj_x_tone);
                        
                        //--------- check same name product(hand carry and regular) combine quantity---------------------
                        window['arr_y_' + color_tone +"detail_c"]  = []; 
                        for (var j=0;j<window['arr_y_' + color_tone +"detail"].length;j++){
                            // console.log(window['arr_y_' + color_tone +"detail"]);return;
                           var name_item=window['arr_y_' + color_tone +"detail"][j]["name"];                          
                           var y_axis=window['arr_y_' + color_tone +"detail"][j]["y"];                          
                           var color=window['arr_y_' + color_tone +"detail"][j]["color"];
                           var obj_y_detail_c ={
                                                "name": name_item,
                                                "y": y_axis,
                                                "color":color,                                                
                                              };                          
                           if(window['arr_y_' + color_tone +"detail_c"].length==0){
                                window['arr_y_' + color_tone +"detail_c"].push(obj_y_detail_c);
                           }else{
                                var index_row="";
                                var flag_check_exist="false";
                                for(var k=0;k<window['arr_y_' + color_tone +"detail_c"].length;k++){
                                    var name_c=window['arr_y_' + color_tone +"detail_c"][k]["name"];
                                    var qty_c=window['arr_y_' + color_tone +"detail_c"][k]["y"];
                                    if(name_item==name_c){
                                        flag_check_exist="true";
                                        y_axis+=qty_c;
                                        index_row=k;
                                    }
                                }
                                if(flag_check_exist=="false"){
                                    window['arr_y_' + color_tone +"detail_c"].push(obj_y_detail_c);
                                }else if(flag_check_exist=="true"){
                                    window['arr_y_' + color_tone +"detail_c"][index_row]["y"]=y_axis;
                                }
                           }                   
                        }
                        
                        //------------------------------------------------------------------------------
                        
                        var obj_y_tone={
                                    name: color_tone,                
                                    id: "X"+color_tone,
                                    data:  window['arr_y_' + color_tone +"detail_c"]
                                  };
                        arr_total_detail.push(obj_y_tone);
                    } 
                   // console.log(arr_total);
                  // console.log(arr_total_detail) ;                  
                    get_chart_column(id_chart,arr_total,arr_total_detail); 
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }  
         
   

    }
]);
//============================ End Heat Map ==============================

//============================ Time Based ==================================

App.controller('RCTimeBasedCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkCRTimeBased");
        set_date_time($scope, '7');
        $scope.loadData = function() {
            load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }


            get_data_time_based(fromdate, todate);
        }

        function get_data_time_based(fromdate, todate) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_time_based",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                    //  console.log(d);return;                   
                    var arr_time_based = [];                    
                    for (var i = 0; i < data.length; i++) {
                        var d_hour = parseInt(data[i]["h"]);
                        var period = "";
                        if (d_hour < 13) {
                            period = d_hour + ":00 AM";
                        } else {
                            period = d_hour + ":00 PM"
                        }
                        var oder_number = parseInt(data[i]["ord_n"]);
                    //    total_number+=oder_number;
                        var obj_item = {
                            "name": period,
                            "y": oder_number
                        };
                        arr_time_based.push(obj_item);
                    }                    
                    chart_column_single("time_order", arr_time_based, "Number Order", "Time Order", " order", "");
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }


    }
]);
//============================ End Time Based ==============================
//============================  Monthly Sale ==================================

App.controller('RCMonthlySaleCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkCRMonthlySale");
        set_date_time($scope, '60');
        $scope.loadData = function() {
            load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }

            get_data_monthly_sale(fromdate, todate, "0", "order_monthly_sale_sky007");
            get_data_monthly_sale(fromdate, todate, "7", "order_monthly_sale_wholesaler");
            get_data_monthly_sale(fromdate, todate, "10", "order_monthly_sale_shopee");
            get_data_monthly_sale(fromdate, todate, "66", "order_monthly_sale_shopee_hince");
            get_data_monthly_sale(fromdate, todate, "48", "order_monthly_sale_mixsoon");   
            get_data_monthly_sale(fromdate, todate, "44", "order_monthly_sale_sociolla");            
            get_data_monthly_sale(fromdate, todate, "64", "order_monthly_sale_hince");
            get_data_monthly_sale(fromdate, todate, "22", "order_monthly_sale_eglips_wholesaler");
            get_data_monthly_sale(fromdate, todate, "20", "order_monthly_sale_lazada");
            get_data_monthly_sale(fromdate, todate, "68", "order_monthly_sale_lazada_hince");
            get_data_monthly_sale(fromdate, todate, "30", "order_monthly_sale_watson");
            get_data_monthly_sale(fromdate, todate, "34", "order_monthly_sale_beautybox");
            get_data_monthly_sale(fromdate, todate, "36", "order_monthly_sale_tiki");
            get_data_monthly_sale(fromdate, todate, "46", "order_monthly_sale_bbiavn");
            get_data_monthly_sale(fromdate, todate, "70", "order_monthly_sale_tiktok_hince");            
            get_data_monthly_sale(fromdate, todate, "48", "order_monthly_sale_mixsoon"); 
            get_data_monthly_sale(fromdate, todate, "50", "order_monthly_sale_guardian"); 
            get_data_monthly_sale(fromdate, todate, "52", "order_monthly_sale_shopee_mixsoon"); 
            get_data_monthly_sale(fromdate, todate, "54", "order_monthly_sale_lazada_mixsoon"); 
            get_data_monthly_sale(fromdate, todate, "58", "order_monthly_sale_tiktok_sky007"); 
            
           
            get_data_monthly_comparison(fromdate, todate);
            get_data_monthly_sale_total(fromdate, todate);
        }

        function get_data_monthly_sale(fromdate, todate, shopsale, idchart) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shopsale
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_time_based_monthly_sale",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   // console.log(d); return;
                    var data = $.parseJSON(d);
                    if(shopsale==48){
                        get_data_report_forchart_mixsoon(data, "0", fromdate, todate, idchart, "", "Total Price");
                    }else{
                        get_data_report_forchart(data, "0", fromdate, todate, idchart, "", "Total Price");
                    }
                    
                },
                error: function(e) {
                    console.log(e);
                }
            })  
        }

        function get_data_monthly_comparison(fromdate, todate) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_time_based_monthly_comparison",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                  //   console.log(d);
                    draw_chart_comparison(data, fromdate, todate);
                   
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
        function get_data_monthly_sale_total(fromdate, todate) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_time_based_monthly_sale_total",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                    var data_hcm=data["data_hcm"];
                    var data_hn=data["data_hn"];
                   //  console.log(d);
                    draw_chart_sale(data_hcm,data_hn, fromdate, todate,'order_monthly_sale_total_sale');
                  //  draw_chart_sale_total(data_hn, fromdate, todate,'order_monthly_sale_total_sale_hn');
                   
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }

        function draw_chart_comparison(data, startdate, enddate) {
            //console.log(data);
            if (data.length > 0) {
                var st = new Date(startdate);
                var sm = st.getMonth();
                var et = new Date(enddate);
                var em = et.getMonth();
                var sy = st.getFullYear();
                var ey = et.getFullYear();

                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var arr_date = [];
                var arr_date_char = [];

                var arr_sky007 = [];
                var arr_wholesaler = [];
                var arr_shoppe = [];
                var arr_shoppe_eglips = [];                       
                var arr_eglips = [];
                var arr_eglips_wholesaler = [];
                var arr_lazada = [];
                var arr_lazada_eglips = [];               
                var arr_sociolla = [];
                var arr_tiktok = [];
                var arr_watson = [];
                var arr_tiki = [];
                var arr_bbiavn = [];
                var arr_guardian = [];
                var arr_shop_total = [];
                var arr_tiki_eglips = [];
                var arr_mixsoon_website = [];
                var arr_shopee_mixsoon = [];
                var arr_lazada_mixsoon = [];
                var arr_tiktok_sky007 = [];
                var arr_wholesaler_total=[];
                
                var arr_tiki_mixsoon=[];
                var arr_tiktok_mixsoon=[];
                var arr_watsons_bbia=[];
                var arr_hince_website=[];
                var arr_hince_shopee=[];
                var arr_hince_lazada=[];
                var arr_hince_tiktok=[];             
                
                
                
                
                    
                if (sy == ey) {
                    for (var i = sm; i <= em; i++) {
                        arr_date.push(i);
                        arr_date_char.push(monthNames[i]);
                    }
                 //   console.log(arr_date_char); return;
                    for (var i = 0; i < arr_date.length; i++) {
                        
                        var date_element = arr_date[i];
                        var index_shop = i;     
    
                        for (var j = 0; j < data.length; j++) {
                            var time = parseInt(data[j]['time']);
                            var category = parseInt(data[j]['ord_category']);
                            var tprice_sky007 = 0;
                            var tprice_wholesaler = 0;
                            var tprice_shoppe = 0;                       
                            var tprice_shoppe_eglips = 0;
                            var tprice_eglips = 0;
                            var tprice_eglips_wholesaler = 0;
                            var tprice_lazada = 0;
                            var tprice_lazada_eglips = 0;                        
                            var tprice_sociolla = 0;
                            var tprice_tiktok = 0;
                            var tprice_watson = 0;
                            var tprice_tiki = 0;
                            var tprice_bbiavn = 0;
                            var tprice_guardian = 0;
                            var tprice_shop_total = 0;
                            var tprice_tiki_eglips = 0;
                            var tprice_mixsoon_website = 0;
                            var tprice_shopee_mixsoon = 0;
                            var tprice_lazada_mixsoon = 0;
                            var tprice_tiktok_sky007 = 0;
                            var tprice_wholesaler_total=0;
                            
                            var tprice_tiki_mixsoon=[];
                            var tprice_tiktok_mixsoon=[];
                            var tprice_watsons_bbia=[];
                            var tprice_hince_website=[];
                            var tprice_hince_shopee=[];
                            var tprice_hince_lazada=[];
                            var tprice_hince_tiktok=[]; 
                            
                            time = (time - 1);
                          //  console.log(date_element +'_'+ time);
                            if (date_element == time) {
                              //   console.log(category); 
                                if(category=="0"){
                                     tprice_sky007 = parseInt(data[j]['total_price']);                                     
                                     arr_sky007.push(tprice_sky007);
                                }else if(category=="7"){
                                     tprice_wholesaler = parseInt(data[j]['total_price']);                                      
                                     arr_wholesaler.push(tprice_wholesaler);
                                }else if(category=="10"){
                                     tprice_shoppe = parseInt(data[j]['total_price']);                                      
                                     arr_shoppe.push(tprice_shoppe);
                                }
                                else if(category=="18"){
                                     tprice_eglips = parseInt(data[j]['total_price']);                                      
                                     arr_eglips.push(tprice_eglips);
                                }
                                else if(category=="20"){
                                     tprice_lazada = parseInt(data[j]['total_price']);                                     
                                     arr_lazada.push(tprice_lazada);
                                }
                                else if(category=="22"){
                                     tprice_eglips_wholesaler = parseInt(data[j]['total_price']);  
                                     arr_eglips_wholesaler.push(tprice_eglips_wholesaler);
                                }
                                else if(category=="24"){
                                     tprice_shoppe_eglips = parseInt(data[j]['total_price']);                                     
                                     arr_shoppe_eglips.push(tprice_shoppe_eglips);
                                }
                                else if(category=="26"){
                                     tprice_lazada_eglips = parseInt(data[j]['total_price']);                                      
                                     arr_lazada_eglips.push(tprice_lazada_eglips);
                                }
                                else if(category=="30"){
                                     tprice_watson = parseInt(data[j]['total_price']);                                     
                                     arr_watson.push(tprice_watson);
                                }else if(category=="36"){
                                     tprice_tiki = parseInt(data[j]['total_price']);                                    
                                     arr_tiki.push(tprice_tiki);
                                }else if(category=="42"){
                                     tprice_tiki_eglips = parseInt(data[j]['total_price']);                                      
                                     arr_tiki_eglips.push(tprice_tiki_eglips);
                                }else if(category=="44"){
                                     tprice_sociolla = parseInt(data[j]['total_price']);                                     
                                     arr_sociolla.push(tprice_sociolla);
                                }
                                else if(category=="46"){
                                     tprice_bbiavn = parseInt(data[j]['total_price']);                                      
                                     arr_bbiavn.push(tprice_bbiavn);
                                }
                                else if(category=="48"){
                                     tprice_mixsoon_website = parseInt(data[j]['total_price']);                                     
                                     arr_mixsoon_website.push(tprice_mixsoon_website);
                                }
                                else if(category=="50"){
                                     tprice_guardian = parseInt(data[j]['total_price']);                                      
                                     arr_guardian.push(tprice_guardian);
                                }                                
                                else if(category=="52"){
                                     tprice_shopee_mixsoon = parseInt(data[j]['total_price']);                                     
                                     arr_shopee_mixsoon.push(tprice_shopee_mixsoon);
                                }                                
                                else if(category=="54"){
                                     tprice_lazada_mixsoon = parseInt(data[j]['total_price']);                                     
                                     arr_lazada_mixsoon.push(tprice_lazada_mixsoon);
                                }  
                                else if(category=="56"){
                                     tprice_tiki_mixsoon = parseInt(data[j]['total_price']);                                     
                                     arr_tiki_mixsoon.push(tprice_tiki_mixsoon);
                                }                              
                                else if(category=="58"){
                                     tprice_tiktok_sky007 = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_tiktok_sky007) == "undefined"){
                                        tprice_tiktok_sky007=0;
                                     } 
                                     arr_tiktok_sky007.push(tprice_tiktok_sky007);
                                }else if(category=="60"){
                                     tprice_tiktok_mixsoon = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_tiktok_mixsoon) == "undefined"){
                                        tprice_tiktok_mixsoon=0;
                                     } 
                                     arr_tiktok_mixsoon.push(tprice_tiktok_mixsoon);
                                }else if(category=="62"){
                                     tprice_watsons_bbia = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_watsons_bbia) == "undefined"){
                                        tprice_watsons_bbia=0;
                                     } 
                                     arr_watsons_bbia.push(tprice_watsons_bbia);
                                }
                                else if(category=="64"){
                                     tprice_hince_website = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_hince_website) == "undefined"){
                                        tprice_hince_website=0;
                                     } 
                                     arr_hince_website.push(tprice_hince_website);
                                }
                                else if(category=="66"){
                                     tprice_hince_shopee = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_hince_shopee) == "undefined"){
                                        tprice_hince_shopee=0;
                                     } 
                                     arr_hince_shopee.push(tprice_hince_shopee);
                                }else if(category=="68"){
                                     tprice_hince_lazada = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_hince_lazada) == "undefined"){
                                        tprice_hince_lazada=0;
                                     } 
                                     arr_hince_lazada.push(tprice_hince_lazada);
                                }else if(category=="70"){
                                     tprice_hince_tiktok = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_hince_tiktok) == "undefined"){
                                        tprice_hince_tiktok=0;
                                     } 
                                     arr_hince_tiktok.push(tprice_hince_tiktok);
                                }                                 
                               
                            
                            }
                           
                         }      
                         
                          /*  var arr_tiki_mixsoon=[];
                            var arr_tiktok_mixsoon=[];
                            var arr_watsons_bbia=[];
                            var arr_hince_website=[];
                            var arr_hince_shopee=[];
                            var arr_hince_lazada=[];
                            var arr_hince_tiktok=[]     */            
                          
                        tprice_shop_total=  (arr_sky007[index_shop]!== undefined ? arr_sky007[index_shop] : 0) + (arr_tiktok_sky007[index_shop]!== undefined ? arr_tiktok_sky007[index_shop] : 0) + (arr_shoppe[index_shop]!== undefined ? arr_shoppe[index_shop] : 0)
                                            + (arr_shoppe_eglips[index_shop]!== undefined ? arr_shoppe_eglips[index_shop] : 0)+ (arr_eglips[index_shop]!== undefined ? arr_eglips[index_shop] : 0)+ (arr_lazada[index_shop]!== undefined ? arr_lazada[index_shop] : 0)
                                            + (arr_lazada_eglips[index_shop]!== undefined ? arr_lazada_eglips[index_shop] : 0)+ (arr_tiktok[index_shop]!== undefined ? arr_tiktok[index_shop] : 0)+ (arr_tiki[index_shop]!== undefined ? arr_tiki[index_shop] : 0)
                                            + (arr_bbiavn[index_shop]!== undefined ? arr_bbiavn[index_shop] : 0)+ (arr_tiki_eglips[index_shop]!== undefined ? arr_tiki_eglips[index_shop] : 0)+ (arr_mixsoon_website[index_shop]!== undefined ? arr_mixsoon_website[index_shop] : 0)
                                            + (arr_shopee_mixsoon[index_shop]!== undefined ? arr_shopee_mixsoon[index_shop] : 0)+ (arr_lazada_mixsoon[index_shop]!== undefined ? arr_lazada_mixsoon[index_shop] : 0)                                            
                                            + (arr_tiki_mixsoon[index_shop]!== undefined ? arr_tiki_mixsoon[index_shop] : 0)+ (arr_tiktok_mixsoon[index_shop]!== undefined ? arr_tiktok_mixsoon[index_shop] : 0)
                                            + (arr_hince_website[index_shop]!== undefined ? arr_hince_website[index_shop] : 0)+ (arr_hince_shopee[index_shop]!== undefined ? arr_hince_shopee[index_shop] : 0)
                                            + (arr_hince_lazada[index_shop]!== undefined ? arr_hince_lazada[index_shop] : 0)+ (arr_hince_tiktok[index_shop]!== undefined ? arr_hince_tiktok[index_shop] : 0);
                      
                      //  tprice_shop_total =arr_sky007[index_shop] +arr_tiktok_sky007[index_shop] + arr_shoppe[index_shop] + arr_shoppe_eglips[index_shop] + arr_eglips[index_shop]  + arr_lazada[index_shop] + arr_lazada_eglips[index_shop] +arr_tiktok[index_shop] + arr_tiki[index_shop] + arr_bbiavn[index_shop] + arr_tiki_eglips[index_shop] + arr_mixsoon_website[index_shop] + arr_shopee_mixsoon[index_shop] + arr_lazada_mixsoon[index_shop] + arr_tiktok_sky007[index_shop] ;
                        arr_shop_total.push(tprice_shop_total);
                        tprice_wholesaler_total=  (arr_wholesaler[index_shop]!== undefined ? arr_wholesaler[index_shop] : 0) + (arr_eglips_wholesaler[index_shop]!== undefined ? arr_eglips_wholesaler[index_shop] : 0) + (arr_sociolla[index_shop]!== undefined ? arr_sociolla[index_shop] : 0)
                                            + (arr_watson[index_shop]!== undefined ? arr_watson[index_shop] : 0)+ (arr_guardian[index_shop]!== undefined ? arr_guardian[index_shop] : 0)
                                            + (arr_watsons_bbia[index_shop]!== undefined ? arr_watsons_bbia[index_shop] : 0);
                      //  tprice_wholesaler_total=parseInt(arr_wholesaler[index_shop]) + parseInt(arr_eglips_wholesaler[index_shop]) + parseInt(arr_sociolla[index_shop]) +parseInt(arr_watson[index_shop]) + parseInt(arr_guardian[index_shop]);
                        arr_wholesaler_total.push(tprice_wholesaler_total)
                 
                  
                    }
                    //  console.log(arr_shop_total)
                 //  console.log(arr_wholesaler_total)

                } else if (sy < ey) {
                    for (var i = sm; i <= 11; i++) {
                        arr_date.push((i + 1) + "_" + sy);
                        arr_date_char.push(monthNames[i] + "(" + sy + ")");
                    }
                    for (var i = 0; i <= em; i++) {
                        arr_date.push((i + 1) + "_" + ey);
                        arr_date_char.push(monthNames[i] + "(" + ey + ")");
                    }
                    for (var i = 0; i < arr_date.length; i++) {
                        var date_element = arr_date[i];
                        var index_shop = i; 
                       //  console.log(date_element);        
                        for (var j = 0; j < data.length; j++) {
                            var time = data[j]['time'];
                            var category = parseInt(data[j]['ord_category']);
                         //   console.log(time);
                            var tprice_sky007 = 0;
                            var tprice_wholesaler = 0;
                            var tprice_shoppe = 0;                       
                            var tprice_shoppe_eglips = 0;
                            var tprice_eglips = 0;
                            var tprice_eglips_wholesaler = 0;
                            var tprice_lazada = 0;
                            var tprice_lazada_eglips = 0;                        
                            var tprice_sociolla = 0;
                            var tprice_tiktok = 0;
                            var tprice_watson = 0;
                            var tprice_tiki = 0;
                            var tprice_bbiavn = 0;
                            var tprice_guardian = 0;
                            var tprice_shop_total = 0;
                            var tprice_tiki_eglips = 0;
                            var tprice_mixsoon_website = 0;
                            var tprice_shopee_mixsoon = 0;
                            var tprice_lazada_mixsoon = 0;
                            var tprice_tiktok_sky007 = 0;
                            var tprice_wholesaler_total=0;
                            
                            var tprice_tiki_mixsoon=[];
                            var tprice_tiktok_mixsoon=[];
                            var tprice_watsons_bbia=[];
                            var tprice_hince_website=[];
                            var tprice_hince_shopee=[];
                            var tprice_hince_lazada=[];
                            var tprice_hince_tiktok=[]; 

                            if (date_element == time) {  
                                if(category=="0"){
                                     tprice_sky007 = parseInt(data[j]['total_price']);                                     
                                     arr_sky007.push(tprice_sky007);
                                }else if(category=="7"){
                                     tprice_wholesaler = parseInt(data[j]['total_price']);                                      
                                     arr_wholesaler.push(tprice_wholesaler);
                                }else if(category=="10"){
                                     tprice_shoppe = parseInt(data[j]['total_price']);                                      
                                     arr_shoppe.push(tprice_shoppe);
                                }
                                else if(category=="18"){
                                     tprice_eglips = parseInt(data[j]['total_price']);                                      
                                     arr_eglips.push(tprice_eglips);
                                }
                                else if(category=="20"){
                                     tprice_lazada = parseInt(data[j]['total_price']);                                     
                                     arr_lazada.push(tprice_lazada);
                                }
                                else if(category=="22"){
                                     tprice_eglips_wholesaler = parseInt(data[j]['total_price']);  
                                     arr_eglips_wholesaler.push(tprice_eglips_wholesaler);
                                }
                                else if(category=="24"){
                                     tprice_shoppe_eglips = parseInt(data[j]['total_price']);                                     
                                     arr_shoppe_eglips.push(tprice_shoppe_eglips);
                                }
                                else if(category=="26"){
                                     tprice_lazada_eglips = parseInt(data[j]['total_price']);                                      
                                     arr_lazada_eglips.push(tprice_lazada_eglips);
                                }
                                else if(category=="30"){
                                     tprice_watson = parseInt(data[j]['total_price']);                                     
                                     arr_watson.push(tprice_watson);
                                }else if(category=="36"){
                                     tprice_tiki = parseInt(data[j]['total_price']);                                    
                                     arr_tiki.push(tprice_tiki);
                                }else if(category=="42"){
                                     tprice_tiki_eglips = parseInt(data[j]['total_price']);                                      
                                     arr_tiki_eglips.push(tprice_tiki_eglips);
                                }else if(category=="44"){
                                     tprice_sociolla = parseInt(data[j]['total_price']);                                     
                                     arr_sociolla.push(tprice_sociolla);
                                }
                                else if(category=="46"){
                                     tprice_bbiavn = parseInt(data[j]['total_price']);                                      
                                     arr_bbiavn.push(tprice_bbiavn);
                                }
                                else if(category=="48"){
                                     tprice_mixsoon_website = parseInt(data[j]['total_price']);                                     
                                     arr_mixsoon_website.push(tprice_mixsoon_website);
                                }
                                else if(category=="50"){
                                     tprice_guardian = parseInt(data[j]['total_price']);                                      
                                     arr_guardian.push(tprice_guardian);
                                }                                
                                else if(category=="52"){
                                     tprice_shopee_mixsoon = parseInt(data[j]['total_price']);                                     
                                     arr_shopee_mixsoon.push(tprice_shopee_mixsoon);
                                }                                
                                else if(category=="54"){
                                     tprice_lazada_mixsoon = parseInt(data[j]['total_price']);                                     
                                     arr_lazada_mixsoon.push(tprice_lazada_mixsoon);
                                } 
                                 else if(category=="56"){
                                     tprice_tiki_mixsoon = parseInt(data[j]['total_price']);                                     
                                     arr_tiki_mixsoon.push(tprice_tiki_mixsoon);
                                }                                  
                                else if(category=="58"){
                                     tprice_tiktok_sky007 = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_tiktok_sky007) == "undefined"){
                                        tprice_tiktok_sky007=0;
                                     } 
                                     arr_tiktok_sky007.push(tprice_tiktok_sky007);
                                }else if(category=="60"){
                                     tprice_tiktok_mixsoon = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_tiktok_mixsoon) == "undefined"){
                                        tprice_tiktok_mixsoon=0;
                                     } 
                                     arr_tiktok_mixsoon.push(tprice_tiktok_mixsoon);
                                }else if(category=="62"){
                                     tprice_watsons_bbia = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_watsons_bbia) == "undefined"){
                                        tprice_watsons_bbia=0;
                                     } 
                                     arr_watsons_bbia.push(tprice_watsons_bbia);
                                }
                                else if(category=="64"){
                                     tprice_hince_website = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_hince_website) == "undefined"){
                                        tprice_hince_website=0;
                                     } 
                                     arr_hince_website.push(tprice_hince_website);
                                }
                                else if(category=="66"){
                                     tprice_hince_shopee = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_hince_shopee) == "undefined"){
                                        tprice_hince_shopee=0;
                                     } 
                                     arr_hince_shopee.push(tprice_hince_shopee);
                                }else if(category=="68"){
                                     tprice_hince_lazada = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_hince_lazada) == "undefined"){
                                        tprice_hince_lazada=0;
                                     } 
                                     arr_hince_lazada.push(tprice_hince_lazada);
                                }else if(category=="70"){
                                     tprice_hince_tiktok = parseInt(data[j]['total_price']);
                                      if (typeof(tprice_hince_tiktok) == "undefined"){
                                        tprice_hince_tiktok=0;
                                     } 
                                     arr_hince_tiktok.push(tprice_hince_tiktok);
                                }                                
                                    
                            }
                        }
                         tprice_shop_total=  (arr_sky007[index_shop]!== undefined ? arr_sky007[index_shop] : 0) + (arr_tiktok_sky007[index_shop]!== undefined ? arr_tiktok_sky007[index_shop] : 0) + (arr_shoppe[index_shop]!== undefined ? arr_shoppe[index_shop] : 0)
                                            + (arr_shoppe_eglips[index_shop]!== undefined ? arr_shoppe_eglips[index_shop] : 0)+ (arr_eglips[index_shop]!== undefined ? arr_eglips[index_shop] : 0)+ (arr_lazada[index_shop]!== undefined ? arr_lazada[index_shop] : 0)
                                            + (arr_lazada_eglips[index_shop]!== undefined ? arr_lazada_eglips[index_shop] : 0)+ (arr_tiktok[index_shop]!== undefined ? arr_tiktok[index_shop] : 0)+ (arr_tiki[index_shop]!== undefined ? arr_tiki[index_shop] : 0)
                                            + (arr_bbiavn[index_shop]!== undefined ? arr_bbiavn[index_shop] : 0)+ (arr_tiki_eglips[index_shop]!== undefined ? arr_tiki_eglips[index_shop] : 0)+ (arr_mixsoon_website[index_shop]!== undefined ? arr_mixsoon_website[index_shop] : 0)
                                            + (arr_shopee_mixsoon[index_shop]!== undefined ? arr_shopee_mixsoon[index_shop] : 0)+ (arr_lazada_mixsoon[index_shop]!== undefined ? arr_lazada_mixsoon[index_shop] : 0)
                                            + (arr_tiki_mixsoon[index_shop]!== undefined ? arr_tiki_mixsoon[index_shop] : 0)+ (arr_tiktok_mixsoon[index_shop]!== undefined ? arr_tiktok_mixsoon[index_shop] : 0)
                                            + (arr_hince_website[index_shop]!== undefined ? arr_hince_website[index_shop] : 0)+ (arr_hince_shopee[index_shop]!== undefined ? arr_hince_shopee[index_shop] : 0)
                                            + (arr_hince_lazada[index_shop]!== undefined ? arr_hince_lazada[index_shop] : 0)+ (arr_hince_tiktok[index_shop]!== undefined ? arr_hince_tiktok[index_shop] : 0);
                                            
                        arr_shop_total.push(tprice_shop_total);
                        
                        tprice_wholesaler_total=  (arr_wholesaler[index_shop]!== undefined ? arr_wholesaler[index_shop] : 0) + (arr_eglips_wholesaler[index_shop]!== undefined ? arr_eglips_wholesaler[index_shop] : 0) + (arr_sociolla[index_shop]!== undefined ? arr_sociolla[index_shop] : 0)
                                            + (arr_watson[index_shop]!== undefined ? arr_watson[index_shop] : 0)+ (arr_guardian[index_shop]!== undefined ? arr_guardian[index_shop] : 0)
                                            + (arr_watsons_bbia[index_shop]!== undefined ? arr_watsons_bbia[index_shop] : 0);
                     
                        arr_wholesaler_total.push(tprice_wholesaler_total)
                     
                        

                    }
                }
                Highcharts.chart('order_monthly_sale_comparison', {
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: 'Source: Sky007.vn'
                    },
                    xAxis: {
                        categories: arr_date_char
                    },
                    yAxis: {
                        title: {
                            text: 'Total Price'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: [{
                        name: 'Sky007',
                        data: arr_sky007
                    }, {
                        name: 'Wholesaler',
                        data: arr_wholesaler
                    }, {
                        name: 'Shopee Bbia',
                        data: arr_shoppe
                    }, {
                        name: 'Shopee Eglips',
                        data: arr_shoppe_eglips
                    }, {
                        name: 'Eglips',
                        data: arr_eglips
                    }, {
                        name: 'Eglips Wholesaler',
                        data: arr_eglips_wholesaler
                    }, {
                        name: 'Lazada Bbia',
                        data: arr_lazada
                    }, {
                        name: 'Lazada Eglips',
                        data: arr_lazada_eglips
                    }, {
                        name: 'Tiktok',
                        data: arr_tiktok
                    }, {
                        name: 'Watson',
                        data: arr_watson
                    }, {
                        name: 'Sociolla',
                        data: arr_sociolla
                    }, {
                        name: 'Tiki',
                        data: arr_tiki
                    }, {
                        name: 'Bbiavn',
                        data: arr_bbiavn
                    }, {
                        name: 'Guardian',
                        data: arr_guardian
                    }, {
                        name: 'Tiki Eglips',
                        data: arr_tiki_eglips
                    }, {
                        name: 'mixsoon website',
                        data: arr_mixsoon_website
                    }, {
                        name: 'Shopee Mixsoon',
                        data: arr_shopee_mixsoon
                    }, {
                        name: 'Lazada mixsoon',
                        data: arr_lazada_mixsoon
                    }]
                });
           
                
                
                Highcharts.chart('order_monthly_sale_comparison_wholesaler', {
                chart: {
                    type: 'column'
                },
                subtitle: {
                        text: 'Source: Sky007.vn'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: arr_date_char
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Percent'
                    }
                },
                tooltip: {                     
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: 'percent',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                series: [{
                    name: 'WholeSaler',
                    data: arr_wholesaler_total
                }, {
                    name: 'Shop',
                    data: arr_shop_total
                }]
            }); 


            }
        } 
        function draw_chart_sale(data_hcm,data_hn, startdate, enddate,name_chart) {
          //console.log(data_hcm);
            if (data_hcm.length > 0) {
                var st = new Date(startdate);
                var sm = st.getMonth();
                var et = new Date(enddate);
                var em = et.getMonth();
                var sy = st.getFullYear();
                var ey = et.getFullYear();

                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var arr_date = [];
                var arr_date_char = [];
               
                var arr_sale_total_hcm=[];
                var arr_sale_total_hn=[];
                    
                if (sy == ey) {
                  // console.log(data);
                    for (var i = 0; i < data_hcm.length; i++) {
                        var total_price=parseInt(data_hcm[i]["total_price"]);
                        var date_time=monthNames[parseInt(data_hcm[i]["time"]-1)];
                        var obj_total=[date_time,total_price];
                        arr_sale_total_hcm.push(obj_total);
                    }
                    for (var i = 0; i < data_hn.length; i++) {
                        var total_price=parseInt(data_hn[i]["total_price"]);
                        var date_time=monthNames[parseInt(data_hn[i]["time"]-1)];
                        var obj_total=[date_time,total_price];
                        arr_sale_total_hn.push(obj_total);
                    }
                   

                } else if (sy < ey) {
                   
                    for (var i = 0; i < data_hcm.length; i++) {
                        var total_price=parseInt(data_hcm[i]["total_price"]);
                        var date_time=data_hcm[i]["time"];
                        var splitstring = date_time.split('_');
                        var date_time_fn=monthNames[parseInt(splitstring[0]-1)]+"("+splitstring[1]+")";
                        var obj_total=[date_time_fn,total_price];
                        arr_sale_total_hcm.push(obj_total);
                    }
                    for (var i = 0; i < data_hn.length; i++) {
                        var total_price=parseInt(data_hn[i]["total_price"]);
                        var date_time=data_hn[i]["time"];
                        var splitstring = date_time.split('_');
                        var date_time_fn=monthNames[parseInt(splitstring[0]-1)]+"("+splitstring[1]+")";
                        var obj_total=[date_time_fn,total_price];
                        arr_sale_total_hn.push(obj_total);
                    }
                   // console.log(arr_sale_total_hcm);
                }
               
                
                Highcharts.chart(name_chart, {
                chart: {
                    type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        min: 0,
                    title: {
                        text: ''
                    }
            
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                       column: {
                        dataLabels: {
                                        enabled: true,
                                        formatter: function () {
                                            return '' + Highcharts.numberFormat(this.y, 0, ',', ' ');
                                        }
                                    }
                                }
                    },
            tooltip: {                     
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> {point.percentage:.0f}<br/>',
                    shared: true
                },
            
                    series: [{
                        name: 'Actsone',
                        colorByPoint: true,
                        data: arr_sale_total_hcm
                    },{
                        name: 'Jnain',
                        colorByPoint: true,
                        data: arr_sale_total_hn
                    }]
    
            }); 
           

            }
        } 
        function get_data_report_forchart(data, category, startdate, enddate, idchart, title_chart, y_title) {
            if (data.length > 0) {
                var arr_bbia = [];
                var arr_eglips = [];
                var arr_another = [];
                var st = new Date(startdate);
                var sm = st.getMonth();
                var et = new Date(enddate);
                var em = et.getMonth();
                var sy = st.getFullYear();
                var ey = et.getFullYear();

                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var arr_date = [];
                var arr_date_char = [];
                if (sy == ey) {
                    for (var i = sm; i <= em; i++) {
                        arr_date.push(i);
                        arr_date_char.push(monthNames[i]);
                    }
                    // console.log(arr_date);

                    for (var i = 0; i < arr_date.length; i++) {
                        var date_element = arr_date[i];
                        var index_bbia = "";
                        var index_eglips = "";
                        var index_another = "";
                        var flag_bbia = "false";
                        var flag_eglips = "false";
                        var flag_another = "false";
                        var tprice_bbia = 0;
                        var tprice_eglips = 0;
                        var tprice_another = 0;
                        //tprice_bbia=parseInt(data[j]['total_price']);
                        //  tprice_eglips=parseInt(data[j]['total_price']);
                        for (var j = 0; j < data.length; j++) {
                            var sale_type = data[j]['category'];
                            var time = parseInt(data[j]['time']);
                            time = (time - 1);
                            if (sale_type == "1" && date_element == time) {
                                index_eglips = j;
                                flag_eglips = "true";
                                //  break;
                            } else if (sale_type == "2" && date_element == time) {
                                index_bbia = j;
                                flag_bbia = "true";
                                //  break;
                            } else if (sale_type == "0" && date_element == time) {
                                index_another = j;
                                flag_another = "true";
                            }

                        }
                        if (flag_bbia == "false") {
                            arr_bbia.push(tprice_bbia);
                        } else if (flag_bbia == "true") {
                            tprice_bbia = parseInt(data[index_bbia]['total_price']);
                            arr_bbia.push(tprice_bbia);
                        }
                        if (flag_eglips == "false") {
                            arr_eglips.push(tprice_eglips);
                        } else if (flag_eglips == "true") {
                            tprice_eglips = parseInt(data[index_eglips]['total_price']);
                            arr_eglips.push(tprice_eglips);
                        }
                        if (flag_another == "false") {
                            arr_another.push(tprice_another);
                        } else if (flag_another == "true") {
                            tprice_another = parseInt(data[index_another]['total_price']);
                            arr_another.push(tprice_another);
                        }

                    }
                } else if (sy < ey) {
                    for (var i = sm; i <= 11; i++) {
                        arr_date.push((i + 1) + "_" + sy);
                        arr_date_char.push(monthNames[i] + "(" + sy + ")");
                    }
                    for (var i = 0; i <= em; i++) {
                        arr_date.push((i + 1) + "_" + ey);
                        arr_date_char.push(monthNames[i] + "(" + ey + ")");
                    }
                    for (var i = 0; i < arr_date.length; i++) {
                        var date_element = arr_date[i];
                        var index_bbia = "";
                        var index_eglips = "";
                        var index_another = "";
                        var flag_bbia = "false";
                        var flag_eglips = "false";
                        var flag_another = "false";
                        var tprice_bbia = 0;
                        var tprice_eglips = 0;
                        var tprice_another = 0;
                        //tprice_bbia=parseInt(data[j]['total_price']);
                        //  tprice_eglips=parseInt(data[j]['total_price']);
                        for (var j = 0; j < data.length; j++) {
                            var sale_type = data[j]['category'];
                            var time = data[j]['time'];

                            if (sale_type == "1" && date_element == time) {
                                index_eglips = j;
                                flag_eglips = "true";
                                //  break;
                            } else if (sale_type == "2" && date_element == time) {
                                index_bbia = j;
                                flag_bbia = "true";
                                //  break;
                            } else if (sale_type == "0" && date_element == time) {
                                index_another = j;
                                flag_another = "true";
                            }

                        }
                        if (flag_bbia == "false") {
                            arr_bbia.push(tprice_bbia);
                        } else if (flag_bbia == "true") {
                            tprice_bbia = parseInt(data[index_bbia]['total_price']);
                            arr_bbia.push(tprice_bbia);
                        }
                        if (flag_eglips == "false") {
                            arr_eglips.push(tprice_eglips);
                        } else if (flag_eglips == "true") {
                            tprice_eglips = parseInt(data[index_eglips]['total_price']);
                            arr_eglips.push(tprice_eglips);
                        }
                        if (flag_another == "false") {
                            arr_another.push(tprice_another);
                        } else if (flag_another == "true") {
                            tprice_another = parseInt(data[index_another]['total_price']);
                            arr_another.push(tprice_another);
                        }

                    }
                }
                linechart(arr_date_char, arr_bbia, arr_eglips, arr_another, idchart, title_chart, y_title);

            }
        }
        function get_data_report_forchart_mixsoon(data, category, startdate, enddate, idchart, title_chart, y_title) {
            if (data.length > 0) {
                var arr_mixsoon = [];              
                var st = new Date(startdate);
                var sm = st.getMonth();
                var et = new Date(enddate);
                var em = et.getMonth();
                var sy = st.getFullYear();
                var ey = et.getFullYear();

                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var arr_date = [];
                var arr_date_char = [];
                if (sy == ey) {
                    for (var i = sm; i <= em; i++) {
                        arr_date.push(i);
                        arr_date_char.push(monthNames[i]);
                    }
                    // console.log(arr_date);

                    for (var i = 0; i < arr_date.length; i++) {
                        var date_element = arr_date[i];
                        var index_mixsoon = "";  
                        var tprice_mixsoon = 0;                 
                        
                        for (var j = 0; j < data.length; j++) {                          
                            var time = parseInt(data[j]['time']);
                            time = (time - 1);
                             if (date_element == time) {                               
                                tprice_mixsoon = parseInt(data[j]['total_price']);
                                arr_mixsoon.push(tprice_mixsoon);                            
                            } 

                        }                       
                        
                        
                       

                    }
                } else if (sy < ey) {
                    for (var i = sm; i <= 11; i++) {
                        arr_date.push((i + 1) + "_" + sy);
                        arr_date_char.push(monthNames[i] + "(" + sy + ")");
                    }
                    for (var i = 0; i <= em; i++) {
                        arr_date.push((i + 1) + "_" + ey);
                        arr_date_char.push(monthNames[i] + "(" + ey + ")");
                    }
                    for (var i = 0; i < arr_date.length; i++) {
                        var date_element = arr_date[i];
                        var index_mixsoon = "";
                     
                        var tprice_mixsoon = 0;
                     
              
                        for (var j = 0; j < data.length; j++) {                          
                            var time = data[j]['time'];
                            if ( date_element == time) {                               
                                tprice_mixsoon = parseInt(data[j]['total_price']);
                                arr_mixsoon.push(tprice_mixsoon);
                               
                            } 

                        }
                      
                        
                                           

                    }
                }
                linechart_mixsoon(arr_date_char, arr_mixsoon, idchart, title_chart, y_title);

            }
        }
    }
]);
//============================ End Time Based ==============================

//============================ Chart report order ==================================

App.controller('RCOrderCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkCRIOrder");
        set_date_time($scope, '7');
        // $scope.time_search ="Begining";
        $scope.loadData = function() {
            load_data();
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            get_data_total_order(fromdate, todate, 0);
        }
        $scope.data_fillter = function() {
            load_data();
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            get_data_total_order(fromdate, todate, 1);
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            get_data_total_monthly(fromdate, todate);
            get_data_number_order(fromdate, todate, "all", "order_total", "Number Total Order");
            get_data_number_order(fromdate, todate, "0", "order_sky007", "Number Order Sky007");
            get_data_number_order(fromdate, todate, "5", "order_marketing_sky007", "Number Order Sky007 Marketing");
            get_data_number_order(fromdate, todate, "7", "order_wholesaler", "Number Order Wholesaler");
            get_data_number_order(fromdate, todate, "10", "order_shopee", "Number Order Shopee Bbia");
            get_data_number_order(fromdate, todate, "11", "order_marketing_shopee", "Number Order Shopee Bbia Marketing");
       
            get_data_number_order(fromdate, todate, "44", "order_sociolla", "Number Order Sociolla");
            get_data_number_order(fromdate, todate, "45", "order_marketing_sociolla", "Number Order Sociolla Marketing");
            get_data_number_order(fromdate, todate, "64", "order_hince", "Number Order Hince");
            get_data_number_order(fromdate, todate, "65", "order_marketing_hince", "Number Order Hince Marketing");
            get_data_number_order(fromdate, todate, "20", "order_lazada", "Number Order Lazada Bbia");
            get_data_number_order(fromdate, todate, "21", "order_marketing_lazada", "Number Order Lazada Bbia Marketing");            
            get_data_number_order(fromdate, todate, "22", "order_eglips_wholesaler", "Number Order Jnain Wholesaler");
            get_data_number_order(fromdate, todate, "66", "order_shopee_hince", "Number Order Shopee Hince");
            get_data_number_order(fromdate, todate, "67", "order_marketing_shopee_hince", "Number Order Shopee Hine Marketing");            
            get_data_number_order(fromdate, todate, "68", "order_lazada_hince", "Number Order Lazada Hince");
            get_data_number_order(fromdate, todate, "69", "order_marketing_lazada_hince", "Number Order Lazada Hince Marketing");
            get_data_number_order(fromdate, todate, "30", "order_watsons", "Number Order Watsons");
            get_data_number_order(fromdate, todate, "31", "order_marketing_watsons", "Number Order Watsons Marketing");
        //    get_data_number_order(fromdate, todate, "34", "order_beautybox", "Number Order Beautybox");
        //    get_data_number_order(fromdate, todate, "35", "order_marketing_beautybox", "Number Order Beautybox Marketing");
            get_data_number_order(fromdate, todate, "36", "order_tiki", "Number Order Tiki");
            get_data_number_order(fromdate, todate, "37", "order_marketing_tiki", "Number Order Tiki Marketing");
   
            get_data_number_order(fromdate, todate, "70", "order_tiktok_hince", "Number Order Tiktok Hince");
            get_data_number_order(fromdate, todate, "71", "order_marketing_tiktok_hince", "Number Order Tiktok Hince Marketing");
            get_data_number_order(fromdate, todate, "46", "order_bbiavn", "Number Order Bbiavn");
            get_data_number_order(fromdate, todate, "47", "order_marketing_bbiavn", "Number Order Bbiavn Marketing");
            get_data_number_order(fromdate, todate, "48", "order_mixsoon", "Number Order Mixsoon");
            get_data_number_order(fromdate, todate, "49", "order_marketing_mixsoon", "Number Order Mixsoon Marketing");
            get_data_number_order(fromdate, todate, "60", "order_tiktok_mixsoon", "Number Order Tiktok Mixsoon");


        }

        function get_data_total_monthly(fromdate, todate) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_order_total_monthly",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                    //    console.log(data);
                    var data_total = data["data_total"];
                    var data_number = data["data_number"];
                    //   console.log(data_total);
                    if (data_total.length > 0) {
                        var membership_type_name = ["Sky007", "Mixsoon", "Shopee", "Eglips", "Lazada","ShopeeEglips","LazadaEglips",'Sociolla','Watsons','Tiki','TikiEglips','Bbiavn','Guardian','LazadaMixsoon','ShopeeMixsoon','TiktokSky007']; //'Beautybox' ,'ShopeeC2C','LazadaC2C'
                        // create array membership type
                        for (var l = 0; l < membership_type_name.length; l++) {
                            var mbs_type = membership_type_name[l];
                            window['arr_' + mbs_type + '_total'] = [];
                            window['arr_' + mbs_type + '_number'] = [];
                            window['arr_' + mbs_type + '_average'] = [];
                        }
                        //-------------------------------- 
                        var st = new Date(fromdate);
                        var sm = st.getMonth();
                        var et = new Date(todate);
                        var em = et.getMonth();
                        var sy = st.getFullYear();
                        var ey = et.getFullYear();

                        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        var arr_date = [];
                        var arr_date_char = [];
                        if (sy == ey) {
                            for (var i = sm; i <= em; i++) {
                                arr_date.push(i);
                                arr_date_char.push(monthNames[i]);
                            }

                            for (var i = 0; i < arr_date.length; i++) {
                                var date_element = arr_date[i];
                                for (var l = 0; l < membership_type_name.length; l++) {
                                    var mbs_type = membership_type_name[l];
                                    window['arr_' + mbs_type + '_total'].push(0);
                                    window['arr_' + mbs_type + '_number'].push(0);
                                    window['arr_' + mbs_type + '_average'].push(0);

                                }


                                for (var j = 0; j < data_total.length; j++) {
                                    var roles_type = data_total[j]['ord_category'];
                                    var time = parseInt(data_total[j]['date']);
                                    var total_order = parseInt(data_total[j]['total_order']);
                                    time = (time - 1);

                                    if (roles_type == "0" && date_element == time) {
                                        arr_Sky007_total[i] = total_order;
                                    } else if (roles_type == "10" && date_element == time) {
                                        arr_Shopee_total[i] = total_order;
                                    } else if (roles_type == "44" && date_element == time) {
                                        arr_Sociolla_total[i] = total_order;
                                    } else if (roles_type == "18" && date_element == time) {
                                        arr_Eglips_total[i] = total_order;
                                    } else if (roles_type == "20" && date_element == time) {
                                        arr_Lazada_total[i] = total_order;
                                    } else if (roles_type == "24" && date_element == time) {
                                        arr_ShopeeEglips_total[i] = total_order;
                                    } else if (roles_type == "26" && date_element == time) {
                                        arr_LazadaEglips_total[i] = total_order;
                                    } else if (roles_type == "30" && date_element == time) {
                                        arr_Watsons_total[i] = total_order;
                                    } else if (roles_type == "36" && date_element == time) {
                                        arr_Tiki_total[i] = total_order;
                                    }  else if (roles_type == "42" && date_element == time) {
                                        arr_TikiEglips_total[i] = total_order;
                                    }  else if (roles_type == "46" && date_element == time) {
                                        arr_Bbiavn_total[i] = total_order;
                                    }  else if (roles_type == "48" && date_element == time) {
                                        arr_Mixsoon_total[i] = total_order;
                                    }  else if (roles_type == "50" && date_element == time) {
                                        arr_Guardian_total[i] = total_order;
                                    } else if (roles_type == "52" && date_element == time) {
                                        arr_ShopeeMixsoon_total[i] = total_order;
                                    } else if (roles_type == "54" && date_element == time) {
                                        arr_LazadaMixsoon_total[i] = total_order;
                                    } else if (roles_type == "58" && date_element == time) {
                                        arr_TiktokSky007_total[i] = total_order;
                                    }
                                    

                                }
                                // console.log(arr_Customer_total);
                                for (var j = 0; j < data_number.length; j++) {
                                    var roles_type = data_number[j]['ord_category'];
                                    var time = parseInt(data_number[j]['date']);
                                    var total_order = parseInt(data_number[j]['total_order']);
                                    time = (time - 1);
                                    if (roles_type == "0" && date_element == time) {
                                        arr_Sky007_number[i] = total_order;
                                    } else if (roles_type == "10" && date_element == time) {
                                        arr_Shopee_number[i] = total_order;
                                    } else if (roles_type == "44" && date_element == time) {
                                        arr_Sociolla_number[i] = total_order;
                                    } else if (roles_type == "18" && date_element == time) {
                                        arr_Eglips_number[i] = total_order;
                                    } else if (roles_type == "20" && date_element == time) {
                                        arr_Lazada_number[i] = total_order;
                                    } else if (roles_type == "24" && date_element == time) {
                                        arr_ShopeeEglips_number[i] = total_order;
                                    } else if (roles_type == "26" && date_element == time) {
                                        arr_LazadaEglips_number[i] = total_order;
                                    } else if (roles_type == "30" && date_element == time) {
                                        arr_Watsons_number[i] = total_order;
                                    } else if (roles_type == "36" && date_element == time) {
                                        arr_Tiki_number[i] = total_order;
                                    } else if (roles_type == "42" && date_element == time) {
                                        arr_TikiEglips_number[i] = total_order;
                                    } else if (roles_type == "46" && date_element == time) {
                                        arr_Bbiavn_number[i] = total_order;
                                    } else if (roles_type == "48" && date_element == time) {
                                        arr_Mixsoon_number[i] = total_order;
                                    } else if (roles_type == "50" && date_element == time) {
                                        arr_Guardian_number[i] = total_order;
                                    }else if (roles_type == "52" && date_element == time) {
                                        arr_ShopeeMixsoon_number[i] = total_order;
                                    }else if (roles_type == "54" && date_element == time) {
                                        arr_LazadaMixsoon_number[i] = total_order;
                                    }else if (roles_type == "58" && date_element == time) {
                                        arr_TiktokSky007_number[i] = total_order;
                                    }
                                }

                            }


                            for (var i = 0; i < arr_date.length; i++) {
                                //   console.log(i);
                                for (var l = 0; l < membership_type_name.length; l++) {
                                    var mbs_type = membership_type_name[l];
                                    if (parseInt(window['arr_' + mbs_type + '_number'][i]) != 0) {
                                        var average = parseInt(window['arr_' + mbs_type + '_total'][i]) / parseInt(window['arr_' + mbs_type + '_number'][i])
                                        window['arr_' + mbs_type + '_average'][i] = parseInt(average);
                                    }

                                }
                            }
                            //  console.log(arr_Lazada_average);                

                        } else if (sy < ey) {
                            for (var i = sm; i <= 11; i++) {
                                arr_date.push((i + 1) + "_" + sy);
                                arr_date_char.push(monthNames[i] + "(" + sy + ")");
                            }
                            for (var i = 0; i <= em; i++) {
                                arr_date.push((i + 1) + "_" + ey);
                                arr_date_char.push(monthNames[i] + "(" + ey + ")");
                            }
                            // console.log(arr_date);
                            for (var i = 0; i < arr_date.length; i++) {
                                for (var i = 0; i < arr_date.length; i++) {
                                    var date_element = arr_date[i];

                                    for (var l = 0; l < membership_type_name.length; l++) {
                                        var mbs_type = membership_type_name[l];
                                        window['arr_' + mbs_type + '_total'].push(0);
                                        window['arr_' + mbs_type + '_number'].push(0);
                                        window['arr_' + mbs_type + '_average'].push(0);

                                    }


                                    for (var j = 0; j < data_total.length; j++) {
                                        var roles_type = data_total[j]['ord_category'];
                                        var time = data_total[j]['date'];
                                        var total_order = parseInt(data_total[j]['total_order']);
                                        //  time = (time - 1);

                                        if (roles_type == "0" && date_element == time) {
                                            arr_Sky007_total[i] = total_order;
                                        } else if (roles_type == "10" && date_element == time) {
                                            arr_Shopee_total[i] = total_order;
                                        }else if (roles_type == "44" && date_element == time) {
                                            arr_Sociolla_total[i] = total_order;
                                        } else if (roles_type == "18" && date_element == time) {
                                            arr_Eglips_total[i] = total_order;
                                        } else if (roles_type == "20" && date_element == time) {
                                            arr_Lazada_total[i] = total_order;
                                        } else if (roles_type == "24" && date_element == time) {
                                            arr_ShopeeEglips_total[i] = total_order;
                                        } else if (roles_type == "26" && date_element == time) {
                                            arr_LazadaEglips_total[i] = total_order;
                                        } else if (roles_type == "30" && date_element == time) {
                                            arr_Watsons_total[i] = total_order;
                                        } else if (roles_type == "36" && date_element == time) {
                                            arr_Tiki_total[i] = total_order;
                                        }  else if (roles_type == "42" && date_element == time) {
                                            arr_TikiEglips_total[i] = total_order;
                                        }  else if (roles_type == "46" && date_element == time) {
                                            arr_Bbiavn_total[i] = total_order;
                                        }  else if (roles_type == "48" && date_element == time) {
                                            arr_Mixsoon_total[i] = total_order;
                                        }  else if (roles_type == "50" && date_element == time) {
                                            arr_Guardian_total[i] = total_order;
                                        }  else if (roles_type == "52" && date_element == time) {
                                            arr_ShopeeMixsoon_total[i] = total_order;
                                        }  else if (roles_type == "54" && date_element == time) {
                                            arr_LazadaMixsoon_total[i] = total_order;
                                        }  else if (roles_type == "58" && date_element == time) {
                                            arr_TiktokSky007_total[i] = total_order;
                                        }

                                    }
                                    // console.log(arr_Sky007_total);
                                    for (var j = 0; j < data_number.length; j++) {
                                        var roles_type = data_number[j]['ord_category'];
                                        var time = data_number[j]['date'];
                                        var total_order = parseInt(data_number[j]['total_order']);
                                        if (roles_type == "0" && date_element == time) {
                                            arr_Sky007_number[i] = total_order;
                                        } else if (roles_type == "10" && date_element == time) {
                                            arr_Shopee_number[i] = total_order;
                                        } else if (roles_type == "44" && date_element == time) {
                                            arr_Sociolla_number[i] = total_order;
                                        } else if (roles_type == "18" && date_element == time) {
                                            arr_Eglips_number[i] = total_order;
                                        } else if (roles_type == "20" && date_element == time) {
                                            arr_Lazada_number[i] = total_order;
                                        } else if (roles_type == "24" && date_element == time) {
                                            arr_ShopeeEglips_number[i] = total_order;
                                        } else if (roles_type == "26" && date_element == time) {
                                            arr_LazadaEglips_number[i] = total_order;
                                        } else if (roles_type == "30" && date_element == time) {
                                            arr_Watsons_number[i] = total_order;
                                        } else if (roles_type == "36" && date_element == time) {
                                            arr_Tiki_number[i] = total_order;
                                        }  else if (roles_type == "42" && date_element == time) {
                                            arr_TikiEglips_number[i] = total_order;
                                        }  else if (roles_type == "46" && date_element == time) {
                                            arr_Bbiavn_number[i] = total_order;
                                        }  else if (roles_type == "48" && date_element == time) {
                                            arr_Mixsoon_number[i] = total_order;
                                        }  else if (roles_type == "50" && date_element == time) {
                                            arr_Guardian_number[i] = total_order;
                                        }  else if (roles_type == "52" && date_element == time) {
                                            arr_ShopeeMixsoon_number[i] = total_order;
                                        }  else if (roles_type == "54" && date_element == time) {
                                            arr_LazadaMixsoon_number[i] = total_order;
                                        }  else if (roles_type == "58" && date_element == time) {
                                            arr_TiktokSky007_number[i] = total_order;
                                        }
                                    }

                                }


                                for (var i = 0; i < arr_date.length; i++) {
                                    for (var l = 0; l < membership_type_name.length; l++) {
                                        var mbs_type = membership_type_name[l];
                                        if (parseInt(window['arr_' + mbs_type + '_number'][i]) != 0) {
                                            var average = parseInt(window['arr_' + mbs_type + '_total'][i]) / parseInt(window['arr_' + mbs_type + '_number'][i]);
                                            window['arr_' + mbs_type + '_average'][i] = parseInt(average);
                                        }
                                    }
                                }
                            }
                        }
                        $obj_data_total = [{
                            name: 'Sky007',
                            data: arr_Sky007_total
                        }, {
                            name: 'Shopee Bbia',
                            data: arr_Shopee_total
                        }, {
                            name: 'Eglips',
                            data: arr_Eglips_total
                        }, {
                            name: 'Lazada Bbia',
                            data: arr_Lazada_total
                        }, {
                            name: 'Shopee Elips',
                            data: arr_ShopeeEglips_total
                        }, {
                            name: 'Lazada Eglips',
                            data: arr_LazadaEglips_total
                        }, {
                            name: 'Sociolla',
                            data: arr_Sociolla_total
                        }, {
                            name: 'Watsons',
                            data: arr_Watsons_total
                        }, {
                            name: 'Tiki',
                            data: arr_Tiki_total
                        }, {
                            name: 'Tiki Eglips',
                            data: arr_TikiEglips_total
                        }, {
                            name: 'Bbiavn',
                            data: arr_Bbiavn_total
                        }, {
                            name: 'Mixsoon',
                            data: arr_Mixsoon_total
                        }, {
                            name: 'Guardian',
                            data: arr_Guardian_total
                        }, {
                            name: 'ShopeeMixsoon',
                            data: arr_ShopeeMixsoon_total
                        }, {
                            name: 'LazadaMixsoon',
                            data: arr_LazadaMixsoon_total
                        }, {
                            name: 'TiktokSky007',
                            data: arr_TiktokSky007_total
                        }];

                        //-------------------------------
                        $obj_data_avegare = [{
                            name: 'Sky007',
                            data: arr_Sky007_average
                        }, {
                            name: 'Shopee Bbia',
                            data: arr_Shopee_average
                        }, {
                            name: 'Eglips',
                            data: arr_Eglips_average
                        }, {
                            name: 'Lazada Bbia',
                            data: arr_Lazada_average
                        }, {
                            name: 'Shopee Eglips',
                            data: arr_ShopeeEglips_average
                        }, {
                            name: 'Lazada Eglips',
                            data: arr_LazadaEglips_average
                        }, {
                            name: 'Sociolla',
                            data: arr_Sociolla_average
                        }, {
                            name: 'Watsons',
                            data: arr_Watsons_average
                        } ,{
                            name: 'Tiki',
                            data: arr_Tiki_average
                        }, {
                            name: 'Tiki Eglips',
                            data: arr_TikiEglips_average
                        }, {
                            name: 'Bbiavn',
                            data: arr_Bbiavn_average
                        }, {
                            name: 'Mixsoon',
                            data: arr_Mixsoon_average
                        }, {
                            name: 'Guardian',
                            data: arr_Guardian_average
                        }, {
                            name: 'ShopeeMixsoon',
                            data: arr_ShopeeMixsoon_average
                        }, {
                            name: 'LazadaMixsoon',
                            data: arr_LazadaMixsoon_average
                        }, {
                            name: 'TiktokSky007',
                            data: arr_TiktokSky007_average
                        }];
                        //-------------------------------
                        $obj_data_number = [{
                            name: 'Sky007',
                            data: arr_Sky007_number
                        }, {
                            name: 'Shopee Bbia',
                            data: arr_Shopee_number
                        }, {
                            name: 'Eglips',
                            data: arr_Eglips_number
                        }, {
                            name: 'Lazada',
                            data: arr_Lazada_number
                        }, {
                            name: 'Shopee Eglips',
                            data: arr_ShopeeEglips_number
                        }, {
                            name: 'Lazada Eglips',
                            data: arr_LazadaEglips_number
                        }, {
                            name: 'Sociolla',
                            data: arr_Sociolla_number
                        }, {
                            name: 'Watsons',
                            data: arr_Watsons_number
                        }, {
                            name: 'Tiki',
                            data: arr_Tiki_number
                        }, {
                            name: 'Tiki Eglips',
                            data: arr_TikiEglips_number
                        }, {
                            name: 'Bbiavn',
                            data: arr_Bbiavn_number
                        }, {
                            name: 'Mixsoon',
                            data: arr_Mixsoon_number
                        }, {
                            name: 'Guardian',
                            data: arr_Guardian_number
                        }];
                        //         console.log($obj_data_avegare);
                        load_chart(arr_date_char, $obj_data_avegare, "order_total_average", "Average order");
                        load_chart(arr_date_char, $obj_data_total, "order_total_monthly", "Total order");
                        load_chart(arr_date_char, $obj_data_number, "order_total_monthly_number", "Number order");

                    }


                },
                error: function(e) {
                    console.log(e);
                }
            });
        }

        function load_chart(xdata, ydata, idchart, ytitle) {
            Highcharts.chart(idchart, {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: xdata
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ytitle
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: ydata
            });
        }

        function generate_date(start, end) {
            var datesArray = [];
            var startDate = new Date(start);
            var endDate = new Date(end);
            while (startDate <= endDate) {
                // var curr = year + "-" + month + "-" + day;
                var newdate = new Date(startDate);
                var year = newdate.getFullYear();
                var month = ("0" + (newdate.getMonth() + 1)).slice(-2);
                var day = ("0" + newdate.getDate()).slice(-2);
                var curr = year + "-" + month + "-" + day;
                datesArray.push(curr);
                startDate.setDate(startDate.getDate() + 1);
            }
            return datesArray;
        }

        function get_data_total_order(fromdate, todate, get_all) { // 0: get all ,1: get by time 
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "get_all": get_all
            };
            // $scope.time_search ="Begining";
            // $scope.number_cancell_eglips=78678;
            $http({
                
                method: "POST",
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_order_total",
                dataType: 'json',
                data: {
                    "start_date": fromdate,
                    "end_date": todate,
                    "get_all": get_all
                }
            }).then(function mySucces(response) {
              // console.log(response); return;
                var data = response["data"];
                //     console.log (parseInt(data));return;
                $scope.number_item_hince = data["hince_item"];
                $scope.number_item_mt_hince = data["hince_item_mt"];
                $scope.number_cancell_hince = data["hince_cancell"];
                $scope.number_order_hince = data["hince_order"];
                $scope.number_cancell_hince_rates = 0 + ' %';
                if (parseInt(data["hince_cancell"]) != 0) {
                    $scope.number_cancell_hince_rates = ((parseInt(data["hince_cancell"]) / parseInt(data["hince_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_lazada = data["lazada_item"];
                $scope.number_item_mt_lazada = data["lazada_item_mt"];
                $scope.number_cancell_lazada = data["lazada_cancell"];
                $scope.number_order_lazada = data["lazada_order"];
                $scope.number_cancell_lazada_rates = 0 + ' %';
                if (parseInt(data["lazada_cancell"]) != 0) {
                    $scope.number_cancell_lazada_rates = ((parseInt(data["lazada_cancell"]) / parseInt(data["lazada_order"]) * 100).toString()).substring(0, 4) + ' %';
                }                
              
                
                $scope.number_item_sociolla = data["sociolla_item"];
                $scope.number_item_mt_sociolla = data["sociolla_item_mt"];
                $scope.number_cancell_sociolla = data["sociolla_cancell"];
                $scope.number_order_sociolla = data["sociolla_order"];
                $scope.number_cancell_sociolla_rates = 0 + ' %';
                if (parseInt(data["sociolla_cancell"]) != 0) {
                    $scope.number_cancell_sociolla_rates = ((parseInt(data["sociolla_cancell"]) / parseInt(data["sociolla_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
          
                $scope.number_item_sky007 = data["sky007_item"];
                $scope.number_item_mt_sky007 = data["sky007_item_mt"];
                $scope.number_cancell_sky007 = data["sky007_cancell"];
                $scope.number_order_sky007 = data["sky007_order"];
                $scope.number_cancell_sky007_rates = 0 + ' %';
                if (parseInt(data["sky007_cancell"]) != 0) {
                    $scope.number_cancell_sky007_rates = ((parseInt(data["sky007_cancell"]) / parseInt(data["sky007_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                $scope.number_item_mixsoon = data["mixsoon_item"];
                $scope.number_item_mt_mixsoon = data["mixsoon_item_mt"];
                $scope.number_cancell_mixsoon = data["mixsoon_cancell"];
                $scope.number_order_mixsoon = data["mixsoon_order"];
                $scope.number_cancell_mixsoon_rates = 0 + ' %';
                if (parseInt(data["mixsoon_cancell"]) != 0) {
                    $scope.number_cancell_mixsoon_rates = ((parseInt(data["mixsoon_cancell"]) / parseInt(data["mixsoon_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                $scope.number_item_total = data["total_item"];
                $scope.number_item_mt_total = data["total_item_mt"];
                $scope.number_cancell_total = data["total_cancell"];
                $scope.number_order_total = data["total_order"];
                $scope.number_cancell_total_rates = 0 + ' %';
                if (parseInt(data["total_cancell"]) != 0) {
                    $scope.number_cancell_total_rates = ((parseInt(data["total_cancell"]) / parseInt(data["total_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_wholesaler = data["wholesaler_item"];
                $scope.number_cancell_wholesaler = data["wholesaler_cancell"];
                $scope.number_order_wholesaler = data["wholesaler_order"];
                $scope.number_cancell_wholesaler_rates = 0 + ' %';
                if (parseInt(data["wholesaler_cancell"]) != 0) {
                    $scope.number_cancell_wholesaler_rates = ((parseInt(data["wholesaler_cancell"]) / parseInt(data["wholesaler_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_wholesaler_eglips = data["wholesaler_eglips_item"];
                $scope.number_cancell_wholesaler_eglips = data["wholesaler_eglips_cancell"];
                $scope.number_order_wholesaler_eglips = data["wholesaler_eglips_order"];
                $scope.number_cancell_wholesaler_eglips_rates = 0 + ' %';
                if (parseInt(data["wholesaler_eglips_cancell"]) != 0) {
                    $scope.number_cancell_wholesaler_eglips_rates = ((parseInt(data["wholesaler_eglips_cancell"]) / parseInt(data["wholesaler_eglips_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_lazada_hince = data["lazada_hince_item"];
                $scope.number_item_mt_lazada_hince = data["lazada_hince_item_mt"];
                $scope.number_cancell_lazada_hince = data["lazada_hince_cancell"];
                $scope.number_order_lazada_hince = data["lazada_hince_order"];
                $scope.number_cancell_lazada_hince_rates = 0 + ' %';
                if (parseInt(data["lazada_hince_cancell"]) != 0) {
                    $scope.number_cancell_lazada_hince_rates = ((parseInt(data["lazada_hince_cancell"]) / parseInt(data["lazada_hince_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_shopee = data["shopee_item"];
                $scope.number_item_mt_shopee = data["shopee_item_mt"];
                $scope.number_cancell_shopee = data["shopee_cancell"];
                $scope.number_order_shopee = data["shopee_order"];
                $scope.number_cancell_shopee_rates = 0 + ' %';
                if (parseInt(data["shopee_cancell"]) != 0) {
                    $scope.number_cancell_shopee_rates = ((parseInt(data["shopee_cancell"]) / parseInt(data["shopee_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_shopee_hince = data["shopee_hince_item"];
                $scope.number_item_mt_shopee_hince = data["shopee_hince_item_mt"];
                $scope.number_cancell_shopee_hince = data["shopee_hince_cancell"];
                $scope.number_order_shopee_hince = data["shopee_hince_order"];
                $scope.number_cancell_shopee_rates_hince = 0 + ' %';
                if (parseInt(data["shopee_hince_cancell"]) != 0) {
                    $scope.number_cancell_shopee_rates_hince = ((parseInt(data["shopee_hince_cancell"]) / parseInt(data["shopee_hince_order"]) * 100).toString()).substring(0, 4) + ' %';
                }           
              //  console.log(data["shopee_eglips_item"])    ; console.log(data["shopee_eglips_order"]);
                $scope.number_item_watsons = data["watsons_item"];
                $scope.number_item_mt_watsons = data["watsons_item_mt"];
                $scope.number_cancell_watsons = data["watsons_cancell"];
                $scope.number_order_watsons = data["watsons_order"];
                $scope.number_cancell_watsons_rates = 0 + ' %';
                if (parseInt(data["watsons_cancell"]) != 0) {
                    $scope.number_cancell_watsons_rates = ((parseInt(data["watsons_cancell"]) / parseInt(data["watsons_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
               
                $scope.number_item_tiki = data["tiki_item"];
                $scope.number_item_mt_tiki = data["tiki_item_mt"];
                $scope.number_cancell_tiki = data["tiki_cancell"];
                $scope.number_order_tiki = data["tiki_order"];
                $scope.number_cancell_tiki_rates = 0 + ' %';
                if (parseInt(data["tiki_cancell"]) != 0) {
                    $scope.number_cancell_tiki_rates = ((parseInt(data["tiki_cancell"]) / parseInt(data["tiki_order"]) * 100).toString()).substring(0, 4) + ' %';
                }               
                
                $scope.number_item_tiktok_hince = data["tiktok_hince_item"];
                $scope.number_item_mt_tiktok_hince = data["tiktok_hince_item_mt"];
                $scope.number_cancell_tiktok_hince = data["tiktok_hince_cancell"];
                $scope.number_order_tiktok_hince = data["tiktok_hince_order"];
                $scope.number_cancell_tiktok_hince_rates = 0 + ' %';
                if (parseInt(data["tiktok_hince_cancell"]) != 0) {
                    $scope.number_cancell_tiktok_hince_rates = ((parseInt(data["tiktok_hince_cancell"]) / parseInt(data["tiktok_hince_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                $scope.number_item_bbiavn = data["bbiavn_item"];
                $scope.number_item_mt_bbiavn = data["bbiavn_item_mt"];
                $scope.number_cancell_bbiavn = data["bbiavn_cancell"];
                $scope.number_order_bbiavn = data["bbiavn_order"];
                $scope.number_cancell_bbiavn_rates = 0 + ' %';
                if (parseInt(data["bbiavn_cancell"]) != 0) {
                    $scope.number_cancell_bbiavn_rates = ((parseInt(data["bbiavn_cancell"]) / parseInt(data["bbiavn_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_guardian = data["guardian_item"];
                $scope.number_item_mt_guardian = data["guardian_item_mt"];
                $scope.number_cancellguardian = data["guardian_cancell"];
                $scope.number_order_guardian = data["guardian_order"];
                $scope.number_cancell_guardian_rates = 0 + ' %';
                if (parseInt(data["guardian_cancell"]) != 0) {
                    $scope.number_cancell_guardian_rates = ((parseInt(data["guardian_cancell"]) / parseInt(data["guardian_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_shopeemixsoon = data["shopeemixsoon_item"];
                $scope.number_item_mt_shopeemixsoon = data["shopeemixsoon_item_mt"];
                $scope.number_cancellshopeemixsoon = data["shopeemixsoon_cancell"];
                $scope.number_order_shopeemixsoon = data["shopeemixsoon_order"];
                $scope.number_cancell_shopeemixsoon_rates = 0 + ' %';
                if (parseInt(data["shopeemixsoon_cancell"]) != 0) {
                    $scope.number_cancell_shopeemixsoon_rates = ((parseInt(data["shopeemixsoon_cancell"]) / parseInt(data["shopeemixsoon_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_lazadamixsoon = data["lazadamixsoon_item"];
                $scope.number_item_mt_lazadamixsoon = data["lazadamixsoon_item_mt"];
                $scope.number_cancelllazadamixsoon = data["lazadamixsoon_cancell"];
                $scope.number_order_lazadamixsoon = data["lazadamixsoon_order"];
                $scope.number_cancell_lazadamixsoon_rates = 0 + ' %';
                if (parseInt(data["lazadamixsoon_cancell"]) != 0) {
                    $scope.number_cancell_lazadamixsoon_rates = ((parseInt(data["lazadamixsoon_cancell"]) / parseInt(data["lazadamixsoon_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_tiktoksky007 = data["tiktoksky007_item"];
                $scope.number_item_mt_tiktoksky007 = data["tiktoksky007_item_mt"];
                $scope.number_cancelltiktoksky007 = data["tiktoksky007_cancell"];
                $scope.number_order_tiktoksky007 = data["tiktoksky007_order"];
                $scope.number_cancell_tiktoksky007_rates = 0 + ' %';
                if (parseInt(data["tiktoksky007_cancell"]) != 0) {
                    $scope.number_cancell_tiktoksky007_rates = ((parseInt(data["tiktoksky007_cancell"]) / parseInt(data["tiktoksky007_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_tiktokmixsoon = data["tiktokmixsoon_item"];
                $scope.number_item_mt_tiktokmixsoon = data["tiktokmixsoon_item_mt"];
                $scope.number_cancelltiktokmixsoon = data["tiktokmixsoon_cancell"];
                $scope.number_order_tiktokmixsoon = data["tiktokmixsoon_order"];
                $scope.number_cancell_tiktokmixsoon_rates = 0 + ' %';
                if (parseInt(data["tiktokmixsoon_cancell"]) != 0) {
                    $scope.number_cancell_tiktokmixsoon_rates = ((parseInt(data["tiktoksmixsoon_cancell"]) / parseInt(data["tiktokmixsoon_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
              //  if (get_all == 1) {
                    $scope.time_search = fromdate + " ~ " + todate;
              //  } else {
               //     $scope.time_search = "Begining";
              //  }
            }, function myError(response) {

            });

        }

        function get_data_number_order(fromdate, todate, shopsale, idchart, name_line) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shopsale
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_order",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                  //   console.log(d);return;                   
                    var data = $.parseJSON(d);
                    var arr_data = [];
                    var arr_date = [];
                    var generate_arr_date = generate_date(fromdate, todate);
                    for (var i = 0; i < generate_arr_date.length; i++) {
                        var values_total_order = 0;
                        for (var j = 0; j < data.length; j++) {
                            if (generate_arr_date[i] == data[j]["date"]) {
                                values_total_order = parseInt(data[j]["total_order"]);
                            }
                        }
                        arr_data.push(values_total_order);
                        arr_date.push(generate_arr_date[i]);

                    }

                    // console.log(data);
                    get_data_report_forchart(arr_date, arr_data, idchart, name_line);
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }

        function get_data_report_forchart(date, data, idchart, name_line) {
            Highcharts.chart(idchart, {
                chart: {
                    type: 'line'
                },
                title: {
                    text: ""
                },
                subtitle: {
                    text: ' '
                },
                xAxis: {
                    categories: date
                },
                yAxis: {
                    title: {
                        text: "Number Order"
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: name_line,
                    data: data
                }]
            });
        }


    }
]);
//============================ End chart report order ==============================

//============================ Chart report membership order =======================
App.controller('RCMembershipOrderCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkCRMembershipOrder");
        set_date_time($scope, '30');
        $scope.loadData = function() {
            load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            get_data_number_order(fromdate, todate);
            get_data_total_order(fromdate, todate);
        }

        function generate_date(start, end) {
            var datesArray = [];
            var startDate = new Date(start);
            var endDate = new Date(end);
            while (startDate <= endDate) {
                // var curr = year + "-" + month + "-" + day;
                var newdate = new Date(startDate);
                var year = newdate.getFullYear();
                var month = ("0" + (newdate.getMonth() + 1)).slice(-2);
                var day = ("0" + newdate.getDate()).slice(-2);
                var curr = year + "-" + month + "-" + day;
                datesArray.push(curr);
                startDate.setDate(startDate.getDate() + 1);
            }
            return datesArray;
        }

        function get_data_number_order(fromdate, todate) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_membership_order",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    // console.log(d);return;                   
                    var data = $.parseJSON(d);
                    var arr_data_newmember = [];
                    var arr_data_general = [];
                    var arr_data_bronze = [];
                    var arr_data_silver = [];
                    var arr_data_gold = [];
                    var arr_data_platinum = [];
                    var arr_data_customer = [];
                    var arr_data_membership = [];
                    var arr_data_c_g = [];
                    var arr_date = [];
                    var generate_arr_date = generate_date(fromdate, todate);
                    for (var i = 0; i < generate_arr_date.length; i++) {
                        var values_total_order_newmember = 0;
                        var values_total_order_general = 0;
                        var values_total_order_bronze = 0;
                        var values_total_order_silver = 0;
                        var values_total_order_gold = 0;
                        var values_total_order_platinum = 0;
                        var values_total_order_customer = 0;
                        var values_total_membership = 0;
                        var values_total_c_g = 0;
                        for (var j = 0; j < data.length; j++) {
                            if (generate_arr_date[i] == data[j]["date"]) {
                                if (data[j]["roles"] == "New Member") {
                                    values_total_order_newmember = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "General") {
                                    values_total_order_general = parseInt(data[j]["total_order"]);
                                    values_total_c_g += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "Bronze") {
                                    values_total_order_bronze = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "Silver") {
                                    values_total_order_silver = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "Gold") {
                                    values_total_order_gold = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "VIP") {
                                    values_total_order_platinum = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "Customer") {
                                    values_total_order_customer = parseInt(data[j]["total_order"]);
                                    values_total_c_g += parseInt(data[j]["total_order"]);
                                }
                            }
                        }
                        arr_data_newmember.push(values_total_order_newmember);
                        arr_data_general.push(values_total_order_general);
                        arr_data_bronze.push(values_total_order_bronze);
                        arr_data_silver.push(values_total_order_silver);
                        arr_data_gold.push(values_total_order_gold);
                        arr_data_platinum.push(values_total_order_platinum);
                        arr_data_customer.push(values_total_order_customer);
                        arr_data_membership.push(values_total_membership);
                        arr_data_c_g.push(values_total_c_g);
                        arr_date.push(generate_arr_date[i]);


                    }
                    var json_data_customer = [{
                        "name": "Customer",
                        "data": arr_data_customer
                    }];
                    var json_data_general = [{
                        "name": "General",
                        "data": arr_data_general
                    }];
                    var json_data_combine = [{
                        "name": "membership",
                        "data": arr_data_membership
                    }, {
                        "name": "Customer and General",
                        "data": arr_data_c_g
                    }];
                    // console.log(data);
                    get_data_report_forchart(arr_date, arr_data_newmember, arr_data_general, arr_data_bronze, arr_data_silver, arr_data_gold, arr_data_platinum, 'order_number_total', 'Total number order');
                    get_data_report_forchart_general_and_customer(arr_date, json_data_general, 'order_number_total_general', 'Total number order');
                    get_data_report_forchart_general_and_customer(arr_date, json_data_customer, 'order_number_total_customer', 'Total number order');
                    get_data_report_forchart_general_and_customer(arr_date, json_data_combine, 'order_number_total_combine', 'Total number order');
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }

        function get_data_total_order(fromdate, todate) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_membership_total_order",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    // console.log(d);return;                   
                    var data = $.parseJSON(d);
                    var arr_data_newmember = [];
                    var arr_data_general = [];
                    var arr_data_bronze = [];
                    var arr_data_silver = [];
                    var arr_data_gold = [];
                    var arr_data_platinum = [];
                    var arr_data_customer = [];
                    var arr_data_membership = [];
                    var arr_data_c_g = [];
                    var arr_date = [];
                    var generate_arr_date = generate_date(fromdate, todate);
                    for (var i = 0; i < generate_arr_date.length; i++) {
                        var values_total_order_newmember = 0;
                        var values_total_order_general = 0;
                        var values_total_order_bronze = 0;
                        var values_total_order_silver = 0;
                        var values_total_order_gold = 0;
                        var values_total_order_platinum = 0;
                        var values_total_order_customer = 0;
                        var values_total_membership = 0;
                        var values_total_c_g = 0;
                        for (var j = 0; j < data.length; j++) {
                            if (generate_arr_date[i] == data[j]["date"]) {
                                if (data[j]["roles"] == "New Member") {
                                    values_total_order_newmember = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "General") {
                                    values_total_order_general = parseInt(data[j]["total_order"]);
                                    values_total_c_g += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "Bronze") {
                                    values_total_order_bronze = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "Silver") {
                                    values_total_order_silver = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "Gold") {
                                    values_total_order_gold = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "VIP") {
                                    values_total_order_platinum = parseInt(data[j]["total_order"]);
                                    values_total_membership += parseInt(data[j]["total_order"]);
                                } else if (data[j]["roles"] == "Customer") {
                                    values_total_order_customer = parseInt(data[j]["total_order"]);
                                    values_total_c_g += parseInt(data[j]["total_order"]);
                                }
                            }
                        }
                        arr_data_membership.push(values_total_membership);
                        arr_data_c_g.push(values_total_c_g);
                        arr_data_newmember.push(values_total_order_newmember);
                        arr_data_general.push(values_total_order_general);
                        arr_data_bronze.push(values_total_order_bronze);
                        arr_data_silver.push(values_total_order_silver);
                        arr_data_gold.push(values_total_order_gold);
                        arr_data_platinum.push(values_total_order_platinum);
                        arr_data_customer.push(values_total_order_customer);
                        arr_date.push(generate_arr_date[i]);

                    }
                    var json_data_customer = [{
                        "name": "Customer",
                        "data": arr_data_customer
                    }];
                    var json_data_general = [{
                        "name": "General",
                        "data": arr_data_general
                    }];
                    var json_data_combine = [{
                        "name": "membership",
                        "data": arr_data_membership
                    }, {
                        "name": "Customer and General",
                        "data": arr_data_c_g
                    }];
                    // console.log(data);

                    get_data_report_forchart_general_and_customer(arr_date, json_data_general, 'order_total_general', 'Total number order');
                    get_data_report_forchart_general_and_customer(arr_date, json_data_customer, 'order_total_customer', 'Total number order');
                    get_data_report_forchart_general_and_customer(arr_date, json_data_combine, 'order_total_combine', 'Total number order');
                    //  console.log(values_total_order_newmember);
                    get_data_report_forchart(arr_date, arr_data_newmember, arr_data_general, arr_data_bronze, arr_data_silver, arr_data_gold, arr_data_platinum, 'order_total', 'Total order');
                    // get_data_report_forchart_general_and_customer(arr_date,arr_data_general,'order_total_general','Total order','General');
                    // get_data_report_forchart_general_and_customer(arr_date,arr_data_customer,'order_total_customer','Total order','Customer');

                },
                error: function(e) {
                    console.log(e);
                }
            })
        }

        function get_data_report_forchart(date, arr_data_newmember, arr_data_general, arr_data_bronze, arr_data_silver, arr_data_gold, arr_data_platinum, idchart, title) {
            Highcharts.chart(idchart, {
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: 'Source: Sky007.vn'
                },
                xAxis: {
                    categories: date
                },
                yAxis: {
                    title: {
                        text: title
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'New Member',
                    data: arr_data_newmember
                }, {
                    name: 'Bronze',
                    data: arr_data_bronze
                }, {
                    name: 'Silver',
                    data: arr_data_silver
                }, {
                    name: 'Gold',
                    data: arr_data_gold
                }, {
                    name: 'VIP',
                    data: arr_data_platinum
                }]
            });
        }

        function get_data_report_forchart_general_and_customer(date, arr_data, idchart, title, name_line) {
            Highcharts.chart(idchart, {
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: 'Source: Sky007.vn'
                },
                xAxis: {
                    categories: date
                },
                yAxis: {
                    title: {
                        text: title
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: arr_data

            });
        }

    }
]);

//============================ End chart report membership order ===================

//============================ Chart report monthly membership order ===============

App.controller('RCMonthlyMembershipOrderCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        //limit_permisstion_menu("chkCRMonthlyMembershipOrder"); 
        set_date_time($scope, '90');
        $scope.loadData = function() {
            load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            get_data_number_order(fromdate, todate);
        }
        // chart_column_single();
        function get_data_number_order(fromdate, todate) {
            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_monthly_membership_order",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    // console.log(d);return;                   
                    var data = $.parseJSON(d);

                    var data_total = data["data_total"];
                    var data_number = data["data_number"];
                   //  console.log(data_number); return;

                    get_data_report_forchart(data_total, data_number, fromdate, todate);
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
        /*{
                            name: 'John',
                            data: [5, 3, 4, 7, 2] Customer General Gold Silver VIP Bronze
                        }*/
        function get_data_report_forchart(data_total, data_number, startdate, enddate) {            
            if (data_total.length > 0) {               
                var membership_type_name = ["Customer", "General", "New_Member", "Bronze", "Silver", "Gold", "VIP"];
                // create array membership type
                for (var l = 0; l < membership_type_name.length; l++) {
                    var mbs_type = membership_type_name[l];
                    window['arr_' + mbs_type + '_total'] = [];
                    window['arr_' + mbs_type + '_number'] = [];
                    window['arr_' + mbs_type + '_average'] = [];
                }
                //--------------------------------
                var st = new Date(startdate);
                var sm = st.getMonth();
                var et = new Date(enddate);
                var em = et.getMonth();
                var sy = st.getFullYear();
                var ey = et.getFullYear();

                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var arr_date = [];
                var arr_date_char = [];
                if (sy == ey) {                    
                    for (var i = sm; i <= em; i++) {
                        arr_date.push(i);
                        arr_date_char.push(monthNames[i]);
                    }

                    for (var i = 0; i < arr_date.length; i++) {
                        var date_element = arr_date[i];
                        for (var l = 0; l < membership_type_name.length; l++) {
                            var mbs_type = membership_type_name[l];
                            window['arr_' + mbs_type + '_total'].push(0);
                            window['arr_' + mbs_type + '_number'].push(0);
                            window['arr_' + mbs_type + '_average'].push(0);

                        }


                        for (var j = 0; j < data_total.length; j++) {
                            var roles_type = data_total[j]['roles'];
                            var time = parseInt(data_total[j]['date']);
                            var total_order = parseInt(data_total[j]['total_order']);
                            time = (time - 1);

                            if (roles_type == "Customer" && date_element == time) {
                                arr_Customer_total[i] = parseInt(data_total[j]['total_order']);
                            } else if (roles_type == "General" && date_element == time) {
                                arr_General_total[i] = parseInt(data_total[j]['total_order']);
                            } else if (roles_type == "Bronze" && date_element == time) {
                                arr_Bronze_total[i] = parseInt(data_total[j]['total_order']);
                            } else if (roles_type == "Silver" && date_element == time) {
                                arr_Silver_total[i] = parseInt(data_total[j]['total_order']);
                            } else if (roles_type == "Gold" && date_element == time) {
                                arr_Gold_total[i] = parseInt(data_total[j]['total_order']);
                            } else if (roles_type == "VIP" && date_element == time) {
                                arr_VIP_total[i] = parseInt(data_total[j]['total_order']);
                            } else if (roles_type == "New Member" && date_element == time) {
                                arr_New_Member_total[i] = parseInt(data_total[j]['total_order']);
                            }

                        }
                        // console.log(arr_Customer_total);
                        for (var j = 0; j < data_number.length; j++) {
                            var roles_type = data_number[j]['roles'];
                            var time = parseInt(data_number[j]['date']);
                            time = (time - 1);
                            if (roles_type == "Customer" && date_element == time) {
                                arr_Customer_number[i] = parseInt(data_number[j]['total_number']);
                            } else if (roles_type == "General" && date_element == time) {
                                arr_General_number[i] = parseInt(data_number[j]['total_number']);
                            } else if (roles_type == "Bronze" && date_element == time) {
                                arr_Bronze_number[i] = parseInt(data_number[j]['total_number']);
                            } else if (roles_type == "Silver" && date_element == time) {
                                arr_Silver_number[i] = parseInt(data_number[j]['total_number']);
                            } else if (roles_type == "Gold" && date_element == time) {
                                arr_Gold_number[i] = parseInt(data_number[j]['total_number']);
                            } else if (roles_type == "VIP" && date_element == time) {
                                arr_VIP_number[i] = parseInt(data_number[j]['total_number']);
                            } else if (roles_type == "New Member" && date_element == time) {
                                arr_New_Member_number[i] = parseInt(data_number[j]['total_number']);
                            }
                        }

                    }


                    for (var i = 0; i < arr_date.length; i++) {
                        //console.log(i);
                        for (var l = 0; l < membership_type_name.length; l++) {
                            var mbs_type = membership_type_name[l];
                            if (parseInt(window['arr_' + mbs_type + '_number'][i]) != 0) {
                                var average = parseInt(window['arr_' + mbs_type + '_total'][i]) / parseInt(window['arr_' + mbs_type + '_number'][i])
                                window['arr_' + mbs_type + '_average'][i] = parseInt(average);
                            }

                        }
                    }

                } else if (sy < ey) {                    
                    for (var i = sm; i <= 11; i++) {
                        arr_date.push((i + 1) + "_" + sy);
                        arr_date_char.push(monthNames[i] + "(" + sy + ")");
                    }
                    for (var i = 0; i <= em; i++) {
                        arr_date.push((i + 1) + "_" + ey);
                        arr_date_char.push(monthNames[i] + "(" + ey + ")");
                    }
                    // console.log(arr_date);
                    for (var i = 0; i < arr_date.length; i++) {
                        for (var i = 0; i < arr_date.length; i++) {
                            var date_element = arr_date[i];

                            for (var l = 0; l < membership_type_name.length; l++) {
                                var mbs_type = membership_type_name[l];
                                window['arr_' + mbs_type + '_total'].push(0);
                                window['arr_' + mbs_type + '_number'].push(0);
                                window['arr_' + mbs_type + '_average'].push(0);

                            }


                            for (var j = 0; j < data_total.length; j++) {
                                var roles_type = data_total[j]['roles'];
                                var time = data_total[j]['date'];
                                var total_order = parseInt(data_total[j]['total_order']);
                                //  time = (time - 1);

                                if (roles_type == "Customer" && date_element == time) {
                                    arr_Customer_total[i] = parseInt(data_total[j]['total_order']);
                                } else if (roles_type == "General" && date_element == time) {
                                    arr_General_total[i] = parseInt(data_total[j]['total_order']);
                                } else if (roles_type == "Bronze" && date_element == time) {
                                    arr_Bronze_total[i] = parseInt(data_total[j]['total_order']);
                                } else if (roles_type == "Silver" && date_element == time) {
                                    arr_Silver_total[i] = parseInt(data_total[j]['total_order']);
                                } else if (roles_type == "Gold" && date_element == time) {
                                    arr_Gold_total[i] = parseInt(data_total[j]['total_order']);
                                } else if (roles_type == "VIP" && date_element == time) {
                                    arr_VIP_total[i] = parseInt(data_total[j]['total_order']);
                                } else if (roles_type == "New Member" && date_element == time) {
                                    arr_New_Member_total[i] = parseInt(data_total[j]['total_order']);
                                }

                            }
                            // console.log(arr_Customer_total);
                            for (var j = 0; j < data_number.length; j++) {
                                var roles_type = data_number[j]['roles'];
                                var time = data_number[j]['date'];

                                if (roles_type == "Customer" && date_element == time) {
                                    arr_Customer_number[i] = parseInt(data_number[j]['total_number']);
                                } else if (roles_type == "General" && date_element == time) {
                                    arr_General_number[i] = parseInt(data_number[j]['total_number']);
                                } else if (roles_type == "Bronze" && date_element == time) {
                                    arr_Bronze_number[i] = parseInt(data_number[j]['total_number']);
                                } else if (roles_type == "Silver" && date_element == time) {
                                    arr_Silver_number[i] = parseInt(data_number[j]['total_number']);
                                } else if (roles_type == "Gold" && date_element == time) {
                                    arr_Gold_number[i] = parseInt(data_number[j]['total_number']);
                                } else if (roles_type == "VIP" && date_element == time) {
                                    arr_VIP_number[i] = parseInt(data_number[j]['total_number']);
                                } else if (roles_type == "New Member" && date_element == time) {
                                    arr_New_Member_number[i] = parseInt(data_number[j]['total_number']);
                                }
                            }

                        }


                        for (var i = 0; i < arr_date.length; i++) {
                            for (var l = 0; l < membership_type_name.length; l++) {
                                var mbs_type = membership_type_name[l];
                                if (parseInt(window['arr_' + mbs_type + '_number'][i]) != 0) {
                                    var average = parseInt(window['arr_' + mbs_type + '_total'][i]) / parseInt(window['arr_' + mbs_type + '_number'][i]);
                                    window['arr_' + mbs_type + '_average'][i] = parseInt(average);
                                }
                            }
                        }
                    }
                    }
                    $obj_data_total = [{
                        name: 'Customer',
                        data: arr_Customer_total
                    }, {
                        name: 'General',
                        data: arr_General_total
                    }, {
                        name: 'New Member',
                        data: arr_New_Member_total
                    }, {
                        name: 'Bronze',
                        data: arr_Bronze_total
                    }, {
                        name: 'Silver',
                        data: arr_Silver_total
                    }, {
                        name: 'Gold',
                        data: arr_Gold_total
                    }, {
                        name: 'VIP',
                        data: arr_VIP_total
                    }];

                    //-------------------------------
                    $obj_data_avegare = [{
                        name: 'Customer',
                        data: arr_Customer_average
                    }, {
                        name: 'General',
                        data: arr_General_average
                    }, {
                        name: 'New Member',
                        data: arr_New_Member_average
                    }, {
                        name: 'Bronze',
                        data: arr_Bronze_average
                    }, {
                        name: 'Silver',
                        data: arr_Silver_average
                    }, {
                        name: 'Gold',
                        data: arr_Gold_average
                    }, {
                        name: 'VIP',
                        data: arr_VIP_average
                    }];
                    //console.log($obj_data_avegare);
                    load_chart(arr_date_char, $obj_data_avegare, "order_number_average", "Average order");
                    load_chart(arr_date_char, $obj_data_total, "order_total", "Total order");

                }
            
        }

        function load_chart(xdata, ydata, idchart, ytitle) {
            Highcharts.chart(idchart, {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: xdata
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ytitle
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: ydata
            });
        }


    }
]);

//============================ End Chart report monthly membership order ============

//====================== End Chart Report =================================================================================

//====================== Data Report ======================================================================================

//============================ Shipping =====================================

App.controller('RDShippingCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRShipping");
        set_date_time($scope, '7');
        $scope.loadData = function() {
          //  load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var shop_sale = $("#cboShopSale").val();
            var province = $("#cboProvince").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shop_sale,
                "province": province
            };
            var name_shop_sale = $('#cboShopSale option:selected').text();
            $scope.expressions_shop_sale = name_shop_sale;
            $("#img_load").show();
            var table = $('#tb_shipping_report').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_shipping",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                  //  console.log(d);return;
                    var data = $.parseJSON(d);
                    var list_order=data["list_order"];
                    var list_packaging=data["list_order_packaging"];
                    for(var i=0;i<list_order.length;i++){
                        var d_company="";
                        var d_dateofarrive="";
                      //  var d_issue="";
                        var d_pay_status="";
                        var sh_code="";
                        var sh_fee="";
                        list_order[i]["d_company"]=d_company;
                        list_order[i]["d_dateofarrive"]=d_dateofarrive;
                       // list_order[i]["d_issue"]=d_issue;
                        list_order[i]["d_pay_status"]=d_pay_status;
                        list_order[i]["sh_code"]=sh_code;
                        list_order[i]["sh_fee"]=sh_fee;
                        for(var j=0;j<list_packaging.length;j++){
                            d_company=list_packaging[j]["d_company"];
                            d_dateofarrive=list_packaging[j]["d_dateofarrive"];
                          //  d_issue=list_packaging[j]["d_issue"];
                            d_pay_status=list_packaging[j]["d_pay_status"];
                            sh_code=list_packaging[j]["sh_code"];
                            sh_fee=list_packaging[j]["sh_fee"];
                            if(list_order[i]["order_id"]==list_packaging[j]["order_id"]){
                                list_order[i]["d_company"]=d_company;
                                list_order[i]["d_dateofarrive"]=d_dateofarrive;
                             //   list_order[i]["d_issue"]=d_issue;
                                list_order[i]["d_pay_status"]=d_pay_status;
                                list_order[i]["sh_code"]=sh_code;
                                list_order[i]["sh_fee"]=sh_fee;
                            }
                        }
                    }
                 //   console.log(list_order);return;
                    var table = $('#tb_shipping_report').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: list_order,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "30px",
                                "data": "order_id"
                            },
                            {
                                "width": "50px",
                                "data": "order_date"
                            },
                            {
                                "width": "50px",
                                "data": "order_status"
                            },
                            {
                                "width": "20px",
                                "data": "user_lev"
                            },
                            {
                                "width": "50px",
                                "data": "name"
                            },
                            {
                                "width": "30px",
                                "data": "phone"
                            },
                            {
                                "width": "60px",
                                "data": "address"
                            },
                            {
                                "width": "20px",
                                "data": "total_price"
                            },
                            {
                                "width": "20px",
                                "data": "d_company"
                            },
                            {
                                "width": "20px",
                                "data": "sh_code"
                            },
                            {
                                "width": "20px",
                                "data": "sh_fee"
                            },
                            {
                                "width": "20px",
                                "data": "d_pay_status"
                            },
                            {
                                "width": "50px",
                                "data": "d_dateofarrive"
                            },


                        ]
                    });

                    $("#img_load").hide();
                    // tb_shipping_report
                    // console.log(data);
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);
//======================== End Shipping =====================================

//============================ Order ========================================

App.controller('RDOrderCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDROrder");
        set_date_time($scope, '7');
        $scope.loadData = function() {
          //  load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var shop_sale = $("#cboShopSale").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shop_sale
            };
            var name_shop_sale = $('#cboShopSale option:selected').text();
            $scope.expressions_shop_sale = name_shop_sale;
            $("#img_load").show();
            var table = $('#tb_order_report').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_order",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                  //  console.log(d);return;
                    var data = $.parseJSON(d);
                 //  console.log(data); 
                    var list_order=data["list_order"];
                    var list_packaging=data["list_order_packaging"];
                    for(var i=0;i<list_order.length;i++){
                        var d_company="";                       
                        var d_pay_status="";                       
                        list_order[i]["d_company"]=d_company;                        
                        list_order[i]["d_pay_status"]=d_pay_status;                        
                        for(var j=0;j<list_packaging.length;j++){
                            d_company=list_packaging[j]["d_company"];                           
                            d_pay_status=list_packaging[j]["d_pay_status"];                            
                            if(list_order[i]["id"]==list_packaging[j]["order_id"]){
                                list_order[i]["d_company"]=d_company;                               
                                list_order[i]["d_pay_status"]=d_pay_status;                                
                            }
                        }
                    }
                    
                    var table = $('#tb_order_report').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: list_order,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px",
                                "data": "order_time"
                            },
                            {
                                "width": "50px",
                                "data": "category"
                            },
                            {
                                "width": "50px",
                                "data": "id"
                            },
                            {
                                "width": "20px",
                                "data": "name"
                            },
                            {
                                "width": "50px",
                                "data": "order_status"
                            },
                            {
                                "width": "20px",
                                "data": "payment"
                            },
                            {
                                "width": "30px",
                                "data": "product_name"
                            },
                            {
                                "width": "60px",
                                "data": "item_price"
                            },
                            {
                                "width": "20px",
                                "data": "item_price_vat"
                            },
                            {
                                "width": "20px",
                                "data": "price_1_item"
                            },
                            {
                                "width": "20px",
                                "data": "d_company"
                            }, {
                                "width": "20px",
                                "data": "d_pay_status"
                            },
                            {
                                "width": "20px",
                                "data": "manager"
                            },
                            {
                                "width": "20px",
                                "data": "customer_buy_type"
                            },

                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);
//======================== End Order ========================================
//============================ Order vnpay ========================================

App.controller('RDOrderVNpayCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDROrderVnpay");
        set_date_time($scope, '7');
        $scope.loadData = function() {
        //    load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
           
            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };
           // var name_shop_sale = $('#cboShopSale option:selected').text();
           // $scope.expressions_shop_sale = name_shop_sale;
            $("#img_load").show();
            var table = $('#tb_order_report').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_order_vnpay",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                  //  console.log(d);//return;
                    var data = $.parseJSON(d);
                 //  console.log(data); 
                    var table = $('#tb_order_report').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px",
                                "data": "order_date"
                            },
                            {
                                "width": "50px",
                                "data": "type"
                            },
                            {
                                "width": "50px",
                                "data": "id"
                            },
                            {
                                "width": "20px",
                                "data": "name"
                            },
                            {
                                "width": "20px",
                                "data": "phone"
                            },
                            {
                                "width": "50px",
                                "data": "post_status"
                            },
                            {
                                "width": "20px",
                                "data": "payment"
                            },
                            {
                                "width": "30px",
                                "data": "total_order"
                            },
                            {
                                "width": "20px",
                                "data": "mg_id"
                            }

                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);
//======================== End Order vnpay ========================================
//============================ Data report location ========================================

App.controller('RDLocationCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRLocation");
        set_date_time($scope, '7');       
      
        $scope.loadData = function() {
          //  load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var shop_sale = $("#cboShopSale").val();
            var date_type=$("#cboDate").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shop_sale,
                "date_type" :date_type
            };  
            var name_shop_sale = $('#cboShopSale option:selected').text();
            $scope.expressions_shop_sale = name_shop_sale;
            $("#img_load").show();
            $("#img_load_area").show();
            var table = $('#tb_loation_report').DataTable();
            table.clear();
            table.destroy();
            var table = $('#tb_loation_report_area').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_location",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                  //  console.log(d);return;
                    var data = $.parseJSON(d);                   
                 //  console.log(data); 
                    var list_total=data["list_total"];
                    var list_main_area=data["list_main_area"];
                   
                    
                    var table = $('#tb_loation_report').DataTable({
                        "order": [
                            [1, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: list_total,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px",
                                "data": "city"
                            },
                            {
                                "width": "50px",
                                "data": "qty_order"
                            },
                            {
                                "width": "50px",
                                "data": "date_time"
                            }

                        ]
                    });

                    $("#img_load").hide();
                    //---------------------------------------------------------------------
                    var table = $('#tb_loation_report_area').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: list_main_area,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px",
                                "data": "city"
                            },{
                                "width": "20px",
                                "data": "district"
                            },
                            {
                                "width": "50px",
                                "data": "qty"
                            },
                            {
                                "width": "50px",
                                "data": "date_time"
                            }

                        ]
                    });

                    $("#img_load_area").hide();
                    
                    
                },
                error: function(e) {
                    console.log(e);
                }
            })           
            
        }
       
    }
]);
//======================== End data report Location ========================================
//============================ Data report location compare========================================

App.controller('RDLocationCompareCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        //limit_permisstion_menu("chkDRLocationCompare");
        set_date_time($scope, '30');       
      
        $scope.loadData = function() {
          //  load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            var list_location=$("#duallistbox_location").val();
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            if(list_location==null){
                alert("Please choose province .");
             }else{ 
                
                var shop_sale = $("#cboShopSale").val();
                var date_type=$("#cboDate").val();
                var obj = {
                    "start_date": fromdate,
                    "end_date": todate,
                    "shop_sale": shop_sale,
                    "list_location":list_location
                };  
                var name_shop_sale = $('#cboShopSale option:selected').text();
                $scope.expressions_shop_sale = name_shop_sale;
                $("#img_load").show();
                $("#img_load_rate").show();
                var table = $('#tb_loation_report').DataTable();
                table.clear();
                table.destroy();
                var table_rate = $('#tb_loation_rate_report').DataTable();
                table_rate.clear();
                table_rate.destroy();
                //-----------------------------------------------------------------------------------
                var st = new Date(fromdate);
                var sm = st.getMonth();
                var et = new Date(todate);
                var em = et.getMonth();
                var sy = st.getFullYear();
                var ey = et.getFullYear();

                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var arr_date = [];
                var arr_date_char = [];
                
                var arr_total = [];
                var arr_sky007 = [];
                var arr_shopee = [];
                var arr_lazada = [];
                var arr_eglips = [];
                if (sy == ey) {
                    for (var i = sm; i <= em; i++) {
                        arr_date.push(i);
                        arr_date_char.push(monthNames[i]);   
                    }
                                               
               
                }else{
                    for (var i = sm; i <= 11; i++) {
                        arr_date.push((i + 1) + "_" + sy);
                        arr_date_char.push(monthNames[i] + "_" + sy);
                    }
                    for (var i = 0; i <= em; i++) {
                        arr_date.push((i + 1) + "_" + ey);
                        arr_date_char.push(monthNames[i] + "_" + ey);
                    }
                }  
              // console.log(arr_date_char);
               //-----------------------------------------------------------------------------------
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_location_compare",
                    type: "POST",
                    data: {
                        "obj": obj
                    },
                    success: function(d) {                       
                        var data_obj = $.parseJSON(d); 
                        var data=data_obj["list_main_area"];
                      //  console.log(data);
                        var arr_data=[];
                        for(var i=0;i<list_location.length;i++)   {
                           var province=list_location[i];
                           var obj_province={"city":province};  
                           for(var k=0;k<arr_date_char.length;k++){
                            var m_date_name=arr_date_char[k];
                            var qty=0;
                                for(var j=0;j<data.length;j++){
                                    var obj_province_name="";
                                    var province_name=data[j]["city"];
                                    var mdate=data[j]["date_month"];
                                  //  var qty=data[j]["qty"];                                
                                    if(province==province_name && m_date_name==mdate){
                                        qty=data[j]["qty"]; 
                                        
                                    }
                                }
                                obj_province[m_date_name]=qty;
                           }                     
                           
                           arr_data.push(obj_province);
                        } 
                    //     console.log(arr_data);
                        //-------------------------rate------------------
                        var arr_data_rate=[];
                        if(Object.values(arr_data[0]).length>2) //min 2 month
                        {
                            //console.log(1);return;
                            for(var i=0;i<arr_data.length;i++){
                            var data_row=(arr_data[i]);                             
                            var data_row_length=(Object.values(data_row).length);                              
                            var obj_province_rate={"city":Object.values(data_row)[0]};
                           // console.log(obj_province_rate); return
                            for(var j=1;j<data_row_length-1;j++){                                
                                var f_data_month_key=Object.keys(data_row)[j];
                                var s_data_month_key=Object.keys(data_row)[j+1];                                   
                                var f_data_month=parseInt(Object.values(data_row)[j]);
                                var s_data_month=parseInt(Object.values(data_row)[j+1]);
                                var rate_value="";
                                if(f_data_month!=0){
                                    rate_value=Math.round(((s_data_month-f_data_month)/f_data_month)*100);
                                }
                                
                                if(j==1){
                                    obj_province_rate[f_data_month_key]="Standard";
                                }
                                obj_province_rate[s_data_month_key]=rate_value;
                                
                            } 
                            arr_data_rate.push(obj_province_rate);
                          //  console.log(arr_data_rate);
                            }
                            $("#tb_row_rate").empty();
                            var html_row='';
                            var arr_columns_rate=[];
                            var list_columns_rate=Object.keys(arr_data[0]);
                            for(var i=0;i<list_columns_rate.length;i++){                            
                                var column_name=list_columns_rate[i]
                                html_row+='<th class="hidden-xs">'+column_name+'</th>';
                                var obj_columns={"width": "20px","data":column_name };                            
                                arr_columns_rate.push(obj_columns);
                            }                        
                            $("#tb_row_rate").append(html_row);                     
                            var table = $('#tb_loation_rate_report').DataTable({
                                "order": [
                                    [0, "desc"]
                                ],
                                dom: 'Bfrtip',
                                buttons: [
                                    'copy', 'csv', 'excel', 'pdf', 'print'
                                ],
                                pageLength: 20,
                                data: arr_data_rate,
                                lengthMenu: [
                                    [10, 20, 30, 50, -1],
                                    [10, 20, 30, 50, "ALL"]
                                ],
                                createdRow: function(row, data, dataIndex) {},
                                "columns": arr_columns_rate
                            });       
                            
                            
                        }
                        $("#img_load_rate").hide();
                        //------------------------- End rate------------------
                        $("#tb_row").empty();
                        var html_row='';
                        var arr_columns=[];
                        var list_columns=Object.keys(arr_data[0]);
                        for(var i=0;i<list_columns.length;i++){                            
                            var column_name=list_columns[i]
                            html_row+='<th class="hidden-xs">'+column_name+'</th>';
                            var obj_columns={"width": "20px","data":column_name };                            
                            arr_columns.push(obj_columns);
                        }                        
                        $("#tb_row").append(html_row);                     
                        var table = $('#tb_loation_report').DataTable({
                            "order": [
                                [0, "desc"]
                            ],
                            dom: 'Bfrtip',
                            buttons: [
                                'copy', 'csv', 'excel', 'pdf', 'print'
                            ],
                            pageLength: 20,
                            data: arr_data,
                            lengthMenu: [
                                [10, 20, 30, 50, -1],
                                [10, 20, 30, 50, "ALL"]
                            ],
                            createdRow: function(row, data, dataIndex) {},
                            "columns": arr_columns
                        });
    
                        $("#img_load").hide();
                          
                    },
                    error: function(e) {
                        console.log(e);
                    }
                })           
                
            }
        }
       
    }
]);
//======================== End data report Location compare========================================
//============================ Direct Order ========================================

App.controller('RDDirectOrderCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
     //   limit_permisstion_menu("chkDRDirectOrder");
        set_date_time($scope, '0');
        $scope.loadData = function() {
       //     load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }         
            var obj = {
                "start_date": fromdate,
                "end_date": todate                
            };        
            $("#img_load").show();
            $("#txtTotalPrice").empty();
            var table = $('#tb_order_report').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_direct_order",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {                 
                    var data = $.parseJSON(d); 
                    var total_money=0
                    for(var i=0;i<data.length;i++){
                        var price=parseInt(data[i]["total_price"]);
                        total_money+=price;                        
                    }      
                    total_money=new Intl.NumberFormat().format(total_money)
                   // console.log(total_money)  ;             
                    $("#txtTotalPrice").text(total_money); 
                    var table = $('#tb_order_report').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px",
                                "data": "order_time"
                            },
                            {
                                "width": "50px",
                                "data": "ID"
                            },
                            {
                                "width": "20px",
                                "data": "name"
                            },
                            {
                                "width": "50px",
                                "data": "order_status"
                            },
                            {
                                "width": "30px",
                                "data": "product_name"
                            },
                            {
                                "width": "60px",
                                "data": "total_price"
                            },
                            {
                                "width": "60px",
                                "data": "manager"
                            }
                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);
//======================== End Order ========================================

//============================ data report shop Items ========================================

App.controller('RDShopItemsCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRItems");
        set_date_time($scope, '14');
        $scope.loadData = function() {
        //    load_data();
        }
        $scope.data_fillter = function() {
        /*    var table = $('#tb_item_report').DataTable();
            table.clear();
            table.destroy();*/
            load_data();
        }
        function template_html_table(check_id){
            var obj_data="";
            var html="";
            var obj_show_data=[];
            if(check_id=="chkSky007"){
                html='<th class="hidden-xs">Customer sale qty</th>\
                      <th class="hidden-xs">Customer Total Price</th>';
                var obj_table={
                    "width": "30px",
                    "data": "chkSky007"
                };
                var obj_table_tprice={
                    "width": "30px",
                    "data": "chkSky007totalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkSky007MT"){
                html='<th class="hidden-xs">Sky007 Marketing qty</th>';
                 var obj_table={
                    "width": "30px",
                    "data": "chkSky007MT"
                };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkWholesaler"){
                html='<th class="hidden-xs">Wholesaler sale qty</th>\
                      <th class="hidden-xs">Wholesaler Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkWholesaler"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkWholesalertotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkShopeeBbia"){
                html='<th class="hidden-xs">Shopee Bbia sale qty</th>\
                      <th class="hidden-xs">Shopee Bbia Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkShopeeBbia"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkShopeeBbiatotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkShopeeBbiaMT"){
                html='<th class="hidden-xs">Shopee Bbia Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkShopeeBbiaMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkLazadaBbia"){
                html='<th class="hidden-xs">Lazada Bbia sale qty</th>\
                      <th class="hidden-xs">Lazada Bbia Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkLazadaBbia"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkLazadaBbiatotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkLazadaBbiaMT"){
                html='<th class="hidden-xs">Lazada Bbia Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkLazadaBbiaMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkWholesalerJnain"){
                html='<th class="hidden-xs">W Jnain Total Price</th>\
                      <th class="hidden-xs">W Jnain sale qty</th>';
                 var obj_table={
                    "width": "30px",
                    "data": "chkWholesalerJnain"
                 };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkWholesalerJnaintotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkBeautybox"){
                html='<th class="hidden-xs">Beautybox sale qty</th>\
                      <th class="hidden-xs">Beautybox Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkBeautybox"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkBeautyboxtotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkBeautyboxMT"){
                html='<th class="hidden-xs">Beautybox Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkBeautyboxMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkTikiBbia"){
                html='<th class="hidden-xs">Tiki sale qty</th>\
                      <th class="hidden-xs">Tiki Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkTikiBbia"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkTikiBbiatotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkTikiBbiaMT"){
                html='<th class="hidden-xs">Tiki Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkTikiBbiaMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkSociolla"){
                html='<th class="hidden-xs">Sociolla sale qty</th>\
                      <th class="hidden-xs">Sociolla Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkSociolla"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkSociollatotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkSociollaMT"){
                html='<th class="hidden-xs">Sociolla Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkSociollaMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkBbiavn"){
                html='<th class="hidden-xs">Bbiavn sale qty</th>\
                      <th class="hidden-xs">Bbiavn Total Price</th>';
                 var obj_table={
                    "width": "30px",
                    "data": "chkBbiavn"
                 };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkBbiavntotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkBbiavnMT"){
                html='<th class="hidden-xs">Bbiavn Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkBbiavnMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkMixsoon"){
                html='<th class="hidden-xs">Mixsoon</th>\
                  <th class="hidden-xs">Mixsoon Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkMixsoon"
                              };
                  var obj_table_tprice={
                    "width": "30px",
                    "data": "chkMixsoontotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkMixsoonMT"){
                html='<th class="hidden-xs">Mixsoon Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkMixsoonMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkMixsoonShopee"){
                html='<th class="hidden-xs">Mixsoon Shopee</th>\
                  <th class="hidden-xs">Mixsoon Shopee Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkMixsoonShopee"
                              };
                  var obj_table_tprice={
                    "width": "30px",
                    "data": "chkMixsoonShopeetotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkMixsoonShopeeMT"){
                html='<th class="hidden-xs">Mixsoon Shopee MT</th>\
                  <th class="hidden-xs">Mixsoon Shopee MT Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkMixsoonShopeeMT"
                              };
                  var obj_table_tprice={
                    "width": "30px",
                    "data": "chkMixsoonShopeeMTtotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkMixsoonLazada"){
                html='<th class="hidden-xs">Mixsoon Lazada</th>\
                  <th class="hidden-xs">Mixsoon Lazada Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkMixsoonLazada"
                              };
                  var obj_table_tprice={
                    "width": "30px",
                    "data": "chkMixsoonLazadatotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkMixsoonLazadaMT"){
                html='<th class="hidden-xs">Mixsoon Lazada MT</th>\
                  <th class="hidden-xs">Mixsoon Lazada MT Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkMixsoonLazadaMT"
                              };
                  var obj_table_tprice={
                    "width": "30px",
                    "data": "chkMixsoonLazadaMTtotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkHince"){
                html='<th class="hidden-xs">Hince sale qty</th>\
                      <th class="hidden-xs">Hince Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkHince"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkHincetotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkHincesMT"){
                html='<th class="hidden-xs">Hince Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkHinceMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkWholesalerHince"){
                html='<th class="hidden-xs">Wholesaler Hince sale qty</th>\
                      <th class="hidden-xs">Wholesaler Hince Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkWholesalerHince"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkWholesalerHincetotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkShopeeHince"){
                html='<th class="hidden-xs">Shopee Hince sale qty</th>\
                      <th class="hidden-xs">Shopee Hince Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkShopeeHince"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkShopeeHincetotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkShopeeHinceMT"){
                html='<th class="hidden-xs">Shopee Hince Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkShopeeHinceMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkLazadaHince"){
                html='<th class="hidden-xs">Lazada Hince sale qty</th>\
                      <th class="hidden-xs">Lazada Hince Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkLazadaHince"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkLazadaHincetotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkLazadaHinceMT"){
                html='<th class="hidden-xs">Lazada Hince Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkLazadaHinceMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkWatsons"){
                html='<th class="hidden-xs">Watsons sale qty</th>\
                      <th class="hidden-xs">Watsons Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkWatsons"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkWatsonstotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkWatsonsMT"){
                html='<th class="hidden-xs">Watsons Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkWatsonsMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkWholesalerActsone"){
                html='<th class="hidden-xs">W Actsone Total Price</th>\
                      <th class="hidden-xs">W Actsone sale qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkWholesalerActsone" 
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkWholesalerActsonetotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkTiktokHince"){
                html='<th class="hidden-xs">TiktokHince sale qty</th>\
                      <th class="hidden-xs">TiktokHince Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkTiktokHince"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkTiktokHincetotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkTiktokHinceMT"){
                html='<th class="hidden-xs">TiktokHince Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkTiktokHinceMT"
                              };
                obj_show_data.push(obj_table);
            }else if(check_id=="chkGuardian"){
                html='<th class="hidden-xs">Guardian sale qty</th>\
                      <th class="hidden-xs">Guardian Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkGuardian"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkGuardiantotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkGuardianMT"){
                html='<th class="hidden-xs">Guardian Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkGuardianMT"
                              };
                obj_show_data.push(obj_table);
            }
            else if(check_id=="chkShopeeMixsoon"){
                html='<th class="hidden-xs">Shopee Mixsoon sale qty</th>\
                      <th class="hidden-xs">Shopee Mixsoon Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkShopeeMixsoon"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkShopeeMixsoontotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkShopeeMixsoonMT"){
                html='<th class="hidden-xs">Shopee Mixsoon Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkShopeeMixsoonMT"
                              };
                obj_show_data.push(obj_table);
            }
            else if(check_id=="chkLazadaMixsoon"){
                html='<th class="hidden-xs">Lazada Mixsoon sale qty</th>\
                      <th class="hidden-xs">Lazada Mixsoon Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkLazadaMixsoon"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkLazadaMixsoontotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkLazadaMixsoonMT"){
                html='<th class="hidden-xs">LazadaMixsoon Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkLazadaMixsoonMT"
                              };
                obj_show_data.push(obj_table);
            }
            else if(check_id=="chkTiktokSky007"){
                html='<th class="hidden-xs">Tiktok Sky007 sale qty</th>\
                      <th class="hidden-xs">Tiktok Sky007 Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkTiktokSky007"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkTiktokSky007totalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkTiktokSky007MT"){
                html='<th class="hidden-xs">Tiktok Sky007 Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkTiktokSky007MT"
                              };
                obj_show_data.push(obj_table);
            }
            
             else if(check_id=="chkWatsonBbia"){
                html='<th class="hidden-xs">Watson Bbia sale qty</th>\
                      <th class="hidden-xs">Watson Bbia Total Price</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkWatsonBbia"
                              };
                 var obj_table_tprice={
                    "width": "30px",
                    "data": "chkWatsonBbiatotalprice"
                }
                obj_show_data.push(obj_table);
                obj_show_data.push(obj_table_tprice);
            }else if(check_id=="chkWatsonBbiaMT"){
                html='<th class="hidden-xs">Watson Bbia Marketing qty</th>';
                 var obj_table={
                                "width": "30px",
                                "data": "chkWatsonBbiaMT"
                              };
                obj_show_data.push(obj_table);
            }
            obj_data={
                "html_header":html,
                "data_template":obj_show_data
            }            
            return obj_data;
        }     

                                       
        
        function load_data() {          
            $("#tb_item_report").append("<thead>\
                                <tr style='background-color: #BCBCBC;color: white;'>\
                                   <th class='hidden-xs'>Items ID</th>\
                                   <th class='hidden-xs'>SKU</th>\
                                   <th class='hidden-xs'>Product Name</th>\
                                   <th class='hidden-xs'>Total Qty</th>\
                                </tr>\
                            </thead>");
            var table = $('#tb_item_report').DataTable();
                        table.clear();
                        table.destroy(); 
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var check_combine = $("#cboProductType").val();
            var brain_name= $("#cbobrain").val();
            var company =$("#cboCompany").val();           
            var list_shopmall=[];
            
            var html_header="";
            var data_template=[{
                                    "width": "30px",
                                    "data": "product_id"
                                },
                                {
                                    "width": "30px",
                                    "data": "sku"
                                },
                                {
                                    "width": "50px",
                                    "data": "product_name"
                                }, 
                                {
                                    "width": "30px",
                                    "data": "total_qty"
                                }
                              ];
            if(company=="0"){
                $("#div_actsone").find("input:checked").each(function() {
                    var check_id=(this.id);
                    list_shopmall.push(check_id);
                    var obj_data=template_html_table(check_id);
                    html_header+=obj_data["html_header"];
                    var obj_data_template=obj_data["data_template"];                
                    for(var i=0;i<obj_data_template.length;i++){
                        data_template.push(obj_data_template[i]);
                    }
                    
                    
                });
            }else if(company=="1"){
                 $("#div_jnain").find("input:checked").each(function() {
                    var check_id=(this.id);
                    list_shopmall.push(check_id);
                    var obj_data=template_html_table(check_id);
                    html_header+=obj_data["html_header"];
                    var obj_data_template=obj_data["data_template"];                
                    for(var i=0;i<obj_data_template.length;i++){
                        data_template.push(obj_data_template[i]);
                    }
                });
            }
          //  data_template = data_template.slice(0, -1); 
          //  console.log(html_header)  ; console.log(data_template)  ;
          //<th class='hidden-xs'>Total sales qty (All shop)</th>\
            var html_table="<thead>\
                                <tr style='background-color: #BCBCBC;color: white;'>\
                                   <th class='hidden-xs'>Items ID</th>\
                                    <th class='hidden-xs'>SKU</th>\
                                   <th class='hidden-xs'>Product Name</th>\
                                   <th class='hidden-xs'>Total Qty</th>\
                                   "+html_header+"\
                                </tr>\
                            </thead>";
            $("#tb_item_report").empty();
            $("#tb_item_report").append(html_table);
             
         //    console.log(html_table)  ; console.log(data_template)  ;
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "listmall":list_shopmall,
                "brand_name" :brain_name,
             //   "product_type": product_type,
                "company" :company
            };
          //  console.log(list_shopmall)  ; return;    
            $("#img_load").show();
            var count_arr_shopmall=list_shopmall.length;
            if(count_arr_shopmall==0){
                alert("Please choose Shop Mall .");                
            }else{
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_shop_items",
                    type: "POST",
                    data: {
                        "obj": obj
                    },
                    success: function(d) {
                      //  console.log(d);return;
                        var data = $.parseJSON(d);
                        for(var i=0;i<data.length;i++){
                            var product_type=data[i]["product_type"];
                            var product_name =data[i]["product_name"];
                            var total_qty=0;
                            for(k=0;k<list_shopmall.length;k++){
                                    $shop_name=list_shopmall[k];
                                    var shop_qty= parseInt(data[i][$shop_name]);
                                    total_qty+=shop_qty;
                                    
                            }    
                            
                            data[i]["total_qty"]=total_qty;
                        }   
                        data_show=data;
                     /*   var data_hancarry=[];
                        var data_regular=[];
                        var data_combine=[];
                        var data_show="";
                        for(var i=0;i<data.length;i++){
                            var product_type=data[i]["product_type"];
                            var product_name =data[i]["product_name"];
                            var total_qty=0;
                            for(k=0;k<list_shopmall.length;k++){
                                    $shop_name=list_shopmall[k];
                                    var shop_qty= parseInt(data[i][$shop_name]);
                                    total_qty+=shop_qty;
                                    
                            }    
                            
                            data[i]["total_qty"]=total_qty;
                            if(product_type=="0"){
                                data_hancarry.push(data[i]);
                            }else{
                                data_regular.push(data[i]);
                            }
                        }
                     //   console.log (JSON.stringify(data_regular)) ; return;
                        if(check_combine=="0"){
                            data_show=data_hancarry;
                        }else if(check_combine=="1"){
                            data_show=data_regular;
                        }else if(check_combine=="2"){
                           data_combine=data_hancarry;    
                         //  console.log(data_show)    ; return;             
                            for(var i=0;i<data_combine.length;i++){
                                
                                var item_name_combine=data_combine[i]["product_name"];
                                var total_qty_h=data_combine[i]["total_qty"];
                                var total_qty=data_combine[i]["total_qty"];
                                var f_check_exist="0"; // 0: not exist , 1 : exist .
                                var qty_combine=data_combine[i]["product_name"];
                                for(k=0;k<list_shopmall.length;k++){
                                    $shop_name=list_shopmall[k];
                                    window['qty' + $shop_name + '_total'] = parseInt(data_combine[i][$shop_name]);
                                    window['price' + $shop_name + '_total'] = parseInt(data_combine[i][$shop_name+"totalprice"]);
                                }                            
                                for(var j=0;j<data_regular.length;j++){
                                     var item_name_regular=data_regular[j]["product_name"];
                                     var total_qty_r=data_regular[j]["total_qty"];
                                     for(n=0;n<list_shopmall.length;n++){
                                        $shop_name_r=list_shopmall[n];                                 
                                        window['qtyr' + $shop_name_r + '_total'] = parseInt(data_regular[j][$shop_name_r]);  
                                        window['pricer' + $shop_name_r + '_total'] = parseInt(data_regular[j][$shop_name_r+"totalprice"]);                                                                      
                                    }                             
                                     if(item_name_combine==item_name_regular){
                                        total_qty=parseInt(total_qty_h)+parseInt(total_qty_r);
                                        f_check_exist="1";
                                        for(n=0;n<list_shopmall.length;n++){
                                            $shop_name=list_shopmall[n];
                                            window['qty' + $shop_name + '_total'] += parseInt(window['qtyr' + $shop_name + '_total']);
                                            window['price' + $shop_name + '_total'] += parseInt(window['pricer' + $shop_name + '_total']);                                       
                                        }                                    
                                     }
                               
                                if(f_check_exist=="1"){
                                    data_combine[i]["total_qty"]= total_qty;       
                                   for(n=0;n<list_shopmall.length;n++){
                                            $shop_name=list_shopmall[n];
                                            data_combine[i][$shop_name]=window['qty' + $shop_name + '_total'];
                                            data_combine[i][$shop_name+"totalprice"]=window['price' + $shop_name + '_total'];
                                   }
                                   
                                } 
                                
                            }
                          } 
                           data_show=data_combine;
                        }  */
                        
                 
                       var table = $('#tb_item_report').DataTable({
                            "order": [
                                [3, "desc"]
                            ],
                            dom: 'Bfrtip',
                            buttons: [
                                'copy', 'csv', 'excel', 'pdf', 'print',
                                {
                                        extend: 'excelHtml5',
                                        text: 'Export selected',
                                        exportOptions: {
                                            columns: ':visible:not(.not-exported)',
                                            modifier: {
                                                selected: true
                                            }
                                        },
                                        title: 'Data export'
                                    }
                                ],
                                select: {
                                    style: 'multi'
                                },
                            
                            pageLength: 20,
                            data: data_show,
                            lengthMenu: [
                                [10, 20, 30, 50, -1],
                                [10, 20, 30, 50, "ALL"]
                            ],
                            createdRow: function(row, data, dataIndex) {},
                            "columns": data_template
                        }); 
    
                        $("#img_load").hide();
                    },
                    error: function(e) {
                        console.log(e);
                    }
                })
            }         
            
          /*  $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_items",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   // console.log(d);return;
                    var data = $.parseJSON(d);                   
                   
                    var table = $('#tb_item_report').DataTable({
                        "order": [
                            [3, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print',
                            {
                                    extend: 'excelHtml5',
                                    text: 'Export selected',
                                    exportOptions: {
                                        columns: ':visible:not(.not-exported)',
                                        modifier: {
                                            selected: true
                                        }
                                    },
                                    title: 'Data export'
                                }
                            ],
                            select: {
                                style: 'multi'
                            },
                        
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": data_template
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })*/
            
       
        }
    }
]);
//======================== End Shope Items =========================================
//============================ Data Report Items ========================================

App.controller('RDItemsCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
       // limit_permisstion_menu("chkDRPreparingOrder");
        set_date_time($scope, '30');
        $scope.loadData = function() {
      //      load_data();
        }
        $scope.data_fillter = function() {
            var table = $('#tb_item_report').DataTable();
            table.clear();
            table.destroy();
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var cbobrand = $("#cbobrand").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "cbobrand": cbobrand
            };

            $("#img_load").show();
           
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_items",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   // console.log(d);return;
                    var data = $.parseJSON(d);                                 
                    var   obj_show_data=[
                                        {
                                            "width": "30px",
                                            "data": "product_name"
                                        }, 
                                        {
                                            "width": "50px",
                                            "data": "sku"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "total_quantity"
                                        }
                                      ];
                    
                    var table = $('#tb_item_report').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": obj_show_data
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);
//======================== End Data Report Items =========================================

//============================ Data Report Heatmap ========================================

App.controller('RDHeatmapCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
       // limit_permisstion_menu("chkDRPreparingOrder");
        set_date_time($scope, '30');
        $scope.loadData = function() {
      //      load_data();
        }
        $scope.data_fillter = function() {
            var table = $('#tb_item_report').DataTable();
            table.clear();
            table.destroy();
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var brand = $("#cbobrand").val();
            var color_tone =$("#cboTone").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "brand": brand,
                "color_tone" :color_tone
            };

            $("#img_load").show();
           
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_heatmap",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   // console.log(d);return;
                    var data = $.parseJSON(d);                                 
                    var   obj_show_data=[
                                       
                                        {
                                            "width": "50px",
                                            "data": "product_name"
                                        },
                                         {
                                            "width": "30px",
                                            "data": "sku"
                                        },  
                                        {
                                            "width": "30px",
                                            "data": "total_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "tone"
                                        }, 
                                        {
                                            "width": "30px",
                                            "render": function(data, type, full, meta) {
                                                var html ="";                                      
                                                $color=full["color"];                                            
                                                
                                               html = '<div style="background-color:'+$color+'" ><span style="color:white"  class="text">'+$color+'</span></div>';
                                                                           
                                                return html;
                                            }
                                            
                                        }
                                      ];
                    
                    var table = $('#tb_item_report').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": obj_show_data
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);
//======================== End Data Report Heatmap =========================================

//======================== Report Data Watsons =========================================
App.controller('RDWatsonsCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRWatsons");
        set_date_time($scope, '30');
        $scope.loadData = function() {     
            get_list_product_report_watsons();
        }
        var data_private="";
        $scope.data_fillter = function() {
         var table = $('#tb_watsons_stock_borrow').DataTable();
         table.destroy();
         table.clear().draw(); 
         get_list_product_report_watsons();
       //  alert(1);
        }
        
         // ------------------- Report Watsons -------------------------------------------------------
        function   get_list_product_report_watsons(){
            $("#img_load").show();
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var check_all_data=$('#chkALL').is(':checked'); 
            var  obj={
                "start_date": fromdate,
                "end_date": todate,
                "all_data": check_all_data
              
            };          
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_get_list_product_watsons",
                    type: "POST",
                    data:{"obj":obj},
                    success: function(d) {
                     //   console.log(d);return;
                        var data = $.parseJSON(d); 
                        data_private=data;   
                        var table = $('#tb_watsons_stock_borrow').DataTable({
                            "order": [
                                [9, "des"]
                            ],
                            pageLength: 20,
                            data: data,
                            lengthMenu: [
                                [20, 30, 50, -1],
                                [20, 30, 50, "ALL"]
                            ], dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                            createdRow: function(row, data, dataIndex) {
                              //   $compile(row)($scope);
                            },
                            "columns": [
                               {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        var html ="";                                      
                                        $status=full["status"];
                                        var po_id=full["po_id"];
                                        if($status!="2"){
                                             html = '<input  name="chk" value="' + full["product_id"] + '" po_id="'+po_id+'" type="checkbox" />';
                                        }                            
                                        return html;
                                    }
                                },{
                                    "width": "30px",
                                    "data": "product_id" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "product_name" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "sku" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "stock_remain" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "stock_total" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "qty_sale" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "qty_return" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "po_id" 
                                },                           
                                {
                                    "width": "50px",
                                    "render": function(data, type, full, meta) {
                                        var html ="";                                      
                                        $status=full["status"];
                                    
                                        if($status=="0"){
                                             html = '<span class="text">Near Expire Date</span>';
                                        }else if($status=="1"){
                                             html = '<span class="text">Items Return Processing</span>';
                                        }                             
                                        return html;
                                    }
                                }
                            ],
                            "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                                if ( aData["status"] == "0" )
                                {
                                    $('td', nRow).css('background-color', '#e9731f');
                                }
                                else if ( aData["status"] == "1" )
                                {
                                    $('td', nRow).css('background-color', 'Orange');
                                }
                           }
                        });
                        $("#img_load").hide();
            
                    },
                    error: function(e) {
                        alert(e);
                    }
                });
        }
        $scope.update_status = function  (){
            
            var arr_product_id=[];
            var flat_check=0;
            var status_update=$("#cboStatus").val();
            var checksListChange = $('input[type="checkbox"]');
            for(var i =0; i< checksListChange.length;i++){
                 var check = checksListChange[i];
                 if($(check).is(':checked')){           
                    var product_id = $(check).val(); 
                    var po_id=   $(check).attr("po_id");
                    var obj={
                        "product_id":product_id,
                        "po_id":po_id
                    }
                    arr_product_id.push(obj)    ; 
                 }
                
            }  
            arr_product_id = $.grep(arr_product_id, function( a ) {
            return a["product_id"] !== 'on'; 
            }) 
            if(arr_product_id.length==0){
                alert("Please check product for update .");
                return;
            }else{
                var table = $('#tb_watsons_stock_borrow').DataTable();
                table.destroy();
                table.clear().draw(); 
            }   
          //  console.log(arr_product_id);
            var obj_data={
                "list_item":arr_product_id,
                "status_update":status_update
            }
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_update_status_exp_watsons",
                type: "POST",
                data: {
                    "obj": obj_data
                },
                success: function(d) {
                    get_list_product_report_watsons();
                },
                error: function(e) {
                }
           })
                
          
        } 
        
           
       
        // ------------------- END Report Watsons -------------------------------------------------------
    }
])

//======================== End Report Data Watsons =====================================

//============================ Data Report Preparing Order ========================================

App.controller('RDPreparingOrderCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
       // limit_permisstion_menu("chkDRPreparingOrder");
        set_date_time($scope, '30');
        $scope.loadData = function() {
      //      load_data();
        }
        $scope.data_fillter = function() {
            var table = $('#tb_item_report').DataTable();
            table.clear();
            table.destroy();
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var product_type = $("#cboProductType").val();
            var company =$("#cboCompany").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "product_type": product_type,
                "company" :company
            };

            $("#img_load").show();
           
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_preparing_order",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                 //   console.log(d);return;
                    var data = $.parseJSON(d);                                 
                    var   obj_show_data=[
                                        {
                                            "width": "30px",
                                            "data": "item_id"
                                        }, 
                                        {
                                            "width": "50px",
                                            "data": "product_name"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "stock_remain"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "total_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "stock_incoming"
                                        }
                                      ];
                    
                    var table = $('#tb_item_report').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": obj_show_data
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);
//======================== End Data Report Preparing Order =========================================

//============================ Tax ========================================

/*App.controller('RDTaxCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRTax");
        set_date_time($scope, '30');
        $scope.loadData = function() {
            load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var shop_sale = $("#cboShopSale").val();
            var brand = $("#cboBrand").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shop_sale,
                "brand": brand
            };

            $("#img_load").show();
            var table = $('#tb_tax').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_tax",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    //console.log(d);return;
                    var data = $.parseJSON(d);
                    var table = $('#tb_tax').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            }
                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);*/
//======================== End Tax =========================================

//============================ Cancelled ======================================

App.controller('RDUCancelledCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRCancelled");
        set_date_time($scope, '7');
        $scope.loadData = function() {
        //    load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }

            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };


            $("#img_load").show();
            $("#img_load_1").show();
            var table = $('#tb_order_cancelled').DataTable();
            table.clear();
            table.destroy();
            var table_cs = $('#tb_customer_cancelled').DataTable();
            table_cs.clear();
            table_cs.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_order_cancelled",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    // console.log(d);
                    var data = $.parseJSON(d);
                    var data_order_cancelled = data["list_order_cancelled"];
                    var data_customer_cancelled = data["list_customer_cancelled"];
                    var table = $('#tb_order_cancelled').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 10,
                        data: data_order_cancelled,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "30px"
                            },
                            {
                                "width": "60px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            }

                        ]
                    });
                    $("#img_load").hide();

                    var table = $('#tb_customer_cancelled').DataTable({
                        "order": [
                            [6, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 10,
                        data: data_customer_cancelled,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "30px"
                            }

                        ]
                    });
                    $("#img_load_1").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);
//======================== End Cancelled ======================================

//============================ Marketing ======================================

App.controller('RDUMarketingCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRMarketing");
        set_date_time($scope, '7');
        $scope.loadData = function() {
         //   load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var shop_sale = $("#cboShopSale").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shop_sale
            };
            var name_shop_sale = $('#cboShopSale option:selected').text();
            $scope.expressions_shop_sale = name_shop_sale;
            $("#img_load").show();
            var table = $('#tb_order_report_marketing').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_order_marketing",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   //  console.log(d); return;
                    var data = $.parseJSON(d);
                    var table = $('#tb_order_report_marketing').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "30px"
                            },
                            {
                                "width": "60px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            },
                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }

    }
]);
//======================== End Marketing ======================================

//============================ Order Membership ===============================
App.controller('RDMembershipOrderCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRMembershipOrder");
        set_date_time($scope, '7');
        $scope.loadData = function() {
        //    load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var membership = $("#cboMembership").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "membership": membership
            };
            var name_shop_sale = $('#cboMembership option:selected').text();
            $scope.expressions_shop_sale = name_shop_sale;
            $("#img_load").show();
            var table = $('#tb_order_report').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_order_membership",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    //  console.log(d);
                    var data = $.parseJSON(d);
                    var table = $('#tb_order_report').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "30px"
                            },
                            {
                                "width": "60px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            }
                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }

    }
]);
//============================ End  Order Membership ==========================

//============================ Report Coupon ===============================
App.controller('RDCouponCtrl', ['$scope', '$localStorage', '$window', '$http', "$compile",
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        var date = "";
        $("#btn_search").hide();
        var d = new Date();
        date += d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate() +
            "_" + d.getHours() + "_" + d.getMinutes() + "_" +
            d.getSeconds();
        limit_permisstion_menu("chkDRCoupon");
        $scope.loadData = function() {
        //    load_data();
        }


        function load_data() {
            var table = $('#tb_coupon_report').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_coupon_list",
                type: "GET",
                success: function(d) {
                    // console.log(d);
                    var data = $.parseJSON(d);
                    var table = $('#tb_coupon_report').DataTable({
                        "order": [
                            [1, "desc"]
                        ],
                        dom: 'Bfrtip',
                        /* buttons: [
                             'copy', 'csv', 'excel', 'pdf', 'print'
                             
                         ],*/
                        buttons: [{
                            extend: 'excelHtml5',
                            title: 'sky007_coupon_' + date
                        }, {
                            extend: 'csv',
                            title: 'sky007_coupon_' + date

                        }],


                        pageLength: 10,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },

                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var html = '<button class="btn btn-info" ng-click="detail_coupon(\'' + id + '\')">Detail</button>';
                                    return html;
                                }
                            }

                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
        $scope.detail_coupon = function(counpon_id) {
            $("#img_load").show();
            var table = $('#tb_order_report').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_coupon_detail",
                type: "POST",
                data: {
                    "coupon_id": counpon_id
                },
                success: function(d) {
                    // console.log(d); return;
                    var data = $.parseJSON(d);
                    var data_counting = data["item_count"][0];
                    //  console.log(data_counting);
                    update_counting(data_counting);
                    var table = $('#tb_order_report').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data["infor_order"],
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],

                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "30px"
                            }

                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }

        function update_counting(data_counting) {
            var total_order = data_counting["total_order"];
            var total_item = data_counting["quantity"];
            var order_completed = data_counting["total_complete"];
            var order_cancel = data_counting["total_cancel"];
            $("#div_total_order").empty();
            $("#div_total_items").empty();
            $("#div_order_completed").empty();
            $("#div_order_cancel").empty();

            $("#div_total_order").append(total_order);
            $("#div_total_items").append(total_item);
            $("#div_order_completed").append(order_completed);
            $("#div_order_cancel").append(order_cancel);
        }
    }
]);
//============================ End Report Coupon ==========================

//====================== End Data Report ==================================================================================        

//====================== Customer Management ==============================================================================

//============================ Customer ========================================

App.controller('CMCustomersCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile', '$filter',
    function($scope, $localStorage, $window, $http, $compile, $filter) {
        checkCookie($scope);
        limit_permisstion_menu("chkCMCustomer");
        set_date_time($scope, '7');
        $scope.loadData = function() {
            load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var qty_item = $("#txtQtyItem").val();
            var total_price = $("#txtTPrice").val();
            var qty_order = $("#txtQtyOrder").val();
            var shopsale = $("#cboShopSale").val();
            if (qty_item == "") {
                qty_item = 0;
            }
            if (total_price == "") {
                total_price = 0;
            }
            if (qty_order == "") {
                qty_order = 0;
            }
            var obj = {
                "qty_item": qty_item,
                "total_price": total_price,
                "qty_order": qty_order,
                "start_date": fromdate,
                "end_date": todate,
                "shopsale": shopsale
            };
            $("#img_load").show();
            /*  var date = new Date();
              $filter('date')(date, 'yyyy/MM/dd hh:mm:ss');*/

            var date = "";
            var d = new Date();
            date += d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate() +
                "_" + d.getHours() + "_" + d.getMinutes() + "_" +
                d.getSeconds();


            var table = $('#tb_history_order').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_customer_management_customer",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    // console.log(d);
                    var data = $.parseJSON(d);
                    var table = $('#tb_history_order').DataTable({
                        "order": [
                            [3, "desc"]
                        ],
                        dom: 'Bfrtip',
                        /* buttons: [
                             'copy', 'csv', 'excel', 'pdf', 'print'
                             
                         ],*/
                        buttons: [{
                            extend: 'excelHtml5',
                            title: 'sky007_customers_' + date
                        }, {
                            extend: 'csv',
                            title: 'sky007_customers_' + date

                        }],


                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "20px"
                            }, {
                                "width": "20px"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var html = '<button class="btn btn-info" ng-click="detail_order_html(' + id + ')">History</button>';
                                    return html;
                                }
                            }

                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
        $scope.detail_order_html = function(id) {

            var obj = {
                "user_id": id
            };
            var table = $('#tb_history_order_detail').DataTable();
            table.clear();
            table.destroy();
            $("#img_load_detail").show();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_customer_management_customer_detail",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                    // console.log(data);

                    var table = $('#tb_history_order_detail').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "500px"
                            },
                            {
                                "width": "50px"
                            }
                        ]
                    });
                    $("#img_load_detail").hide();

                },
                error: function(e) {
                    alert(e);
                }
            });
        }
    }
]);
//======================== End Customer ========================================

//============================ History Order ===================================

App.controller('CMHistoryCustomersCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkCMHistoryOrder");
        set_date_time($scope, '30');
        $scope.loadData = function() {
            load_data();
        }
        $scope.data_fillter = function() {
            load_data();
        }

        function load_data() {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }

            var obj = {
                "start_date": fromdate,
                "end_date": todate
            };

            $("#img_load").show();
            var table = $('#tb_history_order').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_customer_management_history_order",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    // console.log(d);
                    var data = $.parseJSON(d);
                    var table = $('#tb_history_order').DataTable({
                        "order": [
                            [3, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "20px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "20px"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[4];
                                    var html = '<button class="btn btn-info" ng-click="detail_order_html(' + id + ')">History</button>';
                                    return html;
                                }
                            }

                        ]
                    });

                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
        $scope.detail_order_html = function(id) {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "user_id": id
            };
            var table = $('#tb_history_order_detail').DataTable();
            table.clear();
            table.destroy();
            $("#img_load_detail").show();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_customer_management_history_order_detail",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                    // console.log(data);

                    var table = $('#tb_history_order_detail').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "500px"
                            },
                            {
                                "width": "50px"
                            }
                        ]
                    });
                    $("#img_load_detail").hide();

                },
                error: function(e) {
                    alert(e);
                }
            });
        }
    }
]);
//======================== End History Order ====================================
//============================ Customer Analysys ================================

App.controller('CMAnalysysCustomersCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        set_date_time($scope, '30');
    }
]);

//======================== End Customer Analysys ================================

//====================== End Customer Management ==========================================================================

//====================== Order Management =================================================================================

//============================ Update Order =====================================

App.controller('OMUpdateCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
function($scope, $localStorage, $window, $http, $compile) {
    checkCookie($scope);
    limit_permisstion_menu("chkOMUpdateOrder");
    var data_excel = "";
    $("#imgSave").hide();
    var f_list_old_item = [];
    var flatcheck_item = "no";
    var private_order_id = "";
    var private_shop_type = "";
    var private_warehouse = "";
    var flatcheck_address = "no";
    var flatcheck_city = "no";
    var flatcheck_paymethod = "no";
    var flatcheck_shippingfee = "no";
    var flatcheck_shippingstates = "no";
    var flatcheck_delivery_id = "no";
    var flatcheck_shoporderid = "no";
    var flatcheck_parentid = "no";
    var flatcheck_deliverytype = "no";
    var flatcheck_note = "no";
    var flatcheck_noteadmin = "no";
    set_date_time($scope, '1');
    $.session.remove("order_list");

    $("#btnNotifyFinish").hide();
    $("#btnNotifyFinishCancel").hide();
    $("#btnSaveUpdate").hide();
    $("#div_update").hide();
    $("#imgloadupdate").hide();
    $scope.loadData = function() {
        get_list_order();
        // get_list_product();
    }
    $scope.data_fillter = function() {
        //$("#btnNotifyFinish").click();
        get_list_order();
    }

    function get_list_order() {
        var fromdate = $scope.txtfromdate;
        var todate = $scope.txttodate;
        fromdate = formatDate(fromdate);
        todate = formatDate(todate);
        if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
            alert("Please check date .");
            return;
        }
        var shop_sale = $("#cboShopSale").val();
        var warehouse = $("#cboWarehouse").val();
        var obj = {
            "start_date": fromdate,
            "end_date": todate,
            "shop_sale": shop_sale,
            "warehouse": warehouse
        };

        $("#img_load").show();
        clear_input();
        $("#btnSaveUpdate").hide();
        $("#div_update").hide();
        var table = $('#tb_list_order').DataTable();
        table.clear();
        table.destroy();
        $.ajax({
            url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order",
            type: "POST",
            data: {
                "obj": obj
            },
            success: function(d) {
               //  console.log(d);  return;//$compile(row)($scope);
                var data = $.parseJSON(d);
                var mg_name = getCookie("ck_name");
                var table = $('#tb_list_order').DataTable({
                    "order": [
                        [0, "desc"]
                    ],
                    pageLength: 5,
                    data: data,
                    lengthMenu: [
                        [5, 10, 20, 30, 50, -1],
                        [5, 10, 20, 30, 50, "ALL"]
                    ],
                    createdRow: function(row, data, dataIndex) {
                        $compile(row)($scope);
                    },
                    "columns": [{
                            "width": "30px"
                        },
                        {
                            "width": "50px"
                        },
                        {
                            "width": "50px"
                        },
                        {
                            "width": "30px"
                        }, {
                            "width": "30px"
                        },
                        {
                            "width": "30px"
                        },
                        {
                            "width": "30px"
                        },
                        {
                            "width": "30px"
                        },
                        {
                            "width": "30px"
                        },
                        {
                            "width": "30px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                var id = full[0];
                                var status = full[6];
                                var html = "";
                              //  console.log(mg_name);
                                if(mg_name=="Admin" && status != "wc-cancelled" && status != "trash"){
                                    html = '<button class="btn btn-info" ng-click="update_order(\'' + id + '\')">Update</button>';
                                }
                                else {
                                     if (status != "wc-cancelled" && status != "trash" && status != "wc-completed") {
                                     html = '<button class="btn btn-info" ng-click="update_order(\'' + id + '\')">Update</button>';
                                    } 
                                }   
                                
                                return html;
                            }
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                var id = full[0];
                                var status = full[6];
                                var html = "";
                                if (status != "wc-cancelled" && status != "trash" && status != "wc-completed") {
                                    html = '<button class="btn btn-success" ng-click="cancel_order(\'' + id + '\')">Cancel</button>';
                                } else {
                                    if (status != "trash" && status != "wc-completed") {
                                        html = '<button class="btn btn-success" ng-click="order_detail(\'' + id + '\')">Detail Order</button>';
                                    }
                                }
                                return html;
                            }
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                var id = full[0];
                                var status = full[6];
                                var html = "";
                                if (status != "wc-cancelled" && status != "trash" && status != "wc-completed") {
                                    html = '<button class="btn btn-primary" ng-click="delete_order(\'' + id + '\')">Delete</button>';
                                } else {
                                    if (status != "wc-cancelled" && status != "wc-completed") {
                                        html = '<button class="btn btn-primary" ng-click="order_detail(\'' + id + '\')">Detail Order</button>';
                                    }
                                }
                                return html;
                            }
                        }
                    ]
                });

                $("#img_load").hide();
            },
            error: function(e) {
                console.log(e);
            }
        })
    }

    $scope.cancel_order = function(id) {
        $('#modal-noted').modal('show');
        $("#btn_save_note_cancel").attr("order_id", id);
        $("#txt_modal_id_order_cancell").empty();
        $("#txt_modal_id_order_cancell").append(id);
        $("#txtNote_Cancel").attr("placeholder","");
        $("#txtNote_Cancel").val("");
        $("#div_update").hide();            
        clear_input();
    }
    $("#btn_save_note_cancel").click(function() {

        var note = $("#txtNote_Cancel").val();
        var order_id = $("#btn_save_note_cancel").attr("order_id")
        if (note == "") {
            alert("Please insert reason");
            $("#txtNote_Cancel").focus();
        } else {
            $("#div_update").hide();
            var note = $("#txtNote_Cancel").val();
            var mg_name = getCookie("ck_name");
            clear_input();
            var obj = {
                "order_id": order_id,
                "mg_name": mg_name,
                "note": note
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_cancelled",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   
                    var data = $.parseJSON(d);
                     console.log(data);
                    get_list_order();
                    //  get_list_product();
                    if (data == false) {
                        alert("this order already deleted before !");
                    }
                    //$("#tb_list_order_wrapper button").show();     
                },
                error: function(e) {
                    alert(e);
                }
            });
            $('#modal-noted').modal('hide');
        }
        $("#btn_save_note_cancel").attr("order_id", "");
    })
    $scope.delete_order = function(order_id) {
        var answer = confirm("Are you sure you want to delete ?")
        if (answer) {           //ct_skysys.ct_order_management_update_order_delete
            $('#modal-delete').modal('show');
            $("#btnDelete").attr("order_id", order_id);
            $("#txt_modal_id_order").empty();
            $("#txt_modal_id_order").append(order_id);
            $("#txtDeleteReason").attr("placeholder","");
            $("#txtDeleteReason").val("");
            $("#div_update").hide();         
            $('#chkCBS').prop('checked', false);   
            clear_input();
        }
    }
    $("#btnDelete").click(function(){
        var note = $("#txtDeleteReason").val();
        var order_id = $("#btnDelete").attr("order_id");
        var chkCBS=0; // 0 : uncheck , 1 :checked
            if($("#chkCBS").is(':checked')){
                chkCBS=1;
            }
        if (note == "") {
            alert("Please insert reason");
            $("#txtDeleteReason").focus();
        } else {
            $("#div_update").hide();
            var note = $("#txtDeleteReason").val();
            var mg_name = getCookie("ck_name");
            clear_input();
            var obj = {
                "order_id": order_id,
                "mg_name": mg_name,
                "note": note,
                "chkCancelBS":chkCBS
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_delete",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                  //  console.log(d);
                    get_list_order();
                    //  get_list_product();
                    if (d == "false") {
                        alert("this order already deleted before !");
                    }
                    //$("#tb_list_order_wrapper button").show();     
                },
                error: function(e) {
                    alert(e);
                }
            });
            $('#modal-delete').modal('hide');
        }
        $("#btnDelete").attr("order_id", "");
    })
   
    function get_list_product(cbo_shop, warehouse) {
        if (cbo_shop != 0) {
            $("#div_list_item").show();
            var table = $('#tb_list_product').DataTable();
            table.destroy();
            table.clear().draw();
            // alert(warehouse);return;

            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_list_product",
                type: "POST",
                data: {
                    "shoptype": cbo_shop,
                    "warehouse": warehouse
                },
                success: function(d) {
                //     console.log(d);return;
                    $("#div_list_item").hide();
                    var data = $.parseJSON(d);


                    var table = $('#tb_list_product').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 5,
                        data: data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                        "width": "30px",
                        "data": "name" 
                    },
                    {
                        "width": "50px",
                        "data": "price" 
                    },
                    {
                        "width": "50px",
                        "data": "stock" 
                    },
                     {
                        "width": "50px",
                        "data": "sku" 
                    },
                    {
                        "width": "50px",
                        "data": "product_type" 
                    },                    
                    {
                        "width": "10px",
                        "render": function(data, type, full, meta) {
                            //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                            var id = full["id"];
                            var name = full["name"].replace(/"/g, " ");
                            var price = full["price"];
                            var stock = full["stock"];
                            var product_type= full["product_type"];
                            $color_infor="";
                            if(product_type=="Regular"){
                                $type_product=1;
                                $color_infor="btn-danger";
                            }else{
                                $color_infor="btn-info";
                                $type_product=0;
                            }
                            var html = '<button class="btn '+$color_infor+'" ng-click="add_order_html(\'' + id + '\',\'' + price + '\',\'' + name + '\',\'' + stock + '\',\'' + $type_product + '\')">Add</button>';
                            return html;
                        }
                    }
                    ]
                    });


                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        $("#divListOrder").show();



    }
    $scope.add_order_html = function(id, price, name, stock, product_type) {
        // alert(123);return;
        var ss_id = id;
        var color_vat = "";
        if (product_type == "1") {
            color_vat = "background-color: #74f594;";
        }
        var flag_duplicate_p_id = true;
        if (typeof $.session.get('order_list') !== 'undefined' && $.session.get('order_list') !== null) {
            var arr_list = $.session.get('order_list');
            var splitString = arr_list.split(',');
            for (var i = 0; i < splitString.length; i++) {
                if (id == splitString[i]) {
                    flag_duplicate_p_id = false;
                    break;
                }
            }
            if (flag_duplicate_p_id == true && stock > 0) {
                ss_id = $.session.get('order_list') + "," + id;
                $.session.set('order_list', ss_id);
                //  console.log(ss_id);
                var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                <div class="col-md-6">\
                                                    <input style="' + color_vat + '" id="txtItem' + id + '" class="form-control" value="' + name + '" />\
                                                </div>\
                                                <div class="col-md-3">\
                                                    <input style="' + color_vat + '" id="txtPriceItem' + id + '" class="form-control" value="' + price + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57"/>\
                                                </div>\
                                                <div class="col-md-2">\
                                                    <input style="' + color_vat + '" id="txtQuantityItem' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"/>\
                                                </div>\
                                                <div class="col-md-1">\
                                                    <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                </div>\
                                               </div>   ';
                $("#div_list_order").append($compile(html)($scope));
            }
        } else {
            if (stock > 0) {
                $.session.set('order_list', ss_id);
                var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                    <div class="col-md-6">\
                                                        <input style="' + color_vat + '" id="txtItem' + id + '" class="form-control" value="' + name + '" />\
                                                    </div>\
                                                    <div class="col-md-3">\
                                                        <input style="' + color_vat + '" id="txtPriceItem' + id + '" class="form-control" value="' + price + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57"/>\
                                                    </div>\
                                                    <div class="col-md-2">\
                                                        <input style="' + color_vat + '" id="txtQuantityItem' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"/>\
                                                    </div>\
                                                    <div class="col-md-1">\
                                                        <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                    </div>\
                                                   </div>   ';
                $("#div_list_order").append($compile(html)($scope));
            }

        }
        //  console.log(arr_list);


    }

    $scope.update_order = function(order_id) {
        
        $("#imgwaiting").show();
        $("#div_update").hide();
        $("#divDetailOrder").hide();
        clear_input();
        $.ajax({
            url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_infor_order",
            type: "POST",
            data: {
                "order_id": order_id
            },
            success: function(d) {
                var dt = $.parseJSON(d);
             //   console.log(dt); return;
                if (dt == false) {
                    alert("This order already remove !");
                    return;
                }
             //   var dt = $.parseJSON(d);
                var infor_order = dt["infor_order"];
                var item_order = dt["item_order"];
 
                insert_infor(infor_order);
                add_information_item(item_order);
                $("#btnSaveUpdate").show();
                $("#div_update").show();
                $("#imgwaiting").hide();
                // console.log(infor_order);
                // console.log(item_order);
            },
            error: function(e) {
                console.log(e);
            }
        });
    }
    $scope.delete_item = function(product_id) {
        var arr_list=$.session.get('order_list');
        var splitString = arr_list.split(',');
        var arr_order = [];
        for (var i = 0; i < splitString.length; i++) {
            arr_order.push(splitString[i]);
        }
        var index = arr_order.indexOf(product_id);
        if (index != -1) {
            arr_order.splice(index, 1);
        }
        var strss = "";
        for (var i = 0; i < arr_order.length; i++) {
            if (i == 0) {
                strss += arr_order[i];
            } else {
                strss = strss + "," + arr_order[i];
            }
        }
        $.session.set('order_list', strss);
        $("#div_item" + product_id).remove();
        arr_list = $.session.get('order_list');
        if (arr_list.length == 0) {
            $.session.remove('order_list');
        }
        //   console.log(arr_list);
    }

    function insert_infor($data) {
        $data = $data[0];

        // console.log($data)
        $("#txtOrderID").val($data["id"]);
        $("#txtOrderID").closest('div').addClass("open");
        $("#txtName").val($data["name"]);
        $("#txtName").closest('div').addClass("open");
        var warehouse = $data["warehouse"];
        $shop_type = $data["customer_type"];
        private_order_id = $data["id"];
        private_shop_type = $shop_type;
        private_warehouse = warehouse;

        $str_type = "";
        if ($shop_type == 0) {
            $str_type = "Customer";
            get_list_product("1", warehouse);
        } else if ($shop_type == 5) {
            $str_type = "Marketing";
            get_list_product("1", warehouse);
        } else if ($shop_type == 7) {
            $str_type = "Wholesaler";
            get_list_product("1", warehouse);
        } else if ($shop_type == 10) {
            $str_type = "Shopee Bbia";
            get_list_product("2", warehouse);
        } else if ($shop_type == 11) {
            $str_type = "Shopee Bbia Marketing";
            get_list_product("2", warehouse);
        } else if ($shop_type == 14) {
            $str_type = "Lotte";
            get_list_product("3", warehouse);
        } else if ($shop_type == 15) {
            $str_type = "Lotte Marketing";
            get_list_product("3", warehouse);
        } else if ($shop_type == 16) {
            $str_type = "Sendo";
            get_list_product("4", warehouse);
        } else if ($shop_type == 17) {
            $str_type = "Sendo Marketing";
            get_list_product("4", warehouse);
        } else if ($shop_type == 18) {
            $str_type = "Eglips";
            get_list_product("5", warehouse);
        } else if ($shop_type == 19) {
            $str_type = "Eglips Marketing";
            get_list_product("5", warehouse);
        } else if ($shop_type == 20) {
            $str_type = "Lazada";
            get_list_product("6", warehouse);
        } else if ($shop_type == 21) {
            $str_type = "Lazada Maketing";
            get_list_product("6", warehouse);
        } else if ($shop_type == 22) {
            $str_type = "Wholesaler Eglips";
            get_list_product("5", warehouse);
        } else if ($shop_type == 24) {
            $str_type = "Shopee Eglips";
            get_list_product("7", warehouse);
        } else if ($shop_type == 25) {
            $str_type = "Shopee Eglips Marketing";
            get_list_product("7", warehouse);
        } else if ($shop_type == 26) {
            $str_type = "Lazada Eglips";
            get_list_product("8", warehouse);
        } else if ($shop_type == 27) {
            $str_type = "Lazada Eglips Marketing";
            get_list_product("8", warehouse);
        }else if ($shop_type == 28) {
            $str_type = "Robins";
            get_list_product("9", warehouse);
        } else if ($shop_type == 29) {
            $str_type = "Robins Marketing";
            get_list_product("9", warehouse);
        }else if ($shop_type == 30) {
            $str_type = "Watsons";
            get_list_product("10", warehouse);
        }else if ($shop_type == 31) {
            $str_type = "Watsons Marketing";
            get_list_product("10", warehouse);
        }else if($shop_type==32){
            $str_type="Wholesaler Actsone";
            get_list_product("5",warehouse);
        }else if($shop_type==33){
            $str_type="Wholesaler Jnain";
            get_list_product("1",warehouse);
        }else if ($shop_type == 34) {
            $str_type = "Beautybox";
            get_list_product("1", warehouse);
        }else if ($shop_type == 35) {
            $str_type = "Beautybox Marketing";
            get_list_product("1", warehouse);
        }else if ($shop_type == 36) {
            $str_type = "Tiki";
            get_list_product("11", warehouse);
        }else if ($shop_type == 37) {
            $str_type = "Tiki Marketing";
            get_list_product("11", warehouse);
        }else if ($shop_type == 38) {
            $str_type = "Shopee C2C";
            get_list_product("12", warehouse);
        }else if ($shop_type == 39) {
            $str_type = "Shopee C2C Marketing";
            get_list_product("12", warehouse);
        }else if ($shop_type == 40) {
            $str_type = "Lazada C2C";
            get_list_product("13", warehouse);
        }else if ($shop_type == 41) {
            $str_type = "Lazada C2C Marketing";
            get_list_product("13", warehouse);
        }else if ($shop_type == 42) {
            $str_type = "Tiki Eglips";
            get_list_product("14", warehouse);
        }else if ($shop_type == 43) {
            $str_type = "Tiki Eglips Marketing";
            get_list_product("14", warehouse);
        }else if ($shop_type == 44) {
            $str_type = "Sociolla";
            get_list_product("15", warehouse);
        }else if ($shop_type == 45) {
            $str_type = "Sociolla Marketing";
            get_list_product("15", warehouse);
        }else if ($shop_type == 46) {
            $str_type = "Bbiavn";
            get_list_product("16", warehouse);
        }else if ($shop_type == 47) {
            $str_type = "Bbiavn Marketing";
            get_list_product("16", warehouse);
        }else if ($shop_type == 48) {
            $str_type = "Mixsoon";
            get_list_product("17", warehouse);
        }else if ($shop_type == 49) {
            $str_type = "Mixsoon Marketing";
            get_list_product("17", warehouse);
        }
        $("#txtShopType").val($str_type);
        $("#txtShopType").closest('div').addClass("open");
        $("#txtPhone").val($data["phone"]);
        $("#txtPhone").closest('div').addClass("open");
        $("#txtEmail").val($data["email"]);
        $("#txtEmail").closest('div').addClass("open");
        $("#txtAddress").val($data["address"]);
        $("#txtAddress").closest('div').addClass("open");
        // $("#cboCity").val(0);
        var cbocity = document.getElementById('cboCity');
        for (var i = 0; i < cbocity.options.length; i++) {
            if (cbocity.options[i].text === $data["city"]) {
                cbocity.selectedIndex = i;
                break;
            }
        }

        var cbopaymethod = document.getElementById('cboPayMethod');
        for (var i = 0; i < cbopaymethod.options.length; i++) {
            if (cbopaymethod.options[i].text === $data["pay_method"]) {
                cbopaymethod.selectedIndex = i;
                break;
            }
        }
        $("#cboShippingFee").val($data["shipping_state"]);
        $("#txtShippingFee").val($data["shipping_fee"]);
        $("#txtDeliveryID").val($data["delivery_id"]);
        $("#txtDeliveryID").closest('div').addClass("open");
        $("#txtShopOrderID").val($data["shop_order_id"]);
        $("#txtShopOrderID").closest('div').addClass("open");
        $("#txtParentID").val($data["parent_id"]);
        $("#txtParentID").closest('div').addClass("open");
        $("#txtNotePackaging").val($data["message_admin"]);
        $("#txtNote").val($data["note"]);

        if (warehouse == "0") {
            warehouse = "TP.HCM";
        } else if (warehouse == "1") {
            warehouse = "HaNoi";
        }
        var html_warehouse = "( " + warehouse + " - " + $str_type + " )";
        $("#txtshopinfor").empty();
        $("#txtshopinfor").append(html_warehouse);
        var html_deliverytype = '';
        if ($shop_type == "10" || $shop_type == "24") {
            $("#divDeliveryType").show();
            // 0:sky007,1:giaohangnhanh(shopee),2:giaohangtietkiem(shopee),3:viettel(shopee),4:Other, 5:Lotte Express(Lotte0,; 6:HCM Post (Lotte) ,7 :VietNam Post ,8 :Ecotrans , 10 :Saigonship
            html_deliverytype = '<label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group"  ng-click="event_delivery_change(2)" value="2"><span></span> GiaoHangTietKiem\
                            </label>\
                            <label class="css-input css-radio css-radio-warning">\
                                <input type="radio" name="delivery-group" value="1" ng-click="event_delivery_change(1)"><span></span> GiaoHangNhanh\
                            </label>\
                            <label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="3" ng-click="event_delivery_change(3)"><span></span> Viettel\
                            </label>\
                            <label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="7" ng-click="event_delivery_change(7)"><span></span> VietNam Post\
                            </label>\
                            <label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="13" onclick="event_delivery_change(13)"><span></span> J&T Express\
                            </label>';

        } else if ($shop_type == "14") {
            $("#divDeliveryType").show();
            html_deliverytype = '<label class="css-input css-radio css-radio-warning push-10-r">\
                        <input type="radio" name="delivery-group" value="7" ng-click="event_delivery_change(7)"><span></span> VietNam Post\
                    </label>\
                    <label class="css-input css-radio css-radio-warning">\
                        <input type="radio" name="delivery-group" value="5" ng-click="event_delivery_change(5)"><span></span> Lotte Express\
                    </label>\
                    <label class="css-input css-radio css-radio-warning push-10-r">\
                        <input type="radio" name="delivery-group" value="1" onclick="event_delivery_change(1)"><span></span> GiaoHangNhanh\
                    </label>\
                    <label class="css-input css-radio css-radio-warning push-10-r">\
                        <input type="radio" name="delivery-group" value="12" onclick="event_delivery_change(12)"><span></span> Kerry\
                    </label>\
                    <label class="css-input css-radio css-radio-warning push-10-r">\
                        <input type="radio" name="delivery-group" value="12" onclick="event_delivery_change(15)"><span></span> Sixty\
                    </label>';
        } else if($shop_type == "16"){
            $("#divDeliveryType").show();
            html_deliverytype ='<label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="7" ng-click="event_delivery_change(7)"><span></span> VietNam Post\
                            </label>\
                            <label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="3" ng-click="event_delivery_change(3)"><span></span> Viettel\
                            </label>\
                            <label class="css-input css-radio css-radio-warning">\
                                <input type="radio" name="delivery-group" value="1" ng-click="event_delivery_change(1)"><span></span> GiaoHangNhanh\
                            </label>\
                            <label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="16" ng-click="event_delivery_change(16)"><span></span> Ninja Van\
                            </label>\
                            <label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="17" ng-click="event_delivery_change(17)"><span></span> DHL\
                            </label>\
                            <label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="18" ng-click="event_delivery_change(18)"><span></span> VNC Post\
                            </label>\
                            <label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="13" ng-click="event_delivery_change(13)"><span></span> J&T Express\
                            </label>\
                            <label class="css-input css-radio css-radio-warning push-10-r">\
                                <input type="radio" name="delivery-group" value="19" ng-click="event_delivery_change(19)"><span></span> Speedlink\
                            </label>';
        }
            
        // delivery_id
        $("#divDeliveryType").empty();
        $("#divDeliveryType").append($compile(html_deliverytype)($scope));
        
        var shop_delivery = $data["shop_delivery"];
        $("input[name=delivery-group][value='" + shop_delivery + "']").prop("checked", true);

    }
    function add_infomation_lbl(data_infor) {
            var order_id = data_infor["id"];
            var name = data_infor["name"];
            var address = data_infor["address"];
            var email = data_infor["email"];
            var parentid = data_infor["parent_id"];
            var shipping_fee = data_infor["shipping_fee"];
            var note = data_infor["note"];
            var city = data_infor["city"];
            var pay_method = data_infor["pay_method"];
            var customer_type = data_infor["customer_type"];
            var delivery_id = data_infor["delivery_id"];
            var m_c_o = data_infor["mg_id"];
            var time_create = data_infor["date_time"];
            var m_d_o = data_infor["mg_delete"];
            var m_d_t = data_infor["time_delete"];
            var m_cancel_o = data_infor["mg_cancel"];
            var m_cancel_t = data_infor["time_cancel"];
            var reason_cancel = data_infor["reason_cancel"];
            $("#lbl_order_id").empty();
            $("#lbl_customer_name").empty();
            $("#lbl_customer_address").empty();
            $("#lbl_customer_email").empty();
            $("#lbl_customer_city").empty();
            $("#lbl_shipping_fee").empty();
            $("#lbl_pay_method").empty();
            $("#lbl_customer_type").empty();
            $("#lbl_parent_id").empty();
            $("#lbl_delivery_id").empty();
            $("#lbl_manager_c_order").empty();
            $("#lbl_create_time").empty();
            $("#lbl_manager_d_order").empty();
            $("#lbl_manager_d_time").empty();
            $("#lbl_manager_cancel_order").empty();
            $("#lbl_manager_cancel_time").empty();
            $("#lbl_customer_note").empty();
            $("#lbl_reason_cancel").empty();

            $("#lbl_order_id").append(order_id);
            $("#lbl_customer_name").append(name);
            $("#lbl_customer_address").append(address);
            $("#lbl_customer_email").append(email);
            $("#lbl_customer_city").append(city);
            $("#lbl_shipping_fee").append(shipping_fee);
            $("#lbl_pay_method").append(pay_method);
            $("#lbl_customer_type").append(customer_type);
            $("#lbl_parent_id").append(parentid);
            $("#lbl_delivery_id").append(delivery_id);
            $("#lbl_manager_c_order").append(m_c_o);
            $("#lbl_create_time").append(time_create);
            $("#lbl_manager_d_order").append(m_d_o);
            $("#lbl_reason_cancel").append(reason_cancel);
            $("#lbl_customer_note").append(note);
            $("#lbl_manager_d_time").append(m_d_t);
            $("#lbl_manager_cancel_order").append(m_cancel_o);
            $("#lbl_manager_cancel_time").append(m_cancel_t);            
            //$("#lbl_reasion_cancel").append();


        }

        function add_information_item_lbl(data_item) {
            $("#div_item_view").empty();
            var html = "";
            for (var i = 0; i < data_item.length; i++) {
                var id = data_item[i]["item_id"];
                if (i == 0) {
                    ss_id = id;
                } else {
                    ss_id = ss_id + "," + id;
                }
                var name = data_item[i]["order_item_name"];
                var total_price = parseInt(data_item[i]["price"]);
                var quantity = parseInt(data_item[i]["quantity"]);
                var price = total_price / quantity;
                var item_and_quantity = {
                    "product_id": id,
                    "quantity": quantity.toString(),
                    "price": price.toString()
                };
                f_list_old_item.push(item_and_quantity);
                html += '<div id="div_item' + id + '" class="col-md-12 form-group">\
                        <div class="col-md-6">\
                            <input id="txtItem' + id + '" class="form-control" value="' + name + '" readonly/>\
                        </div>\
                        <div class="col-md-3">\
                            <input id="txtPriceItem' + id + '" class="form-control" value="' + price + '" readonly/>\
                        </div>\
                        <div class="col-md-2">\
                            <input id="txtQuantityItem' + id + '" class="form-control" value="' + quantity + '" readonly/>\
                        </div>\
                       </div>   ';
            }
            $("#div_item_view").append(html);
        }

    function add_information_item(data_item) {
        //console.log(data_item);
        var html = "";
        var ss_id = "";
        for (var i = 0; i < data_item.length; i++) {

            //  ss_id=
            var id = data_item[i]["item_id"];
            if (i == 0) {
                ss_id = id;
            } else {
                ss_id = ss_id + "," + id;
            }
            var name = data_item[i]["order_item_name"];
            var total_price = parseInt(data_item[i]["price"]);
            var quantity = parseInt(data_item[i]["quantity"]);
            var product_type = data_item[i]["product_type"];
            //  console.log(product_type);
            var color_vat = "";
            if (product_type == "1") {
                color_vat = "background-color: #74f594;";
            }
            var price = total_price / quantity;
            var item_and_quantity = {
                "product_id": id,
                "quantity": quantity.toString(),
                "price": price.toString()
            };
            f_list_old_item.push(item_and_quantity);
            html += '<div id="div_item' + id + '" class="col-md-12 form-group">\
                <div class="col-md-6">\
                    <input style="' + color_vat + '" id="txtItem' + id + '" class="form-control" value="' + name + '" />\
                </div>\
                <div class="col-md-3">\
                    <input style="' + color_vat + '" id="txtPriceItem' + id + '" class="form-control" value="' + price + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57"/>\
                </div>\
                <div class="col-md-2">\
                    <input style="' + color_vat + '" id="txtQuantityItem' + id + '" class="form-control" value="' + quantity + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57"/>\
                </div>\
                <div class="col-md-1">\
                    <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                </div>\
               </div>   ';
        }
        $.session.set('order_list', ss_id);
        // console.log(flatcheck_item);
        $("#div_list_order").append($compile(html)($scope));
    }

    function clear_input() {


        $("#cboShippingFee").val("flat_rate:chuyen-phat-noi-thanh-hcm");
        $("#txtShippingFee").val("20000");
        $("#txtDeliveryID").val("");
        $("#txtShopOrderID").val("");
        $("#txtNotePackaging").val("");
        $("#txtshopinfor").empty();
        $("#txtOrderID").val("");
        $("#txtShopType").val("");
        $("#txtPhone").val("");
        $("#txtName").val("");
        $("#txtAddress").val("");
        $("#txtEmail").val("");
        $("#txtParentID").val("");
        $("#txtNote").val("");
        $("#cboCity").val(0);
        $("#cboPayMethod").val(0);
        $("#cboCustomerType").val(0);
        $("#div_list_order").empty();
        $.session.remove("order_list");

        flatcheck_city = "no";
        flatcheck_shippingstates = "no";
        flatcheck_shippingfee = "no";
        flatcheck_paymethod = "no";
        flatcheck_customertype = "no";
        flatcheck_parentid = "no";
        flatcheck_delivery_id = "no";
        flatcheck_shoporderid = "no";
        flatcheck_shippingstates = "no";

        flatcheck_note = "no";
        flatcheck_item = "no";
        f_list_old_item = [];

        private_order_id = "";
        private_shop_type = "";
        private_warehouse = "";
        flatcheck_address = "no";

        flatcheck_deliverytype = "no";
        flatcheck_noteadmin = "no";


    }

  
    $("#btnSaveUpdate").click(function() {
        check_part_change();
    });

    function check_part_change() {
        var arr_item_change = [];
        var arr_list_new_order = "";
        var arr_list_new_order = $.session.get('order_list');
        if (typeof(arr_list_new_order) === "undefined" || arr_list_new_order == "") {
            alert("Please Choose Item Update !!");
            return;
        }
        var splitString = arr_list_new_order.split(',');
        var length_new_order = splitString.length;
        for (var i = 0; i < length_new_order; i++) {
            var item_id = splitString[i];
            var quantity_new_item = $("#txtQuantityItem" + item_id + "").val();
            if (quantity_new_item == "0") {
                alert("Please insert item quantity  !");
                return;
            }
            var price_new_item = $("#txtPriceItem" + item_id + "").val();
            var arr_new_item = {
                "product_id": item_id,
                "quantity": quantity_new_item,
                "price": price_new_item
            };
            arr_item_change.push(arr_new_item);
        }

        if (f_list_old_item.length != arr_item_change.length) {
            flatcheck_item = "yes";
        } else {
            for (var i = 0; i < f_list_old_item.length; i++) {
                var chk_item_id = f_list_old_item[i]["product_id"];
                var chk_item_quantity = f_list_old_item[i]["quantity"];
                var chk_item_price = f_list_old_item[i]["price"];
                var chk_index = 0;
                var flat_check_same_item = "false";
                for (var j = 0; j < arr_item_change.length; j++) {
                    if (chk_item_id == arr_item_change[j]["product_id"]) {
                        flat_check_same_item = "true";
                        chk_index = j;
                        break;
                    }
                }
                if (flat_check_same_item == "false") {
                    flatcheck_item = "yes";
                } else {
                    if (chk_item_quantity != arr_item_change[chk_index]["quantity"]) {
                        flatcheck_item = "yes";
                        break;
                    }
                    if (chk_item_price != arr_item_change[chk_index]["price"]) {
                        flatcheck_item = "yes";
                        break;
                    }
                }
            }
        }
        var arr_flat_change = {
            "flatcheck_address": flatcheck_address,
            "flatcheck_city": flatcheck_city,
            "flatcheck_paymethod": flatcheck_paymethod,
            "flatcheck_shippingfee": flatcheck_shippingfee,
            "flatcheck_shippingstates": flatcheck_shippingstates,
            "flatcheck_delivery_id": flatcheck_delivery_id,
            "flatcheck_shoporderid": flatcheck_shoporderid,
            "flatcheck_parentid": flatcheck_parentid,
            "flatcheck_deliverytype": flatcheck_deliverytype,
            "flatcheck_note": flatcheck_note,
            "flatcheck_noteadmin": flatcheck_noteadmin,
            "flatcheck_item": flatcheck_item
        };

        var address_change = $("#txtAddress").val();
        var city_change = $("#cboCity option:selected").text();
        var paymethod_change = $("#cboPayMethod option:selected").text();
        var shippingstates_code_change = $("#cboShippingFee").val();
        var shippingstates_change = $("#cboShippingFee option:selected").text();
        var shippingfee_change = $("#txtShippingFee").val();
        var deliveryID_change = $("#txtDeliveryID").val();
        var shopOrderID_change = $("#txtShopOrderID").val();
        var parentID_change = $("#txtParentID").val();
        if (parentID_change == "") {
            parentID_change = 0;
        }
        var delivery_type = $("input:radio[name=delivery-group]:checked").val();
        if (typeof delivery_type === "undefined") {
            delivery_type = "4";
        }
        //  console.log(delivery_type);
        var note_change = $("#txtNote").val();
        var note_admin_change = $("#txtNotePackaging").val();
        var mg_name = getCookie("ck_name");
        var arr_info_change = {
            "order_id": private_order_id,
            "address": address_change,
            "city": city_change,
            "paymethod": paymethod_change,
            "shippingstates_code": shippingstates_code_change,
            "shipping_states": shippingstates_change,
            "shipping_fee": shippingfee_change,
            "deliveryID": deliveryID_change,
            "shopOrderID": shopOrderID_change,
            "parentID": parentID_change,
            "delivery_type": delivery_type,
            "note": note_change,
            "note_admin": note_admin_change,
            "arr_old_item": f_list_old_item,
            "arr_new_item": arr_item_change,
            "mg_name": mg_name
        };

        var arr_infor_change = {
            "flat": arr_flat_change,
            "arr_info": arr_info_change
        };
      //  console.log(arr_infor_change);
        update_bill(arr_infor_change);
        //alert(index);
    };

function update_bill(data_update) {

    //url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_update_order",
    $("#imgSave").show();
    $("#btnSaveUpdate").hide();

    $.ajax({
        url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_update_order",
        type: "POST",
        data: {
            "data": data_update
        },
        success: function(d) {
            d=(d.replace(/\s+/, ""));
            alert(d);
            clear_input();
            get_list_order();
            $("#div_update").hide();
            $("#imgSave").hide();
            
        },
        error: function(e) {
            alert(e);
        }
    });
}
 $scope.event_delivery_change = function(val) {
    flatcheck_deliverytype="yes"; 
 }

$("#txtAddress").change(function(){
    flatcheck_address="yes";
}); $("#cboCity").change(function(){
    flatcheck_city="yes";
});  $("#cboPayMethod").change(function(){
    flatcheck_paymethod="yes";
});  $("#txtDeliveryID").change(function(){
    flatcheck_delivery_id="yes";
});  $("#txtShopOrderID").change(function(){
    flatcheck_shoporderid="yes";
});  $("#txtParentID").change(function(){
    flatcheck_parentid="yes";
}); $("#txtNote").change(function(){
    flatcheck_note="yes";
});  $("#txtNotePackaging").change(function(){
    flatcheck_noteadmin="yes";
});  $("#txtShippingFee").change(function(){
    flatcheck_shippingstates="yes";
})
$("#cboShippingFee").change(function() {
     flatcheck_shippingstates="yes";
     flatcheck_shippingfee="yes";
    var index = $("#cboShippingFee option:selected").index();
    if (index == 0) {
        $("#txtShippingFee").val("20000");
    } else if (index == 1) {
        $("#txtShippingFee").val("30000");
    } else if (index == 2) {
        $("#txtShippingFee").val("30000");
    } else if (index == 3) {
        $("#txtShippingFee").val("0");
    }  
});
function clear_input() {
    $("#txtOrderID").val("");
    $("#txtName").val("");
    $("#txtAddress").val("");
    $("#txtEmail").val("");
    $("#txtParentID").val("");
    $("#txtShippingFee").val("");
    $("#txtNote").val("");
    $("#cboCity").val(0);
    $("#cboShippingFee").val(0);
    $("#cboPayMethod").val(0);
    $("#cboCustomerType").val(0);
    $("#div_list_order").empty();
    $.session.remove("order_list");
    b_order_id = "";
    flatcheck_city = "no";
    flatcheck_shippingstates = "no";
    flatcheck_shippingfee = "no";
    flatcheck_paymethod = "no";
    flatcheck_customertype = "no";
    flatcheck_parentid = "no";
    flatcheck_delivery_id = "no";
    flatcheck_note = "no";
    flatcheck_item = "no";
    f_list_old_item = [];

}
$scope.order_detail = function(order_id) {
    $.ajax({
        url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_infor_order_delete",
        type: "POST",
        data: {
            "order_id": order_id
        },
        success: function(d) {
            var dt = $.parseJSON(d);
            //console.log(dt) ; 
            var data_infor = dt["infor_order"][0];
            var data_item = dt["item_order"];
           
            $('#modal-detail-order').modal('show');
            add_infomation_lbl(data_infor);
            add_information_item_lbl(data_item);

        },
        error: function(e) {
            alert(e);
        }
    });
}




$(function() {
    $("#input").on("change", function() {
        $("#btnUpdateCancell").hide();
        var excelFile,
            fileReader = new FileReader();

        $("#result").hide();

        fileReader.onload = function(e) {
            var buffer = new Uint8Array(fileReader.result);

            $.ig.excel.Workbook.load(buffer, function(workbook) {
                var column, row, newRow, cellValue, columnIndex, i,
                    worksheet = workbook.worksheets(0),
                    columnsNumber = 0,
                    gridColumns = [],
                    data = [],
                    worksheetRowsCount;

                // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                while (worksheet.rows(0).getCellValue(columnsNumber)) {
                    columnsNumber++;
                }

                // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                    column = worksheet.rows(0).getCellText(columnIndex);
                    gridColumns.push({
                        headerText: column,
                        key: column
                    });
                }

                // We start iterating from 1, because we already read the first row to build the gridColumns array above
                // We use each cell value and add it to json array, which will be used as dataSource for the grid
                for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                    newRow = {};
                    row = worksheet.rows(i);

                    for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                        cellValue = row.getCellText(columnIndex);
                        newRow[gridColumns[columnIndex].key] = cellValue;
                    }

                    data.push(newRow);

                }
                data_excel = data;
              //  console.log(data_excel);
                $("#btnUpdateCancell").show();
                // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

            }, function(error) {

            });
        }

        if (this.files.length > 0) {
            excelFile = this.files[0];
            if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                fileReader.readAsArrayBuffer(excelFile);
            } else {

            }
        }

    })
});

var mg_name = getCookie("ck_name");
$("#btnUpdateCancell").click(function() {   
    $("#btnUpdateCancell").hide();
    if (data_excel.length > 0) {
        $.ajax({
            url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_cancel_by_excel_check",
            type: "POST",
            data: {
                "data": data_excel
            },
            success: function(d) {
                 d=(d.replace(/\s+/, ""));
             //    console.log(d);
                $("#btnUpdateCancell").show();
                if (d == "true") {
                    var answer = confirm("All data correct , Do you want to continues update cancel ?")
                        if (answer) {
                            $.ajax({
                                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_cancel_by_excel",
                                type: "POST",
                                data: {
                                    "data": data_excel,
                                    "mg_name": mg_name
                                },
                                success: function(d) {
                                //   console.log(d) ;
                                   $("#btnNotifyFinishCancel").click();                                        
                                },
                                error: function(e) {
                                    console.log(e) ;
                                    alert(e);
                                }
                             });
                        }
                        else {
                            alert("You not yet update cancel .");
                        }
                    //$("#btnNotifyFinishCancel").click();

                } else {
                    alert(d);
                }
                var table = $('#tb_list_order').DataTable();
                table.destroy();
                get_list_order();
            },
            error: function(e) {

            }
        });
        //  console.log(data_excel); 
    }

});
}]);
//======================== End Update Order ====================================

//============================ Tracking Order ==================================

App.controller('OMTrackingCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
    }
]);
//======================== End Tracking Order ===================================

//============================ Shipping Order ===================================

App.controller('OMShippingCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkOMShipingOrder");
        set_date_time($scope, 1);
        $("#btnNotifyFinish").hide();

        var data_excel = "";
        var data_excel_shipping_fee = "";
        var data_excel_complete = "";
        $scope.loadData = function() {
          //  updata_delivery_data();
            load_data($compile, $scope);
        }
        $scope.data_fillter = function() {
      /*      var table = $('#tb_list_order_status').DataTable();
            var buttons = [];

            $.each(table.buttons()[0].inst.s.buttons,
                function() {
                    buttons.push(this);
                });
            $.each(buttons,
                function() {
                    table.buttons()[0].inst.remove(this.node);
                });
            table.destroy();*/
            var table = $('#tb_list_order_status').DataTable();
            table.clear();
            table.destroy();
            load_data($compile, $scope);
        }
        
        function load_data($compile, $scope) {
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
           // var delivery_company = $("#cboDCompany").val();
            var obj = {
                 "start_date": fromdate,
                 "end_date": todate
             };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_shipping_get_order",
                type: "POST",
                data: {"obj":obj},
                success:function(d){
                  //  console.log(d);return;
                    var dt = $.parseJSON(d);
                    var list_order=dt["infor_order"];
                    var list_delivery=dt["infor_delivery"];                   
                    for(var i=0;i<list_order.length;i++){
                        var delivery_company="";      
                        var arrive_date="";   
                        var delivery_id="";
                        var delivery_fee="" ;             
                        var d_pay_status="";                       
                        list_order[i]["delivery_company"]=delivery_company;                        
                        list_order[i]["arrive_date"]=arrive_date;
                        list_order[i]["delivery_id"]=delivery_id;
                        list_order[i]["delivery_fee"]=delivery_fee;
                        list_order[i]["d_pay_status"]=d_pay_status;                        
                        for(var j=0;j<list_delivery.length;j++){
                            delivery_company=list_delivery[j]["delivery_company"];      
                            arrive_date=list_delivery[j]["arrive_date"];   
                            delivery_id=list_delivery[j]["delivery_id"];
                            delivery_fee=list_delivery[j]["delivery_fee"] ;             
                            d_pay_status=list_delivery[j]["d_pay_status"];                          
                            if(list_order[i]["order_id"]==list_delivery[j]["order_id"]){
                                list_order[i]["delivery_company"]=delivery_company;                        
                                list_order[i]["arrive_date"]=arrive_date;
                                list_order[i]["delivery_id"]=delivery_id;
                                list_order[i]["delivery_fee"]=delivery_fee;
                                list_order[i]["d_pay_status"]=d_pay_status;  
                               // break;                          
                            }
                        }
                    }
                   //  console.log(list_order);
                    var table = $('#tb_list_order_status').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 50,
                        data: list_order,                        
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],                        
                        lengthMenu: [
                            [ 50,100,200, -1],
                            [ 50,100,200, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },   
                        "columns": [{
                                "width": "50px",
                                "data": "name"
                            },
                            {
                                "width": "20px",
                                "data": "order_id"
                            },
                            {
                                "width": "50px",
                                "data": "phone"
                            },
                            {
                                "width": "50px",
                                "data": "address"
                            },
                            {
                                "width": "80px",
                                "data": "type"
                            },
                            {
                                "width": "80px",
                                "data": "shop_order_id"
                            }, {
                                "width": "50px",
                                "data": "total_order"
                            }, {
                                "width": "50px",
                                "data": "delivery_company"
                            }, {
                                "width": "50px",
                                "data": "delivery_id"
                            }, {
                                "width": "50px",
                                "data": "order_date"
                            }, {
                                "width": "50px",
                                "data": "arrive_date"
                            }, {
                                "width": "50px",
                                "data": "delivery_fee"
                            }, {
                                "width": "50px",
                                "data": "post_status"
                            }, {
                                "width": "50px",
                                "data": "d_pay_status"
                            }
                        ]
                    });                   
                },
                error:function(e){
                    console.log(e);
                }
            });

          /*  editor = new $.fn.dataTable.Editor({
                ajax: {
                    url: "assets/js/connect/server/call_sv.php",
                    type: "POST",
                    data: {
                        "delivery_company": delivery_company,
                        "s_date": fromdate,
                        "e_date": todate
                    }
                },
                table: "#tb_list_order_status",
                fields: [{
                        label: "Delivery Company:",
                        name: "`delivery_company`",
                        type: "select",
                        options: [{
                                label: "No Shipping",
                                value: "0"
                            },
                            {
                                label: "VIETTEL POST",
                                value: "1"
                            },
                            {
                                label: "VIETNAM POST(EMS)",
                                value: "2"
                            },
                            {
                                label: "TASETCO",
                                value: "3"
                            },
                            {
                                label: "Saigonship",
                                value: "4"
                            },
                            {
                                label: "Direct",
                                value: "5"
                            },
                            {
                                label: "GiaoHangNhanh",
                                value: "6"
                            },
                            {
                                label: "GiaoHangTietKiem",
                                value: "7"
                            },
                            {
                                label: "Ecotrans",
                                value: "8"
                            },
                            {
                                label: "TPT",
                                value: "9"
                            },
                            {
                                label: "Express",
                                value: "10"
                            },
                            {
                                label: "Another",
                                value: "11"
                            }
                        ]
                    },
                    {
                        label: "Delivery ID:",
                        name: "`delivery_id`"
                    },
                    {
                        label: "Arrive Date:",
                        name: "`arrive_date`",
                        type: "datetime"
                    },
                    {
                        label: "Delivery fee:",
                        name: "`delivery_fee`"
                    },
                    {
                        label: "Status Order:",
                        name: "`status`",
                        type: "select",
                        options: [{
                                label: "wc-pending",
                                value: "wc-pending"
                            },
                            {
                                label: "wc-processing",
                                value: "wc-processing"
                            },
                            {
                                label: "wc-on-hold",
                                value: "wc-on-hold"
                            },
                            {
                                label: "wc-completed",
                                value: "wc-completed"
                            },
                            {
                                label: "wc-cancelled",
                                value: "wc-cancelled"
                            }
                        ]
                    },
                    {
                        label: "Payment Check:",
                        name: "`delivery_status`",
                        type: "select",
                        options: [{
                                label: "Not Yet",
                                value: "0"
                            },
                            {
                                label: "Finished",
                                value: "1"
                            },
                            {
                                label: "Cancelled",
                                value: "2"
                            }

                        ]
                    }
                ]
            });*/

         /*   $('#tb_list_order_status').on('click', 'tbody td:not(:first-child)', function(e) {
                editor.inline(this, {
                    buttons: {
                        label: '&gt;',
                        fn: function() {
                            this.submit();
                        }
                    }
                });
            });

            $('#tb_list_order_status').DataTable({
                dom: "Bfrtip",
                pageLength: 50,
                ajax: {
                    url: "assets/js/connect/server/call_sv.php",
                    type: "POST",
                    data: {
                        "delivery_company": delivery_company,
                        "s_date": fromdate,
                        "e_date": todate
                    }
                },
                createdRow: function(row, data, dataIndex) {
                    $compile(row)($scope);
                },
                columns: [{
                        width: "30px",
                        data: null,
                        defaultContent: '',
                        className: 'select-checkbox',
                        orderable: false
                    },
                    {
                        width: "50px",
                        data: null,
                        render: function(data, type, row) {
                            // Combine the first and last names into a single table field
                            return data['`firstname`'] + ' ' + data['`lastname`'];
                        }
                    },
                    {
                        data: "`order_id`",
                        width: "50px"
                    },
                    {
                        data: "`phone`",
                        width: "50px"
                    },
                    {
                        data: "`address`",
                        width: "150px"
                    },
                    {
                        data: "`total_order`",
                        width: "50px",
                        render: $.fn.dataTable.render.number(',', '.', 0, '')
                    },
                    {
                        data: "`delivery_company`",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "No Shipping";
                            } else if (val == 1) {
                                html = "VIETTEL POST";
                            } else if (val == 2) {
                                html = "VIETNAM POST(EMS)";
                            } else if (val == 3) {
                                html = "TASETCO";
                            } else if (val == 4) {
                                html = "Saigonship";
                            } else if (val == 5) {
                                html = "Direct";
                            } else if (val == 6) {
                                html = "GiaoHangNhanh";
                            } else if (val == 7) {
                                html = "GiaoHangTietKiem";
                            } else if (val == 8) {
                                html = "Ecotrans";
                            } else if (val == 9) {
                                html = "TPT";
                            } else if (val == 10) {
                                html = "Express";
                            } else if (val == 11) {
                                html = "Another";
                            }
                            return html;
                        }
                    },
                    {
                        data: "`delivery_id`"
                    },
                    {
                        data: "`order_date`"
                    },
                    {
                        data: "`arrive_date`"
                    },
                    {
                        data: "`delivery_fee`"
                    },
                    {
                        data: "`status`"
                    },
                    {
                        data: "`delivery_status`",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "Not Yet";
                            } else if (val == 1) {
                                html = "Finished";
                            } else if (val == 2) {
                                html = "cancelled";
                            }
                            return html;
                        }
                    },
                    {
                        data: "`old_order_id`"
                    },

                ],
                order: [2, 'desc'],
                select: {
                    style: 'os',
                    selector: 'td:first-child'
                },
                buttons: [

                    {
                        extend: "edit",
                        editor: editor
                    },

                    {
                        extend: 'collection',
                        text: 'Export',
                        buttons: [
                            'copy',
                            'excel',
                            'csv',
                            'pdf',
                            'print'
                        ]
                    }
                ],
                "footerCallback": function(row, data, start, end, display) {
                    var api = this.api(),
                        data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function(i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                            i : 0;
                    };

                    // Total over all pages
                    total = api
                        .column(10)
                        .data()
                        .reduce(function(a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    total_order = api
                        .column(5)
                        .data()
                        .reduce(function(a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total over this page
                    total = total.toString();
                    total = total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    // Update footer
                    $("#txt_total_item_sale").empty();
                    $("#txt_total_item_sale").append(total + ' VND');
                    // $scope.txt_total_item_sale=total;
                    // alert(total);
                    total_order = total_order.toString();
                    total_order = total_order.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    // Update footer
                    $("#txt_total_order").empty();
                    $("#txt_total_order").append(total_order + ' VND');
                    // $scope.txt_total_order=total_order;
                }
            });*/
        }


    /*    function updata_delivery_data() {
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_insert_delivery",
                type: "POST",
                async: false,
                success: function(d) {
                    // console.log(d); 
                    //  var data=$.parseJSON(d);
                    // console.log(data);   
                },
                error: function(e) {
                    alert(e);
                }

            });

        }*/


        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdate").hide();
                var excelFile,
                    fileReader = new FileReader();

                $("#result").hide();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel = data;
                        // console.log(data_excel);
                        $("#btnUpdate").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }

            })
        });
        $("#btnUpdate").click(function() {
            if (data_excel.length > 0) {
                $("#btnUpdate").hide();
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_by_excel",
                    type: "POST",
                    data: {
                        "data": data_excel
                    },
                    success: function(d) {                      
                        $("#btnUpdate").show();
                        if (d == "true") {
                            $("#btnNotifyFinish").click();

                        } else {
                            alert(d);
                        }
                        var table = $('#tb_list_order_status').DataTable();
                        var buttons = [];

                        $.each(table.buttons()[0].inst.s.buttons,
                            function() {
                                buttons.push(this);
                            });
                        $.each(buttons,
                            function() {
                                table.buttons()[0].inst.remove(this.node);
                            });
                        table.destroy();
                        load_data($compile, $scope);
                    },
                    error: function(e) {

                    }
                });
                //  console.log(data_excel); 
            }

        });
        
        //----------------------------------------------------------------------------------------------------------------//
        
        $(function() {
            $("#inputShipping").on("change", function() {
                $("#btnUpdateShipping").hide();
                var excelFile,
                    fileReader = new FileReader();

                $("#result").hide();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel_shipping_fee = data;
                        // console.log(data_excel_shipping_fee);
                        $("#btnUpdateShipping").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }

            })
        });
        $("#btnUpdateShippingFee").click(function() {
            if (data_excel_shipping_fee.length > 0) {
                $("#btnUpdateShippingFee").hide();
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_by_excel_shipping_fee",
                    type: "POST",
                    data: {
                        "data": data_excel_shipping_fee
                    },
                    success: function(d) {
                        $("#btnUpdateShippingFee").show();
                        if (d == "true") {
                            $("#btnNotifyFinish").click();

                        } else {
                            alert(d);
                        }
                        var table = $('#tb_list_order_status').DataTable();
                        var buttons = [];

                        $.each(table.buttons()[0].inst.s.buttons,
                            function() {
                                buttons.push(this);
                            });
                        $.each(buttons,
                            function() {
                                table.buttons()[0].inst.remove(this.node);
                            });
                        table.destroy();
                        load_data($compile, $scope);
                    },
                    error: function(e) {

                    }
                });
                //  console.log(data_excel); 
            }

        });
        
      
      //----------------------------------------------------------------------------------------------------------------//
        
        $(function() {
            $("#inputComplete").on("change", function() {
                $("#btnUpdateComplete").hide();
                var excelFile,
                    fileReader = new FileReader();

                $("#result").hide();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel_complete = data;
                         console.log(data_excel_complete);
                        $("#btnUpdateComplete").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }

            })
        });
        $("#btnUpdateComplete").click(function() {
            if (data_excel_complete.length > 0) {
                $("#btnUpdateComplete").hide();
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_by_excel_complete",
                    type: "POST",
                    data: {
                        "data": data_excel_complete
                    },
                    success: function(d) {
                        $("#btnUpdateComplete").show();
                        if (d == "true") {
                            $("#btnNotifyFinish").click();

                        } else {
                            alert(d);
                        }
                        var table = $('#tb_list_order_status').DataTable();
                        var buttons = [];

                        $.each(table.buttons()[0].inst.s.buttons,
                            function() {
                                buttons.push(this);
                            });
                        $.each(buttons,
                            function() {
                                table.buttons()[0].inst.remove(this.node);
                            });
                        table.destroy();
                        load_data($compile, $scope);
                    },
                    error: function(e) {

                    }
                });
                //  console.log(data_excel); 
            }

        });
       //------------------------------------------------------------------------------------------------------------------------   

    }
]);
//======================== End Shipping Order ===================================

App.controller('OMGetDataVATCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
      //  limit_permisstion_menu("chkSMUpdateStock");
    }
]);
App.controller('OMCancelBSTCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
      checkCookie($scope);
        limit_permisstion_menu("chkSMCBS");
      $("#img_load").hide();
      $scope.loadData = function() {
            
      }

      function load_data() {
        
      }
      $("#btnCBS").click(function(){
        $("#img_load").show();
        $("#btnCBS").hide();
        var data_cancel=$("#txtListOrder").val();     
        var mg_name = getCookie("ck_name");         
        data_cancel = data_cancel.replace(/(\r\n|\n|\r)/gm, "");       
         $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_cancel_bs",
                type: "POST",
                data:{"list_order":data_cancel,"user_action":mg_name},
                success: function(d) {
                  //  console.log(d); return;                  
                 
                   d = d.replace(/(\r\n|\n|\r)/gm, "");
                //   console.log(d);
                    if(d=="true"){
                        alert("Update FN .");
                    }else{
                        alert(d);
                    }
                     $("#btnCBS").show();
                     $("#img_load").hide();
                    
                },
                error: function(d) {
                }
         })
                
      })
      
    }
]);

//====================== End Order Management =============================================================================

//====================== Stock Management =================================================================================

//============================ Stock Update =====================================

App.controller('SMUpdateCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSMUpdateStock");          
        $("#imgloadchange").hide();
        $("#imgloadsave").hide();
        $("#imgloadborrow").hide();

        $("#divDetail").hide();
        $("#detail_history").hide();
        $("#btnNotifyFinish").hide();
        $scope.loadData = function() {
            load_data();
        }

        function load_data() {
            $("#img_load_sky007").show();
            $("#img_load_total").show();
            $("#img_load_bbiavn").show();
            var table_sky007 = $('#tb_list_item_sky007').DataTable();
            table_sky007.clear();
            table_sky007.destroy();
            var table_total = $('#tb_list_item_total').DataTable();
            table_total.clear();
            table_total.destroy();
            var table_bbiavn = $('#tb_list_item_bbiavn').DataTable();
            table_bbiavn.clear();
            table_bbiavn.destroy();
            var table_mixsoon = $('#tb_list_item_mixsoon').DataTable();
            table_mixsoon.clear();
            table_mixsoon.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock",
                type: "POST",
                data:{"warehouse":"0"},
                success: function(d) {
                    // console.log(d);
                    var data = $.parseJSON(d);
                    var data_sky007 = data["list_item_sky007"];
                    var data_total = data["list_item_main"];
                    var data_bbiavn = data["list_item_bbiavn"];
                    var data_mixsoon = data["list_item_mixsoon"];
                   //  console.log(data_total);return;
                    var table_total = $('#tb_list_item_total').DataTable({
                        "order": [
                            [3, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 5,
                        data: data_total,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var name = full[2].replace(/"/g, " ");
                                    var stock_total = full[3]; 
                                    var html = '<button class="btn btn-info" ng-click="update_item(' + id + ',\'' + name + '\',\'' + stock_total + '\')">Update</button>';
                                    return html;
                                }
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var name = full[2].replace(/"/g, " ");
                                    var html = '<button class="btn btn-warning" ng-click="history_comming(' + id + ',\'' + name + '\')">History</button>';
                                    return html;
                                }
                            }
                        ]
                    });



                    var table_sky007 = $('#tb_list_item_sky007').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 5,
                        data: data_sky007,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var stock_status = full[6];
                                    var html = "";
                                    if (stock_status == "instock") {
                                        html = '<button class="btn btn-primary" ng-click="even_item_status_bbiavn_sky007(' + id + ',\'' + stock_status + '\',3)">Instock</button>';
                                    } else if (stock_status == "outofstock") {
                                        html = '<button class="btn btn-danger" ng-click="even_item_status_bbiavn_sky007(' + id + ',\'' + stock_status + '\',3)">Outofstock</button>';
                                    }
                                    return html;
                                }
                                
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var status_item = full[7];
                                    var html = "";
                                    if (status_item == "private") {
                                        html = '<button class="btn btn-primary" ng-click="even_item_status_bbiavn_sky007(' + id + ',\'' + status_item + '\',4)">Private</button>';
                                    } else if (status_item == "publish") {
                                        html = '<button class="btn btn-danger" ng-click="even_item_status_bbiavn_sky007(' + id + ',\'' + status_item + '\',4)">Publish</button>';
                                    }
                                    return html;
                                }
                            }
                        ]
                    });
                    
                    var table_bbiavn = $('#tb_list_item_bbiavn').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 5,
                        data: data_bbiavn,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var stock_status = full[6];
                                    var html = "";
                                    if (stock_status == "instock") {
                                        html = '<button class="btn btn-primary" ng-click="even_item_status_bbiavn_sky007(' + id + ',\'' + stock_status + '\',0)">Instock</button>';
                                    } else if (stock_status == "outofstock") {
                                        html = '<button class="btn btn-danger" ng-click="even_item_status_bbiavn_sky007(' + id + ',\'' + stock_status + '\',0)">Outofstock</button>';
                                    }
                                    return html;
                                }
                                
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var status_item = full[7];
                                    var html = "";
                                    if (status_item == "private") {
                                        html = '<button class="btn btn-primary" ng-click="even_item_status_bbiavn_sky007(' + id + ',\'' + status_item + '\',1)">Private</button>';
                                    } else if (status_item == "publish") {
                                        html = '<button class="btn btn-danger" ng-click="even_item_status_bbiavn_sky007(' + id + ',\'' + status_item + '\',1)">Publish</button>';
                                    }
                                    return html;
                                }
                            }
                        ]
                    });
                    var table_mixsoon = $('#tb_list_item_mixsoon').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 5,
                        data: data_mixsoon,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var stock_status = full[6];
                                    var html = "";
                                    if (stock_status == "instock") {
                                        html = '<button class="btn btn-primary" ng-click="even_item_status_mixsoon(' + id + ',\'' + stock_status + '\',0)">Instock</button>';
                                    } else if (stock_status == "outofstock") {
                                        html = '<button class="btn btn-danger" ng-click="even_item_status_mixsoon(' + id + ',\'' + stock_status + '\',0)">Outofstock</button>';
                                    }
                                    return html;
                                }
                                
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var status_item = full[7];
                                    var html = "";
                                    if (status_item == "private") {
                                        html = '<button class="btn btn-primary" ng-click="even_item_status_mixsoon(' + id + ',\'' + status_item + '\',1)">Private</button>';
                                    } else if (status_item == "publish") {
                                        html = '<button class="btn btn-danger" ng-click="even_item_status_mixsoon(' + id + ',\'' + status_item + '\',1)">Publish</button>';
                                    }
                                    return html;
                                }
                            }
                        ]
                    });
                    $("#img_load_bbiavn").hide();
                    $("#img_load_total").hide();
                    $("#img_load_sky007").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })

        }
        $scope.even_item_status = function(id, item_status) {
            if (confirm('Are you sure you want to change item status ?')) {
                var item_status_change = "";
                if (item_status == "private") {
                    item_status_change = "publish";
                } else if (item_status == "publish") {
                    item_status_change = "private";
                }
                var obj = {
                    "id": id,
                    "item_status": item_status_change
                }
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_item_status",
                    type: "POST",
                    data: {
                        "obj": obj
                    },
                    success: function(d) {
                        load_data();
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            }
        }
        $scope.even_item_status_bbiavn_sky007 = function(id, item_status,flat) { //flat : 0 is check stock status (instock,outofstock) . 1 : status of item(publish or private)
            if (confirm('Are you sure you want to change item status ?')) {
                var item_status_change = "";
                if (item_status == "private") {
                    item_status_change = "publish";
                } else if (item_status == "publish") {
                    item_status_change = "private";
                } else if(item_status == "instock") {
                    item_status_change = "outofstock";
                }else if(item_status == "outofstock") {
                    item_status_change = "instock";
                }
                var obj  = {
                    "id": id,
                    "item_status": item_status_change,
                    "flat":flat
                }
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_item_status_bbiavn_sky007",
                    type: "POST",
                    data: {
                        "obj": obj
                    },
                    success: function(d) {
                      //  console.log(d);
                        load_data();
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });
            }
        }
         
         
        $scope.update_item = function(id, name, stock_total) {
            $("#divDetail").show();
            $("#detail_history").hide();
            $("#txtNote").focus();
            $("#txtItemName").val(name);
            $("#txtItemID").val(id);           
            $("#txtStockTotal").val(stock_total);           

        }        
      
        $("#btnChange").click(function() {
            var note = $("#txtNote").val();
            var stock_total = $("#txtStockTotal").val(); 
            var item_id = $("#txtItemID").val();
            var manager_name = getCookie("ck_name");           
            var obj = {
                "item_id": item_id,              
                "note": note,
                "stock_total": stock_total,
                "manager_name": manager_name
            };
            if (note == "") {
                $("#txtNote").focus();
                alert("Please write down a reason !");
                return;
            }
            $("#btnChange").hide();
            $("#imgloadchange").show();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_save_stock",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    //  console.log(d);
                    $("#btnNotifyFinish").click();
                    $("#imgloadchange").hide();
                    $("#btnChange").show();
                    load_data();
                    $("#divDetail").hide();                                 
                    $("#txtNote").val("");
                },
                error: function(e) {
                    alert(e);
                }
            });
        })
        
        $("#btnSave").click(function() {
            var r = confirm("Are you sure that is correct quantity ");
            if (r == true) {
                $("#btnSave").hide();
                $("#imgloadsave").show();
                var item_id = $("#txtItemID").val();
                var incoming_qty = $("#txtIncoming").val();
                var expiration = $("#txtEDate").val();
                var lot_number = $("#txtLotN").val();              
                var manager_name= getCookie("ck_name");
                var obj = {
                    "item_id": item_id,
                    "incoming_qty": incoming_qty,
                    "expiration": expiration,
                    "lot_number": lot_number,
                    "manager_name":manager_name
                   
                }
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_save_stock_incoming",
                    type: "POST",
                    data: {
                        "obj": obj
                    },
                    success: function(d) {
                        //console.log(d);return;
                        $("#btnNotifyFinish").click();
                        $("#btnSave").show();
                        $("#imgloadsave").hide();
                        load_data();
                        $("#divDetail").hide();
                        $("#txtIncoming").val(0);
                        $("#txtLotN").val("");                        
                    },
                    error: function(e) {
                        alert(e);
                    }
                });
            }
        })
        $scope.history_comming = function(id, name) {
            $("#txt_h_pro_name").val(name);
            $("#divDetail").hide();
            $("#detail_history").show();
            $("#txt_h_pro_name").focus();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_get_history_comming",
                type: "POST",
                data: {
                    "item_id": id,
                    "warehouse":"0"
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                    //  console.log(data);return;
                    var data_history_updae = data['history_update'];
                    var data_update_incoming = data['history_incoming'];
                    var table_history_update = $('#tb_list_history_update').DataTable();
                    table_history_update.destroy();

                    var table_history_update = $('#tb_list_history_update').DataTable({
                        "order": [
                            [4, "desc"]
                        ],
                        pageLength: 5,
                        data: data_history_updae,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "30px"
                            }, {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            }, {
                                "width": "50px"
                            }, {
                                "width": "50px"
                            }

                        ]
                    });
                    var table_history_inoming = $('#tb_list_history_inoming').DataTable();
                    table_history_inoming.destroy();

                    var table_history_inoming = $('#tb_list_history_inoming').DataTable({
                        "order": [
                            [1, "desc"]
                        ],
                        pageLength: 5,
                        data: data_update_incoming,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "30px"
                            }, {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            }, {
                                "width": "50px"
                            }, {
                                "width": "50px"
                            }
                        ]
                    });
                },
                error: function(e) {
                    alert(e);
                }
            });
        }
    }
]);
//======================== End Stock Update =====================================

//============================ Stock Update HN =====================================

App.controller('SMUpdateHNCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSMUpdateStockHN");
        var flat_qty_stock_total = "no";      
        $("#imgloadchange").hide();
        $("#imgloadsave").hide();
        $("#imgloadborrow").hide();

        $("#divDetail").hide();
        $("#detail_history").hide();
        $("#btnNotifyFinish").hide();
        $scope.loadData = function() {
            load_data();
        }

        function load_data() {
            $("#img_load").show();
            $("#img_load_regular").show();
            var table = $('#tb_list_item').DataTable();
            table.clear();
            table.destroy();
            var table_regular = $('#tb_list_item_regular').DataTable();
            table_regular.clear();
            table_regular.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock",
                type: "POST",
                data:{"warehouse":"1"},
                success: function(d) {
                  //  console.log(d);
                    var data = $.parseJSON(d);
                    var data_main = data["list_item_main"];                  
                    // console.log(data_regular);return;
                    var table = $('#tb_list_item').DataTable({
                        "order": [
                            [3, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 5,
                        data: data_main,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px"                          
                            },
                            {
                                "width": "50px"                               
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            }, 
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var name = full[2].replace(/"/g, " ");
                                    var stock_total = full[3]; 
                                    var html = '<button class="btn btn-info" ng-click="update_item(' + id + ',\'' + name + '\',\'' + stock_total + '\')">Update</button>';
                                    return html;
                                }
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var name = full[2].replace(/"/g, " ");
                                    var html = '<button class="btn btn-warning" ng-click="history_comming(' + id + ',\'' + name + '\')">History</button>';
                                    return html;
                                }
                            }  
                        ]
                    });
                  
                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })

        }
       
        $scope.update_item = function(id, name, stock_total) {
            $("#divDetail").show();
            $("#detail_history").hide();
            $("#txtNote").focus();
            $("#txtItemName").val(name);
            $("#txtItemID").val(id);
            $("#txtStockTotal").val(stock_total);          
        }       
       
        $("#btnChange").click(function() {
            var note = $("#txtNote").val();
            var stock_total = $("#txtStockTotal").val();
            var stock = $("#txtStock").val();
            var status = $("#cboStatus").val();
            var item_id = $("#txtItemID").val();
            var manager_name = getCookie("ck_name");          
            var obj = {
                "item_id": item_id,
                "status": status,
                "note": note,
                "stock_total": stock_total,
                "stock": stock,   
                "manager_name": manager_name
            };
            if (note == "") {
                $("#txtNote").focus();
                alert("Please write down reason !");
                return;
            }
            $("#btnChange").hide();
            $("#imgloadchange").show();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_save_stock_hn",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    //  console.log(d);
                    $("#btnNotifyFinish").click();
                    $("#imgloadchange").hide();
                    $("#btnChange").show();
                    load_data();
                    $("#divDetail").hide(); 
                    $("#txtNote").val("");
                },
                error: function(e) {
                    alert(e);
                }
            });
        })
       
        $("#btnSave").click(function() {
            var r = confirm("Are you sure that is correct quantity ");
            if (r == true) {
                $("#btnSave").hide();
                $("#imgloadsave").show();
                var item_id = $("#txtItemID").val();
                var incoming_qty = $("#txtIncoming").val();
                var expiration = $("#txtEDate").val();
                var lot_number = $("#txtLotN").val();
                var manager_name= getCookie("ck_name");
               
                var obj = {
                    "item_id": item_id,
                    "incoming_qty": incoming_qty,
                    "expiration": expiration,
                    "lot_number": lot_number,
                    "manager_name": manager_name
                  
                }
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_save_stock_incoming_hn",
                    type: "POST",
                    data: {
                        "obj": obj
                    },
                    success: function(d) {
                        //console.log(d);return;
                        $("#btnNotifyFinish").click();
                        $("#btnSave").show();
                        $("#imgloadsave").hide();
                        load_data();
                        $("#divDetail").hide();
                        $("#txtIncoming").val(0);
                        $("#txtLotN").val("");                  
                    },
                    error: function(e) {
                        alert(e);
                    }
                });
            }
        })
        $scope.history_comming = function(id, name) {
            $("#txt_h_pro_name").val(name);
            $("#divDetail").hide();
            $("#detail_history").show();
            $("#txt_h_pro_name").focus();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_get_history_comming",
                type: "POST",
                data: {
                    "item_id": id,
                    "warehouse":"1"
                },
                success: function(d) {
                    var data = $.parseJSON(d);
                    //  console.log(data);return;
                    var data_history_updae = data['history_update'];
                    var data_update_incoming = data['history_incoming'];
                    var table_history_update = $('#tb_list_history_update').DataTable();
                    table_history_update.destroy();

                    var table_history_update = $('#tb_list_history_update').DataTable({
                        "order": [
                            [4, "desc"]
                        ],
                        pageLength: 5,
                        data: data_history_updae,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "30px"
                            }, {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            }, {
                                "width": "50px"
                            }, {
                                "width": "50px"
                            }

                        ]
                    });
                    var table_history_inoming = $('#tb_list_history_inoming').DataTable();
                    table_history_inoming.destroy();

                    var table_history_inoming = $('#tb_list_history_inoming').DataTable({
                        "order": [
                            [1, "desc"]
                        ],
                        pageLength: 5,
                        data: data_update_incoming,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {},
                        "columns": [{
                                "width": "30px"
                            }, {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            }, {
                                "width": "50px"
                            }, {
                                "width": "50px"
                            }
                        ]
                    });
                },
                error: function(e) {
                    alert(e);
                }
            });
        }
    }
]);
//======================== End Stock Update HN =====================================

//============================ Stock Share ======================================

App.controller('SMShareCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSMShareStock");
        var today = moment().format('YYYY_MM_DD_hh_mm_ss');
        // console.log(today);
      //  update_new_item();
        $scope.loadData = function() {
            load_data($compile, $scope);
        }
        $scope.data_fillter = function() {
            var table = $('#tb_list_item').DataTable();
            var buttons = [];

            $.each(table.buttons()[0].inst.s.buttons,
                function() {
                    buttons.push(this);
                });
            $.each(buttons,
                function() {
                    table.buttons()[0].inst.remove(this.node);
                });
            table.destroy();
            load_data($compile, $scope);
        }

        function update_new_item() {
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_share_stock_update_new_item",
                type: "GET",
                success: function(d) {

                },
                error: function(e) {
                    console.log(e);
                }
            });

        }

      /*  $("#cboWarehouse").change(function() {
            var table = $('#tb_list_item').DataTable();
            var buttons = [];

            $.each(table.buttons()[0].inst.s.buttons,
                function() {
                    buttons.push(this);
                });
            $.each(buttons,
                function() {
                    table.buttons()[0].inst.remove(this.node);
                });
            table.destroy();
            load_data($compile, $scope);
        })*/

        function load_data($compile, $scope) {

            var mg_name = getCookie("ck_name");
            var warehouse = "0";
            var brand_name = $("#cboBrandName").val();
            var category = $("#cboCategory").val();
            var product_type = $("#cboProductType").val();
            var obj = {
                "warehouse": "0",
                "brand": brand_name,
                "category": category,
                "product_type": product_type,
                "mg_name": mg_name
            };

             /*  $.ajax({
                    url: "assets/js/connect/server/sv_share_stock.php",
                    type: "POST",
                    data:{"obj_data":obj}   ,         
                    success: function(d) {
                        console.log(d);
                    //    return;
                    },
                    error : function(e){
                        console.log(e);
                    }
                 });      */
                 
            if (warehouse == "0") {
                $("#tb_list_item").empty();

                var html = '<thead>\
                  <tr style=" background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs"></th> \
                       <th class="hidden-xs">item_id</th>\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Total Stock</th>\
                       <th class="hidden-xs">counting Stock</th>\
                       <th class="hidden-xs">Stock Sky007vn</th>\
                       <th class="hidden-xs">stock_website</th>\
                       <th class="hidden-xs">Price Sky007vn</th>\
                       <th class="hidden-xs">Stock Bbiavn</th>\
                       <th class="hidden-xs">stock_bbiavn</th> \
                       <th class="hidden-xs">Price Bbiavn</th>   \
                       <th class="hidden-xs">Stock Shopee</th>\
                       <th class="hidden-xs">stock_shopee</th>\
                       <th class="hidden-xs">Price Shopee</th>\
                       <th class="hidden-xs">Stock Lazada</th>\
                       <th class="hidden-xs">stock_lazada</th> \
                       <th class="hidden-xs">Price Lazada</th>   \
                       <th class="hidden-xs">Stock Tiki</th>\
                       <th class="hidden-xs">stock_tiki</th> \
                       <th class="hidden-xs">Price Tiki</th>   \
                       <th class="hidden-xs">Stock Tiktok</th>   \
                       <th class="hidden-xs">stock_tiktok</th> \
                       <th class="hidden-xs">Price Tiktok</th>  \
                       <th class="hidden-xs">Stock WH</th>   \
                       <th class="hidden-xs">stock_wholesaler</th> \
                       <th class="hidden-xs">Price WH</th>  \
                       <th class="hidden-xs">warehouse</th>   \
                  </tr>\
               </thead>';
                $("#tb_list_item").append(html);

                editor = new $.fn.dataTable.Editor({
                    ajax: {
                        url: "assets/js/connect/server/sv_share_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    table: "#tb_list_item",
                    fields: [

                        {
                            label: "Price Website:",
                            name: "price_web"
                        },
                        {
                            label: "Stock Sky007:",
                            name: "stock_web",

                        },
                        {
                            label: "Stock Bbiavn:",
                            name: "stock_bbiavn"
                        },
                        {
                            label: "Price Bbiavn:",
                            name: "price_bbiavn"
                        },
                        {
                            label: "Stock Shopee:",
                            name: "stock_shopee"
                        },
                        {
                            label: "Price Shopee:",
                            name: "price_shopee"
                        },
                        {
                            label: "Stock Lazada:",
                            name: "stock_lazada"
                        },
                        {
                            label: "Price Lazada:",
                            name: "price_lazada"
                        },
                        {
                            label: "Stock Tiki:",
                            name: "stock_tiki"
                        },
                        {
                            label: "Price Tiki:",
                            name: "price_tiki"
                        },
                        {
                            label: "Stock Tiktok:",
                            name: "stock_tiktok"
                        },
                        {
                            label: "Price Tiktok:",
                            name: "price_tiktok"
                        },
                        {
                            label: "Stock Wholesaler:",
                            name: "stock_wholesaler"
                        },
                        {
                            label: "Price Wholesaler:",
                            name: "price_wholesaler"
                        }
                    ]
                });
                $('#tb_list_item').on('click', 'tbody td:not(:first-child)', function(e) {
                    editor.inline(this, {
                        buttons: {
                            label: '&gt;',
                            fn: function() {
                                this.submit();                              
                            }
                        }
                    });
                });

                $('#tb_list_item').DataTable({
                    dom: "Bfrtip",
                    pageLength: 50,
                    ajax: {
                        url: "assets/js/connect/server/sv_share_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        $compile(row)($scope);
                    },
                    columns: [{
                            width: "30px",
                            data: null,
                            defaultContent: '',
                            className: 'select-checkbox',
                            orderable: false
                        },
                        {
                            width: "50px",
                            data: "product_id"

                        },
                        {
                            width: "50px",
                            data: "product_name"

                        },
                        {
                            width: "50px",
                            data: "sku"

                        }, {
                            width: "50px",
                            data: "stock_total"

                        },
                        {
                            width: "50px",
                            data: null,
                            render: function(data, type, row) {
                                var total = parseInt(data['stock_web']) + parseInt(data['stock_shopee']) + parseInt(data['stock_lazada']) + parseInt(data['stock_tiki'])  + parseInt(data['stock_bbiavn'])+ parseInt(data['stock_tiktok'])+ parseInt(data['stock_wholesaler']);
                                return total;
                            }

                        },
                        {
                            data: "stock_web",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_web",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_bbiavn",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_bbiavn",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_shopee",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_shopee",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_lazada",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_lazada",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_tiki",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_tiki",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_tiktok",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_tiktok",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_wholesaler",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_wholesaler",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "tphcm";
                            },
                            "visible": false
                        }

                    ],
                    order: [4, 'asc'],
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
                    },

                    buttons: [


                        {
                            extend: 'collection',
                            text: 'Export',
                            buttons: [
                                'copy',
                                {
                                    extend: 'excel',
                                    exportOptions: {
                                       columns: [1, 2, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18 ,19,21,22,24]
                                    },
                                    title: 'share_stock_TPHCM' + today


                                },
                                {
                                    extend: 'csv',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18,19,21,22,24]
                                    },
                                    title: 'share_stock_TPHCM' + today,
                                },
                                'pdf',
                                'print'
                            ]


                        }

                    ],
                    "createdRow": function(row, data, dataIndex) {
                        var sku = data['sku'];
                        var lastchar = sku.substr(sku.length - 2);
                        if (lastchar == '-R') {
                            $(row).css('background-color', 'rgb(205, 224, 247)');
                        }
                    }
                });

                /*     var table = $('#tb_list_item').DataTable();
                     $('#tb_list_item tbody').on( 'click', 'tr', function () {
                          console.log( table.row( this ).data() );
                      } ); */
            } 


        }

        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateShareStock").hide();
                var excelFile,
                    fileReader = new FileReader();

                $("#result").hide();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel = data;
                        //console.log(data_excel);
                        $("#btnUpdateShareStock").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }

            })
        });
        
        $("#btnUpdateShareStock").click(function() {
            $("#btnUpdateShareStock").hide();
            var warehouse = "0";
            var mg_name = getCookie("ck_name");
         //   console.log(data_excel); return;
            if (data_excel.length > 0) {
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_share_stock_by_excel",
                    type: "POST",
                    data: {
                        "warehouse": warehouse,
                        "name_management":mg_name,
                        "data": data_excel                    
                    },
                    success: function(d) {
                         console.log(d);return;
                        $("#btnUpdateShareStock").show();
                        // console.log(d);
                        if (d == "") {
                            //$("#btnNotifyFinish").click();
                            alert("update Succeeded !");

                        } else {
                            alert(d);
                        }
                        var table = $('#tb_list_item').DataTable();
                        table.destroy();
                        load_data($compile, $scope)
                       
                    },
                    error: function(e) {

                    }
                });
                //  console.log(data_excel); 
            }

        });
    }
]);
//======================== End Stock Share ======================================
//============================ Stock Share HN ======================================

App.controller('SMShareHNCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSMShareStockHN");
        var today = moment().format('YYYY_MM_DD_hh_mm_ss');
        // console.log(today);
      //  update_new_item();
        $scope.loadData = function() {
            load_data($compile, $scope);
        }
        $scope.data_fillter = function() {
            var table = $('#tb_list_item_hn').DataTable();
            var buttons = [];

            $.each(table.buttons()[0].inst.s.buttons,
                function() {
                    buttons.push(this);
                });
            $.each(buttons,
                function() {
                    table.buttons()[0].inst.remove(this.node);
                });
            table.destroy();
            load_data($compile, $scope);
        }

        function update_new_item() {
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_share_stock_update_new_item",
                type: "GET",
                success: function(d) {
                
                },
                error: function(e) {
                    console.log(e);
                }
            });

        }

      /*  $("#cboWarehouse").change(function() {
            var table = $('#tb_list_item').DataTable();
            var buttons = [];

            $.each(table.buttons()[0].inst.s.buttons,
                function() {
                    buttons.push(this);
                });
            $.each(buttons,
                function() {
                    table.buttons()[0].inst.remove(this.node);
                });
            table.destroy();
            load_data($compile, $scope);
        })*/
        function testtt(obj){
            $.ajax({
                     url: "assets/js/connect/server/sv_share_stock.php",
                            type: "POST",
                            data: {
                                "obj_data": obj
                            },
                    success: function(d) {
                        console.log(d);
                    },
                    error: function(e) {
                        console.log(e);
                    }
                }); 
        }
        function load_data($compile, $scope) {
          
            var mg_name = getCookie("ck_name");
            var warehouse = "1";
            var brand_name = $("#cboBrandName").val();
            var category = $("#cboCategory").val();
            var product_type = $("#cboProductType").val();
            var obj = {
                "warehouse": "1",
                "brand": brand_name,
                "category": category,
                "product_type": product_type,
                "mg_name": mg_name
            };          
            //  testtt(obj); return ;
                $("#tb_list_item_hn").empty();

                var html = '<thead>\
                  <tr style=" background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs"></th> \
                       <th class="hidden-xs">item_id</th>\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Total Stock</th>\
                       <th class="hidden-xs">counting Stock</th>\
                       <th class="hidden-xs">Stock Eglips</th>\
                       <th class="hidden-xs">stock_eglips_website</th> \
                       <th class="hidden-xs">Price Eglips</th>  \
                       <th class="hidden-xs">Stock Shopee Eglips</th>  \
                       <th class="hidden-xs">stock_shopee_eglips</th> \
                       <th class="hidden-xs">Price Shopee Eglips</th>  \
                       <th class="hidden-xs">Stock Lazada Eglips</th>  \
                       <th class="hidden-xs">stock_lazada_eglips</th> \
                       <th class="hidden-xs">Price Lazada Eglips</th>  \
                       <th class="hidden-xs">Stock Tiki Eglips</th>  \
                       <th class="hidden-xs">stock_tiki_eglips</th> \
                       <th class="hidden-xs">Price Tiki Eglips</th>  \
                       <th class="hidden-xs">warehouse</th>  \
                  </tr>\
               </thead>';              
                $("#tb_list_item_hn").append(html);                
                editor = new $.fn.dataTable.Editor({
                    ajax: {
                        url: "assets/js/connect/server/sv_share_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    table: "#tb_list_item_hn",
                    fields: [


                       
                        {
                            label: "Price Eglips:",
                            name: "price_eglips"
                        },
                        {
                            label: "Stock Eglips:",
                            name: "stock_eglips"
                        },
                        {
                            label: "Price Shopee Eglips:",
                            name: "price_shopee_eglips"
                        },
                        {
                            label: "Stock Shopee Eglips:",
                            name: "stock_shopee_eglips"
                        },
                        {
                            label: "Price Lazada Eglips:",
                            name: "price_lazada_eglips"
                        },
                        {
                            label: "Stock Lazada Eglips:",
                            name: "stock_lazada_eglips"
                        },
                        {
                            label: "Price Tiki Eglips:",
                            name: "price_tiki_eglips"
                        },
                        {
                            label: "Stock Tiki Eglips:",
                            name: "stock_tiki_eglips"
                        }

                    ]
                });
                $('#tb_list_item_hn').on('click', 'tbody td:not(:first-child)', function(e) {
                    editor.inline(this, {
                        buttons: {
                            label: '&gt;',
                            fn: function() {
                                this.submit();
                            }
                        }
                    });
                });

                $('#tb_list_item_hn').DataTable({
                    dom: "Bfrtip",
                    pageLength: 50,
                    ajax: {
                        url: "assets/js/connect/server/sv_share_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        $compile(row)($scope);
                    },
                    columns: [{
                            width: "30px",
                            data: null,
                            defaultContent: '',
                            className: 'select-checkbox',
                            orderable: false
                        },
                        {
                            width: "50px",
                            data: "product_id"

                        },
                        {
                            width: "50px",
                            data: "product_name"

                        },
                        {
                            width: "50px",
                            data: "sku"

                        }, {
                            width: "50px",
                            data: "stock_total"

                        },
                        {
                            width: "50px",
                            data: null,
                            render: function(data, type, row) {
                                var total =  parseInt(data['stock_eglips']) + parseInt(data['stock_shopee_eglips'])+ parseInt(data['stock_lazada_eglips']) + parseInt(data['stock_tiki_eglips']);
                                return total;
                            }

                        },
                        {
                            data: "stock_eglips",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_eglips",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_shopee_eglips",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_shopee_eglips",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_lazada_eglips",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_lazada_eglips",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_tiki_eglips",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_tiki_eglips",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },                    
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "hanoi";
                            },
                            "visible": false
                        }

                    ],
                    order: [4, 'desc'],
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
                    },
                    buttons: [

                        {
                            extend: 'collection',
                            text: 'Export',
                            buttons: [
                                'copy',
                                {
                                    extend: 'excel',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 6, 7, 9, 10, 12,13,15]
                                    },
                                    title: 'share_stock_HaNoi' + today


                                },
                                {
                                    extend: 'csv',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 6, 7, 9, 10, 12,13,15]
                                    },
                                    title: 'share_stock_HaNoi' + today,
                                },
                                'pdf',
                                'print'
                            ]


                        }

                    ],
                    "createdRow": function(row, data, dataIndex) {
                        var sku = data['sku'];
                        var lastchar = sku.substr(sku.length - 2);
                        if (lastchar == '-R') {
                            $(row).css('background-color', 'rgb(205, 224, 247)');
                        }
                    }
                });

        }

        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateShareStock").hide();
                var excelFile,
                    fileReader = new FileReader();

                $("#result").hide();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel = data;
                        //console.log(data_excel);
                        $("#btnUpdateShareStock").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }

            })
        });
        var mg_name = getCookie("ck_name");
        $("#btnUpdateShareStock").click(function() {
            $("#btnUpdateShareStock").hide();
            var warehouse = "1";
            if (data_excel.length > 0) {
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_share_stock_by_excel",
                    type: "POST",
                    data: {
                        "warehouse": warehouse,
                        "data": data_excel,
                        "mg_name": mg_name
                    },
                    success: function(d) {
                        $("#btnUpdateShareStock").show();
                        // console.log(d);
                        if (d == "true") {
                            //$("#btnNotifyFinish").click();
                            alert("update Succeeded !");

                        } else {
                            alert(d);
                        }
                        var table = $('#tb_list_item_hn').DataTable();
                        table.destroy();
                        load_data($compile, $scope)
                    },
                    error: function(e) {

                    }
                });
                //  console.log(data_excel); 
            }

        });
    }
]);
//======================== End Stock Share HN ======================================




//============================ Stock borrow ======================================

/*App.controller('SMSBorrowStockCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSBorrow");
       set_date_time($scope, '7');            
       
        var today = moment().format('YYYY_MM_DD_hh_mm_ss');
        // console.log(today);
      //  update_new_item();
       $flat_acction="edit";
       $("#btnEditStock").click(function (){
            $flat_acction="edit";
            var table = $('#tb_list_item_borrow').DataTable();
            var buttons = [];

            $.each(table.buttons()[0].inst.s.buttons,
                function() {
                    buttons.push(this);
                });
            $.each(buttons,
                function() {
                    table.buttons()[0].inst.remove(this.node);
                });
            table.destroy();
            load_data($compile, $scope);
            $("#div_give_stock").hide();
             $("#div_history").hide();
            $("#div_edit_stock").show();
            $("#btnEditStock").addClass("btn-primary");
            $("#btnGiveStock").removeClass("btn-primary");
            $("#btnHistory").removeClass("btn-primary");
        })
        $("#btnGiveStock").click(function (){
            $flat_acction="give";
            $("#div_edit_stock").hide();
            $("#div_history").hide();
            $("#div_give_stock").show();
             $("#btnEditStock").removeClass("btn-primary");
            $("#btnGiveStock").addClass("btn-primary");
            $("#btnHistory").removeClass("btn-primary");
            get_list_product($scope);
            
        })
        $("#div_give_stock").hide();
        $("#div_history").hide();
        $scope.loadData = function() {            
            load_data($compile, $scope);
        }
        $scope.data_fillter = function() {
            
            if($flat_acction=="edit"){
                var table = $('#tb_list_item_borrow').DataTable();
                var buttons = [];
    
                $.each(table.buttons()[0].inst.s.buttons,
                    function() {
                        buttons.push(this);
                    });
                $.each(buttons,
                    function() {
                        table.buttons()[0].inst.remove(this.node);
                    });
                table.destroy();
                load_data($compile, $scope);
            }else if($flat_acction=="give"){
                get_list_product($scope);
            }else if ($flat_acction=="history"){
                load_history()
            }
        }
        $("#cboWarehouse").change(function(){
            if($flat_acction=="edit"){
                var table = $('#tb_list_item_borrow').DataTable();
                var buttons = [];
    
                $.each(table.buttons()[0].inst.s.buttons,
                    function() {
                        buttons.push(this);
                    });
                $.each(buttons,
                    function() {
                        table.buttons()[0].inst.remove(this.node);
                    });
                table.destroy();
                load_data($compile, $scope);
            }else if($flat_acction=="give"){
                get_list_product($scope);
            }
            
        });
        
       
      
       
        function load_data($compile, $scope) {
            
          
            var mg_name = getCookie("ck_name");
            var warehouse = $("#cboWarehouse").val();
            var brand_name = $("#cboBrandName").val();
            var category = $("#cboCategory").val();
            var product_type = $("#cboProductType").val();
            var obj = {
                "warehouse": warehouse,
                "brand": brand_name,
                "category": category,
                "product_type": product_type,
                "mg_name": mg_name
            };  
                $("#tb_list_item_borrow").empty();

                var html = "";     
               if(warehouse=="0"){
                html = '<thead>\
                  <tr style=" background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs"></th> \
                       <th class="hidden-xs">item_id</th>\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Stock Eglips</th>\
                       <th class="hidden-xs">stock_eglips</th> \
                       <th class="hidden-xs">Price Eglips</th>  \
                       <th class="hidden-xs">Stock Watsons</th>\
                       <th class="hidden-xs">stock_watson</th> \
                       <th class="hidden-xs">Price Watsons</th>  \
                       <th class="hidden-xs">Stock Sendo</th>\
                       <th class="hidden-xs">stock_sendo</th> \
                       <th class="hidden-xs">Price Sendo</th>  \
                       <th class="hidden-xs">warehouse</th>  \
                  </tr>\
               </thead>'; 
               $("#tb_list_item_borrow").append(html);                
                editor = new $.fn.dataTable.Editor({
                    ajax: {
                        url: "assets/js/connect/server/sv_borrow_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    table: "#tb_list_item_borrow",
                    fields: [


                       
                        {
                            label: "Price Eglips:",
                            name: "price_eglips"
                        },
                        {
                            label: "Stock Eglips:",
                            name: "stock_eglips"
                        },{
                            label: "Price Watsons:",
                            name: "price_watsons"
                        },
                        {
                            label: "Stock Watsons:",
                            name: "stock_watsons"
                        },
                        {
                            label: "Stock Sendo:",
                            name: "stock_sendo"
                        },
                        {
                            label: "Price Sendo:",
                            name: "price_sendo"
                        }

                    ]
                });
                $('#tb_list_item_borrow').on('click', 'tbody td:not(:first-child)', function(e) {
                    editor.inline(this, {
                        buttons: {
                            label: '&gt;',
                            fn: function() {
                                this.submit();
                            }
                        }
                    });
                });

                $('#tb_list_item_borrow').DataTable({
                    dom: "Bfrtip",
                    pageLength: 50,
                    ajax: {
                        url: "assets/js/connect/server/sv_borrow_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        $compile(row)($scope);
                    },
                    columns: [{
                            width: "30px",
                            data: null,
                            defaultContent: '',
                            className: 'select-checkbox',
                            orderable: false
                        },
                        {
                            width: "50px",
                            data: "product_id"

                        },
                        {
                            width: "50px",
                            data: "product_name"

                        },
                        {
                            width: "50px",
                            data: "sku"

                        },
                        {
                            data: "stock_eglips",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_eglips",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_watsons",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_watsons",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_sendo",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_sendo",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },                 
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "tphcm";
                            },
                            "visible": false
                        }

                    ],
                    order: [4, 'desc'],
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
                    },
                    buttons: [

                        {
                            extend: 'collection',
                            text: 'Export',
                            buttons: [
                                'copy',
                                {
                                    extend: 'excel',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 5, 7, 8,10,11,13]
                                    },
                                    title: 'share_stock_borrow_TPHCM' + today


                                },
                                {
                                    extend: 'csv',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 5, 7, 8,10,11,13]
                                    },
                                    title: 'share_stock_borrow_TPHCM' + today,
                                },
                                'pdf',
                                'print'
                            ]


                        }

                    ],
                    "createdRow": function(row, data, dataIndex) {
                        var sku = data['sku'];
                        var lastchar = sku.substr(sku.length - 2);
                        if (lastchar == '-R') {
                            $(row).css('background-color', 'rgb(205, 224, 247)');
                        }
                    }
                });
               }else if (warehouse=="1"){
             //   console.log(obj);
                html = '<thead>\
                  <tr style=" background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs"></th> \
                       <th class="hidden-xs">item_id</th>\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Stock website sky007</th>\
                       <th class="hidden-xs">stock_web</th> \
                       <th class="hidden-xs">Price website sky007</th>  \
                       <th class="hidden-xs">warehouse</th>  \
                  </tr>\
                </thead>'; 
                $("#tb_list_item_borrow").append(html);                
                editor = new $.fn.dataTable.Editor({
                    ajax: {
                        url: "assets/js/connect/server/sv_borrow_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    table: "#tb_list_item_borrow",
                    fields: [


                       
                        {
                            label: "Price Website sky007:",
                            name: "price_web"
                        },
                        {
                            label: "Stock Website sky007:",
                            name: "stock_web"
                        }

                    ]
                });
                $('#tb_list_item_borrow').on('click', 'tbody td:not(:first-child)', function(e) {
                    editor.inline(this, {
                        buttons: {
                            label: '&gt;',
                            fn: function() {
                                this.submit();
                            }
                        }
                    });
                });

                $('#tb_list_item_borrow').DataTable({
                    dom: "Bfrtip",
                    pageLength: 50,
                    ajax: {
                        url: "assets/js/connect/server/sv_borrow_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        $compile(row)($scope);
                    },
                    columns: [{
                            width: "30px",
                            data: null,
                            defaultContent: '',
                            className: 'select-checkbox',
                            orderable: false
                        },
                        {
                            width: "50px",
                            data: "product_id"

                        },
                        {
                            width: "50px",
                            data: "product_name"

                        },
                        {
                            width: "50px",
                            data: "sku"

                        },
                        {
                            data: "stock_web",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_web",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },                 
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "hanoi";
                            },
                            "visible": false
                        }

                    ],
                    order: [4, 'desc'],
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
                    },
                    buttons: [

                        {
                            extend: 'collection',
                            text: 'Export',
                            buttons: [
                                'copy',
                                {
                                    extend: 'excel',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 5, 7]
                                    },
                                    title: 'share_stock_borrow_HaNoi' + today


                                },
                                {
                                    extend: 'csv',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 5, 7]
                                    },
                                    title: 'share_stock_borrow_HaNoi' + today,
                                },
                                'pdf',
                                'print'
                            ]


                        }

                    ],
                    "createdRow": function(row, data, dataIndex) {
                        var sku = data['sku'];
                        var lastchar = sku.substr(sku.length - 2);
                        if (lastchar == '-R') {
                            $(row).css('background-color', 'rgb(205, 224, 247)');
                        }
                    }
                });
               }         
                

        }
        $("#cboShopType").change(function(){
            var shoptype=$("#cboShopType").val();
          //  alert(1);
            if(shoptype!="0"){
                $('#btnSaveGiveStock').prop('disabled', false);
            }else{
                $('#btnSaveGiveStock').prop('disabled', true);
            }
        })
        $("#btnSaveGiveStock").click(function(){          
            $warehouse=$("#cboWarehouse").val();
            $shoptype=$("#cboShopType").val();
            var arr_list_id_order = $.session.get('order_list');
            var mg_name = getCookie("ck_name");
         
            var object_order = []; // update price for each product.
            var splitString = arr_list_id_order.split(',');        
          
            for (var i = 0; i < splitString.length; i++) {
                var product_id = splitString[i];
                var quantity = $("#txtQuantityItem" + product_id).val();                
                if (quantity > 0) {
                  
                    var item_order = {
                        "product_id": product_id,
                        "quantity": quantity                    
                                          
                    };        
                  
                    object_order.push(item_order);
                } else {
                    alert("quantity >0 !");
                    $("#txtQuantityItem" + product_id).focus();
                    return;
                }
            }
            var obj={"warehouse":$warehouse,"shoptype":$shoptype,"list_item":object_order,"mg_name":mg_name};
          //  console.log(obj)    ;
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_give_stock",
                type: "POST",
                data:{"obj":obj},
                success: function(d) {
                  //  console.log(d)
                    if(d=="true"){
                        alert("Give Stock Finished !")
                    }else{
                        alert("Stock have problem please check again !");
                    }
                    get_list_product($scope);
                     console.log(d);
                   // var data = $.parseJSON(d);
                },
                error:function(e){
                    console.log(e);
                }
                });
          });
        function get_list_product($scope) {
            $.session.remove("order_list");
            $('#btnSaveGiveStock').prop('disabled', true);
            $("#div_list_order").empty();
             var warehouse=$("#cboWarehouse").val();        
             if(warehouse=="0"){
                $("#txtTitle").empty()
                $("#txtTitle").append("Give Stock From TP.HCM To Warehouse Ha Noi");
                $html_cboShop='<option value="0">---</option>\
                               <option value="sky007_web">Sky007 Website (Warehouse HN)</option>';
                $("#cboShopType").empty();
                $("#cboShopType").append($html_cboShop);
             }else if(warehouse=="1") {
                $("#txtTitle").empty()
                $("#txtTitle").append("Give Stock From Ha Noi To Warehouse TP.HCM");
                $html_cboShop='<option value="0">---</option>\
                               <option value="eglips_web">Eglips Website (Warehouse TP.HCM)</option>\
                               <option value="lazada_eglips">Lazada Eglips (Warehouse TP.HCM)</option>\
                               <option value="watsons">Watsons (Warehouse TP.HCM)</option>\
                               <option value="sendo">Sendo (Warehouse TP.HCM)</option>';
                $("#cboShopType").empty();
                $("#cboShopType").append($html_cboShop);
             }  
             $("#imgSave").hide();
             $("#div_list_item").show();   
             var table = $('#tb_list_product').DataTable();
             table.destroy();
             table.clear().draw();            
           
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_get_list_product",
                type: "POST",
                data:{"warehouse":warehouse},
                success: function(d) {
                   //  console.log(d);return;
                    var data = $.parseJSON(d);
                    
        
                    var table = $('#tb_list_product').DataTable({
                        "order": [
                            [1, "desc"]
                        ],
                        pageLength: 5,
                        data: data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "name" 
                            },                           
                            {
                                "width": "50px",
                                "data": "stock" 
                            },                    
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var name = full["name"].replace(/"/g, " ");                                    
                                    var stock = full["stock"];
                                    var html = '<button class="btn btn-info" ng-click="add_order_html(\'' + id + '\',\'' + name + '\',\'' + stock + '\',\'0\')">Add</button>';
                                    return html;
                                }
                            },{
                                "width": "50px",
                                "data": "stock_regular" 
                            }, {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var html ="";
                                    var id = full["id_regular"];
                                    if(id!= null){
                                        var name = full["name"].replace(/"/g, " ");                                       
                                        var stock = full["stock_regular"];
                                        var html = '<button class="btn btn-danger" ng-click="add_order_html(\'' + id + '\',\'' + name + '\',\'' + stock + '\',\'1\')">Add</button>';
         
                                    }
                                     return html;
                                }
                            }
                        ]
                    });
                    $("#div_list_item").hide();
        
                },
                error: function(e) {
                    alert(e);
                }
            });
          
        }
         $scope.delete_item=function(product_id) {
            var arr_list = $.session.get('order_list');
            // arr_list= arr_list.replace(new RegExp(product_id + ',?'), '');
            var splitString = arr_list.split(',');
            var arr_order = [];
            for (var i = 0; i < splitString.length; i++) {
                arr_order.push(splitString[i]);
            }
            var index = arr_order.indexOf(product_id);
            if (index != -1) {
                arr_order.splice(index, 1);
            }
            var strss = "";
            for (var i = 0; i < arr_order.length; i++) {
                if (i == 0) {
                    strss += arr_order[i];
                } else {
                    strss = strss + "," + arr_order[i];
                }
            }
            $.session.set('order_list', strss);
            $("#div_item" + product_id).remove();
            arr_list = $.session.get('order_list');
            if (arr_list.length == 0) {
                $.session.remove('order_list');
            }
            console.log(arr_list);
        }
        $scope.add_order_html = function (id,  name, stock,product_type) { //product_type 0: not vat , 1: vat            
            var ss_id = id;
            var color_vat="";
            if(product_type=="1"){
                color_vat="background-color: #74f594;";
            }           
          //  console.log("123");
            var flag_duplicate_p_id = true;
            if (typeof $.session.get('order_list') !== 'undefined' && $.session.get('order_list') !== null) {
                var arr_list = $.session.get('order_list');
                var splitString = arr_list.split(',');
                for (var i = 0; i < splitString.length; i++) {
                    if (id == splitString[i]) {
                        flag_duplicate_p_id = false;
                        break;
                    }
                }
                if (flag_duplicate_p_id == true && stock > 0) {          
                    ss_id = $.session.get('order_list') + "," + id;
                    $.session.set('order_list', ss_id);
                    var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                        <div class="col-md-6">\
                                                            <span style="'+color_vat+'"  id="txtItem' + id + '"> '+ name +' </span>\
                                                        </div>\
                                                        <div class="col-md-2">\
                                                            <input style="'+color_vat+'" id="txtQuantityItem' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57" />\
                                                        </div>\
                                                        <div class="col-md-1">\
                                                            <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                        </div>\
                                                       </div>   ';
                                                    //   console.log(html);
                    $("#div_list_order").append($compile(html)($scope));
                }
            } else {
                if (stock > 0) {           
                    $.session.set('order_list', ss_id);
                    var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                            <div class="col-md-6">\
                                                                <span style="'+color_vat+'"  id="txtItem' + id + '" >'+name+'</span>\
                                                            </div>\
                                                            <div class="col-md-2">\
                                                                <input style="'+color_vat+'" id="txtQuantityItem' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  />\
                                                            </div>\
                                                            <div class="col-md-1">\
                                                                <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                            </div>\
                                                           </div>   ';
                    $("#div_list_order").append($compile(html)($scope));
                }
        
            }
             
        
        }
        $("#btnHistory").click(function(){
            $flat_acction="history";
            $("#div_give_stock").hide();
            $("#div_edit_stock").hide();
            $("#div_history").show();
            
            $("#btnEditStock").removeClass("btn-primary");
            $("#btnGiveStock").removeClass("btn-primary");
            $("#btnHistory").addClass("btn-primary");
            load_history();
        })
        function load_history(){
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var table = $('#tb_history_give_stock').DataTable();
             table.destroy();
             table.clear().draw();            
           $("#div_refesh_history_give_stock").show();
           var obj={"start_date": fromdate,"end_date": todate,}
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_get_history_stock_borrow",
                type: "POST",
                data:{"obj":obj},
                success: function(d) {
                   //  console.log(d);return;
                    var data = $.parseJSON(d);
                    
        
                    var table = $('#tb_history_give_stock').DataTable({
                        "order": [
                            [3, "desc"]
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "product_id" 
                            },                           
                            {
                                "width": "50px",
                                "data": "product_name" 
                            },{
                                "width": "50px",
                                "data": "log_stock" 
                            },{
                                "width": "50px",
                                "data": "time_update" 
                            },{
                                "width": "50px",
                                "data": "manager" 
                            }
                        ]
                    });
                    $("#div_refesh_history_give_stock").hide();
        
                },
                error: function(e) {
                    alert(e);
                }
            });
        }
    }
]); */

//============================= end borrow stock ===============================

//============================ Stock borrow 1 ======================================

App.controller('SMSBorrowStockCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSBorrow");
       set_date_time($scope, '7');            
       var f_list_old_item = [];
        var today = moment().format('YYYY_MM_DD_hh_mm_ss');
        // console.log(today);
      //  update_new_item();
       $flat_acction="edit";
       var private_data="";
       $("#btnEditStock").click(function (){
            $flat_acction="edit";
            var table = $('#tb_list_item_borrow').DataTable();
                var buttons = [];
    
                $.each(table.buttons()[0].inst.s.buttons,
                    function() {
                        buttons.push(this);
                    });
                $.each(buttons,
                    function() {
                        table.buttons()[0].inst.remove(this.node);
                    });
                table.destroy();
            load_data($compile, $scope);
            $("#div_give_stock").hide();
             $("#div_history").hide();
             $("#div_return_stock").hide();
            $("#div_edit_stock").show();
            $("#btnEditStock").addClass("btn-primary");
            $("#btnGiveStock").removeClass("btn-primary");
            $("#btnHistory").removeClass("btn-primary");
            $("#btnReturnStock").removeClass("btn-primary");            
            $("#divFilter").show();
        })
        $("#btnGiveStock").click(function (){
            $flat_acction="give";
            $("#div_edit_stock").hide();
            $("#div_history").hide();
            $("#div_return_stock").hide();
            $("#div_give_stock").show();
             $("#btnEditStock").removeClass("btn-primary");
            $("#btnGiveStock").addClass("btn-primary");
            $("#btnHistory").removeClass("btn-primary");
            $("#btnReturnStock").removeClass("btn-primary");                     
            $("#divFilter").hide();
            get_list_product($scope);
            
        })
        $("#btnReturnStock").click(function (){
            $flat_acction="return";
            $("#div_edit_stock").hide();
            $("#div_history").hide();
            $("#div_return_stock").show();
            $("#div_give_stock").hide();
            $("#btnEditStock").removeClass("btn-primary");
            $("#btnGiveStock").removeClass("btn-primary");
            $("#btnReturnStock").addClass("btn-primary");
            $("#btnHistory").removeClass("btn-primary"); 
            $("#divFilter").hide();       
            get_list_product_return($scope);
            
        })       
        $("#div_give_stock").hide();
        $("#div_history").hide();
        $("#div_return_stock").hide();            
        $scope.loadData = function() {            
            load_data($compile, $scope);
            // $("#btnHistory").click();
        }
        $scope.data_fillter = function() {
            
            if($flat_acction=="edit"){
                var table = $('#tb_list_item_borrow').DataTable();
                var buttons = [];
    
                $.each(table.buttons()[0].inst.s.buttons,
                    function() {
                        buttons.push(this);
                    });
                $.each(buttons,
                    function() {
                        table.buttons()[0].inst.remove(this.node);
                    });
                table.destroy();
                load_data($compile, $scope);
            }else if($flat_acction=="give"){
                get_list_product($scope);
            }else if($flat_acction=="return"){
                get_list_product_return($scope);
            }else if ($flat_acction=="history"){
                load_history();
            }
        }
        $("#cboWarehouse").change(function(){
            if($flat_acction=="edit"){
                var table = $('#tb_list_item_borrow').DataTable();
                var buttons = [];
    
                $.each(table.buttons()[0].inst.s.buttons,
                    function() {
                        buttons.push(this);
                    });
                $.each(buttons,
                    function() {
                        table.buttons()[0].inst.remove(this.node);
                    });
                table.destroy();
                load_data($compile, $scope);
            }            
        });
        function load_data($compile, $scope) {
            var mg_name = getCookie("ck_name");
            var warehouse = $("#cboWarehouse").val();
            var brand_name = $("#cboBrandName").val();
            var category = $("#cboCategory").val();
            var product_type = $("#cboProductType").val();      
            var obj = {
                "warehouse": warehouse,
                "brand": brand_name,
                "category": category,
                "product_type": product_type,
                "mg_name": mg_name
            };  
                $("#tb_list_item_borrow").empty();

                var html = "";     
               if(warehouse=="0"){
                html = '<thead>\
                  <tr style=" background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs"></th> \
                       <th class="hidden-xs">item_id</th>\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Stock Eglips</th>\
                       <th class="hidden-xs">stock_eglips</th> \
                       <th class="hidden-xs">Price Eglips</th>  \
                       <th class="hidden-xs">Stock Watsons</th>\
                       <th class="hidden-xs">stock watson Total</th> \
                       <th class="hidden-xs">Price Watsons</th>  \
                       <th class="hidden-xs">stock Sociolla</th>  \
                       <th class="hidden-xs">Price Sociolla</th>  \
                       <th class="hidden-xs">warehouse</th>  \
                  </tr>\
               </thead>'; 
               $("#tb_list_item_borrow").append(html);                
                editor = new $.fn.dataTable.Editor({
                    ajax: {
                        url: "assets/js/connect/server/sv_borrow_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    table: "#tb_list_item_borrow"
                  /*  fields: [


                       
                        {
                            label: "Price Eglips:",
                            name: "price_eglips"
                        },
                        {
                            label: "Stock Eglips:",
                            name: "stock_eglips"
                        },{
                            label: "Price Watsons:",
                            name: "price_watsons"
                        },
                        {
                            label: "Stock Watsons:",
                            name: "stock_watsons"
                        },
                        {
                            label: "Stock Sendo:",
                            name: "stock_sendo"
                        },
                        {
                            label: "Price Sendo:",
                            name: "price_sendo"
                        }

                    ]*/
                });
                $('#tb_list_item_borrow').on('click', 'tbody td:not(:first-child)', function(e) {
                    editor.inline(this, {
                        buttons: {
                            label: '&gt;',
                            fn: function() {
                                this.submit();
                            }
                        }
                    });
                });

                $('#tb_list_item_borrow').DataTable({
                    dom: "Bfrtip",
                    pageLength: 50,
                    ajax: {
                        url: "assets/js/connect/server/sv_borrow_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        $compile(row)($scope);
                    },
                    columns: [{
                            width: "30px",
                            data: null,
                            defaultContent: '',
                            className: 'select-checkbox',
                            orderable: false
                        },
                        {
                            width: "50px",
                            data: "product_id"

                        },
                        {
                            width: "50px",
                            data: "product_name"

                        },
                        {
                            width: "50px",
                            data: "sku"

                        },
                        {
                            data: "stock_eglips",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_eglips",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_watsons",
                            width: "50px"
                        }, {
                            width: "30px",
                             data: "stock_watsons_total"
                           
                        },
                        {
                            data: "price_watsons",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_sociolla",
                            width: "50px"
                        },
                        {
                            data: "price_sociolla",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },                 
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "tphcm";
                            },
                            "visible": false
                        }

                    ],
                    order: [4, 'desc'],
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
                    },
                    buttons: [

                        {
                            extend: 'collection',
                            text: 'Export',
                            buttons: [
                                'copy',
                                {
                                    extend: 'excel',
                                   /* exportOptions: {
                                        columns: [1, 2, 3, 4, 5, 7, 8,10,11,13]
                                    },*/
                                    title: 'share_stock_borrow_TPHCM' + today


                                },
                                {
                                    extend: 'csv',
                                   /* exportOptions: {
                                        columns: [1, 2, 3, 4, 5, 7, 8,10,11,13]
                                    },*/
                                    title: 'share_stock_borrow_TPHCM' + today,
                                },
                                'pdf',
                                'print'
                            ]


                        }

                    ],
                    "createdRow": function(row, data, dataIndex) {
                        var sku = data['sku'];
                        var lastchar = sku.substr(sku.length - 2);
                        if (lastchar == '-R') {
                            $(row).css('background-color', 'rgb(205, 224, 247)');
                        }
                    }
                });
               }else if (warehouse=="1"){
             //   console.log(obj);
                html = '<thead>\
                  <tr style=" background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs"></th> \
                       <th class="hidden-xs">item_id</th>\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Stock website sky007</th>\
                       <th class="hidden-xs">stock_web</th> \
                       <th class="hidden-xs">Price website sky007</th>  \
                       <th class="hidden-xs">warehouse</th>  \
                  </tr>\
                </thead>'; 
                $("#tb_list_item_borrow").append(html);                
                editor = new $.fn.dataTable.Editor({
                    ajax: {
                        url: "assets/js/connect/server/sv_borrow_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    table: "#tb_list_item_borrow"
                   /* fields: [


                       
                        {
                            label: "Price Website sky007:",
                            name: "price_web"
                        },
                        {
                            label: "Stock Website sky007:",
                            name: "stock_web"
                        }

                    ]*/
                });
                $('#tb_list_item_borrow').on('click', 'tbody td:not(:first-child)', function(e) {
                    editor.inline(this, {
                        buttons: {
                            label: '&gt;',
                            fn: function() {
                                this.submit();
                            }
                        }
                    });
                });

                $('#tb_list_item_borrow').DataTable({
                    dom: "Bfrtip",
                    pageLength: 50,
                    ajax: {
                        url: "assets/js/connect/server/sv_borrow_stock.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        $compile(row)($scope);
                    },
                    columns: [{
                            width: "30px",
                            data: null,
                            defaultContent: '',
                            className: 'select-checkbox',
                            orderable: false
                        },
                        {
                            width: "50px",
                            data: "product_id"

                        },
                        {
                            width: "50px",
                            data: "product_name"

                        },
                        {
                            width: "50px",
                            data: "sku"

                        },
                        {
                            data: "stock_web",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_web",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },                 
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "hanoi";
                            },
                            "visible": false
                        }

                    ],
                    order: [4, 'desc'],
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
                    },
                    buttons: [

                        {
                            extend: 'collection',
                            text: 'Export',
                            buttons: [
                                'copy',
                                {
                                    extend: 'excel',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 5, 7]
                                    },
                                    title: 'share_stock_borrow_HaNoi' + today


                                },
                                {
                                    extend: 'csv',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 5, 7]
                                    },
                                    title: 'share_stock_borrow_HaNoi' + today,
                                },
                                'pdf',
                                'print'
                            ]


                        }

                    ],
                    "createdRow": function(row, data, dataIndex) {
                        var sku = data['sku'];
                        var lastchar = sku.substr(sku.length - 2);
                        if (lastchar == '-R') {
                            $(row).css('background-color', 'rgb(205, 224, 247)');
                        }
                    }
                });
               }         
                

        }
        // -------------------- give stock------------------------------------------------
        $("#cboGiveStock").change(function(){
           get_list_product($scope);
        })
        $("#btnSaveGiveStock").click(function(){          
            $("#btnSaveGiveStock").hide();
            $stock_give=$("#cboGiveStock").val();
            $po_id=$("#txt_po").val(); // use for watsons .
          //  console.log($stock_give); return;
            var arr_list_id_order = $.session.get('order_list');
            var mg_name = getCookie("ck_name");
         
            var object_order = []; // update price for each product.
            var splitString = arr_list_id_order.split(',');        
          
            for (var i = 0; i < splitString.length; i++) {
                var product_id = splitString[i];
                var quantity = $("#txtQuantityItem" + product_id).val();    
                var expdate = $("#txtExpItem" + product_id).val();               
                if (quantity > 0) {
                  
                    var item_order = {
                        "product_id": product_id,
                        "quantity": quantity ,
                        "expdate":  expdate               
                                          
                    };        
                  
                    object_order.push(item_order);
                } else {
                    alert("quantity >0 !");
                    $("#txtQuantityItem" + product_id).focus();
                    $("#btnSaveGiveStock").show();
                    return;
                }
                if($stock_give==5||$stock_give==7){                  
                    if(expdate==""){
                        alert("Please insert Expiration date");
                        $("#txtExpItem" + product_id).focus();
                        $("#btnSaveGiveStock").show();
                        return;
                    }if(isValidDate(expdate)==false){
                        alert("Wrong Format Expiration date");
                        $("#txtExpItem" + product_id).focus();
                        $("#btnSaveGiveStock").show();
                        return;
                    }
                }
            }
            if($stock_give==5||$stock_give==7){   
                if($po_id==""){
                        alert("Please insert PO .");
                        $("#txt_po").focus();
                        $("#btnSaveGiveStock").show();
                }
            }
            var obj={"stock":$stock_give,"list_item":object_order,"mg_name":mg_name,"po_id":$po_id};
        //    console.log(obj)    ;
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_give_and_return_stock",
                type: "POST",
                data:{"obj":obj},
                success: function(d) {
                     d=(d.replace(/\s+/, ""));
                 //    console.log(d); return;
                    $("#btnSaveGiveStock").show();
                    if(d=="true"){
                        alert("Move Stock Finished !")
                    }else{
                        alert("Stock have problem please check again !");
                    }
                    get_list_product($scope);                    
                   // var data = $.parseJSON(d);
                },
                error:function(e){
                    console.log(e);
                }
                }); 
          });
          
        function get_list_product($scope) {
            $.session.remove("order_list");
            $('#btnSaveGiveStock').prop('disabled', true);
            $("#div_list_order").empty();
            var cboGiveStock=$("#cboGiveStock").val();
             $("#imgSave").hide();     
            
             var table = $('#tb_list_product').DataTable();
             table.destroy();
             table.clear().draw();  
                $("#div_list_item").show();
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_get_list_product",
                    type: "POST",
                    data:{"stock":cboGiveStock},
                    success: function(d) {
                        // console.log(d);return;
                        var data = $.parseJSON(d);
                        
            
                        var table = $('#tb_list_product').DataTable({
                            "order": [
                                [1, "desc"]
                            ],
                            pageLength: 5,
                            data: data,
                            lengthMenu: [
                                [5, 10, 20, 30, 50, -1],
                                [5, 10, 20, 30, 50, "ALL"]
                            ],
                            createdRow: function(row, data, dataIndex) {
                                $compile(row)($scope);
                            },
                            "columns": [{
                                    "width": "30px",
                                    "data": "name" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "stock" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "sku" 
                                },                    
                                {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                        var id = full["id"];
                                        var name = full["name"].replace(/"/g, " ");                                    
                                        var stock = full["stock"];
                                     //   var sku= full["sku"];
                                        var product_type= full["product_type"];
                                        $color_infor="";
                                        if(product_type=="Regular"){
                                            $type_product=1;
                                            $color_infor="btn-danger";
                                        }else{
                                            $color_infor="btn-info";
                                            $type_product=0;
                                        }
                                        var html = '<button class="btn '+$color_infor+'" ng-click="add_order_html(\'' + id + '\',\'' + name + '\',\'' + stock + '\',\'' + $type_product + '\')">Add</button>';
                                        return html;
                                    }
                                }/*,{
                                    "width": "50px",
                                    "data": "stock_regular" 
                                }, {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                        var html ="";
                                        var id = full["id_regular"];
                                        if(id!= null){
                                            var name = full["name"].replace(/"/g, " ");                                       
                                            var stock = full["stock_regular"];
                                            var html = '<button class="btn btn-danger" ng-click="add_order_html(\'' + id + '\',\'' + name + '\',\'' + stock + '\',\'1\')">Add</button>';
             
                                        }
                                         return html;
                                    }
                                }*/
                            ]
                        });
                        $("#div_list_item").hide();
            
                    },
                    error: function(e) {
                        alert(e);
                    }
                });
          
        }
         $scope.delete_item=function(product_id) {
            var arr_list = $.session.get('order_list');
            // arr_list= arr_list.replace(new RegExp(product_id + ',?'), '');
            var splitString = arr_list.split(',');
            var arr_order = [];
            for (var i = 0; i < splitString.length; i++) {
                arr_order.push(splitString[i]);
            }
            var index = arr_order.indexOf(product_id);
            if (index != -1) {
                arr_order.splice(index, 1);
            }
            var strss = "";
            for (var i = 0; i < arr_order.length; i++) {
                if (i == 0) {
                    strss += arr_order[i];
                } else {
                    strss = strss + "," + arr_order[i];
                }
            }
            $.session.set('order_list', strss);
            $("#div_item" + product_id).remove();
            arr_list = $.session.get('order_list');
            if (arr_list.length == 0) {
                $.session.remove('order_list');
            }
            console.log(arr_list);
        }
        $scope.add_order_html = function (id,  name, stock,product_type) { //product_type 0: not vat , 1: vat            
            var ss_id = id;
            var color_vat="";
            if(product_type=="1"){
                color_vat="background-color: #74f594;";
            } 
            $('#btnSaveGiveStock').prop('disabled', false);
                      
          //  console.log("123");
            var flag_duplicate_p_id = true;
            if (typeof $.session.get('order_list') !== 'undefined' && $.session.get('order_list') !== null) {
                var arr_list = $.session.get('order_list');
                var splitString = arr_list.split(',');
                for (var i = 0; i < splitString.length; i++) {
                    if (id == splitString[i]) {
                        flag_duplicate_p_id = false;
                        break;
                    }
                }
                if (flag_duplicate_p_id == true && stock > 0) {          
                    ss_id = $.session.get('order_list') + "," + id;
                    $.session.set('order_list', ss_id);
                    var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                        <div class="col-md-4">\
                                                            <span style="'+color_vat+'"  id="txtItem' + id + '"> '+ name +' </span>\
                                                        </div>\
                                                        <div class="col-md-2">\
                                                            <input style="'+color_vat+'" id="txtQuantityItem' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57" />\
                                                        </div>\
                                                         <div class="col-md-4">\
                                                            <input class="form-control" id="txtExpItem' + id + '" />\
                                                        </div>\
                                                        <div class="col-md-1">\
                                                            <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                        </div>\
                                                       </div>   ';
                                                    //   console.log(html);
                    $("#div_list_order").append($compile(html)($scope));
                }
            } else {
                if (stock > 0) {           
                    $.session.set('order_list', ss_id);
                    var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                            <div class="col-md-4">\
                                                                <span style="'+color_vat+'"  id="txtItem' + id + '" >'+name+'</span>\
                                                            </div>\
                                                            <div class="col-md-2">\
                                                                <input style="'+color_vat+'" id="txtQuantityItem' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  />\
                                                            </div>\<div class="col-md-4">\
                                                                <input class="form-control" id="txtExpItem' + id + '"  />\
                                                            </div>\
                                                            <div class="col-md-1">\
                                                                <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                            </div>\
                                                           </div>   ';
                    $("#div_list_order").append($compile(html)($scope));
                }
        
            }
             
        
        }
        // -------------------- end give stock------------------------------------------------
        // ------------------- Return Stock --------------------------------------------------
        $("#cboReturnStock").change(function(){
           get_list_product_return($scope);
        })
        $("#btnSaveReturnStock").click(function(){          
            $("#btnSaveReturnStock").hide();
            $stock_return=$("#cboReturnStock").val();
            var arr_list_id_order_return = $.session.get('order_list_return');
            var mg_name = getCookie("ck_name");
         
            var object_order = []; // update price for each product.
            var splitString = arr_list_id_order_return.split(',');        
          
            for (var i = 0; i < splitString.length; i++) {
                var product_id = splitString[i];
                var quantity = $("#txtQuantityItemReturn" + product_id).val();                
                if (quantity > 0) {
                  
                    var item_order = {
                        "product_id": product_id,
                        "quantity": quantity,
                        "expdate":""                    
                                          
                    };        
                  
                    object_order.push(item_order);
                } else {
                    alert("quantity >0 !");
                    $("#txtQuantityItemReturn" + product_id).focus();
                    return;
                }
            }
            var obj={"stock":$stock_return,"list_item":object_order,"mg_name":mg_name,"po_id":""};
          //  console.log(obj)    ;
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_give_and_return_stock",
                type: "POST",
                data:{"obj":obj},
                success: function(d) {
                  //  console.log(d);
                    d=(d.replace(/\s+/, ""));
                    $("#btnSaveReturnStock").show();                   
                    if(d=="true"){
                        alert("Return Stock Finished !")
                    }else{
                        alert("Stock have problem please check again !");
                    }
                    get_list_product_return($scope);
                   //  console.log(d);
                   // var data = $.parseJSON(d);
                },
                error:function(e){
                    console.log(e);
                }
                });
          });
          
        function get_list_product_return($scope) {
            $.session.remove("order_list_return");
            $('#btnSaveReturnStock').prop('disabled', true);
            $("#div_list_order_return").empty();
            var cboReturnStock=$("#cboReturnStock").val();
             $("#imgSaveReturn").hide();     
            
             var table = $('#tb_list_product_return').DataTable();
             table.destroy();
             table.clear().draw();  
                $("#div_list_item_return").show();
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_get_list_product",
                    type: "POST",
                    data:{"stock":cboReturnStock},
                    success: function(d) {
                       //  console.log(d);return;
                        var data = $.parseJSON(d);                        
            
                        var table = $('#tb_list_product_return').DataTable({
                            "order": [
                                [1, "desc"]
                            ],
                            pageLength: 5,
                            data: data,
                            lengthMenu: [
                                [5, 10, 20, 30, 50, -1],
                                [5, 10, 20, 30, 50, "ALL"]
                            ],
                            createdRow: function(row, data, dataIndex) {
                                $compile(row)($scope);
                            },
                            "columns": [{
                                    "width": "30px",
                                    "data": "name" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "stock" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "sku" 
                                },                    
                                {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                        var id = full["id"];
                                        var name = full["name"].replace(/"/g, " ");                                    
                                        var stock = full["stock"];
                                        var product_type= full["product_type"];
                                        $color_infor="";
                                        if(product_type=="Regular"){
                                            $type_product=1;
                                            $color_infor="btn-danger";
                                        }else{
                                            $color_infor="btn-info";
                                            $type_product=0;
                                        }
                                        var html = '<button class="btn '+$color_infor+'" ng-click="add_order_return_html(\'' + id + '\',\'' + name + '\',\'' + stock + '\',\'' + $type_product + '\')">Add</button>';
                                        return html;
                                    }
                                }/*,{
                                    "width": "50px",
                                    "data": "stock_regular" 
                                }, {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                        var html ="";
                                        var id = full["id_regular"];
                                        if(id!= null){
                                            var name = full["name"].replace(/"/g, " ");                                       
                                            var stock = full["stock_regular"];
                                            var html = '<button class="btn btn-danger" ng-click="add_order_return_html(\'' + id + '\',\'' + name + '\',\'' + stock + '\',\'1\')">Add</button>';
             
                                        }
                                         return html;
                                    }
                                }*/
                            ]
                        });
                        $("#div_list_item_return").hide();
            
                    },
                    error: function(e) {
                        alert(e);
                    }
                });
          
        }
         $scope.delete_item_return=function(product_id) {
            var arr_list = $.session.get('order_list_return');
            // arr_list= arr_list.replace(new RegExp(product_id + ',?'), '');
            var splitString = arr_list.split(',');
            var arr_order = [];
            for (var i = 0; i < splitString.length; i++) {
                arr_order.push(splitString[i]);
            }
            var index = arr_order.indexOf(product_id);
            if (index != -1) {
                arr_order.splice(index, 1);
            }
            var strss = "";
            for (var i = 0; i < arr_order.length; i++) {
                if (i == 0) {
                    strss += arr_order[i];
                } else {
                    strss = strss + "," + arr_order[i];
                }
            }
            $.session.set('order_list_return', strss);
            $("#div_item_return" + product_id).remove();
            arr_list = $.session.get('order_list_return');
            if (arr_list.length == 0) {
                $.session.remove('order_list_return');
            }
            console.log(arr_list);
        }
        $scope.add_order_return_html = function (id,  name, stock,product_type) { //product_type 0: not vat , 1: vat            
            var ss_id = id;
            var color_vat="";
            if(product_type=="1"){
                color_vat="background-color: #74f594;";
            } 
            $('#btnSaveReturnStock').prop('disabled', false);                      
          
            var flag_duplicate_p_id = true;
            if (typeof $.session.get('order_list_return') !== 'undefined' && $.session.get('order_list_return') !== null) {               
                var arr_list = $.session.get('order_list_return');
                var splitString = arr_list.split(',');
                for (var i = 0; i < splitString.length; i++) {
                    if (id == splitString[i]) {
                        flag_duplicate_p_id = false;
                        break;
                    }
                }
                if (flag_duplicate_p_id == true && stock > 0) {          
                    ss_id = $.session.get('order_list_return') + "," + id;
                    $.session.set('order_list_return', ss_id);
                    var html = '<div id="div_item_return' + id + '" class="col-md-12 form-group">\
                                                        <div class="col-md-6">\
                                                            <span style="'+color_vat+'"  id="txtItemReturn' + id + '"> '+ name +' </span>\
                                                        </div>\
                                                        <div class="col-md-2">\
                                                            <input style="'+color_vat+'" id="txtQuantityItemReturn' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57" />\
                                                        </div>\
                                                        <div class="col-md-1">\
                                                            <button class="btn btn-danger" ng-click="delete_item_return(\'' + id + '\')">X</button>\
                                                        </div>\
                                                       </div>   ';
                                                    //   console.log(html);
                    $("#div_list_order_return").append($compile(html)($scope));
                }
            } else {
                if (stock > 0) {           
                    $.session.set('order_list_return', ss_id);
                    var html = '<div id="div_item_return' + id + '" class="col-md-12 form-group">\
                                                            <div class="col-md-6">\
                                                                <span style="'+color_vat+'"  id="txtItemReturn' + id + '" >'+name+'</span>\
                                                            </div>\
                                                            <div class="col-md-2">\
                                                                <input style="'+color_vat+'" id="txtQuantityItemReturn' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  />\
                                                            </div>\
                                                            <div class="col-md-1">\
                                                                <button class="btn btn-danger" ng-click="delete_item_return(\'' + id + '\')">X</button>\
                                                            </div>\
                                                           </div>   ';
                    $("#div_list_order_return").append($compile(html)($scope));
                }
        
            }
             
        
        }
        // ------------------- end return stock ----------------------------------------------     
        
        // ------------------- hostory -------------------------------------------------------
        $("#btnHistory").click(function(){
            $flat_acction="history";
            $("#div_give_stock").hide();
            $("#div_edit_stock").hide();
            $("#div_return_stock").hide();          
            $("#div_history").show();
            $("#divFilter").hide();
            
            $("#btnEditStock").removeClass("btn-primary");
            $("#btnGiveStock").removeClass("btn-primary");
            $("#btnHistory").addClass("btn-primary");
            $("#btnReturnStock").removeClass("btn-primary");
            $("#btnReportWatsons").removeClass("btn-primary");
            load_history();
        })
        $("#btnHistorySearch").click(function(){
           load_history(); 
        });
        function load_history(){
            $("#divListDetail").hide();
            $("#divListUpdate").hide();
            var fromdate = $scope.txtfromdate;
            var todate = $scope.txttodate;
            var mg_name = getCookie("ck_name");
            fromdate = formatDate(fromdate);
            todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN" || todate == "NaN-NaN-NaN") {
                alert("Please check date .");
                return;
            }
            var table = $('#tb_history_stock_borrow').DataTable();
             table.destroy();
             table.clear().draw();            
           $("#div_refesh_history_give_stock").show();
           $("#btnUpdateStock").attr("h_id","");
           var obj={"start_date": fromdate,"end_date": todate};
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_get_history_stock_borrow",
                type: "POST",
                data:{"obj":obj},
                success: function(d) {
                 //    console.log(d);return;
                    var data = $.parseJSON(d);
                   //  console.log(data);//return;
                    private_data=data;
        
                    var table = $('#tb_history_stock_borrow').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        pageLength: 20,
                        data: data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "20px",
                                "render": function(data, type, full, meta) { 
                                    var id=  full["id"] ;
                                    var html = '<button class="btn btn-primary" ng-click="view_detail_id_moving(\'' + id + '\')">'+id+'</button>';                                                                                                           
                                    return html;
                                } 
                            },{
                                "width": "50px",
                                 "render": function(data, type, full, meta) {
                                    var where_stock = full["where_stock"];                                   
                                    var html = "";  
                                    if(where_stock==1){
                                        html = '<span>Stock Total From (Warehouse Ho Chi Minh) To Sky007 Borrow (Warehouse Ha Noi)</span>';
                                    } else if(where_stock==2){
                                        html = '<span>Return Stock From Sky007 Borrow (Warehouse Ha Noi) To Stock Total (Warehouse Ho Chi Minh)</span>';
                                    } else if(where_stock==3){
                                        html = '<span>Stock Total From (Warehouse Ha Noi) To Eglips Borrow(Warehouse Ho Chi Minh)</span>';
                                    } else if(where_stock==4){
                                        html = '<span>Return Stock From Eglips Borrow(Warehouse Ho Chi Minh) To Stock Total (Warehouse Ha Noi)</span>';
                                    } else if(where_stock==5){
                                        html = '<span>Stock Total From (Warehouse Ha Noi) To Watsons</span>';
                                    } else if(where_stock==6){
                                        html = '<span>Return Stock From Watsons To Stock Total (Warehouse Ha Noi)</span>';
                                    } else if(where_stock==7){
                                        html = '<span>Stock Eglips Borrow From (Warehouse Ho Chi Minh) To Watsons</span>';
                                    } else if(where_stock==8){
                                        html = '<span>Return Stock From Watsons To Stock Eglips Borrow  (Warehouse Ho Chi Minh)</span>';
                                    } else if(where_stock==9){
                                        html = '<span>Stock Total From (Warehouse Ho Chi Minh) To Stock Sociolla (Warehouse Ho Chi Minh)</span>';
                                    } else if(where_stock==10){
                                        html = '<span>Return Stock From Sociolla To Stock Total (Warehouse Ho Chi Minh)</span>';
                                    }      
                                    return html;
                                }
                            },{
                                "width": "30px",
                                "data": "create_time" 
                            },{
                                "width": "30px",
                                "data": "update_time" 
                            },{
                                "width": "30px",
                                "data": "delete_time" 
                            },{
                                "width": "30px",
                                "data": "mg_create" 
                            },{
                                "width": "30px",
                                 "render": function(data, type, full, meta) {                                                               
                                    var status=  full["status"] ;        
                                    if(status==0){
                                        var html = '<span class="text ">New</span>';
                                    }else if(status==1){
                                        var html = '<span class="text text-primary">Updated</span>';
                                    }else if(status==2){
                                        var html = '<span class="text text-success">Deleted</span>';
                                    }     
                                    return html;
                                }
                            },{
                                "width": "30px",
                                "render": function(data, type, full, meta) { 
                                    var id=  full["id"] ;
                                    var active=  full["active"] ;
                                    var html ="";
                                    var status=  full["status"] ;    
                                    if(active=="0" && status!="2"){
                                       html = '<button class="btn btn-primary" ng-click="update_row_history(\'' + id + '\')">Update</button>';
                                    }                                                                           
                                    return html;
                                } 
                            },{
                                "width": "30px",
                                "render": function(data, type, full, meta) { 
                                    var id=  full["id"] ;
                                    var active=  full["active"] ;
                                    var status=  full["status"] ; 
                                    var html ="";
                                    if(active=="0" && status!="2"){
                                       html = '<button class="btn btn-primary" ng-click="delete_row_history(\'' + id + '\')">Delete</button>'; 
                                    }                                    
                                    return html;
                                }
                            },{
                                "width": "30px",
                                "render": function(data, type, full, meta) {   
                                    var id=  full["id"] ; 
                                    var active=  full["active"] ; 
                                    var html ="";  
                                    if(mg_name=="Admin" || mg_name=="Yunjin Noh")  {
                                        if(active==0){
                                            html = '<button class="btn btn-primary" ng-click="change_active_row_history(\'' + id + '\',\''+active+'\')">Active</button>';
                                        }else{
                                            html = '<button class="btn" ng-click="change_active_row_history(\'' + id + '\',\''+active+'\')">Disable</button>';
                                        } 
                                    }  
                                    return html;
                                } 
                            }
                        ]
                    });
                    $("#div_refesh_history_give_stock").hide();
        
                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        $scope.change_active_row_history=function(history_id,active) {
            $("#divListDetail").hide();
            $("#divListUpdate").hide();
            $obj={"history_id":history_id,"active":active};
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_setting_active",
                type: "POST",
                data:{"obj":$obj},
                success: function(d) {
                  //  console.log(d);
                    alert("update active finished !");
                    load_history();
                },
                error: function(e) {
                    console.log(e);
                }
            });                
        }
        $scope.delete_row_history=function(history_id){
            $("#divListDetail").hide();
            $("#divListUpdate").hide();
            var answer = confirm("Are you sure you want to delete ?")
            if (answer) {
               var mg_name = getCookie("ck_name");            
               var obj={"history_id": history_id,"mg_name": mg_name};
               $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_delete_moving",
                    type: "POST",
                    data:{"obj":obj},
                    success: function(d) {
                        alert(d);
                        //alert("update active finished !");
                        //console.log(d);
                        load_history();
                    },
                    error: function(e) {
                        console.log(e);
                    }
                }); 
            }

        }
        $scope.view_detail_id_moving=function(history_id){     
            $("#divListUpdate").hide();
            var list_data="";
            for(var i=0;i<private_data.length;i++){
                if(private_data[i]["id"]==history_id){
                    list_data=private_data[i]["list_items"];
                    break;
                }
            }
            var table = $('#tb_list_detail').DataTable();
             table.destroy();
             table.clear().draw();
            var table = $('#tb_list_detail').DataTable({
                        "order": [
                            [0, "desc"]
                        ],
                        pageLength: 20,
                        data: list_data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                           
                        },
                        "columns": [{
                                    "width": "30px",
                                    "data": "product_id" 
                                },{
                                    "width": "30px",
                                    "data": "product_name" 
                                },{
                                    "width": "30px",
                                    "render": function(data, type, full, meta) {   
                                        var product_type=  full["product_type"] ;                                       
                                        var html =""; 
                                        if(product_type==0){
                                            html = '<span class="text text-primary">Hand carry product</span>';
                                        }else{
                                            html = '<span class="text text-primary">Regular product</span>';
                                        } 
                                       
                                        return html;
                                }
                                },{
                                    "width": "30px",
                                    "data": "quantity" 
                                }
                            ]
                    });
                    $("#divListDetail").show();
                   
          //  console.log(list_data);
        }
        
        $scope.update_row_history=function(history_id){
            $("#divListDetail").hide();    
            $("#divListUpdate").show();
            var stock="";
            var list_item="";
            var po_id="";
            for(var i=0;i<private_data.length;i++){
                if(private_data[i]["id"]==history_id){                    
                    stock=private_data[i]["where_stock"];
                    list_item=private_data[i]["list_items"];
                    po_id=private_data[i]["po_id"];
                    break;
                }
            }
            $("#txt_po_edit").val(po_id);            
            $("#btnUpdateStock").attr("h_id",history_id);
            get_list_product_update(stock);
            add_information_item_update(list_item);          
        }
        $scope.delete_item_update=function(product_id) {            
            var arr_list = $.session.get('order_list_update');
            // arr_list= arr_list.replace(new RegExp(product_id + ',?'), '');
            var splitString = arr_list.split(',');
            var arr_order = [];
            for (var i = 0; i < splitString.length; i++) {
                arr_order.push(splitString[i]);
            }
            var index = arr_order.indexOf(product_id);  
            if (index != -1) {
                arr_order.splice(index, 1);
            }
            var strss = "";
            for (var i = 0; i < arr_order.length; i++) {
                if (i == 0) {
                    strss += arr_order[i];
                } else {
                    strss = strss + "," + arr_order[i];
                }
            }
            $.session.set('order_list_update', strss);
            $("#div_item_update" + product_id).remove();
            arr_list = $.session.get('order_list_update');
            if (arr_list.length == 0) {
                $.session.remove('order_list_update');
            }
            console.log(arr_list);
        }

        function add_information_item_update(data_item) {
            //console.log(data_item);
            $("#div_list_order_update").empty();
            $.session.remove("order_list_update");
            f_list_old_item = [];
            var html = "";
            var ss_id = "";
            for (var i = 0; i < data_item.length; i++) {
    
                //  ss_id=
                var id = data_item[i]["product_id"];
                if (i == 0) {
                    ss_id = id;
                } else {
                    ss_id = ss_id + "," + id;
                }
                var name = data_item[i]["product_name"];               
                var quantity = parseInt(data_item[i]["quantity"]);
                var product_type = data_item[i]["product_type"];
             //   console.log(data_item);
                var expdate="";
                if (typeof(data_item[i]["expdate"]) === "undefined" || data_item[i]["expdate"] == "") {
                   
                }else{
                    expdate=data_item[i]["expdate"];
                }
                //  console.log(product_type);
                var color_vat = "";
                if (product_type == "1") {
                    color_vat = "background-color: #74f594;";
                }
               
                var item_and_quantity = {
                    "product_id": id,
                    "quantity": quantity.toString()
                };
                f_list_old_item.push(item_and_quantity);
                html += '<div id="div_item_update' + id + '" class="col-md-12 form-group">\
                    <div class="col-md-4">\
                        <input style="' + color_vat + '" id="txtItemUpdate' + id + '" class="form-control" value="' + name + '" />\
                    </div>\
                    <div class="col-md-2">\
                        <input style="' + color_vat + '" id="txtQuantityItemUpdate' + id + '" class="form-control" value="' + quantity + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57"/>\
                    </div>\
                     <div class="col-md-4">\
                        <input style="' + color_vat + '" class="form-control" id="txtExpItem' + id + '" value="' + expdate + '"  />\
                    </div>\
                    <div class="col-md-2">\
                        <button class="btn btn-danger" ng-click="delete_item_update(\'' + id + '\')">X</button>\
                    </div>\
                   </div>   ';
            }
            $.session.set('order_list_update', ss_id);
            // console.log(flatcheck_item);
            $("#div_list_order_update").append($compile(html)($scope));
        }
         $scope.add_order_update_html=function(id,  name, stock,product_type) { //product_type 0: not vat , 1: vat      
               
            var ss_id = id;
            var color_vat="";            
            if(product_type=="1"){
                color_vat="background-color: #74f594;";
            } 
            $('#btnUpdateStock').prop('disabled', false);
                      
          //  console.log("123");
            var flag_duplicate_p_id = true;
            if (typeof $.session.get('order_list_update') !== 'undefined' && $.session.get('order_list_update') !== null) {
                var arr_list = $.session.get('order_list_update');
                var splitString = arr_list.split(',');
                for (var i = 0; i < splitString.length; i++) {
                    if (id == splitString[i]) {
                        flag_duplicate_p_id = false;
                        break;
                    }
                }
                if (flag_duplicate_p_id == true && stock > 0) {          
                    ss_id = $.session.get('order_list_update') + "," + id;
                    $.session.set('order_list_update', ss_id);
                    var html = '<div id="div_item_update' + id + '" class="col-md-12 form-group">\
                                                        <div class="col-md-4">\
                                                            <span style="'+color_vat+'"  id="txtItemUpdate' + id + '"> '+ name +' </span>\
                                                        </div>\
                                                        <div class="col-md-2">\
                                                            <input style="'+color_vat+'" id="txtQuantityItemUpdate' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57" />\
                                                        </div>\
                                                         <div class="col-md-4">\
                                                            <input style="' + color_vat + '" class="form-control" id="txtExpItem' + id + '" />\
                                                        </div>\
                                                        <div class="col-md-2">\
                                                            <button class="btn btn-danger" ng-click="delete_item_update(\'' + id + '\')">X</button>\
                                                        </div>\
                                                       </div>   ';
                                                    //   console.log(html);
                    $("#div_list_order_update").append($compile(html)($scope));
                }
            } else {
                if (stock > 0) {           
                    $.session.set('order_list_update', ss_id);
                    var html = '<div id="div_item_update' + id + '" class="col-md-12 form-group">\
                                                            <div class="col-md-4">\
                                                                <span style="'+color_vat+'"  id="txtItemUpdate' + id + '" >'+name+'</span>\
                                                            </div>\
                                                            <div class="col-md-2">\
                                                                <input style="'+color_vat+'" id="txtQuantityItemUpdate' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  />\
                                                            </div>\
                                                            <div class="col-md-4">\
                                                                <input style="' + color_vat + '" class="form-control" id="txtExpItem' + id + '" />\
                                                            </div>\
                                                            <div class="col-md-2">\
                                                                <button class="btn btn-danger" ng-click="delete_item_update(\'' + id + '\')">X</button>\
                                                            </div>\
                                                           </div>   ';
                    $("#div_list_order_update").append($compile(html)($scope));
                }
        
            }
             
        
        }
        $('#btnUpdateStock').click(function(){
            $('#btnUpdateStock').hide();
            if (typeof $.session.get('order_list_update') !== 'undefined' && $.session.get('order_list_update') !== null) {
                var arr_list = $.session.get('order_list_update');              
                var splitString = arr_list.split(',');
                var arr_item_change= [];
                for (var i = 0; i < splitString.length; i++) {
                    
                    var item_id = splitString[i];
                    var quantity_new_item = $("#txtQuantityItemUpdate" + item_id + "").val(); 
                    var expdate = $("#txtExpItem" + item_id + "").val();                                     
                    var arr_new_item = {
                        "product_id": item_id,
                        "quantity": quantity_new_item,
                        "expdate": expdate
                    };
                    arr_item_change.push(arr_new_item);
                }
                var stock="";
                var list_item="";
                var history_id=$("#btnUpdateStock").attr("h_id");
                var mg_name=getCookie("ck_name");
                var po_id="";
                for(var i=0;i<private_data.length;i++){
                    if(private_data[i]["id"]==history_id){                    
                        stock=private_data[i]["where_stock"];
                        list_item=private_data[i]["list_items"];
                        po_id=private_data[i]["po_id"];
                        break;
                    }
                }
                
                $obj={"list_old":list_item,"list_new":arr_item_change,"stock_where":stock,"history_id":history_id,"mg_name":mg_name,"po_id":po_id};
            //    console.log($obj);
                $.ajax({
                        url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_update_list_borrow",
                        type: "POST",
                        data:{"obj":$obj},
                        success: function(d) {
                              $('#btnUpdateStock').show();
                           // console.log(d); return;
                            alert(d);
                            load_history();
                            $('#btnUpdateStock').show();
                           // console.log(d);
                        },
                        error:function(e){
                            
                        }
                })
            }               
          
        });
        function get_list_product_update($stock) {
            $.session.remove("order_list_update");
            
             var table = $('#tb_list_product_update').DataTable();
             table.destroy();
             table.clear().draw();  
                $("#div_list_item_update").show();
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_borrow_stock_get_list_product",
                    type: "POST",
                    data:{"stock":$stock},
                    success: function(d) {
                       // console.log(d);return;
                        var data = $.parseJSON(d);
                        
            
                        var table = $('#tb_list_product_update').DataTable({
                            "order": [
                                [1, "desc"]
                            ],
                            pageLength: 5,
                            data: data,
                            lengthMenu: [
                                [5, 10, 20, 30, 50, -1],
                                [5, 10, 20, 30, 50, "ALL"]
                            ],
                            createdRow: function(row, data, dataIndex) {
                                 $compile(row)($scope);
                            },
                            "columns": [{
                                    "width": "30px",
                                    "data": "name" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "stock" 
                                },                           
                                {
                                    "width": "50px",
                                    "data": "sku" 
                                },                    
                                {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                        var id = full["id"];
                                        var name = full["name"].replace(/"/g, " ");                                    
                                        var stock = full["stock"];
                                        var product_type= full["product_type"];
                                        $color_infor="";
                                        if(product_type=="Regular"){
                                            $type_product=1;
                                            $color_infor="btn-danger";
                                        }else{
                                            $color_infor="btn-info";
                                            $type_product=0;
                                        }
                                        var html = '<button class="btn '+$color_infor+'" ng-click="add_order_update_html(\'' + id + '\',\'' + name + '\',\'' + stock + '\',\'' + $type_product + '\')">Add</button>';
                                        return html;
                                    }
                                }/*,{
                                    "width": "50px",
                                    "data": "stock_regular" 
                                }, {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                        var html ="";
                                        var id = full["id_regular"];
                                        if(id!= null){
                                            var name = full["name"].replace(/"/g, " ");                                       
                                            var stock = full["stock_regular"];
                                            var html = '<button class="btn btn-danger" ng-click="add_order_update_html(\'' + id + '\',\'' + name + '\',\'' + stock + '\',\'1\')">Add</button>';
             
                                        }
                                         return html;
                                    }
                                }*/
                            ]
                        });
                        $("#div_list_item_update").hide();
            
                    },
                    error: function(e) {
                        alert(e);
                    }
                });
          
        }
        // ------------------- END  hostory -------------------------------------------------------
       
       
    }
]);

//============================= end borrow stock 1 ===============================
//============================ Share stock mixsoon ===========================

App.controller('SMShareMSCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
     checkCookie($scope);
      //  limit_permisstion_menu("chkSMShareStock");
        var today = moment().format('YYYY_MM_DD_hh_mm_ss');
      
        $scope.loadData = function() {
            load_data($compile, $scope);
        }
        $scope.data_fillter = function() {
            var table = $('#tb_list_item').DataTable();
            var buttons = [];

            $.each(table.buttons()[0].inst.s.buttons,
                function() {
                    buttons.push(this);
                });
            $.each(buttons,
                function() {
                    table.buttons()[0].inst.remove(this.node);
                });
            table.destroy();
            load_data($compile, $scope);
        }
      
        function load_data($compile, $scope) {

            var mg_name = getCookie("ck_name");
            var warehouse = "0";
            var brand_name = $("#cboBrandName").val();
            var category = $("#cboCategory").val();
            var product_type = $("#cboProductType").val();
            var obj = {
                "warehouse": "0",
                "brand": brand_name,
                "category": category,
                "product_type": product_type,
                "mg_name": mg_name
            };
          
            if (warehouse == "0") {
                $("#tb_list_item").empty();

                var html = '<thead>\
                  <tr style=" background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs"></th> \
                       <th class="hidden-xs">item_id</th>\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Total Stock</th>\
                       <th class="hidden-xs">counting Stock</th>\
                       <th class="hidden-xs">Stock Mixsoon Web</th>\
                       <th class="hidden-xs">stock_mixsoon_web</th>\
                       <th class="hidden-xs">Price Mixsoon Web</th>\
                       <th class="hidden-xs">Stock Sky007 Web</th>\
                       <th class="hidden-xs">stock_sky007_web</th>\
                       <th class="hidden-xs">Price Sky007 Web</th>\
                       <th class="hidden-xs">Stock Shopee</th>\
                       <th class="hidden-xs">stock_shopee</th>\
                       <th class="hidden-xs">Price Shopee</th>\
                       <th class="hidden-xs">Stock Lazada</th>\
                       <th class="hidden-xs">stock_lazada</th> \
                       <th class="hidden-xs">Price Lazada</th>\
                       <th class="hidden-xs">Stock Tiki</th>\
                       <th class="hidden-xs">stock_tiki</th>\
                       <th class="hidden-xs">Price Tiki</th>\
                       <th class="hidden-xs">Stock Tiktok Sky007</th>\
                       <th class="hidden-xs">stock_tiktok</th>\
                       <th class="hidden-xs">Price Tiktok sky007</th>\
                       <th class="hidden-xs">Stock Tiktok Mixsoon</th>\
                       <th class="hidden-xs">stock_tiktok_mixsoon</th>\
                       <th class="hidden-xs">Price Tiktok Mixsoon</th>\
                       <th class="hidden-xs">Stock Wholesaler</th>\
                       <th class="hidden-xs">stock_wholesaler</th>\
                       <th class="hidden-xs">Price Wholesaler</th>\
                       <th class="hidden-xs">warehouse</th>\
                  </tr>\
               </thead>';
                $("#tb_list_item").append(html);

                editor = new $.fn.dataTable.Editor({
                    ajax: {
                        url: "assets/js/connect/server/sv_share_stock_mixsoon.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    table: "#tb_list_item",
                    fields: [

                        {
                            label: "Price Mixsoon Website:",
                            name: "price_mixsoon_web"
                        },
                        {
                            label: "Stock Mixsoon:",
                            name: "stock_mixsoon_web",

                        },
                        {
                            label: "Price Sky007 Website:",
                            name: "price_sky007_web"
                        },
                        {
                            label: "Stock Sky007:",
                            name: "stock_sky007_web",

                        },
                        {
                            label: "Stock Shopee:",
                            name: "stock_shopee"
                        },
                        {
                            label: "Price Shopee:",
                            name: "price_shopee"
                        },
                        {
                            label: "Stock Lazada:",
                            name: "stock_lazada"
                        },
                        {
                            label: "Price Lazada:",
                            name: "price_lazada"
                        },
                        {
                            label: "Stock Tiki:",
                            name: "stock_tiki"
                        },
                        {
                            label: "Price Tiki:",
                            name: "price_tiki"
                        },
                        {
                            label: "Stock Tiktok Sky007:",
                            name: "stock_tiktok"
                        },
                        {
                            label: "Price Tiktok Sky007:",
                            name: "price_tiktok"
                        },
                        {
                            label: "Stock Tiktok:",
                            name: "stock_tiktok_mixsoon"
                        },
                        {
                            label: "Price Tiktok:",
                            name: "price_tiktok_mixsoon"
                        },
                        {
                            label: "Stock Wholesaler:",
                            name: "stock_wholesaler"
                        },
                        {
                            label: "Price wholesaler:",
                            name: "price_wholesaler"
                        }
                    ]
                });
                $('#tb_list_item').on('click', 'tbody td:not(:first-child)', function(e) {
                    editor.inline(this, {
                        buttons: {
                            label: '&gt;',
                            fn: function() {
                                this.submit();
                            }
                        }
                    });
                });

                $('#tb_list_item').DataTable({
                    dom: "Bfrtip",
                    pageLength: 50,
                    ajax: {
                        url: "assets/js/connect/server/sv_share_stock_mixsoon.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        $compile(row)($scope);
                    },
                    columns: [{
                            width: "30px",
                            data: null,
                            defaultContent: '',
                            className: 'select-checkbox',
                            orderable: false
                        },
                        {
                            width: "50px",
                            data: "product_id"

                        },
                        {
                            width: "50px",
                            data: "product_name"

                        },
                        {
                            width: "50px",
                            data: "sku"

                        }, {
                            width: "50px",
                            data: "stock_total"

                        },
                        {
                            width: "50px",
                            data: null,
                            render: function(data, type, row) {
                                var total = parseInt(data['stock_mixsoon_web']) + parseInt(data['stock_sky007_web']) + parseInt(data['stock_shopee']) + parseInt(data['stock_lazada']) + parseInt(data['stock_tiki'])+ parseInt(data['stock_tiktok']) + parseInt(data['stock_tiktok_mixsoon']+ parseInt(data['stock_wholesaler']));
                                return total;
                            }

                        },
                        {
                            data: "stock_mixsoon_web",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_mixsoon_web",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_sky007_web",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_sky007_web",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_shopee",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_shopee",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_lazada",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_lazada",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_tiki",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_tiki",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_tiktok",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_tiktok",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_tiktok_mixsoon",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_tiktok_mixsoon",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_wholesaler",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_wholesaler",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "tphcm";
                            },
                            "visible": false
                        }

                    ],
                    order: [4, 'desc'],
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
                    },

                    buttons: [


                        {
                            extend: 'collection',
                            text: 'Export',
                            buttons: [
                                'copy',
                                {
                                    extend: 'excel',                                  
                                    title: 'share_stock_mixsoon_TPHCM' + today


                                },
                                {
                                    extend: 'csv',                                    
                                    title: 'share_stock_mixsoon_TPHCM' + today,
                                },
                                'pdf',
                                'print'
                            ]


                        }

                    ],
                    "createdRow": function(row, data, dataIndex) {
                        var sku = data['sku'];
                        var lastchar = sku.substr(sku.length - 2);
                        if (lastchar == '-R') {
                            $(row).css('background-color', 'rgb(205, 224, 247)');
                        }
                    }
                });

                /*     var table = $('#tb_list_item').DataTable();
                     $('#tb_list_item tbody').on( 'click', 'tr', function () {
                          console.log( table.row( this ).data() );
                      } ); */
            } 


        }

        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateShareStock").hide();
                var excelFile,
                    fileReader = new FileReader();

                $("#result").hide();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel = data;
                        //console.log(data_excel);
                        $("#btnUpdateShareStock").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }

            })
        });
        
     /*   $("#btnUpdateShareStock").click(function() {
            $("#btnUpdateShareStock").hide();
            var warehouse = "0";
            var mg_name = getCookie("ck_name");
         //   console.log(data_excel); return;
            if (data_excel.length > 0) {
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_share_stock_by_excel",
                    type: "POST",
                    data: {
                        "warehouse": warehouse,
                        "name_management":mg_name,
                        "data": data_excel                    
                    },
                    success: function(d) {
                         console.log(d);return;
                        $("#btnUpdateShareStock").show();
                        // console.log(d);
                        if (d == "") {
                            //$("#btnNotifyFinish").click();
                            alert("update Succeeded !");

                        } else {
                            alert(d);
                        }
                        var table = $('#tb_list_item').DataTable();
                        table.destroy();
                        load_data($compile, $scope)
                       
                    },
                    error: function(e) {

                    }
                });
                //  console.log(data_excel); 
            }

        });*/
    }
])
        
 //============================END Share stock mixsoon ===========================   
 //============================ Share stock hince ===========================

App.controller('SMShareHinceCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
     checkCookie($scope);
      //  limit_permisstion_menu("chkSMShareStock");
        var today = moment().format('YYYY_MM_DD_hh_mm_ss');
      
        $scope.loadData = function() {
            load_data($compile, $scope);
        }
        $scope.data_fillter = function() {
            var table = $('#tb_list_item').DataTable();
            var buttons = [];

            $.each(table.buttons()[0].inst.s.buttons,
                function() {
                    buttons.push(this);
                });
            $.each(buttons,
                function() {
                    table.buttons()[0].inst.remove(this.node);
                });
            table.destroy();
            load_data($compile, $scope);
        }
      
        function load_data($compile, $scope) {

            var mg_name = getCookie("ck_name");
            var warehouse = "0";
            var brand_name = $("#cboBrandName").val();
            var category = $("#cboCategory").val();
            var product_type = $("#cboProductType").val();
            var obj = {
                "warehouse": "0",
                "brand": brand_name,
                "category": category,
                "product_type": product_type,
                "mg_name": mg_name
            };
          
            if (warehouse == "0") {
                $("#tb_list_item").empty();

                var html = '<thead>\
                  <tr style=" background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs"></th> \
                       <th class="hidden-xs">item_id</th>\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Total Stock</th>\
                       <th class="hidden-xs">counting Stock</th>\
                       <th class="hidden-xs">Stock Hince Web</th>\
                       <th class="hidden-xs">stock_hince_web</th>\
                       <th class="hidden-xs">Price Hince Web</th>\
                       <th class="hidden-xs">Stock Shopee</th>\
                       <th class="hidden-xs">stock_shopee</th>\
                       <th class="hidden-xs">Price Shopee</th>\
                       <th class="hidden-xs">Stock Lazada</th>\
                       <th class="hidden-xs">stock_lazada</th> \
                       <th class="hidden-xs">Price Lazada</th>   \
                       <th class="hidden-xs">Stock Tiki</th>\
                       <th class="hidden-xs">stock_tiki</th> \
                       <th class="hidden-xs">Price Tiki</th>   \
                       <th class="hidden-xs">Stock Tiktok Hince</th>\
                       <th class="hidden-xs">stock_tiktok_hince</th> \
                       <th class="hidden-xs">Price Tiktok Hince</th>   \
                       <th class="hidden-xs">warehouse</th>   \
                  </tr>\
               </thead>';
                $("#tb_list_item").append(html);

                editor = new $.fn.dataTable.Editor({
                    ajax: {
                        url: "assets/js/connect/server/sv_share_stock_hince.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    table: "#tb_list_item",
                    fields: [

                        {
                            label: "Price Hince Website:",
                            name: "price_hince_web"
                        },
                        {
                            label: "Stock Hince:",
                            name: "stock_hince_web",

                        },
                        {
                            label: "Price Sky007 Website:",
                            name: "price_sky007_web"
                        },
                        {
                            label: "Stock Sky007:",
                            name: "stock_sky007_web",

                        },
                        {
                            label: "Stock Shopee:",
                            name: "stock_shopee"
                        },
                        {
                            label: "Price Shopee:",
                            name: "price_shopee"
                        },
                        {
                            label: "Stock Lazada:",
                            name: "stock_lazada"
                        },
                        {
                            label: "Price Lazada:",
                            name: "price_lazada"
                        },
                        {
                            label: "Stock Tiki:",
                            name: "stock_tiki"
                        },
                        {
                            label: "Price Tiki:",
                            name: "price_tiki"
                        },
                        {
                            label: "Stock Hince:",
                            name: "stock_tiktok_hince"
                        },
                        {
                            label: "Price Hince:",
                            name: "price_tiktok_hince"
                        }
                    ]
                });
                $('#tb_list_item').on('click', 'tbody td:not(:first-child)', function(e) {
                    editor.inline(this, {
                        buttons: {
                            label: '&gt;',
                            fn: function() {
                                this.submit();
                            }
                        }
                    });
                });

                $('#tb_list_item').DataTable({
                    dom: "Bfrtip",
                    pageLength: 50,
                    ajax: {
                        url: "assets/js/connect/server/sv_share_stock_hince.php",
                        type: "POST",
                        data: {
                            "obj_data": obj
                        }
                    },
                    createdRow: function(row, data, dataIndex) {
                        $compile(row)($scope);
                    },
                    columns: [{
                            width: "30px",
                            data: null,
                            defaultContent: '',
                            className: 'select-checkbox',
                            orderable: false
                        },
                        {
                            width: "50px",
                            data: "product_id"

                        },
                        {
                            width: "50px",
                            data: "product_name"

                        },
                        {
                            width: "50px",
                            data: "sku"

                        }, {
                            width: "50px",
                            data: "stock_total"

                        },
                        {
                            width: "50px",
                            data: null,
                            render: function(data, type, row) {
                                var total = parseInt(data['stock_hince_web'])  + parseInt(data['stock_shopee']) + parseInt(data['stock_lazada']) + parseInt(data['stock_tiki']) + parseInt(data['stock_tiktok_hince']);
                                return total;
                            }

                        },
                        {
                            data: "stock_hince_web",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_hince_web",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_shopee",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_shopee",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_lazada",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_lazada",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_tiki",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_tiki",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            data: "stock_tiktok_hince",
                            width: "50px"
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_tiktok_hince",
                            width: "50px",
                            render: $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "tphcm";
                            },
                            "visible": false
                        }

                    ],
                    order: [4, 'desc'],
                    select: {
                        style: 'os',
                        selector: 'td:first-child'
                    },

                    buttons: [


                        {
                            extend: 'collection',
                            text: 'Export',
                            buttons: [
                                'copy',
                                {
                                    extend: 'excel',                                  
                                    title: 'share_stock_hince_TPHCM' + today


                                },
                                {
                                    extend: 'csv',                                    
                                    title: 'share_stock_hince_TPHCM' + today,
                                },
                                'pdf',
                                'print'
                            ]


                        }

                    ],
                    "createdRow": function(row, data, dataIndex) {
                        var sku = data['sku'];
                        var lastchar = sku.substr(sku.length - 2);
                        if (lastchar == '-R') {
                            $(row).css('background-color', 'rgb(205, 224, 247)');
                        }
                    }
                });

                /*     var table = $('#tb_list_item').DataTable();
                     $('#tb_list_item tbody').on( 'click', 'tr', function () {
                          console.log( table.row( this ).data() );
                      } ); */
            } 


        }

        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateShareStock").hide();
                var excelFile,
                    fileReader = new FileReader();

                $("#result").hide();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel = data;
                        //console.log(data_excel);
                        $("#btnUpdateShareStock").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }

            })
        });
        
     /*   $("#btnUpdateShareStock").click(function() {
            $("#btnUpdateShareStock").hide();
            var warehouse = "0";
            var mg_name = getCookie("ck_name");
         //   console.log(data_excel); return;
            if (data_excel.length > 0) {
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_share_stock_by_excel",
                    type: "POST",
                    data: {
                        "warehouse": warehouse,
                        "name_management":mg_name,
                        "data": data_excel                    
                    },
                    success: function(d) {
                         console.log(d);return;
                        $("#btnUpdateShareStock").show();
                        // console.log(d);
                        if (d == "") {
                            //$("#btnNotifyFinish").click();
                            alert("update Succeeded !");

                        } else {
                            alert(d);
                        }
                        var table = $('#tb_list_item').DataTable();
                        table.destroy();
                        load_data($compile, $scope)
                       
                    },
                    error: function(e) {

                    }
                });
                //  console.log(data_excel); 
            }

        });*/
    }
])
        
 //============================END Share stock hince ===========================   
//============================ Stock Check ======================================

App.controller('SMCheckStockCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSMCheckStock");
           
      ///  $("#imgloadchange").hide();
      ///  $("#imgloadsave").hide();
      ///  $("#imgloadborrow").hide();

      ///  $("#btnNotifyFinish").hide();
        $scope.loadData = function() {
            load_data();
        }
        $scope.data_fillter=function(){
             var table = $('#tb_list_item').DataTable();
            table.clear();
            table.destroy(); 
            load_data();
        }
        function load_data() {
    
         
         var html="";
         var warehouse=$("#cboWarehouse").val();
         var brain_name=$("#cboBrandName").val();
        
         if(warehouse=="0"){
           $("#tb_list_item").empty();
            html = '<thead>\
                    <tr style="background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU Hand Carried</th>\
                       <th class="hidden-xs">SKU Regular</th>\
                       <th class="hidden-xs">Hand Carried Stock</th>\
                       <th class="hidden-xs">Regular Stock</th> \
                       <th class="hidden-xs">Total Stock</th>\
                       <th class="hidden-xs">Eglips Website (borrow)</th>\
                    </tr>\
                 </thead>'; 
                $("#tb_list_item").append(html);
          
           
            $obj={"warehouse":warehouse,"brain_name":brain_name};      
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_check_stock",
                type: "POST",
                data:{"obj":$obj},
                success: function(d) {
                //   console.log(d); return;   
                    var data = $.parseJSON(d);                                 
                    // console.log(data);
                    var table = $('#tb_list_item').DataTable({
                        "order": [
                            [5, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 50,
                        data: data,
                        lengthMenu: [
                            [ 50, -1],
                            [ 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data":"product_name"
                            },
                            {
                                "width": "50px",
                                "data":"sku_h"
                            },
                            {
                                "width": "50px",
                                "data":"sku_r"
                            },
                            {
                                "width": "50px",  
                                "data":"stock_total_h"
                            },
                            {
                                "width": "50px",
                                "data":"stock_total_r"
                            },
                            {
                                "width": "50px",                              
                                "data":"stock_total"                               
                            },
                            {
                                "width": "50px",                              
                                "data":"stock_borrow"                               
                            }
                        ]
                    });
                    
                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })     
                
         }else if(warehouse=="1"){
             var table = $('#tb_list_item').DataTable();
            table.clear();
            table.destroy();  
             $("#tb_list_item").empty(); 
            html = '<thead>\
                    <tr style="background-color: #BCBCBC;color: white;">\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">SKU Hand Carried</th>\
                       <th class="hidden-xs">SKU Regular</th>\
                       <th class="hidden-xs">Hand Carried Stock</th>\
                       <th class="hidden-xs">Regular Stock</th> \
                       <th class="hidden-xs">Total Stock</th>\
                       <th class="hidden-xs">Sky007 Website (borrow)</th>\
                    </tr>\
                 </thead>'; 
                $("#tb_list_item").append(html);
                
            $obj={"warehouse":warehouse,"brain_name":brain_name};        
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_check_stock",
                type: "POST",
                data:{"obj":$obj},
                success: function(d) {
                  //  console.log(d);
                    var data = $.parseJSON(d);                                 
                 //    console.log(data_regular);return;
                    var table = $('#tb_list_item').DataTable({
                        "order": [
                            [5, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 50,
                        data: data,
                        lengthMenu: [
                            [ 50, -1],
                            [ 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data":"product_name"
                            },
                            {
                                "width": "50px",
                                "data":"sku_h"
                            },
                            {
                                "width": "50px",
                                "data":"sku_r"
                            },
                            {
                                "width": "50px",  
                                "data":"stock_total_h"
                            },
                            {
                                "width": "50px",
                                "data":"stock_total_r"
                            },
                            {
                                "width": "50px",                              
                                "data":"stock_total"                               
                            },
                            {
                                "width": "50px",                              
                                "data":"stock_borrow"                               
                            }
                        ]
                    });
                    
                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            }) 
         }
         
                
      
           

        }
       
       
    }
]);


//============================ End Stock Check ==================================
//============================ History Stock ======================================

App.controller('SMHistoryStockCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSMDailyStock");
        
        jQuery('.js-datepicker').add('.input-daterange').datepicker({
            weekStart: 1,
            autoclose: true,
            todayHighlight: true
        }); 
        $('.datepicker').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss'
        });

        $("#d_incomming").hide();
        var today = new Date();
        var lastday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        var year = today.getFullYear();
        var month =("0" + (today.getMonth() + 1)).slice(-2);
        var day = ("0" + today.getDate()).slice(-2); 
        var curr = year + "-" + month + "-" + day + " " +"00"+ ":" +"00"+ ":" +"00";
        
        var fyear = lastday.getFullYear();
        var fmonth =("0" + (lastday.getMonth() + 1)).slice(-2);
        var fday = ("0" + lastday.getDate()).slice(-2);       
        var flastday = fyear + "-" + fmonth + "-" + fday + " " +"00"+ ":" +"00"+ ":" +"00";
  
        $("#from_date_picker").val(flastday);
        $("#to_date_picker").val(curr); 
         
        $("#from_date_picker_incomming").val(flastday);
        $("#to_date_picker_incomming").val(curr);   
      //  set_date_time($scope, 7)
        $scope.loadData = function() {
            $.session.remove("list_item_search");
            get_list_product();
        }
        $("#cboWarehouse").change(function(){
            var cboshop =$("#cboWarehouse").val();
            if(cboshop=="0"){
                $("#cboShop").empty();
                var html='<option value="1">Actsone</option>\
                            <option value="2">Jnain(Eglips Website)</option>\
                            <option value="3">Jnain(Lazada Eglips)</option>\
                            <option value="4">Jnain(Watsons)</option>\
                            <option value="5">Jnain(Sendo)</option>';
                $("#cboShop").append(html);
               
            }else if(cboshop=="1"){
                $("#cboShop").empty();
                var html='<option value="6">Jnain</option>\
                            <option value="7">Actsone(Sky007 Website)</option>';
                $("#cboShop").append(html);
              
            } 
        })
        
        function get_list_product() {          
            var table = $('#tb_list_product').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_get_list_product",
                type: "GET",                
                success: function(d) {
                    //console.log(d);return;
                    var data = $.parseJSON(d);
                    // $('#tb_list_product').DataTable().destroy();
                    //table. 

                    var table = $('#tb_list_product').DataTable({
                        /* dom: 'Bfrtip',
                            buttons: [
                                'copy', 'csv', 'excel', 'pdf', 'print'
                            ],*/
                        "order": [
                            [1, "desc"]
                        ],
                        pageLength: 5,
                        data: data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        
                        "columns": [
                        {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];                                   
                                    var view=  full[3] ;        
                                    if(view==0){
                                        var html = '<button class="btn btn-success" ng-click="view_product(\'' + id + '\',\''+view+'\')">Active</button>';
                                    }else{
                                        var html = '<button class="btn btn-info" ng-click="view_product(\'' + id + '\',\''+view+'\')">Disable</button>';
                                    }     
                                    return html;
                                }
                            },{
                                "width": "30px",
                               data: "product_id"
                            },
                            {
                                "width": "100px",
                                data: "product_name"
                                
                            },{
                                "width": "40px",
                               data: "type"
                            },{
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var name = full[1].replace(/"/g, " ");   
                                    var product_type=  full[2] ;                            
                                    var html = '<button class="btn btn-info" ng-click="add_order_html(\'' + id + '\',\'' + name + '\',\''+product_type+'\')">Add</button>';
                                    return html;
                                }
                            }
                        ]
                    });



                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        $("#cboCheck").change(function() {
            var check_value=$("#cboCheck").val();
            var today = new Date();
            var lastday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
            var year = today.getFullYear();
            var month =("0" + (today.getMonth() + 1)).slice(-2);
            var day = ("0" + today.getDate()).slice(-2); 
            var curr = year + "-" + month + "-" + day + " " +"00"+ ":" +"00"+ ":" +"00";
            
            var fyear = lastday.getFullYear();
            var fmonth =("0" + (lastday.getMonth() + 1)).slice(-2);
            var fday = ("0" + lastday.getDate()).slice(-2);       
            var flastday = fyear + "-" + fmonth + "-" + fday + " " +"00"+ ":" +"00"+ ":" +"00";
      
            $("#from_date_picker").val(flastday);
            $("#to_date_picker").val(curr); 
             
            $("#from_date_picker_incomming").val(flastday);
            $("#to_date_picker_incomming").val(curr);
             $.session.remove('list_item_search');
             $("#div_list_item_search").empty();
             $("#div_infor_number_order").empty();
            if(check_value==0){
                $("#d_log_stock").show();
                $("#d_incomming").hide();              
            }else if(check_value==1){
                get_incomming_stock();
                $("#d_log_stock").hide();
                $("#d_incomming").show();
                var table = $('#tb_list_history_item').DataTable();
                table.destroy();
                //table.rows().remove().draw();
            }
        })
        $scope.view_product=function(id,view){
             $data={"id":id,"view":view};
             $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_view_product",
                type: "POST",
                data:{"data":$data},                
                success: function(d) {
                    get_list_product();
                },
                error: function(e) {
                    alert(e);
                }
            });
            
        }
        $scope.add_order_html = function(id, name,product_type) {
            var ss_id = id;
            var flag_duplicate_p_id = true;           
            var strStyle="";
            if(product_type=="Regular"){
                strStyle='style="background-color: #ece5ec;"';
            }
            if (typeof $.session.get('list_item_search') !== 'undefined' && $.session.get('list_item_search') !== null) {
                var arr_list = $.session.get('list_item_search');
                var splitString = arr_list.split(',');
                for (var i = 0; i < splitString.length; i++) {
                    if (id == splitString[i]) {
                        flag_duplicate_p_id = false;
                        break;
                    }
                }
                if (flag_duplicate_p_id == true) {
                    ss_id = $.session.get('list_item_search') + "," + id;
                    $.session.set('list_item_search', ss_id);
                    var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                        <div class="col-md-11">\
                                                            <input '+strStyle+' id="txtItem' + id + '" class="form-control" value="' + name + '" />\
                                                        </div>\
                                                        <div class="col-md-1">\
                                                            <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                        </div>\
                                                       </div>   ';
                    $("#div_list_item_search").append($compile(html)($scope));
                }
            } else {

                $.session.set('list_item_search', ss_id);
                var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                            <div class="col-md-11">\
                                                                <input '+strStyle+' id="txtItem' + id + '" class="form-control" value="' + name + '" />\
                                                            </div>\
                                                            <div class="col-md-1">\
                                                                <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                            </div>\
                                                           </div>   ';
                $("#div_list_item_search").append($compile(html)($scope));


            }
            var arr_list = $.session.get('list_item_search');           

        }
        $scope.delete_item = function(product_id) {
            var arr_list = $.session.get('list_item_search');
            var splitString = arr_list.split(',');
            var arr_order = [];
            for (var i = 0; i < splitString.length; i++) {
                arr_order.push(splitString[i]);
            }
            var index = arr_order.indexOf(product_id);
            if (index != -1) {
                arr_order.splice(index, 1);
            }
            var strss = "";
            for (var i = 0; i < arr_order.length; i++) {
                if (i == 0) {
                    strss += arr_order[i];
                } else {
                    strss = strss + "," + arr_order[i];
                }
            }
            $.session.set('list_item_search', strss);
            $("#div_item" + product_id).remove();
            arr_list = $.session.get('list_item_search');
            if (arr_list.length == 0) {
                $.session.remove('list_item_search');
            }
        }

        function report_line_item() {
            var fromdate = $("#from_date_picker").val();
            var todate = $("#to_date_picker").val();       
          
          //  fromdate = formatDate(fromdate);
           // todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN NaN:NaN:NaN" || todate == "NaN-NaN-NaN NaN:NaN:NaN") {
                alert("Please check date .");
                return;
            }
            var arr_list = $.session.get('list_item_search');
            var warehouse=$("#cboWarehouse").val();
            var shoptype=$("#cboShop").val();

            var table = $('#tb_list_history_item').DataTable();
            table.destroy();

            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "item_list": arr_list,
                "warehouse":warehouse,
                "shoptype":shoptype
            }            
            $("#img_load").show();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_list_daily_stock_item",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                  //  console.log(d); return;
                    var data = $.parseJSON(d);
                    var data_infor=data["data_infor"];
                    var data_log=data["data_log"];
                    var html="";
                    for(var i=0;i<data_infor.length;i++){
                        var product_id=data_infor[i]["product_id"];
                        var product_name=data_infor[i]["product_name"];
                        var order_number=data_infor[i]["order_quantity"];
                        var number_cancel=data_infor[i]["cancel_order"];
                        html+='<div class="col-md-12 text-primary">\
                                <div style="border: 1px solid;" class="col-md-2">'+product_id+'</div>\
                                <div style="border: 1px solid;" class="col-md-4">'+product_name+'</div>\
                                <div style="border: 1px solid;" class="col-md-2">'+order_number+'</div>\
                                <div style="border: 1px solid;" class="col-md-2">'+number_cancel+'</div>\
                            </div>';
                    }
                    $("#div_infor_number_order").empty();
                    $("#div_infor_number_order").append(html);
                   //   console.log(data_infor);


                    var table = $('#tb_list_history_item').DataTable({
                        
                        pageLength: 20,
                        data: data_log,
                        lengthMenu: [
                            [ 20, 50, 100, -1],
                            [ 20, 50, 100, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },                      
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            }

                        ]
                    });
                    $("#img_load").hide();
                },
                error: function(e) {
                    alert(e);
                }
            });


        }

        $scope.daily_fillter = function() {
            //  var html='<table id="tb_list_daily_item" class="table table-bordered table-striped table-hover js-dataTable-full display responsive nowrap" cellspacing="0" width="100%">\
            //                               </table> ';

            //  $("#divGTotalSaleItem").empty();
            //  $("#divGTotalSaleItem").append(html);
            if (typeof $.session.get('list_item_search') !== 'undefined' && $.session.get('list_item_search') !== null) {

                report_line_item();
            } else {
                alert("Please add item for check  report !");
            }

        };
        $scope.daily_fillter_incomming=function (){
            get_incomming_stock();
        }
        function get_incomming_stock(){
            var fromdate = $("#from_date_picker_incomming").val();
            var todate = $("#to_date_picker_incomming").val();       
          
          //  fromdate = formatDate(fromdate);
           // todate = formatDate(todate);
            if (fromdate == "NaN-NaN-NaN NaN:NaN:NaN" || todate == "NaN-NaN-NaN NaN:NaN:NaN") {
                alert("Please check date .");
                return;
            }           
            var warehouse=$("#cboWarehouseIncoming").val();

            var table_i = $('#tb_list_incomingstock').DataTable();
            table_i.destroy();
            var table_b = $('#tb_list_borrow_stock').DataTable();
            table_b.destroy();
            var table_h = $('#tb_list_history_update_stock').DataTable();
            table_h.destroy();

            var obj = {
                "start_date": fromdate,
                "end_date": todate,               
                "warehouse":warehouse
            }        
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_list_incoming_stock",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                  //  console.log(d); return;
                    var data = $.parseJSON(d);
                    var data_i=data["data_incomming"];
                    var data_b=data["data_borrow"];
                    var data_h=data["data_history"];
                 //   console.log(data_i);console.log(data_b);console.log(data_h); return;

                    var table = $('#tb_list_incomingstock').DataTable({
                        
                        pageLength: 20,
                        data: data_i,
                        lengthMenu: [
                            [ 20, 50, 100, -1],
                            [ 20, 50, 100, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },                      
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            }

                        ]
                    }); 
                    
                    var table = $('#tb_list_borrow_stock').DataTable({
                        
                        pageLength: 20,
                        data: data_b,
                        lengthMenu: [
                            [ 20, 50, 100, -1],
                            [ 20, 50, 100, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },                      
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            }

                        ]
                    }); 
                    
                    var table = $('#tb_list_history_update_stock').DataTable({
                        
                        pageLength: 20,
                        data: data_h,
                        lengthMenu: [
                            [ 20, 50, 100, -1],
                            [ 20, 50, 100, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },                      
                        "columns": [{
                                "width": "30px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            }

                        ]
                    });                   
                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        
                                
        
    }
]);
//======================== End History Daily ======================================

 // ======================= stock management shop mall ============================
 
App.controller('SMShopMallCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        var data_excel="";
        var data_excel_divide="";
        checkCookie($scope);
       // limit_permisstion_menu("chkSMCheckStock");       
       $scope.loadData = function() {  
          //   load_product();
       }
       $scope.get_stock_insert_data = function() {  
             var table = $('#tb_list_item').DataTable();
             table.clear();
             table.destroy();
             
             $('#img_load').show(); 
             get_stock_and_insert_new_item();
       }
       function   load_product(){
        $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_get_list_product_mall",
                    type: "GET", 
                    success: function(d) {    
                        $('#img_load').hide();
                        var data = $.parseJSON(d); 
                        var table = $('#tb_list_item').DataTable({ 
                                            "order": [
                                                [0, "desc"]
                                            ],
                                                
                                            dom: 'Bfrtip',
                                            buttons: [
                                                'copy', 'csv', 'excel', 'pdf', 'print'
                                            ],
                                            pageLength: 5,
                                            data: data,
                                            lengthMenu: [
                                                [5, 20, 30, 50, -1],
                                                [5, 20, 30, 50, "ALL"] 
                                            ],
                                            createdRow: function(row, data, dataIndex) {
                                                $compile(row)($scope);
                                            },
                                            "columns": [
                                                {
                                                    "width": "40px",
                                                    "data": "product_name"
                                                },{
                                                    "width": "110px",
                                                    "render": function(data, type, full, meta) {    
                                                        var item_id=full["item_id"];
                                                        return "<span class='text'>"+item_id+"</span>";
                                                     }
                                                   // "data": "item_id"
                                                },
                                                {
                                                    "width": "20",
                                                    "data": "sku"
                                                },
                                                {
                                                    "width": "10px",
                                                    "render": function(data, type, full, meta) {                                                      
                                                        return "";
                                                     }
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "price"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "variation_name"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "variation_id"
                                                },
                                                {
                                                    "width": "20",
                                                    "data": "variation_sku"
                                                },
                                                {
                                                    "width": "10px",
                                                    "render": function(data, type, full, meta) {                                                      
                                                        return "";
                                                     }
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "variation_price"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "product_type"
                                                }, {
                                                    "width": "10px",
                                                    "render": function(data, type, full, meta) {                                                      
                                                        return "";
                                                     }
                                                }, {
                                                    "width": "10px",
                                                    "render": function(data, type, full, meta) {
                                                        return "";
                                                    },
                                                    "visible": false
                                                }, {
                                                    "width": "10px",
                                                    "render": function(data, type, full, meta) {
                                                        return "";
                                                    },
                                                    "visible": false
                                                }]   
                                              
                                        }); 
                    },
                    error: function(e){
                        
                    }
            })
       }      
      
       function get_stock_and_insert_new_item(){
          //  var shopmall=$("#cboBrandName").val();
           
            $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_get_stock_list_product_mall_and_insert_newitems",
                    type: "GET",
                    success: function(d) {   
                  //      console.log(d); return;
                        var data = $.parseJSON(d); 
                        $('#img_load').hide();
                        var table = $('#tb_list_item').DataTable({ 
                                            "order": [
                                                [0, "desc"]
                                            ],
                                                
                                            dom: 'Bfrtip',
                                            buttons: [
                                                'copy', 'csv', 'excel', 'pdf', 'print'
                                            ],
                                            pageLength: 5,
                                            data: data,
                                            lengthMenu: [
                                                [5, 20, 30, 50, -1],
                                                [5, 20, 30, 50, "ALL"] 
                                            ],
                                            createdRow: function(row, data, dataIndex) {
                                                $compile(row)($scope);
                                            },
                                            "columns": [
                                                {
                                                    "width": "40px",
                                                    "data": "name"
                                                },{
                                                    "width": "10px",
                                                    "data": "item_id"
                                                },
                                                {
                                                    "width": "20",
                                                    "data": "item_sku"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "stock"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "price"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "variation_name"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "variation_id"
                                                },
                                                {
                                                    "width": "20",
                                                    "data": "variation_sku"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "variation_stock"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "variation_price"
                                                },
                                                {
                                                    "width": "10px",
                                                    "data": "product_type"
                                                }, {
                                                    "width": "10px",
                                                    "data": "status"
                                                }, {
                                                    "width": "10px",
                                                    "render": function(data, type, full, meta) {
                                                        return "";
                                                    },
                                                    "visible": false
                                                }, {
                                                    "width": "10px",
                                                    "render": function(data, type, full, meta) {
                                                        return "";
                                                    },
                                                    "visible": false
                                                }]   
                                              
                                        }); 
                    },
                    error: function(e){
                        alert("Can't get stock , Server execute time .")
                        console.log(e);
                    }
            })
       }
       //---------------------------------Update stock for shopee --------------------------------------
        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateStock").hide();
                var excelFile,
                    fileReader = new FileReader();

                $("#result").hide();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] =cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel = data;
                  //      console.log(data_excel);
                        $("#btnUpdateStock").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }

            })
        });
        $("#btnUpdateStock").click(function(){          
            if(data_excel.length>0){
                flat_check_file=0;               
                $variation_id=data_excel[0]["VariationID"];
                $stock_insert=data_excel[0]["stock_insert"];
                $ItemID=data_excel[0]["ItemID"];
                $product_type=data_excel[0]["ProductType"];
              //  console.log($stock_insert);
                if(typeof($variation_id) === "undefined" || typeof($stock_insert) === "undefined" || typeof($ItemID) === "undefined"|| typeof($product_type) === "undefined"){
                 flat_check_file=1;
                }
                if(flat_check_file==0){
                    $.ajax({
                        url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_shopee",
                        type: "POST",                                     
                        data: {"data_insert":data_excel},
                        success: function(d) {
                            console.log(d);
                        },error: function(e){
                            console.log(e);
                        }
                    })
                }else{
                    alert("You update wrong file .");
                }
                
               
                
            }else{
                alert("Please check File excel again .");
            }
             
         
           
        })
        //---------------------------------End Update stock for shopee --------------------------------------
        $("#input_divide_stock").on("change", function() {
                $("#btnDivideStock").hide();
                var excelFile,
                    fileReader = new FileReader();

                $("#result").hide();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] =cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel_divide = data;
                       // console.log(data_excel);
                        $("#btnDivideStock").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }          
        });
        $("#btnDivideStock").click(function(){   
            if(data_excel_divide.length>0){
                var obj_data_insert=[];      
                var flat_check_file=0;    
                for(var i=0;i<data_excel_divide.length;i++){
                  var  Itemsku = data_excel_divide[i]["SKU"];
                  var StockInsert = data_excel_divide[i]["stock_shopee"];
                  if(typeof(Itemsku) === "undefined" || typeof(StockInsert) === "undefined"){
                    flat_check_file=1;break;
                  }
                  var product_id=data_excel_divide[i]["item_id"];    
                  var obj={"Itemsku":Itemsku,"StockInsert":StockInsert,"product_id":product_id} ;  
                  if(StockInsert!="") {
                    obj_data_insert.push(obj);
                  }   
                }
                if(flat_check_file==0){
                    $('#img_load').show();
                    $("#txtError").val("");
                    var table = $('#tb_list_item').DataTable();
                    table.clear();
                    table.destroy();
                    $.ajax({
                            url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_auto_divide_stock_shopee",
                            type: "POST",                                     
                            data: {"obj":obj_data_insert},
                            success: function(d) {
                         //       console.log(d);
                                var data_obj = $.parseJSON(d);
                                var str_error=data_obj["str_err"];
                                var data=data_obj["data"];                                                             
                                $("#txtError").val(str_error);
                                $('#img_load').hide();
                                var table = $('#tb_list_item').DataTable({ 
                                    "order": [
                                        [0, "desc"]
                                    ],
                                        
                                    dom: 'Bfrtip',
                                    buttons: [
                                        'copy', 'csv', 'excel', 'pdf', 'print'
                                    ],
                                    pageLength: 5,
                                    data: data,
                                    lengthMenu: [
                                        [5, 20, 30, 50, -1],
                                        [5, 20, 30, 50, "ALL"] 
                                    ],
                                    createdRow: function(row, data, dataIndex) {
                                        $compile(row)($scope);
                                    },
                                    "columns": [
                                        {
                                            "width": "40px",
                                            "data": "product_name"
                                        },{
                                            "width": "10px",
                                            "data": "item_id"
                                        },
                                        {
                                            "width": "20",
                                            "data": "sku"
                                        },
                                        {
                                            "width": "10px",
                                            "render": function(data, type, full, meta) {
                                                return "";
                                            },
                                        },
                                        {
                                            "width": "10px",
                                            "data": "price"
                                        },
                                        {
                                            "width": "10px",
                                            "data": "variation_name"
                                        },
                                        {
                                            "width": "10px",
                                            "data": "variation_id"
                                        },
                                        {
                                            "width": "20",
                                            "data": "variation_sku"
                                        },
                                        {
                                            "width": "10px",
                                            "render": function(data, type, full, meta) {
                                                return "";
                                            },
                                        },
                                        {
                                            "width": "10px",
                                            "data": "variation_price"
                                        },
                                        {
                                            "width": "10px",
                                            "data": "product_type"
                                        }, {
                                            "width": "10px",
                                           "render": function(data, type, full, meta) {
                                                return "";
                                            },
                                        }, {
                                            "width": "10px",
                                            "data": "stock_insert"
                                        }, {
                                            "width": "10px",
                                           "data": "stock_variation_insert"
                                        }]   
                                      
                                }); 
                            },
                            error: function(e) {
                                console.log(e);
                            }
                 
                    })
                }else{
                    alert("You update wrong file .")
                }
                
            }else{
                alert("Please check file excel again .");
            }
            
         })
       //---------------------------------Divide stock for shopee -------------------------------------------
       
       //---------------------------------END Divide stock for shopee ---------------------------------------
    }
])
        
//============================ END Share management shop mall======================

//====================== End Stock Management =============================================================================

//====================== Setting ==========================================================================================

//============================ Setting Combo ===========================

App.controller('SsettingcomboCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
         limit_permisstion_menu("chkSsettingcombo");
         $.session.remove("list_detail_combo");
         $("#imgLoadList").hide();       
         $("#div_list_detail_combo").hide();
            
        
        
        $scope.loadData = function() {
            load_list_combo();
            load_list_item();           
        }
        
        
        function load_list_combo() {           
 
                     
            var table = $('#tb_list_combo_shop').DataTable();
                table.destroy();            
                $("#imgSave").hide();
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_get_list_combo",
                    type: "GET",                  
                    async: false,
                    success: function(d) {
                        var data = $.parseJSON(d);
                    //    console.log(d);   return; 
                        
                        var table = $('#tb_list_combo_shop').DataTable({ 
                            "order": [
                                [0, "desc"]
                            ],
                                
                            dom: 'Bfrtip',
                            buttons: [
                                'copy', 'csv', 'excel', 'pdf', 'print'
                            ],
                            pageLength: 30,
                            data: data,
                            lengthMenu: [
                                [5, 20, 30, 50, -1],
                                [5, 20, 30, 50, "ALL"] 
                            ],
                            createdRow: function(row, data, dataIndex) {
                                $compile(row)($scope);
                            },
                            "columns": [{
                                    "width": "10px",
                                    "data": "product_id"
                                },
                                {
                                    "width": "40px",
                                    "data": "product_name"
                                },
                                {
                                    "width": "20",
                                    "data": "sku"
                                },
                                {
                                    "width": "10px",
                                    "data": "price_shopee"
                                },
                                {
                                    "width": "10px",
                                    "data": "stock_shopee"
                                }, {
                                    "width": "10px",
                                    "data": "stock_lazada"
                                }, {
                                    "width": "10px",
                                    "data": "stock_tiki"
                                }, {
                                    "width": "30px",
                                    "data": "variation_combo"
                                }, {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                        var html = "";
                                        var id = full["product_id"];
                                        var product_name=full["product_name"];   
                                        var price=full["price_shopee"]; 
                                        product_name=product_name.replace(/['"]+/g, '');  //remove "  
                                        if (id != null) {
                                           
                                            var html = '<button class="btn btn-danger" ng-click="update_combo(\'' + id + '\',\'' + product_name + '\',\'' + price + '\')">Update</button>';
    
                                        }
                                        return html;
                                    }
                                }, {
                                    "width": "10px",
                                    "data": "s_connection"
                                }] 
                                 
                              
                        });   
                        $("#tb_list_combo_shop tbody tr").on('click',function(event) {
                    		$("#tb_list_combo_shop tbody tr").removeClass('row_selected');		
                    		$(this).addClass('row_selected');
                    	});                 
                    },
                    error: function(e) {
                        alert(e);
                    }
                });
        }  
        function load_list_item(){
            var table = $('#tb_list_product').DataTable();
            table.destroy();            
              
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_get_list_item",
                 
                type: "get",             
                async: false,
                success: function(d) {
                   // console.log(d);
                    var data = $.parseJSON(d);
                    var obj_arr_item=[]; 
                    var arr_regular=[];
                    var arr_hand=[]
                    for(var i=0;i<data.length;i++){
                        if(data[i]["product_type"]==0){
                           arr_hand.push (data[i]);
                        }else if(data[i]["product_type"]==1){
                            arr_regular.push (data[i]);
                        }
                    }
                  //  obj_arr_item=arr_hand ;
                    for(var i=0;i<arr_hand.length;i++){
                        var product_name=arr_hand[i]["product_name"];
                        var product_id=arr_hand[i]["product_id"];
                        var sku=arr_hand[i]["sku"];
                        var product_price=arr_hand[i]["price_web"];                         
                        var obj={"product_name":product_name,"price":product_price,"sku_h":sku,"sku_r":"","product_id_h":product_id,"product_id_r":""};
                        obj_arr_item.push(obj);
                        
                    }              
                                    
                   for(var i=0;i<arr_regular.length;i++){
                    var flat_check_exist_item=0;
                    var name_product_r=arr_regular[i]["product_name"];
                    var sku=arr_regular[i]["sku"];
                    var product_id=arr_regular[i]["product_id"];
                    var product_price=arr_regular[i]["price_web"];
                    var obj={"product_name":name_product_r,"price":product_price,"sku_h":"","sku_r":sku,"product_id_h":"","product_id_r":product_id};
                    for(var j=0;j<obj_arr_item.length;j++){
                        var name_product_h=obj_arr_item[j]["product_name"];
                       
                        if(name_product_h==name_product_r){
                            flat_check_exist_item=1;
                            obj_arr_item[j]["sku_r"]=sku;
                            obj_arr_item[j]["product_id_r"]=product_id;                        
                            break;
                        }
                    }
                    if(flat_check_exist_item==0){
                       obj_arr_item.push(obj);  
                    }
                  }
              //   console.log(obj_arr_item) ; return;
                //--------------table --------------------------------------------------------//
                var table = $('#tb_list_product').DataTable({ 
                            "order": [
                                [0, "desc"]
                            ],
                            pageLength: 5,
                            data: obj_arr_item,
                            lengthMenu: [
                                [5, 20, 30, 50, -1],
                                [5, 20, 30, 50, "ALL"] 
                            ],
                            createdRow: function(row, data, dataIndex) {
                                $compile(row)($scope);
                            },
                            "columns": [{
                                    "width": "10px",
                                    "data": "product_name"
                                },
                                {
                                    "width": "30px",
                                    "data": "price"
                                }, {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                        var html = "";
                                        var id = full["product_id_h"];
                                        var sku= full["sku_h"];
                                        var price=full["price"];
                                        var product_name=full["product_name"];   
                                        product_name=product_name.replace(/['"]+/g, '');  //remove "                                                                           
                                        if (id != "") {                                           
                                         var html = '<button class="btn btn-primary" ng-click="add_detail_combo(\'' + id + '\',\'' + sku + '\',\'' + price + '\',\'' + product_name + '\',0)">Add Handcarry</button>';
                                        //id,sku, price, name,product_type
                                        }
                                        return html;
                                    }
                                }, {
                                    "width": "10px",
                                    "render": function(data, type, full, meta) {
                                        //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                        var html = "";
                                        var id = full["product_id_r"];
                                        var sku= full["sku_r"];
                                        var price=full["price"];
                                        var product_name=full["product_name"];  
                                         product_name=product_name.replace(/['"]+/g, '');         //remove "                                                                             
                                        if (id != "") {                                           
                                           var html = '<button class="btn btn-danger" ng-click="add_detail_combo(\'' + id + '\',\'' + sku + '\',\'' + price + '\',\'' + product_name + '\',1)">Add Regular</button>';
    
                                        }
                                        return html;
                                    }
                                }]   
                              
                        });
                //--------------end table ---------------------------------------------------//
                //    console.log(obj_arr_item);
                },
                error: function(e) {
                        alert(e);
               }
        })
    }
        
      
        $scope.add_detail_combo= function(id,sku, price, name,product_type) { //product_type 0: not vat , 1: vat            
            var total_price = 0;
            var ss_id = id;
            var color_vat="";
            if(product_type=="1"){
                color_vat="background-color: #74f594;";
            }         
          
            var flag_duplicate_p_id = false;
            if (typeof $.session.get('list_detail_combo') !== 'undefined' && $.session.get('list_detail_combo') !== null) {
                var arr_list = $.session.get('list_detail_combo');
                var splitString = arr_list.split(',');
                for (var i = 0; i < splitString.length; i++) {
                    if (id == splitString[i]) {
                        flag_duplicate_p_id = true;
                        break;
                    }
                }
                if (flag_duplicate_p_id == false ) {          
                    ss_id = $.session.get('list_detail_combo') + "," + id;
                    $.session.set('list_detail_combo', ss_id);
                    var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                        <div class="col-md-6">\
                                                            <span style="'+color_vat+'"  id="txtItem' + id + '" sku='+sku+' product_type='+product_type+'> '+ name +' </span>\
                                                        </div>\
                                                        <div class="col-md-3">\
                                                            <input style="'+color_vat+'" id="txtPriceItem' + id + '" class="form-control" value="' + price + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  />\
                                                        </div>\
                                                        <div class="col-md-2">\
                                                            <input style="'+color_vat+'" id="txtQuantityItem' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57" />\
                                                        </div>\
                                                        <div class="col-md-1">\
                                                            <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                        </div>\
                                                       </div>   ';
                    $("#div_list_order").append($compile(html)($scope));
                }
            } else {
                        
                    $.session.set('list_detail_combo', ss_id);
                    var html = '<div id="div_item' + id + '" class="col-md-12 form-group">\
                                                            <div class="col-md-6">\
                                                                <span style="'+color_vat+'"  id="txtItem' + id + '" sku='+sku+' product_type='+product_type+' >'+name+'</span>\
                                                            </div>\
                                                            <div class="col-md-3">\
                                                                <input style="'+color_vat+'" id="txtPriceItem' + id + '" class="form-control" value="' + price + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  />\
                                                            </div>\
                                                            <div class="col-md-2">\
                                                                <input style="'+color_vat+'" id="txtQuantityItem' + id + '" class="form-control" value="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"  />\
                                                            </div>\
                                                            <div class="col-md-1">\
                                                                <button class="btn btn-danger" ng-click="delete_item(\'' + id + '\')">X</button>\
                                                            </div>\
                                                           </div>   ';                
                      $("#div_list_order").append($compile(html)($scope));
               
        
            }
             
        
        }
         $scope.delete_item=function(product_id) {
            var arr_list = $.session.get('list_detail_combo');
            // arr_list= arr_list.replace(new RegExp(product_id + ',?'), '');
            var splitString = arr_list.split(',');
            var arr_order = [];
            for (var i = 0; i < splitString.length; i++) {
                arr_order.push(splitString[i]);
            }
            var index = arr_order.indexOf(product_id);
            if (index != -1) {
                arr_order.splice(index, 1);
            }
            var strss = "";
            for (var i = 0; i < arr_order.length; i++) {
                if (i == 0) {
                    strss += arr_order[i];
                } else {
                    strss = strss + "," + arr_order[i];
                }
            }
            $.session.set('list_detail_combo', strss);
            $("#div_item" + product_id).remove();
            arr_list = $.session.get('list_detail_combo');
            if (arr_list.length == 0) {
                $.session.remove('list_detail_combo');
            }
            console.log(arr_list);
        }
        function clear_input() {
          //  $("#txtItemName").val("");            
            $("#lblCBname").attr("combo_id","");           
        //    $("#txtItemName").attr("shoptype","");
            $("#lblCBname").empty();  
            $("#lblPrice").empty();  
            $("#txtDetailCombo").val("");       
            $("#div_list_detail_combo").hide(); 
            $("#div_list_order").empty(); 
        
             var table = $('#tb_list_combo_shop').DataTable().search("").draw();                                 
              

            if (typeof $.session.get('list_detail_combo') !== 'undefined' && $.session.get('list_detail_combo') !== null) {
                $.session.remove('list_detail_combo');
            }
           
        }
         function clear_input_without_reload() {
          //  $("#txtItemName").val("");            
            $("#lblCBname").attr("combo_id","");           
        //    $("#txtItemName").attr("shoptype","");
            $("#lblCBname").empty();  
            $("#lblPrice").empty();  
            $("#txtDetailCombo").val("");       
            $("#div_list_detail_combo").hide(); 
            $("#div_list_order").empty(); 
        
           //  var table = $('#tb_list_combo_shop').DataTable().search("").draw();                                 
              

            if (typeof $.session.get('list_detail_combo') !== 'undefined' && $.session.get('list_detail_combo') !== null) {
                $.session.remove('list_detail_combo');
            }
           
        }
        $scope.update_combo = function(product_id,product_name,price) {   
         //   clear_input();
            clear_input_without_reload();
            $("#imgLoadList").show();          
            $("#lblCBname").append(product_name);
            $("#lblPrice").append(price);
            $("#lblCBname").attr("combo_id",product_id);
          
            
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_get_list_detail_combo",                 
                type: "POST",
                data: {
                        "product_id": product_id
                },            
                success: function(d) {
                    
                    var data = $.parseJSON(d);  
                    load_detail_combo(data);
                    $("#txtDetailCombo").focus();
                
                },
                error: function(e) {
                    alert(e);
                }

            });
            
            
        }
      function load_detail_combo(data){
         var text_variation=data[0]["variation_combo"];
         var obj_combo=data[0]["obj_combo"]; 
         if(obj_combo.length>0){
             add_information_item(obj_combo);    
         }                    
         $("#imgLoadList").hide(); 
         $("#txtDetailCombo").val(text_variation);
         $("#div_list_detail_combo").show();
         
         
               
      }
      function add_information_item(data_item){
            //console.log(data_item);
            var html="";
            var ss_id="";  
            for(var i=0;i<data_item.length;i++){
               
              //  ss_id=
                var id=data_item[i]["product_id"];
                if(i==0){
                   ss_id= id;
                }else{
                    ss_id=ss_id+","+id;
                }
                var name=data_item[i]["product_name"];
                var price=parseInt(data_item[i]["price"]);
                var quantity=parseInt(data_item[i]["quantity"]);    
                var product_type=data_item[i]["product_type"] ;
                var sku=data_item[i]["sku"] ;
              //  console.log(product_type);
                var color_vat="";
                if(product_type=="1"){
                    color_vat="background-color: #74f594;";
                }
               
                
                html+='<div id="div_item'+id+'" class="col-md-12 form-group">\
                        <div class="col-md-6">\
                            <span style="'+color_vat+'"  id="txtItem' + id + '" sku='+sku+' product_type='+product_type+' >'+name+'</span>\
                        </div>\
                        <div class="col-md-3">\
                            <input style="'+color_vat+'" id="txtPriceItem'+id+'" class="form-control" value="'+price+'" onkeypress="return event.charCode >= 48 && event.charCode <= 57"/>\
                        </div>\
                        <div class="col-md-2">\
                            <input style="'+color_vat+'" id="txtQuantityItem'+id+'" class="form-control" value="'+quantity+'" onkeypress="return event.charCode >= 48 && event.charCode <= 57"/>\
                        </div>\
                        <div class="col-md-1">\
                            <button class="btn btn-danger" ng-click="delete_item(\''+id+'\')">X</button>\
                        </div>\
                       </div>   ';        
            }
            $.session.set('list_detail_combo',ss_id) ;
           // console.log(flatcheck_item);
            $("#div_list_order").append($compile(html)($scope));             
        }
       $("#btnSaveUpdate").click(function(){
            $("#imgSave").show();
            $("#btnSaveUpdate").hide();
            var arr_list_id_order = $.session.get('list_detail_combo');         
            var object_combo = []; //list update event marketing
            var splitString = arr_list_id_order.split(',');         
            var combo_id =  $("#lblCBname").attr("combo_id");
            var text_detail= $("#txtDetailCombo").val();
          
            for (var i = 0; i < splitString.length; i++) {
                var product_id = splitString[i];
                var product_name=$("#txtItem" + product_id).text();
                var quantity = $("#txtQuantityItem" + product_id).val();
                var price_item = $("#txtPriceItem" + product_id).val();
                var sku = $("#txtItem" + product_id).attr("sku");                       
                var product_type=$("#txtItem" + product_id).attr("product_type");           
                if (quantity > 0) {
                   
                    var item_order = {
                        "product_id": product_id,
                        "product_name": product_name,
                        "quantity": quantity,
                        "price": price_item,
                        "sku":sku,
                        "product_type":product_type                        
                    };                   
                    object_combo.push(item_order);
                } else {
                    alert("quantity >0 !");
                    $("#txtQuantityItem" + product_id).focus();
                    return;
                }
            }
          //  console.log(object_combo);
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_update_detail_combo",                 
                type: "POST",
                data: {
                        "combo_id": combo_id,
                        "obj": object_combo,
                        "text_detail":text_detail
                },              
                success: function(d) {
                    alert("update finished.")   
                    $("#div_list_detail_combo").hide();  
                    $("#btnSaveUpdate").show();
                    load_list_combo();
                    clear_input();               
                  //  console.log(d);
                },
                error: function(e) {
                    alert(e);
                }

            });
       })
      
       
    }
]);
//======================== End Setting combo ====================================================
//============================ Setting Tiki ===========================

App.controller('SsettingtikiCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
      //  limit_permisstion_menu("chkSsettingtiki");      
        
        $scope.loadData = function() {
          
                 
        }
    }
])
        
 //============================END Setting Tiki ===========================    
//======================== Setting Flash sale ===================================================

App.controller('SEventflashsaleCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        var data_excel="";
        limit_permisstion_menu("chkSEventFlashSale");      
        $scope.loadData = function() {
            get_list_product();
            loaddata_event();
        }

        function get_list_product() {
            //alert(123);
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_SETTING_get_product_sky007vn",
                type: "GET",                
                success: function(d) {
                   //  console.log(d);return;
                    var data = $.parseJSON(d);
                    var table = $('#tb_list_item').DataTable();
                    table.destroy();

                    var table = $('#tb_list_item').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 5,
                        data: data,
                        dom: 'Bfrtip',
                            buttons: [
                                'copy', 'csv', 'excel', 'pdf', 'print'
                            ],
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "id"
                            },{
                                "width": "30px",
                                "data": "sku"
                            },{
                                "width": "30px",
                                "data": "product_name"
                            },
                            {
                                "width": "50px",
                                "data": "sale_price"
                            },
                            {
                                "width": "50px",
                                "data": "stock"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var sku = full["sku"];
                                    var name = full["product_name"].replace(/"/g, " ");
                                    var price = full["sale_price"];
                                    var stock = full["stock"];
                                    var html = '<button class="btn btn-info" ng-click="add_event_html(\'' + id + '\',\'' + sku + '\',\'' + price + '\',\'' + name + '\')">Add</button>';
                                    return html;
                                }
                            }
                        ]
                    });



                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        
        $scope.add_event_html = function(id,sku, price, name) {
            var obj = {
                "item_id": id,
                "sku":sku,
                "item_price": price,
                "product_name": name,
                "shop_type": 0 // 0 :sky007vn ; 1:eglipsvn ; 2: mixsoon 
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_sale_of_insert_flash_sale",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    //console.log(d);return;
                    var table = $('#tb_list_event_flash_sale').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                    loaddata_event();
                },
                error: function(e) {
                    alert(e);
                }

            });
            // console.log(id+'_'+name+'_'+stock);

        }

        function loaddata_event() {
            editor = new $.fn.dataTable.Editor({
                ajax: "assets/js/connect/server/sv_setting_flash_sale.php",
                table: "#tb_list_event_flash_sale",
                fields: [{
                    label: "Price Sale Of:",
                    name: "sale_price"
                }, {
                    label: "Normal Sale:",
                    name: "original_price"
                }, {
                    label: "Start Time:",
                    name: "start_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'
                }, {
                    label: "End Time:",
                    name: "end_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'

                }]
            });

            // Activate an inline edit on click of a table cell
            $('#tb_list_event_flash_sale').on('click', 'tbody td:not(:first-child)', function(e) {
                editor.inline(this, {
                    buttons: {
                        label: '&gt;',
                        fn: function() {
                            this.submit();
                        }
                    }
                });
            });


           $('#tb_list_event_flash_sale').DataTable({
                dom: "Bfrtip",
                ajax: "assets/js/connect/server/sv_setting_flash_sale.php",
                order: [
                    [8, 'asc']
                ],
                columns: [{
                        data: null,
                        defaultContent: '',
                        className: 'select-checkbox',
                        orderable: false
                    },
                    {
                        data: "item_id"

                        //width: "20px"
                    },{
                        data: "sku"

                        //width: "20px"
                    }, {
                        data: "item_name"

                        //width: "20px"
                    }, {
                        data: "sale_price"
                        //	width: "100px"
                    }, {
                        data: "original_price"
                        //	width: "20"
                    }, {
                        data: "start_time"
                    }, {
                        data: "end_time"
                    },{
                        data: "status",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "waiting";
                            } else if (val == 1) {
                                html = "Inprogress";
                            }
                            return html;
                        }
                    }
                ],
                select: {
                    style: 'os',
                    selector: 'td:first-child'
                },
                buttons: [{
                        extend: "edit",
                        editor: editor
                    },
                    {
                        extend: "remove",
                        editor: editor
                    }
                ]
            });
        }
        $("#btnUpdateFlashSale").click(function(){
            var check_file=check_file_excel_flash(data_excel);
            if(check_file==0){
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_flash_sale_excel_insert",                 
                    type: "POST",
                    data: {
                            "obj": data_excel,
                            "shop_type": 0 // 0:sky007 , 1:eglips, 2 mixsoon
                    },              
                    success: function(d) {
                        console.log(d)
                    alert("Insert finished.");  
                    var table = $('#tb_list_event_flash_sale').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                        loaddata_event() ;                         
                    },
                    error: function(e) {
                       
                        alert(e);
                    }
    
                });
            }
        })
        function check_file_excel_flash(data){
            var item_id="";
            var item_name="";
            var sku="";
            var sale_price="";
            var original_price="";
            var start_time="";
            var end_time="";
            var flag=0;
            if(data.length==0){
                flag=1;
            }else{
               for(var i=0 ; i<data.length;i++){
                    item_id=data[i]["item_id"];
                    item_name=data[i]["item_name"];
                    sku=data[i]["sku"];
                    sale_price=data[i]["sale_price"];
                    original_price=data[i]["original_price"];
                    start_time=data[i]["start_time"];
                    end_time=data[i]["end_time"];
                    if(item_id=="" && item_name=="" && sku=="" && sale_price=="" && original_price=="" && start_time=="" && end_time==""){
                        alert("File is Wrong format.");
                        flag=1;
                        break;
                    }
                } 
            }
            
            return flag;
        }
        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateFlashSale").hide();
                var excelFile,
                    fileReader = new FileReader();
            
                $("#result").hide();
            
                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);
            
                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;
            
                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }
            
                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }
            
                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);
            
                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }
            
                            data.push(newRow);
            
                        }
                        data_excel = data;
                        console.log(data_excel);
                        $("#btnUpdateFlashSale").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array
            
                    }, function(error) {
            
                    });
                }
            
                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {
            
                    }
                }
            
            })
            });
    }
    
]);


//======================== End Setting Flash sale ===============================================

//======================== Setting Flash sale eglips===================================================

App.controller('SEventflashsaleeglipsvnCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        var data_excel="";
     //   limit_permisstion_menu("chkSEventFlashSale");      
        $scope.loadData = function() {
            get_list_product();
            loaddata_event();
        }

        function get_list_product() {
            //alert(123);
          var shoptype=1 ; // 0 :sky007vn ; 1:eglips ; 2:mixsoon 
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_get_list_product",
                type: "POST",
                data: {
                    "shoptype": shoptype,                   
                },              
                success: function(d) {
                   //  console.log(d);return;
                    var data = $.parseJSON(d);
                    var table = $('#tb_list_item').DataTable();
                    table.destroy();

                    var table = $('#tb_list_item').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 5,
                        data: data,
                        dom: 'Bfrtip',
                            buttons: [
                                'copy', 'csv', 'excel', 'pdf', 'print'
                            ],
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "id"
                            },
                            {
                                "width": "50px",
                                "data": "product_name"
                            },
                            {
                                "width": "50px",
                                "data": "sku"
                            },
                            {
                                "width": "50px",
                                "data": "sale_price"
                            }, {
                                "width": "50px",
                                "data": "stock"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var name = full["product_name"].replace(/"/g, " ");
                                    name =name.replace(/'/g, '');
                                    var price = full["sale_price"];
                                    var stock = full["stock"];
                                    var sku = full["sku"];
                                    var html = '<button class="btn btn-info" ng-click="add_event_html(\'' + id + '\',\'' + price + '\',\'' + name + '\',\'' + sku + '\')">Add</button>';
                                    return html;
                                }
                            }
                       
                        ]
                    });



                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        
        $scope.add_event_html = function(id, price, name, sku) {
            var obj = {
                "item_id": id,
                "sku":sku,
                "item_price": price,
                "product_name": name,
                "shop_type": 1 // 0 :sky007vn ; 1:eglipsvn ; 2: mixsoon
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_sale_of_insert_flash_sale",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    //console.log(d);return;
                    var table = $('#tb_list_event_flash_sale').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                    loaddata_event();
                },
                error: function(e) {
                    alert(e);
                }

            });
          //   console.log(obj);

        }

        function loaddata_event() {
            editor = new $.fn.dataTable.Editor({
                ajax: "assets/js/connect/server/sv_setting_flash_sale_eglips.php",
                table: "#tb_list_event_flash_sale",
                fields: [{
                    label: "Price Sale Of:",
                    name: "sale_price"
                }, {
                    label: "Normal Sale:",
                    name: "original_price"
                }, {
                    label: "Start Time:",
                    name: "start_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'
                }, {
                    label: "End Time:",
                    name: "end_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'

                }]
            });

            // Activate an inline edit on click of a table cell
            $('#tb_list_event_flash_sale').on('click', 'tbody td:not(:first-child)', function(e) {
                editor.inline(this, {
                    buttons: {
                        label: '&gt;',
                        fn: function() {
                            this.submit();
                        }
                    }
                });
            });


           $('#tb_list_event_flash_sale').DataTable({
                dom: "Bfrtip",
                ajax: "assets/js/connect/server/sv_setting_flash_sale_eglips.php",
                order: [
                    [8, 'asc']
                ],
                columns: [{
                        data: null,
                        defaultContent: '',
                        className: 'select-checkbox',
                        orderable: false
                    },
                    {
                        data: "item_id"

                        //width: "20px"
                    },{
                        data: "sku"

                        //width: "20px"
                    }, {
                        data: "item_name"

                        //width: "20px"
                    }, {
                        data: "sale_price"
                        //	width: "100px"
                    }, {
                        data: "original_price"
                        //	width: "20"
                    }, {
                        data: "start_time"
                    }, {
                        data: "end_time"
                    },{
                        data: "status",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "waiting";
                            } else if (val == 1) {
                                html = "Inprogress";
                            }
                            return html;
                        }
                    }
                ],
                select: {
                    style: 'os',
                    selector: 'td:first-child'
                },
                buttons: [{
                        extend: "edit",
                        editor: editor
                    },
                    {
                        extend: "remove",
                        editor: editor
                    }
                ]
            });
        }
        $("#btnUpdateFlashSale").click(function(){
            var check_file=check_file_excel_flash(data_excel);
            if(check_file==0){
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_flash_sale_excel_insert",                 
                    type: "POST",
                    data: {
                            "obj": data_excel,
                            "shop_type": 1 //0: sky007vn ; 1: eglipsvn ; 2: mixsoonvn
                    },              
                    success: function(d) {
                        console.log(d)
                    alert("Insert finished.");  
                    var table = $('#tb_list_event_flash_sale').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                        loaddata_event() ;                         
                    },
                    error: function(e) {
                       
                        alert(e);
                    }
    
                });
            }
        })
        function check_file_excel_flash(data){
            var item_id="";
            var item_name="";
            var sku="";
            var sale_price="";
            var original_price="";
            var start_time="";
            var end_time="";
            var flag=0;
            if(data.length==0){
                flag=1;
            }else{
               for(var i=0 ; i<data.length;i++){
                    item_id=data[i]["item_id"];
                    item_name=data[i]["item_name"];
                    sku=data[i]["sku"];
                    sale_price=data[i]["sale_price"];
                    original_price=data[i]["original_price"];
                    start_time=data[i]["start_time"];
                    end_time=data[i]["end_time"];
                    if(item_id=="" && item_name=="" && sku=="" && sale_price=="" && original_price=="" && start_time=="" && end_time==""){
                        alert("File is Wrong format.");
                        flag=1;
                        break;
                    }
                } 
            }
            
            return flag;
        }
        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateFlashSale").hide();
                var excelFile,
                    fileReader = new FileReader();
            
                $("#result").hide();
            
                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);
            
                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;
            
                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }
            
                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }
            
                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);
            
                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }
            
                            data.push(newRow);
            
                        }
                        data_excel = data;
                        console.log(data_excel);
                        $("#btnUpdateFlashSale").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array
            
                    }, function(error) {
            
                    });
                }
            
                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {
            
                    }
                }
            
            })
            });
    }
    
]);


//======================== End Setting Flash sale eglips===============================================

//======================== Schedule Calendar ====================================================




// Components Calendar Controller
App.controller('SCalendarCtrl', ['$scope', '$localStorage', '$window',
    function($scope, $localStorage, $window) {
        limit_permisstion_menu("chkSCalendar");
        // Init FullCalendar
        var initCalendar = function() {
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            jQuery('.js-calendar').fullCalendar({
                firstDay: 1,
                editable: true,
                droppable: true,
                allDaySlot: true,
                header: {
                    left: 'title',
                    right: 'prev,next month,agendaWeek,agendaDay,listWeek'
                },
                drop: function(date, allDay, ui, resourceId) { // this function is called when something is dropped
                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = jQuery(this).data('eventObject');


                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = jQuery.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    jQuery('.js-calendar').fullCalendar('renderEvent', copiedEventObject, true);

                    var title = copiedEventObject.title;
                    var color = copiedEventObject.color;
                    var startdatetime = moment(copiedEventObject.start);;
                    var dateStartComponent = startdatetime.utc().format('YYYY-MM-DD HH:mm:ss');
                    // console.log(dateStartComponent);
                    var obj = {
                        "title": title,
                        "color": color,
                        "start": dateStartComponent
                    };
                    $.ajax({
                        url: 'assets/js/connect/gateway.php?controller=ct_skysys.ct_schedule_calendar_insert',
                        data: {
                            "obj": obj
                        },
                        type: "POST",
                        success: function(json) {
                            $('.js-calendar').fullCalendar('removeEvents');
                            $('.js-calendar').fullCalendar('refetchEvents')
                        }
                    })
                    jQuery(this).remove();
                    // location.reload();
                },

                events: 'assets/js/connect/gateway.php?controller=ct_skysys.ct_schedule_calendar',
                eventClick: function(event, jsEvent, view) {
                    var endtime = $.fullCalendar.moment(event.end).format('YYYY-MM-DD HH:mm:ss');
                    var starttime = $.fullCalendar.moment(event.start).format('YYYY-MM-DD HH:mm:ss');
                    // var mywhen = starttime + ' - ' + endtime;
                    var id = event.id;
                    var title = event.title;
                    var color = event.color;
                    var matches = endtime.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
                    $("#txtTitle").val("");
                    $("#txtEnd").val("");
                    $("#txtStart").val("");
                    $("#btnSave").attr("eventid", "");
                    if (matches === null) {

                    } else {
                        $("#txtEnd").val(endtime);
                    }
                    $("#txtTitle").val(title);

                    $("#txtStart").val(starttime);
                    $("#btnSave").attr("eventid", id);

                    var element = document.getElementById('cboColor');
                    element.value = color;

                    // console.log(event)

                    jQuery('#modal_modify').modal('show');



                },
                eventDrop: function(event, delta, revertFunc) {

                    //  console.log(event);
                    //  console.log(revertFunc);
                    var title = event.title;
                    var start = moment(event.start);;
                    var dateStartComponent = start.utc().format('YYYY-MM-DD HH:mm:ss');
                    var end = moment(event.end);
                    var dateEndComponent = end.utc().format('YYYY-MM-DD HH:mm:ss');
                    var id = event.id;
                    var url = event.url;
                    var color = event.color;
                    var allday = event.allDay;

                    var obj = {
                        "title": title,
                        "start": dateStartComponent,
                        "end": dateEndComponent,
                        "id": id,
                        "url": url,
                        "color": color,
                        "allday": allday
                    };
                    // console.log(id);
                    $.ajax({
                        url: 'assets/js/connect/gateway.php?controller=ct_skysys.ct_schedule_calendar_update',
                        data: {
                            "obj": obj
                        },
                        type: "POST",
                        success: function(json) {
                            //  console.log(json);
                        }
                    })
                },
                eventResize: function(event) {
                    //  console.log(event);
                    var title = event.title;
                    var start = moment(event.start);;
                    var dateStartComponent = start.utc().format('YYYY-MM-DD HH:mm:ss');
                    var end = moment(event.end);
                    var dateEndComponent = end.utc().format('YYYY-MM-DD HH:mm:ss');
                    var id = event.id;
                    var url = event.url;
                    var color = event.color;
                    var allday = event.allDay;

                    var obj = {
                        "title": title,
                        "start": dateStartComponent,
                        "end": dateEndComponent,
                        "id": id,
                        "url": url,
                        "color": color,
                        "allday": allday
                    };

                    //  console.log(id);
                    $.ajax({
                        url: 'assets/js/connect/gateway.php?controller=ct_skysys.ct_schedule_calendar_update',
                        data: {
                            "obj": obj
                        },
                        type: "POST",
                        success: function(json) {
                            //console.log(json);
                        }
                    })
                }
            });
        };

        // Add Event functionality
        //  addEvent();

        // FullCalendar, for more examples you can check out http://fullcalendar.io/
        //  initEvents();
        initCalendar();
        $("#btnSave").click(function() {
            var title = $("#txtTitle").val();
            var end = $("#txtEnd").val();
            var start = $("#txtStart").val();
            var color = $("#cboColor").val();
            var id = $("#btnSave").attr("eventid");
            if (start == "") {
                $("#txtStart").focus();
                return;
            }
            var obj = {
                "title": title,
                "start": start,
                "end": end,
                "id": id,
                "color": color
            };
            // console.log(obj);

            $.ajax({
                url: 'assets/js/connect/gateway.php?controller=ct_skysys.ct_schedule_calendar_update_hand',
                data: {
                    "obj": obj
                },
                type: "POST",
                success: function(json) {
                    $('.js-calendar').fullCalendar('removeEvents');
                    $('.js-calendar').fullCalendar('refetchEvents');
                    jQuery('#modal_modify').modal('hide');
                }
            })

        })
        $("#btnDelete").click(function() {
            var id = $("#btnSave").attr("eventid");
            var obj = {
                "id": id
            };
            // console.log(obj);
            $.ajax({
                url: 'assets/js/connect/gateway.php?controller=ct_skysys.ct_schedule_calendar_delete',
                data: {
                    "obj": obj
                },
                type: "POST",
                success: function(json) {
                    $('.js-calendar').fullCalendar('removeEvents');
                    $('.js-calendar').fullCalendar('refetchEvents');
                    jQuery('#modal_modify').modal('hide');
                }
            })

        })
        $("#btnAdd").click(function() {
            var title = $("#txtTitleNew").val();
            var color = $("#cboColorNew").val();
            if (title == "") {
                $("#txtTitleNew").focus();
                return;
            } else {
                //  var eventInput      = jQuery('.js-add-event');
                var eventInputVal = '';

                // When the add event form is submitted

                eventInputVal = title; // Get input value

                // Check if the user entered something

                // Add it to the events list
                jQuery('.js-events')
                    .prepend('<li style="background-color: ' + color + ' !important" class="animated fadeInDown">' +
                        jQuery('<div />').text(eventInputVal).html() +
                        '</li>');

                // Clear input field
                //  eventInput.prop('value', '');                   
                // Re-Init Events
                // initEvents();
                jQuery('.js-events')
                    .find('li')
                    .each(function() {
                        var event = jQuery(this);

                        // create an Event Object
                        var eventObject = {
                            title: title,
                            color: color
                        };

                        // store the Event Object in the DOM element so we can get to it later
                        jQuery(this).data('eventObject', eventObject);

                        // make the event draggable using jQuery UI
                        jQuery(this).draggable({
                            zIndex: 999,
                            revert: true,
                            revertDuration: 0
                        });
                    });
                jQuery('#modal_add').modal('hide');
                return false;


            }

        })

    }

]);




//======================== End Schedule Calendar  ============================

//============================ Setting Event Sale of ===========================

App.controller('SEventSaleOfCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSEventSaleOf");
        var data_excel="";
        // limit_permisstion("7001");
        $scope.loadData = function() {
            get_list_product();
            loaddata_event();
        }

        function get_list_product() {
            var shoptype=0 ; // 0 :sky007vn ; 1:eglips ; 2:mixsoon        
            //alert(123);
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_get_list_product",
                type: "POST",
                data: {
                    "shoptype": shoptype
                },
                success: function(d) {
                    // console.log(d);return;
                    var data = $.parseJSON(d);
                    var table = $('#tb_list_item').DataTable();
                    table.destroy();

                    var table = $('#tb_list_item').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 5,
                        data: data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "id"
                            },
                            {
                                "width": "50px",
                                "data": "product_name"
                            },
                            {
                                "width": "50px",
                                "data": "sku"
                            },
                            {
                                "width": "50px",
                                "data": "sale_price"
                            }, {
                                "width": "50px",
                                "data": "stock"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var name = full["product_name"].replace(/"/g, " ");
                                    var price = full["sale_price"];
                                    var stock = full["stock"];
                                    var sku = full["sku"];
                                    var html = '<button class="btn btn-info" ng-click="add_event_html(\'' + id + '\',\'' + price + '\',\'' + name + '\',\'' + sku + '\')">Add</button>';
                                    return html;
                                }
                            }
                        ]
                    });



                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        $("#btnCache").click(function(){
             $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_sale_of_delete_cache",
                type: "GET",               
                success: function(d) {
                    console.log(d);
                    alert("Clear cache finished.");
                },
                error: function(e) {
                    alert(e);
                }

            });
                
        });
        $scope.add_event_html = function(id, price, name, sku) {
            var shop_type=0;// 0 : Sky007 ; 1 : eglips ; 2: mixsoon .
            var obj = {
                "item_id": id,
                "item_price": price,
                "product_name": name,
                "sku": sku,
                "shop_type":shop_type
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_sale_of_insert_event",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    //console.log(d);return;
                    var table = $('#tb_list_event_setting').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                    loaddata_event();
                },
                error: function(e) {
                    alert(e);
                }

            });
            // console.log(id+'_'+name+'_'+stock);

        }

        function loaddata_event() {
            editor = new $.fn.dataTable.Editor({
                ajax: "assets/js/connect/server/sv_setting_event_sale_of.php",
                table: "#tb_list_event_setting",
                fields: [{
                    label: "Price Sale Of:",
                    name: "sale_price"
                }, {
                    label: "Normal Sale:",
                    name: "regular_price"
                }, {
                    label: "Start Time:",
                    name: "start_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'
                }, {
                    label: "End Time:",
                    name: "end_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'

                }, {
                    label: "Status:",
                    name: "flag",
                    type: "",
                    type: "select",
                    options: [{
                            label: "Prepare",
                            value: "0"
                        },
                        {
                            label: "Inprogress",
                            value: "1"
                        },
                        {
                            label: "Not Yet",
                            value: "2"
                        }
                    ]

                }]
            });

            // Activate an inline edit on click of a table cell
            $('#tb_list_event_setting').on('click', 'tbody td:not(:first-child)', function(e) {
                editor.inline(this, {
                    buttons: {
                        label: '&gt;',
                        fn: function() {
                            this.submit();
                        }
                    }
                });
            });


            $('#tb_list_event_setting').DataTable({
                dom: "Bfrtip",
                ajax: "assets/js/connect/server/sv_setting_event_sale_of.php",
                order: [
                    [8, 'asc']
                ],
                columns: [{
                        data: null,
                        defaultContent: '',
                        className: 'select-checkbox',
                        orderable: false
                    },
                    {
                        data: "product_id"

                        //width: "20px"
                    }, {
                        data: "product_name"

                        //width: "20px"
                    }, {
                        data: "sku"

                        //width: "20px"
                    }, {
                        data: "sale_price"
                        //	width: "100px"
                    }, {
                        data: "regular_price"
                        //	width: "100px"
                    }, {
                        data: "start_time"
                    }, {
                        data: "end_time"
                    }, {
                        data: "flag",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "Prepare";
                            } else if (val == 1) {
                                html = "Inprogress";
                            } else if (val == 2) {
                                html = "Not Yet";
                            }
                            return html;
                        }
                    }
                ],
                select: {
                    style: 'os',
                    selector: 'td:first-child'
                },
                buttons: [{
                        extend: "edit",
                        editor: editor
                    },
                    {
                        extend: "remove",
                        editor: editor
                    }
                ]
            });
                       
        }
        $("#btnUpdateSettingEvent").click(function(){
            var shop_type =0;  // 0:sky007vn ; 1: eglips ; 2 : mixsoon .
            var check_file=check_file_excel_flash(data_excel);
             var obj={
                "data_excel":data_excel,
                "shop_type":shop_type
            }
            if(check_file==0){
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_setting_excel_insert",                 
                    type: "POST",
                    data: {
                            "obj": obj
                    },              
                    success: function(d) {
                    //    console.log(d)
                    alert("Insert finished.");  
                    var table = $('#tb_list_event_flash_sale').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                        loaddata_event() ;                         
                    },
                    error: function(e) {
                       
                        alert(e);
                    }
    
                });
            }
        })
         function check_file_excel_flash(data){
            var item_id="";
            var item_name="";
            var sku="";
            var sale_price="";
            var original_price="";
            var start_time="";
            var end_time="";
            var flag=0;
            if(data.length==0){
                flag=1;
            }else{
               for(var i=0 ; i<data.length;i++){
                    item_id=data[i]["item_id"];
                    item_name=data[i]["item_name"];
                    sku=data[i]["sku"];
                    sale_price=data[i]["sale_price"];
                    original_price=data[i]["original_price"];
                    start_time=data[i]["start_time"];
                    end_time=data[i]["end_time"];
                    if(item_id=="" && item_name=="" && sku=="" && sale_price=="" && original_price=="" && start_time=="" && end_time==""){
                        alert("File is Wrong format.");
                        flag=1;
                        break;
                    }
                } 
            }
            
            return flag;
        }
        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateSettingEvent").hide();
                var excelFile,
                    fileReader = new FileReader();
            
                $("#result").hide();
            
                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);
            
                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;
            
                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }
            
                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }
            
                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);
            
                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }
            
                            data.push(newRow);
            
                        }
                        data_excel = data;
                        console.log(data_excel);
                        $("#btnUpdateSettingEvent").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array
            
                    }, function(error) {
            
                    });
                }
            
                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {
            
                    }
                }
            
            })
            });
    }
]);
//======================== End Setting Event Sale of ============================
//============================ Setting Event Sale of eglips ===========================

App.controller('SEventSaleOfEglipsCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSEventSaleOfEglips");
        var data_excel="";
        // limit_permisstion("7001");
        $scope.loadData = function() {
            get_list_product();
            loaddata_event();
        }

        function get_list_product() {
            //alert(123);
            var shoptype=1 ; // 0 :sky007vn ; 1:eglips ; 2:mixsoon 
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_get_list_product",
                type: "POST",
                data: {
                    "shoptype": shoptype,                   
                },
                success: function(d) {
                   // console.log(d);return;
                    var data = $.parseJSON(d);
                    var table = $('#tb_list_item_eglips').DataTable();
                    table.destroy();

                    var table = $('#tb_list_item_eglips').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 5,
                        data: data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "id"
                            },
                            {
                                "width": "50px",
                                "data": "product_name"
                            },
                            {
                                "width": "50px",
                                "data": "sku"
                            },
                            {
                                "width": "50px",
                                "data": "sale_price"
                            }, {
                                "width": "50px",
                                "data": "stock"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var name = full["product_name"].replace(/"/g, " ");
                                    name =name.replace(/'/g, '');
                                    var price = full["sale_price"];
                                    var stock = full["stock"];
                                    var sku = full["sku"];
                                    var html = '<button class="btn btn-info" ng-click="add_event_eglips_html(\'' + id + '\',\'' + price + '\',\'' + name + '\',\'' + sku + '\')">Add</button>';
                                    return html;
                                }
                            }
                        ]
                    });



                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        
        $scope.add_event_eglips_html = function(id, price, name, sku) {
            var shop_type=1;// 0 : Sky007 ; 1 : eglips ; 2: mixsoon .
            var obj = {
                "item_id": id,
                "item_price": price,
                "product_name": name,
                "sku": sku,
                "shop_type": shop_type
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_sale_of_insert_event",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    //console.log(d);return;
                    var table = $('#tb_list_event_setting_eglips').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                    loaddata_event();
                },
                error: function(e) {
                    alert(e);
                }

            });
            // console.log(id+'_'+name+'_'+stock);

        }

        function loaddata_event() {
            editor = new $.fn.dataTable.Editor({
                ajax: "assets/js/connect/server/sv_setting_event_sale_of_eglips.php",
                table: "#tb_list_event_setting_eglips",
                fields: [{
                    label: "Price Sale Of:",
                    name: "sale_price"
                }, {
                    label: "Normal Sale:",
                    name: "regular_price"
                }, {
                    label: "Start Time:",
                    name: "start_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'
                }, {
                    label: "End Time:",
                    name: "end_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'

                }, {
                    label: "Status:",
                    name: "flag",
                    type: "",
                    type: "select",
                    options: [{
                            label: "Prepare",
                            value: "0"
                        },
                        {
                            label: "Inprogress",
                            value: "1"
                        },
                        {
                            label: "Not Yet",
                            value: "2"
                        }
                    ]

                }]
            });

            // Activate an inline edit on click of a table cell
            $('#tb_list_event_setting_eglips').on('click', 'tbody td:not(:first-child)', function(e) {
                editor.inline(this, {
                    buttons: {
                        label: '&gt;',
                        fn: function() {
                            this.submit();
                        }
                    }
                });
            });


            $('#tb_list_event_setting_eglips').DataTable({
                dom: "Bfrtip",
                ajax: "assets/js/connect/server/sv_setting_event_sale_of_eglips.php",
                order: [
                    [8, 'asc']
                ],
                columns: [{
                        data: null,
                        defaultContent: '',
                        className: 'select-checkbox',
                        orderable: false
                    },
                    {
                        data: "product_id"

                        //width: "20px"
                    }, {
                        data: "product_name"

                        //width: "20px"
                    }, {
                        data: "sku"

                        //width: "20px"
                    }, {
                        data: "sale_price"
                        //	width: "100px"
                    }, {
                        data: "regular_price"
                        //	width: "100px"
                    }, {
                        data: "start_time"
                    }, {
                        data: "end_time"
                    }, {
                        data: "flag",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "Prepare";
                            } else if (val == 1) {
                                html = "Inprogress";
                            } else if (val == 2) {
                                html = "Not Yet";
                            }
                            return html;
                        }
                    }
                ],
                select: {
                    style: 'os',
                    selector: 'td:first-child'
                },
                buttons: [{
                        extend: "edit",
                        editor: editor
                    },
                    {
                        extend: "remove",
                        editor: editor
                    }
                ]
            });
                       
        }
        $("#btnUpdateSettingEventEglips").click(function(){
            var check_file=check_file_excel_flash(data_excel);
            var shop_type=1; // 0:sky007vn ; 1: eglips ; 2 : mixsoon .
            var obj={
                "data_excel":data_excel,
                "shop_type":shop_type
            }
             if(check_file==0){
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_setting_excel_insert",                 
                    type: "POST",
                    data: {
                            "obj": obj
                    },              
                    success: function(d) {
                        console.log(d)
                    alert("Insert finished.");  
                    var table = $('#tb_list_event_setting_eglips').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                        loaddata_event() ;                         
                    },
                    error: function(e) {
                       
                        alert(e);
                    }
    
                });
            }
        })
         function check_file_excel_flash(data){
            var item_id="";
            var item_name="";
            var sku="";
            var sale_price="";
            var original_price="";
            var start_time="";
            var end_time="";
            var flag=0;
            if(data.length==0){
                flag=1;
            }else{
               for(var i=0 ; i<data.length;i++){
                    item_id=data[i]["item_id"];
                    item_name=data[i]["item_name"];
                    sku=data[i]["sku"];
                    sale_price=data[i]["sale_price"];
                    original_price=data[i]["original_price"];
                    start_time=data[i]["start_time"];
                    end_time=data[i]["end_time"];
                    if(item_id=="" && item_name=="" && sku=="" && sale_price=="" && original_price=="" && start_time=="" && end_time==""){
                        alert("File is Wrong format.");
                        flag=1;
                        break;
                    }
                } 
            }
            
            return flag;
        }
        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateSettingEvent").hide();
                var excelFile,
                    fileReader = new FileReader();
            
                $("#result").hide();
            
                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);
            
                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;
            
                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }
            
                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }
            
                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);
            
                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }
            
                            data.push(newRow);
            
                        }
                        data_excel = data;
                        console.log(data_excel);
                        $("#btnUpdateSettingEvent").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array
            
                    }, function(error) {
            
                    });
                }
            
                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {
            
                    }
                }
            
            })
            });
    }
]);
//======================== End Setting Event Sale of eglips ============================
//============================ Setting Event Sale of Mixsoon ===========================

App.controller('SEventSaleOfMixsoonCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSEventSaleOfMixsoon");
        var data_excel="";
        // limit_permisstion("7001");
        $scope.loadData = function() {
            get_list_product();
            loaddata_event();
        }

        function get_list_product() {
            //alert(123);
            var shoptype=2 ; // 0 :sky007vn ; 1:eglips ; 2:mixsoon 
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_get_list_product",
                type: "POST",
                data: {
                    "shoptype": shoptype
                },
                success: function(d) {
                    // console.log(d);return;
                    var data = $.parseJSON(d);
                    var table = $('#tb_list_item_mixsoon').DataTable();
                    table.destroy();

                    var table = $('#tb_list_item_mixsoon').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 5,
                        data: data,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "id"
                            },
                            {
                                "width": "50px",
                                "data": "product_name"
                            },
                            {
                                "width": "50px",
                                "data": "sku"
                            },
                            {
                                "width": "50px",
                                "data": "sale_price"
                            }, {
                                "width": "50px",
                                "data": "stock"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var name = full["product_name"].replace(/"/g, " ");
                                    var price = full["sale_price"];
                                    var stock = full["stock"];
                                    var sku = full["sku"];
                                    var html = '<button class="btn btn-info" ng-click="add_event_mixsoon_html(\'' + id + '\',\'' + price + '\',\'' + name + '\',\'' + sku + '\')">Add</button>';
                                    return html;
                                }
                            }
                        ]
                    });



                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        
        $scope.add_event_mixsoon_html = function(id, price, name, sku) {
            var shop_type=2;// 0 : Sky007 ; 1 : eglips ; 2: mixsoon .
            var obj = {
                "item_id": id,
                "item_price": price,
                "product_name": name,
                "sku": sku,
                "shop_type":shop_type
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_sale_of_insert_event",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    //console.log(d);return;
                    var table = $('#tb_list_event_setting_mixsoon').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                    loaddata_event();
                },
                error: function(e) {
                    alert(e);
                }

            });
            // console.log(id+'_'+name+'_'+stock);

        }

        function loaddata_event() {
            editor = new $.fn.dataTable.Editor({
                ajax: "assets/js/connect/server/sv_setting_event_sale_of_mixsoon.php",
                table: "#tb_list_event_setting_mixsoon",
                fields: [{
                    label: "Price Sale Of:",
                    name: "sale_price"
                }, {
                    label: "Normal Sale:",
                    name: "regular_price"
                }, {
                    label: "Start Time:",
                    name: "start_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'
                }, {
                    label: "End Time:",
                    name: "end_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'

                }, {
                    label: "Status:",
                    name: "flag",
                    type: "",
                    type: "select",
                    options: [{
                            label: "Prepare",
                            value: "0"
                        },
                        {
                            label: "Inprogress",
                            value: "1"
                        },
                        {
                            label: "Not Yet",
                            value: "2"
                        }
                    ]

                }]
            });

            // Activate an inline edit on click of a table cell
            $('#tb_list_event_setting_mixsoon').on('click', 'tbody td:not(:first-child)', function(e) {
                editor.inline(this, {
                    buttons: {
                        label: '&gt;',
                        fn: function() {
                            this.submit();
                        }
                    }
                });
            });


            $('#tb_list_event_setting_mixsoon').DataTable({
                dom: "Bfrtip",
                ajax: "assets/js/connect/server/sv_setting_event_sale_of_mixsoon.php",
                order: [
                    [8, 'asc']
                ],
                columns: [{
                        data: null,
                        defaultContent: '',
                        className: 'select-checkbox',
                        orderable: false
                    },
                    {
                        data: "product_id"

                        //width: "20px"
                    }, {
                        data: "product_name"

                        //width: "20px"
                    }, {
                        data: "sku"

                        //width: "20px"
                    }, {
                        data: "sale_price"
                        //	width: "100px"
                    }, {
                        data: "regular_price"
                        //	width: "100px"
                    }, {
                        data: "start_time"
                    }, {
                        data: "end_time"
                    }, {
                        data: "flag",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "Prepare";
                            } else if (val == 1) {
                                html = "Inprogress";
                            } else if (val == 2) {
                                html = "Not Yet";
                            }
                            return html;
                        }
                    }
                ],
                select: {
                    style: 'os',
                    selector: 'td:first-child'
                },
                buttons: [{
                        extend: "edit",
                        editor: editor
                    },
                    {
                        extend: "remove",
                        editor: editor
                    }
                ]
            });
                       
        }
        $("#btnUpdateSettingEventMixsoon").click(function(){
            var check_file=check_file_excel_flash(data_excel);
            var shop_type=2; //0:sky007vn ; 1:eglips ; 2:mixsoon
            var obj={
                "data_excel":data_excel,
                "shop_type":shop_type
            }
            if(check_file==0){
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_setting_excel_insert",                 
                    type: "POST",
                    data: {
                            "obj": obj
                    },              
                    success: function(d) {
                        console.log(d)
                    alert("Insert finished.");  
                    var table = $('#tb_list_event_setting_mixsoon').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                        loaddata_event() ;                         
                    },
                    error: function(e) {
                       
                        alert(e);
                    }
    
                });
            }
        })
         function check_file_excel_flash(data){
            var item_id="";
            var item_name="";
            var sku="";
            var sale_price="";
            var original_price="";
            var start_time="";
            var end_time="";
            var flag=0;
            if(data.length==0){
                flag=1;
            }else{
               for(var i=0 ; i<data.length;i++){
                    item_id=data[i]["item_id"];
                    item_name=data[i]["item_name"];
                    sku=data[i]["sku"];
                    sale_price=data[i]["sale_price"];
                    original_price=data[i]["original_price"];
                    start_time=data[i]["start_time"];
                    end_time=data[i]["end_time"];
                    if(item_id=="" && item_name=="" && sku=="" && sale_price=="" && original_price=="" && start_time=="" && end_time==""){
                        alert("File is Wrong format.");
                        flag=1;
                        break;
                    }
                } 
            }
            
            return flag;
        }
        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdateSettingEvent").hide();
                var excelFile,
                    fileReader = new FileReader();
            
                $("#result").hide();
            
                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);
            
                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;
            
                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }
            
                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }
            
                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);
            
                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }
            
                            data.push(newRow);
            
                        }
                        data_excel = data;
                        console.log(data_excel);
                        $("#btnUpdateSettingEvent").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array
            
                    }, function(error) {
            
                    });
                }
            
                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {
            
                    }
                }
            
            })
            });
    }
]);
//======================== End Setting Event Sale of mixsoon ============================
//============================ Update Membership ================================

App.controller('SupdatemembershipCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSUpdateMembership");
        //limit_permisstion("7001");   
        $("#btnNotifyFinish").hide();
        var data_excel = "";
        $("#btnBronze").click(function() {
            var r = confirm("Are you sure do you want to update ?");
            if (r == true) {
                convert_membership("bronze");
            }
        });
        $("#btnSilver").click(function() {
            var r = confirm("Are you sure do you want to update ?");
            if (r == true) {
                convert_membership("silver");
            }
        });
        $("#btnGold").click(function() {
            var r = confirm("Are you sure do you want to update ?");
            if (r == true) {
                convert_membership("gold");
            }
        });
        $("#btnVip").click(function() {
            var r = confirm("Are you sure do you want to update ?");
            if (r == true) {
                convert_membership("vip");
            }
        });
        $(function() {
            $("#input").on("change", function() {
                $("#btnUpdate").hide();
                var excelFile,
                    fileReader = new FileReader();

                fileReader.onload = function(e) {
                    var buffer = new Uint8Array(fileReader.result);

                    $.ig.excel.Workbook.load(buffer, function(workbook) {
                        var column, row, newRow, cellValue, columnIndex, i,
                            worksheet = workbook.worksheets(0),
                            columnsNumber = 0,
                            gridColumns = [],
                            data = [],
                            worksheetRowsCount;

                        // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                        // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                        while (worksheet.rows(0).getCellValue(columnsNumber)) {
                            columnsNumber++;
                        }

                        // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                        for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                            column = worksheet.rows(0).getCellText(columnIndex);
                            gridColumns.push({
                                headerText: column,
                                key: column
                            });
                        }

                        // We start iterating from 1, because we already read the first row to build the gridColumns array above
                        // We use each cell value and add it to json array, which will be used as dataSource for the grid
                        for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                                cellValue = row.getCellText(columnIndex);
                                newRow[gridColumns[columnIndex].key] = cellValue;
                            }

                            data.push(newRow);

                        }
                        data_excel = data;
                        $("#btnUpdate").show();
                        // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array

                    }, function(error) {

                    });
                }

                if (this.files.length > 0) {
                    excelFile = this.files[0];
                    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                        fileReader.readAsArrayBuffer(excelFile);
                    } else {

                    }
                }

            })
        });
        $("#btnUpdate").click(function() {
            if (data_excel.length > 0) {
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_update_membership",
                    type: "POST",
                    data: {
                        "data": data_excel
                    },
                    success: function(d) {
                        // console.log(d);
                        $("#btnNotifyFinish").click();
                        $("#input").val("");
                    },
                    error: function(e) {
                        console.log(e);

                    }
                });
                // console.log(data_excel); 
            }

        });

        function convert_membership($membership) {
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_conver_membership",
                type: "POST",
                data: {
                    "membership": $membership
                },
                success: function(d) {
                    $("#btnNotifyFinish").click();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
    }
]);
//======================== End Update Membership ================================
//============================ Update Membership ================================

App.controller('SsettingaccountCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSSettingAccount");
        $("#btnNotifyFinish").hide();
        $scope.loadData = function() {
            load_list_user();

        }

        function load_list_user() {
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_get_account",
                type: "GET",
                success: function(d) {
                    // console.log(d);return;
                    var data = $.parseJSON(d);
                    var table = $('#tb_list_account').DataTable();
                    table.destroy();

                    var table = $('#tb_list_account').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 10,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "id"
                            },
                            {
                                "width": "50px",
                                "data": "email"
                            },
                            {
                                "width": "50px",
                                "data": "name"
                            },
                            {
                                "width": "50px",
                                "data": "permission"
                            },
                            {
                                "width": "50px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var active = full["active"];
                                    var html = '';
                                    if (active == "0") {
                                        html = "Active";
                                    } else {
                                        html = "Inactive";
                                    }
                                    return html;
                                }
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var email = full["email"];
                                    var name = full["name"];
                                    var permission = full["permission"];
                                    var limitmenu = full["limit_menu"];
                                    var active = full["active"];
                                    var html = '<button class="btn btn-info" ng-click="update_user_html(\'' + id + '\',\'' + email + '\',\'' + name + '\',\'' + permission + '\',\'' + active + '\')">Update</button>';
                                    return html;
                                }
                            }
                        ]
                    });
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
        $("#btnAdd").click(function() {
            $("#divPW").show();
            $("#btnCreatePW").hide();
            $("#txtlbl").empty();
            $("#txtlbl").html("New Account");
            $("#btnSave").attr("flag", "0");
            $("#btnSave").attr("id_account", "-1");
            clear_input();
            checked_default();
            $('#modal_add').modal('show');
            //  jQuery('#myModalId').modal('show');
            //  $("#chkDashboard").removeAttr('checked');
        })
        $scope.update_user_html = function(id, email, name, permission, active) {
            $("#txtlbl").empty();
            clear_input();
            $("#txtlbl").html("Update Account");
            $("#divPW").hide();
            $("#btnCreatePW").show();
            $("#txtName").val(name);
            $("#txtEmail").val(email);
            $("#cboPermission").val(permission);
            $("#cboActive").val(active);
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_get_account_id",
                type: "POST",
                data: {
                    "id_account": id
                },
                success: function(d) {
                    var data = $.parseJSON(d);


                    var limitmenu = data[0][0];
                    limitmenu = JSON.parse(limitmenu);

                    // console.log(asdf);
                    //  limitmenu=
                    // console.log(limitmenu); return;
                    if (limitmenu != null) {
                        for (var i = 0; i < limitmenu.length; i++) {
                            var id_checkbox = limitmenu[i];
                            $('#' + id_checkbox + '').prop("checked", true);
                            // console.log('#'+id_checkbox+'');
                        }
                    } else {
                        $('#chkDashboard').prop("checked", true);
                    }

                    $('#modal_add').modal('show');
                    $("#btnSave").attr("flag", "1");
                    $("#btnSave").attr("id_account", id);
                },
                error: function(e) {
                    console.log(e);
                }
            })

        }
        $("#btnCreatePW").click(function() {
            $("#divPW").show();
            $("#btnCreatePW").hide();
        })

        function clear_input() {
            $("#txtEmail").val("");
            $("#txtPassword").val("");
            $("#txtName").val("");
            $("#cboPermission").val("user");
            $("#cboActive").val(0);
            $(':checkbox').attr('checked', false);

        }

        function checked_default() {
           // var strDefault = ["chkDashboard","chkCRCategory","chkCRLocation","chkCRItems","chkCRTimeBased","chkCRMonthlySale","chkCRIOrder","chkCRMembershipOrder","chkDRCoupon","chkDRShipping","chkDROrder","chkDRItems","chkDRTax","chkDRCancelled","chkDRMarketing","chkDRMembershipOrder","chkCMCustomer","chkCMHistoryOrder","chkOMUpdateOrder","chkOMShipingOrder","chkSMUpdateStock","chkSMShareStock","chkSMUpdateStockHN","chkSMShareStockHN","chkSMDailyStock","chkSCalendar","chkSEventMarketing","chkSEventSaleOf","chkSUpdateMembership","chkSSettingAccount"]; 
            var strDefault = ["chkDashboard", "chkCRCategory", "chkCRLocation", "chkCRItems", "chkCRTimeBased", "chkCRMonthlySale", "chkCRIOrder", "chkDRShipping", "chkDROrder", "chkDRItems", "chkDRTax", "chkDRCancelled", "chkDRMarketing", "chkCMCustomer", "chkCMHistoryOrder", "chkSCalendar"];
            for (var i = 0; i < strDefault.length; i++) {
                var id_checkbox = strDefault[i];
                $('#' + id_checkbox + '').prop("checked", true);
                // console.log('#'+id_checkbox+'');
            }
        }
        $("#btnSave").click(function() {
            var email = $("#txtEmail").val();
            var password = $("#txtPassword").val();
            var name = $("#txtName").val();
            var permission = $("#cboPermission").val();
            var active = $("#cboActive").val();
            var list_menu_limit = [];
            $(":checkbox:checked").each(function() {
                list_menu_limit.push(this.id);
            });
            var action = $("#btnSave").attr("flag"); // 0: create new ; 1: update
            var id = $("#btnSave").attr("id_account");
            var obj = {
                "id": id,
                "email": email,
                "password": password,
                "name": name,
                "permission": permission,
                "limit_menu": list_menu_limit,
                "active": active,
                "action": action
            };
            if (email == "") {
                $("#txtEmail").focus();
                alert("please insert email !");
                return;
            }
            if (action == "0" && password == "") {
                $("#txtPassword").focus();
                alert("please insert password !");
                return;
            }
            if (name == "") {
                $("#txtName").focus();
                alert("please insert name !");
                return;
            }
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_account",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    load_list_user();
                    $('#modal_add').modal('hide');
                    $("#btnNotifyFinish").click();
                },
                error: function(e) {
                    console.log(e);
                }
            })

        })



    }
]);
//======================== End Update Membership ================================

//======================== Setting new product ====================================
App.controller('SsettingnewproductCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
     //   limit_permisstion_menu("chkSSettingAccount");
     //   $("#btnNotifyFinish").hide();
        $("#imgloadchange").hide();
        $scope.loadData = function() {
            load_list_product();

        }
      
        function load_list_product() {
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_get_list_product",
                type: "GET",
                success: function(d) {
                    // console.log(d);return;
                    var data = $.parseJSON(d);
                    var table = $('#tb_list_product').DataTable();
                    table.destroy();

                    var table = $('#tb_list_product').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 10,
                        data: data,
                        lengthMenu: [
                            [10, 20, 30, 50, -1],
                            [10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "product_id"
                            },
                            {
                                "width": "50px",
                                "data": "product_name"
                            },
                            {
                                "width": "50px",
                                "data": "sku"
                            },
                            {
                                "width": "50px",
                                "data": "main_name"
                            },
                            {
                                "width": "50px",
                                "data": "sub_name"
                            },
                            {
                                "width": "50px",
                                "data": "link_img"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var html ="";
                                  
                                        var product_name = full["product_name"].replace(/"/g, " ");
                                        var product_id = full["product_id"];
                                        var sku = full["sku"];
                                        var main_name = full["main_name"];
                                        var sub_name = full["sub_name"];
                                        var link_img = full["link_img"];
                                        var html = '<button class="btn btn-danger" ng-click="edit_product(\'' + product_id + '\',\'' + product_name + '\',\'' + sku + '\',\'' + main_name + '\',\'' + sub_name + '\',\'' + link_img + '\')">Edit</button>';
         
                                    
                                     return html;
                                }
                            }
                        ]
                    });
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }
        // $scope.save_thums = function (){
         //   alert(1);
          
        $scope.edit_product = function(product_id, product_name,sku, main_name, sub_name, link_img) {
            $("#txtItemName").val("");
            $("#txtItemID").val("");
            $("#txtsku").val("");
            $("#txtMainName").val("");
            $("#txtSubName").val("");
            
            $("#txtItemName").val(product_name);
            $("#txtItemID").val(product_id);
            $("#txtsku").val(sku);
            $("#txtMainName").val(main_name);
            $("#txtSubName").val(sub_name);
            $("#inputProduct").val(null);
            $('#imgProduct').attr("value_name","");
            if(link_img!="" && link_img!="null"){
                $('#imgProduct').attr('src', "assets/img/products/"+link_img+""); 
            }else{
                $('#imgProduct').attr('src', "assets/img/avatars/no-img.png"); 
            }
          

        }
      
        $("#btnChange").click(function() {
            var product_id = $("#txtItemID").val();
            if(product_id==""){
                alert("please choose product for update ."); return;
            }else{
                var mainName = $("#txtMainName").val();
                var subName = $("#txtSubName").val();
                var link_name = $('#imgProduct').attr("value_name");
               $("#imgloadchange").show();
               $("#btnChange").hide();
                var obj = {
                    "product_id": product_id,
                    "mainName": mainName,
                    "subName": subName,
                    "link_name": link_name               
                };
                
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_update_product",
                    type: "POST",
                    data: {
                        "obj": obj
                    },
                    success: function(d) {
                        load_list_product();                   
                        alert("Updated .");
                        $("#imgloadchange").hide();
                        $("#txtItemName").val("");
                        $("#txtItemID").val("");
                        $("#txtsku").val("");
                        $("#txtMainName").val("");
                        $("#txtSubName").val("");
                        $("#inputProduct").val(null);
                        $('#imgProduct').attr("value_name","");          
                        $('#imgProduct').attr('src', "assets/img/avatars/no-img.png"); 
                        $("#btnChange").show();
                    },
                    error: function(e) {
                        console.log(e);
                    }
                })
            }
            

        })



    }
]);

//======================== End setting new product ================================
//============================ Setting Membership ===========================

App.controller('SsettingmembershipCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
      //  limit_permisstion_menu("chkSsettingtiki");      
        
        $scope.loadData = function() {            
            // 0 :sky007vn ; 1:bbia ; 2:hince 
            get_list_product(0);
        //    loaddata_event();
                 
        }
        function get_list_product(shoptype) {              
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_get_list_product",
                type: "POST",
                data: {
                    "shoptype": shoptype
                },
                success: function(d) {      
                    var data = $.parseJSON(d);

                    var categories = data.categories;
                    var $categoriesSelect = $('#categories');
        
                    // Clear existing options except the first one
                    $categoriesSelect.find('option:not(:first)').remove();
        
                    // Populate the select element with categories
                    $.each(categories, function(index, category) {
                        var option = $('<option></option>')
                            .attr('value', category.term_id)
                            .text(category.name);
                        $categoriesSelect.append(option);
                    });

                    var products = data.products
                    var table = $('#tb_list_item_sky007').DataTable();
                    table.destroy();

                    var table = $('#tb_list_item_sky007').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 5,
                        data: products,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data": "id"
                            },
                            {
                                "width": "50px",
                                "data": "product_name"
                            },
                            {
                                "width": "50px",
                                "data": "sku"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var name = full["product_name"].replace(/"/g, " ");
                                    name =name.replace(/'/g, "");
                                    var price = full["sale_price"];
                                    var stock = full["stock"];
                                    var sku = full["sku"];
                                    var html = '<button class="btn btn-info" ng-click="add_event_html(\'' + id + '\',\'' + name + '\',\'' + sku + '\',\'' + shoptype + '\')">Add</button>';
                                    return html;
                                }
                            }
                        ]
                    });



                },
                error: function(e) {
                    alert(e);
                }
            });
        }
        
        $scope.add_event_html = function(id,  name, sku,shoptype) {          
           // var shop_type=0;// 0 :sky007vn ; 1:bbia ; 2:hince 
           var categories_id = $('#categories').val();
           var categories_name = $('#categories option:selected').text();
           if(categories_id==0){
                alert("Please choose categories.");               
           }else{           
            var obj = {
                "shoptype": shoptype,
                "product_id": id,               
                "product_name": name,
                "sku": sku,             
                "category_id":categories_id,
                "category_name":categories_name    
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_membership_insert",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   // console.log(d);return;
                    var table = $('#tb_list_event_membership_sky007').DataTable();

                    var buttons = [];

                    $.each(table.buttons()[0].inst.s.buttons,
                        function() {
                            buttons.push(this);
                        });
                    $.each(buttons,
                        function() {
                            table.buttons()[0].inst.remove(this.node);
                        });
                    table.destroy();
                    loaddata_event();
                },
                error: function(e) {
                    alert(e);
                }

            });
            }
            // console.log(id+'_'+name+'_'+stock);
        

        }

        function loaddata_event() {
            editor = new $.fn.dataTable.Editor({
                ajax: "assets/js/connect/server/sv_setting_event_membership.php",
                table: "#tb_list_event_membership_sky007",
                fields: [{
                    label: "Price Sale Of:",
                    name: "sale_price"
                }, {
                    label: "Normal Sale:",
                    name: "regular_price"
                }, {
                    label: "Start Time:",
                    name: "start_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'
                }, {
                    label: "End Time:",
                    name: "end_time",
                    type: "datetime",
                    def: function() {
                        return new Date();
                    },
                    format: 'YYYY-MM-DD HH:mm'

                }, {
                    label: "Status:",
                    name: "flag",
                    type: "",
                    type: "select",
                    options: [{
                            label: "Prepare",
                            value: "0"
                        },
                        {
                            label: "Inprogress",
                            value: "1"
                        },
                        {
                            label: "Not Yet",
                            value: "2"
                        }
                    ]

                }]
            });

            // Activate an inline edit on click of a table cell
            $('#tb_list_event_membership_sky007').on('click', 'tbody td:not(:first-child)', function(e) {
                editor.inline(this, {
                    buttons: {
                        label: '&gt;',
                        fn: function() {
                            this.submit();
                        }
                    }
                });
            });


            $('#tb_list_event_membership_sky007').DataTable({
                dom: "Bfrtip",
                ajax: "assets/js/connect/server/sv_setting_event_membership.php",
                order: [
                    [6, 'asc']
                ],
                columns: [{
                        data: null,
                        defaultContent: '',
                        className: 'select-checkbox',
                        orderable: false
                    },
                    {
                        data: "product_id"

                        //width: "20px"
                    }, {
                        data: "product_name"

                        //width: "20px"
                    }, {
                        data: "sku"

                        //width: "20px"
                    }, {
                        data: "start_time"
                    }, {
                        data: "end_time"
                    }, {
                        data: "flag",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "Prepare";
                            } else if (val == 1) {
                                html = "Inprogress";
                            } else if (val == 2) {
                                html = "Not Yet";
                            }
                            return html;
                        }
                    }
                ],
                select: {
                    style: 'os',
                    selector: 'td:first-child'
                },
                buttons: [{
                        extend: "edit",
                        editor: editor
                    },
                    {
                        extend: "remove",
                        editor: editor
                    }
                ]
            });
                       
        }        
        
    }
])
        
 //============================END Setting Tiki ===========================    
//====================== End Setting ======================================================================================

//====================== liblary ======================================================================================
function save_thums(){
   
            var fd = new FormData();
            $("#txt_thums_note").empty();
            $('#imgProduct').attr('src', '#');
            $('#imgProduct').attr("value_name","");
            var files = $('#inputProduct')[0].files[0];
            fd.append('file',files);
            var imgname  =  $('#inputProduct').val();
            $abc=$('#inputProduct');
            var size  =  $('#inputProduct')[0].files[0].size;
            var ext =  imgname.substr( (imgname.lastIndexOf('.') +1) );
            if(ext=='jpg' || ext=='jpeg' || ext=='png' || ext=='gif' || ext=='PNG' || ext=='JPG' || ext=='JPEG')
            {
                 if(size<=10000000)
                 {
                   
                    $.ajax({      
                        url:"assets/js/connect/server/upload_file.php",
                        type: "POST", 
                        data: fd , 
                        processData: false,
                        contentType: false,
                        success: function(d) {
                         //  console.log(d);
                            //$url_link=d.replace(/\s/g, ''); 
                            $url_link='assets/img/products/'+d;
                           // console.log($url_link);
                            var reader = new FileReader();
                            reader.onload = function (e) {
                              $('#imgProduct')
                                .attr('src', $url_link)
                                .width(150)
                                .height(150);
                            };
                            reader.readAsDataURL(files);  
                            $('#imgProduct').attr("value_name",d);     
                            
                        },
                        error: function(e) {
                            console.log(e); 
                        }
                    });
                 }else{
                    $("#txt_thums_note").append("Sorry File size exceeding from 10 Mb");
                 }
            }else{
                $("#txt_thums_note").append("Sorry Only you can uplaod JPEG|JPG|PNG|GIF file type");
            }
         }
function set_date_time($scope, $date) {
    $scope.today = function() {
        $scope.txtfromdate = new Date();
        $scope.txttodate = new Date();
    };
    $scope.txttodate = new Date();
    $scope.txtfromdate = lastWeek();

    $scope.clear = function() {
        $scope.txtfromdate = null;
    };
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.txttodate = new Date(year, month, day);
    };

    $scope.format = 'yyyy/MM/dd';


    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    function lastWeek() {
        var today = new Date();
        var lastweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - $date);
        return lastweek;
    }
}
function set_date_time_hour($scope, $date) {
    $scope.today = function() {
        $scope.txtfromdate = new Date();
        $scope.txttodate = new Date();
    };
    $scope.txttodate = new Date();
    $scope.txtfromdate = lastWeek();

    $scope.clear = function() {
        $scope.txtfromdate = null;
    };
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.txttodate = new Date(year, month, day);
    };

    $scope.format = 'yyyy/MM/dd hh:mm:ss';


    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    function lastWeek() {
        var today = new Date();
        var lastweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - $date);
        return lastweek;
    }
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
// template column chart 
// xaxis :array value
// yaxis : array object arr_quantity_item=[];//{"name":name_item,"data":arr_quantity_item}  
function chart_column_multi(idchart, titlerchart, xaxis, yaxis, name_y_axis, label_end) {
    Highcharts.chart(idchart, {
        chart: {
            type: 'column'
        },
        title: {
            text: titlerchart
        },
        subtitle: {
            text: 'Source: Sky007.vn'
        },
        xAxis: {
            categories: xaxis,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: name_y_axis
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:1f} ' + label_end + '</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: yaxis
    });
}
// template column chart 
// xaxis :array value
// yaxis : array object arr_quantity_item=[];//{"name":name_item,"data":arr_quantity_item}  
function chart_column_drilldown(idchart, data_main, data_drilldown) {
    Highcharts.chart(idchart, {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: ''
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:1f}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:1f}</b><br/>'
        },

        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: data_main
        }],
        drilldown: {
            series: data_drilldown
        }
    });
}

function linechart(dataarray, bbia, eglips, another, idchart, title_chart, y_tilte) {

    //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    Highcharts.chart(idchart, {
        chart: {
            type: 'line'
        },
        title: {
            text: title_chart
        },
        subtitle: {
            text: 'Source: Sky007.vn'
        },
        xAxis: {
            categories: dataarray
        },
        yAxis: {
            title: {
                text: y_tilte
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Bbia',
            data: bbia
        }, {
            name: 'Eglips',
            data: eglips
        }, {
            name: 'Another',
            data: another
        }]
    });

}
function linechart_mixsoon(dataarray, mixsoon,  idchart, title_chart, y_tilte) {

    //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    Highcharts.chart(idchart, {
        chart: {
            type: 'line'
        },
        title: {
            text: title_chart
        },
        subtitle: {
            text: 'Source: Sky007.vn'
        },
        xAxis: {
            categories: dataarray
        },
        yAxis: {
            title: {
                text: y_tilte
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Mixsoon',
            data: mixsoon
        }]
    });

}
function linechart_location(dataarray, data_location,  idchart, title_chart, y_tilte) {

    //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    Highcharts.chart(idchart, {
        chart: {
            type: 'line'
        },
        title: {
            text: title_chart
        },
        subtitle: {
            text: 'Source: Sky007.vn'
        },
        xAxis: {
            categories: dataarray
        },
        yAxis: {
            title: {
                text: y_tilte
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: data_location
    });

}

function chart_column_single(idchart, data_obj, y_label, series_name, string_end_label, title_chart) {
    Highcharts.chart(idchart, {
        chart: {
            type: 'column'
        },
        title: {
            text: title_chart
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: y_label
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:1f}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:1f} ' + string_end_label + '</b><br/>'
        },

        series: [{
            name: series_name,
            colorByPoint: true,
            data: data_obj
        }],

    });
}
function chart_column_single_chart_report_item( obj_data_20_item,arr_product_name) {
     $number_limit=0;
     if(arr_product_name.length>20){
              $number_limit=19 ; 
     }else{
        $number_limit=arr_product_name.length-1;
     }
    Highcharts.chart('div_item_top_sale', {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Stacked column chart'
          },
          xAxis: {
            categories: arr_product_name,
            max: $number_limit        
          },          
          yAxis: {
            min: 0,
            title: {
              text: 'Total quantity'
            },
            stackLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
                color: ( // theme
                  Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color
                ) || 'gray'
              }
            }
          },
          legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
          },
          tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',

          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true
              },
               'colorByPoint': true
            }
          },        
          series: obj_data_20_item
        });
}
setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie($scope) {
    var email = getCookie("ck_email");
    var ck_expiredate = getCookie("ck_ticket_expiry");
    var management_id = getCookie("ck_partner_id");
    var permission = getCookie("ck_permission");
    var management_name = getCookie("ck_name");
    var date_expiredate = new Date(ck_expiredate);

    var date_now = new Date();

    if (email == "" || ck_expiredate == "" || date_expiredate <= date_now || management_id == "") {
        window.location.href = "login.html";
    } else {
        $scope.managemnet_name = management_name;
    }
}

function limit_permisstion(strPermisstion) {
    var management_id = getCookie("ck_partner_id");
    var splitString = strPermisstion.split(',');
    var flat = "false";
    for (var i = 0; i < splitString.length; i++) {
        if (splitString[i] == management_id) {
            flat = "true";
            break;
        }
    }
    if (flat == "false") {
        alert("You Don't Have Permission !");
        window.location.href = "#/dashboard";
    }
}

function limit_permisstion_menu(menu_name) {
    var management_id = getCookie("ck_partner_id");
    var permission = getCookie("ck_permission");
    var limit_menu = getCookie("ck_limit_menu");
    var flat = "false";
    limit_menu = $.parseJSON(limit_menu);
    /* list menu name ["chkDashboard", "chkCRCategory", "chkCRLocation", "chkCRItems", "chkCRTimeBased", "chkCRMonthlySale", "chkCRIOrder", "chkDRShipping", "chkDROrder", "chkDRItems", "chkDRTax", "chkDRCancelled", "chkDRMarketing", "chkCMCustomer", "chkCMHistoryOrder", "chkOMUpdateOrder", "chkOMShipingOrder", "chkSMUpdateStock", "chkSMShareStock", "chkSMDailyStock", "chkSCalendar", "chkSEventMarketing", "chkSEventSaleOf", "chkSUpdateMembership", "chkSSettingAccount"]*/
    for (var i = 0; i < limit_menu.length; i++) {
        if (menu_name == limit_menu[i]) {
            flat = "true";
            break;
        }
    }
    if (flat == "false") {
        alert("You Don't Have Permission !");
        window.location.href = "#/dashboard";
    }


}
function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
}

function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function isoFormatYMD(d) {
    function pad(n) {
        return (n < 10 ? '0' : '') + n
    }
    return pad(d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + d.getUTCDate() + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()));
}




