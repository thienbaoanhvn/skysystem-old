/*
 *  Document   : controllers.js
 *  Author     : Anh tran
 *  Description: controllers for pages
 *
 */
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
                getData(fromdate, todate, "all", "total_daily_sale");
                getData(fromdate, todate, "0", "daily_sale_customer");
                getData(fromdate, todate, "7", "daily_sale_wholesaler");
                getData(fromdate, todate, "10", "daily_sale_shoppe");
                getData(fromdate, todate, "24", "daily_sale_shoppe_eglips");
                getData(fromdate, todate, "14", "daily_sale_lotte");                
                getData(fromdate, todate, "18", "daily_sale_eglips");
                getData(fromdate, todate, "22", "daily_sale_eglips_wholesaler");
                getData(fromdate, todate, "20", "daily_sale_lazada");
                getData(fromdate, todate, "26", "daily_sale_lazada_eglips");
                getData(fromdate, todate, "36", "daily_sale_tiki");
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
        function getData(fromdate, todate, category, idchart) {
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
                // console.log(data); return;
                get_data_report_forchart(fromdate, todate, data, category, idchart);
                // console.log(response);
            }, function myError(response) {

            });
        }
        // prepare data for chart
        function get_data_report_forchart(fromdate, todate, data, category, idchart) {

            if (data.length > 0) {
                var arr_date = generate_date(fromdate, todate);
                var arr_bbia = [];
                var arr_eglips = [];
                var arr_another = [];

                for (var i = 0; i < arr_date.length; i++) {
                    var real_time = arr_date[i];
                    var flag_eglips = "false";
                    var flag_bbia = "false";
                    var flag_another = "false";
                    var index_eglips = 0;
                    var index_bbia = 0;
                    var index_another = 0;
                    for (var j = 0; j < data.length; j++) {
                        var sale_time = data[j]["time"];
                        var caregory = data[j]['category'];
                        if (real_time == sale_time && caregory == "1") {
                            flag_eglips = "true";
                            index_eglips = j;
                        } else if (real_time == sale_time && caregory == "2") {
                            flag_bbia = "true";
                            index_bbia = j;
                        } else if (real_time == sale_time && caregory == "0") {
                            flag_another = "true";
                            index_another = j;
                        }

                    }
                    if (flag_eglips == "false") {
                        arr_eglips.push(0);
                    } else if (flag_eglips == "true") {
                        var tprice = parseInt(data[index_eglips]['total_price']);
                        arr_eglips.push(tprice);
                    }
                    if (flag_bbia == "false") {
                        arr_bbia.push(0);
                    } else if (flag_bbia == "true") {
                        var tprice = parseInt(data[index_bbia]['total_price']);
                        arr_bbia.push(tprice);
                    }
                    if (flag_another == "false") {
                        arr_another.push(0);
                    } else if (flag_another == "true") {
                        var tprice = parseInt(data[index_another]['total_price']);
                        arr_another.push(tprice);
                    }

                }
                set_graph(arr_date, arr_bbia, arr_eglips, arr_another, idchart);
            }
        }

        function set_graph(dataarray, bbia, eglips, another, idchart) {
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

        //////////////////////////////////////////////////

    }
]);

//====================== End Dashboard Content Controller==================================================================

//====================== Chart Report =====================================================================================

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
                getData(fromdate, todate, "34", "categories_sale_beautybox");
                getData(fromdate, todate, "36", "categories_sale_tiki");
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
                filter_data(fromdate, todate, "all", "location_sale", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "0", "location_sale_customer", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "7", "location_sale_wholesaler", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "10", "location_sale_shoppe", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "24", "location_sale_shopee_eglips", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "14", "location_sale_lotte", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "16", "location_sale_sendo", "Number Order", "Location", "order");                
                filter_data(fromdate, todate, "18", "location_sale_eglips", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "22", "location_sale_eglips_wholesaler", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "20", "location_sale_lazada", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "26", "location_sale_lazada_eglips", "Number Order", "Location", "order");
                filter_data(fromdate, todate, "36", "location_sale_tiki", "Number Order", "Location", "order");
            }
        }

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
        //chart_column_single
    }
]);
//============================ End Location ===============================

//============================ Items ======================================

App.controller('RCItemsCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {

        var index_page = 1;
        var number_navigation = 0;
        var data_top_sale = "";
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
            var objdata_20item = [];
            if (index_page != 1 && index_page != number_navigation) {
                //var length_item= data_top_sale.length;
                var start_item = (index_page * 20) - 20;
                var end_item = (index_page * 20);
                for (var i = start_item; i < end_item; i++) {
                    var name_item = data_top_sale[i]["product_name"];
                    var quantity = parseInt(data_top_sale[i]["quantity"]);
                    var obj_1_item = [name_item, quantity];
                    objdata_20item.push(obj_1_item);
                }

            } else {
                if (index_page == 1) {
                    for (var i = 0; i < 20; i++) {
                        var name_item = data_top_sale[i]["product_name"];
                        var quantity = parseInt(data_top_sale[i]["quantity"]);
                        var obj_1_item = [name_item, quantity];
                        objdata_20item.push(obj_1_item);
                    }
                } else if (index_page == number_navigation) {
                    var start_item = (index_page * 20) - 20;
                    for (var i = start_item; i < data_top_sale.length; i++) {
                        var name_item = data_top_sale[i]["product_name"];
                        var quantity = parseInt(data_top_sale[i]["quantity"]);
                        var obj_1_item = [name_item, quantity];
                        objdata_20item.push(obj_1_item);
                    }
                }
            }


            chart_column_single("chart_top_sale", objdata_20item, "Number Item Order", "Number Item Sale", "item", "Top Item Best Sale(" + name_shop_sale + ")");

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
            var objdata_20item = [];
            if (index_page != 1 && index_page != number_navigation) {
                //var length_item= data_top_sale.length;
                var start_item = (index_page * 20) - 20;
                var end_item = (index_page * 20);
                for (var i = start_item; i < end_item; i++) {
                    var name_item = data_top_sale[i]["product_name"];
                    var quantity = parseInt(data_top_sale[i]["quantity"]);
                    var obj_1_item = [name_item, quantity];
                    objdata_20item.push(obj_1_item);
                }

            } else {
                if (index_page == 1) {
                    for (var i = 0; i < 20; i++) {
                        var name_item = data_top_sale[i]["product_name"];
                        var quantity = parseInt(data_top_sale[i]["quantity"]);
                        var obj_1_item = [name_item, quantity];
                        objdata_20item.push(obj_1_item);
                    }
                } else if (index_page == number_navigation) {
                    var start_item = (index_page * 20) - 20;
                    for (var i = start_item; i < data_top_sale.length; i++) {
                        var name_item = data_top_sale[i]["product_name"];
                        var quantity = parseInt(data_top_sale[i]["quantity"]);
                        var obj_1_item = [name_item, quantity];
                        objdata_20item.push(obj_1_item);
                    }
                }
            }


            chart_column_single("chart_top_sale", objdata_20item, "Number Item Order", "Number Item Sale", "item", "Top Item Best Sale(" + name_shop_sale + ")");
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
                            </table> ';

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
                    // console.log(d);return;
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
            // chart_column_single(id_chart, objdata_20item, y_label, serries_name, string_end_label, title_chart);
        }


        function load_chart_top(fromdate, todate, shop_sale, id_chart, y_label, serries_name, string_end_label, title_chart) {
            index_page = 1;
            number_navigation = 0;
            var brand_name = $("#cboBrand").val();
            var city = $("#cboCity").val();
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "shop_sale": shop_sale,
                "brand_name": brand_name,
                "city": city,
                "number_items_show": number_items_show
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_chart_report_item_get_list_top_sale",
                type: "POST",
                async: false,
                data: {
                    "obj": obj
                },
                success: function(d) {
                   // console.log(d);
                    var data = $.parseJSON(d);
                    data_top_sale = data;
                    number_navigation = parseInt(data.length / 20);
                    if ((data.length % 20) != 0) {
                        number_navigation = number_navigation + 1;
                    }
                    //  alert(number_navigation);
                    // conso
                    load_navigation($compile, $scope);
                    var total_number=0;
                    var objdata_20item = [];
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
                    }
                    
                     for (var i = 0; i < data.length; i++) {                          
                            var quantity = parseInt(data[i]["quantity"]);
                           total_number+=quantity;
                         
                        }
                    $("#txtTotalAllItemBestSale").empty();
                     $("#txtTotalAllItemBestSale").append(total_number);
                    chart_column_single(id_chart, objdata_20item, y_label, serries_name, string_end_label, title_chart);
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
            get_data_monthly_sale(fromdate, todate, "24", "order_monthly_sale_shopee_eglips");
            get_data_monthly_sale(fromdate, todate, "14", "order_monthly_sale_lotte");   
            get_data_monthly_sale(fromdate, todate, "16", "order_monthly_sale_sendo");            
            get_data_monthly_sale(fromdate, todate, "18", "order_monthly_sale_eglips");
            get_data_monthly_sale(fromdate, todate, "22", "order_monthly_sale_eglips_wholesaler");
            get_data_monthly_sale(fromdate, todate, "20", "order_monthly_sale_lazada");
            get_data_monthly_sale(fromdate, todate, "26", "order_monthly_sale_lazada_eglips");
            get_data_monthly_sale(fromdate, todate, "34", "order_monthly_sale_beautybox");
            get_data_monthly_sale(fromdate, todate, "36", "order_monthly_sale_tiki");
            get_data_monthly_comparison(fromdate, todate);
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
                    var data = $.parseJSON(d);
                    get_data_report_forchart(data, "0", fromdate, todate, idchart, "", "Total Price");
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
                    draw_chart_comparison(data, fromdate, todate);
                   // console.log(data);
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }

        function draw_chart_comparison(data, startdate, enddate) {
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
                var arr_lotte = [];               
                var arr_eglips = [];
                var arr_eglips_wholesaler = [];
                var arr_lazada = [];
                var arr_lazada_eglips = [];               
                var arr_sendo = [];
                var arr_beautybox = [];
                var arr_tiki = [];
                var arr_shop_total = [];
                var arr_wholesaler_total=[];
                    
                if (sy == ey) {
                    for (var i = sm; i <= em; i++) {
                        arr_date.push(i);
                        arr_date_char.push(monthNames[i]);
                    }
                    for (var i = 0; i < arr_date.length; i++) {
                        var date_element = arr_date[i];
                        var index_shop = "";
                        var tprice_sky007 = 0;
                        var tprice_wholesaler = 0;
                        var tprice_shoppe = 0;
                        var tprice_lotte = 0;
                        var tprice_shoppe_eglips = 0;
                        var tprice_eglips = 0;
                        var tprice_eglips_wholesaler = 0;
                        var tprice_lazada = 0;
                        var tprice_lazada_eglips = 0;                        
                        var tprice_sendo = 0;
                        var tprice_beautybox = 0;
                        var tprice_tiki = 0;
                        var tprice_shop_total = 0;
                        var tprice_wholesaler_total=0;

                        for (var j = 0; j < data.length; j++) {
                            var time = parseInt(data[j]['time']);
                            time = (time - 1);
                            if (date_element == time) {
                                index_shop = j;
                            }
                        }
                        tprice_sky007 = parseInt(data[index_shop]['total_sky007']);
                        arr_sky007.push(tprice_sky007);
                        tprice_wholesaler = parseInt(data[index_shop]['total_wholesaler']);
                        arr_wholesaler.push(tprice_wholesaler);
                        tprice_shoppe = parseInt(data[index_shop]['total_shoppe']);
                        arr_shoppe.push(tprice_shoppe);
                        tprice_shoppe_eglips = parseInt(data[index_shop]['total_shoppe_eglips']);
                        arr_shoppe_eglips.push(tprice_shoppe_eglips);
                        tprice_lotte = parseInt(data[index_shop]['total_lotte']);
                        arr_lotte.push(tprice_lotte);                       
                        tprice_eglips = parseInt(data[index_shop]['total_eglips']);
                        arr_eglips.push(tprice_eglips);
                        tprice_eglips_wholesaler = parseInt(data[index_shop]['total_eglips_wholesaler']);
                        arr_eglips_wholesaler.push(tprice_eglips_wholesaler);
                        tprice_lazada = parseInt(data[index_shop]['total_lazada']);
                        arr_lazada.push(tprice_lazada);
                        tprice_lazada_eglips = parseInt(data[index_shop]['total_lazada_eglips']);
                        arr_lazada_eglips.push(tprice_lazada_eglips);                        
                        tprice_sendo = parseInt(data[index_shop]['total_sendo']);
                        arr_sendo.push(tprice_sendo);
                        tprice_beautybox = parseInt(data[index_shop]['total_beautybox']);
                        arr_beautybox.push(tprice_beautybox);
                        tprice_tiki = parseInt(data[index_shop]['total_tiki']);
                        arr_tiki.push(tprice_tiki);
                        tprice_shop_total = tprice_sky007 + tprice_shoppe + tprice_lotte + tprice_shoppe_eglips + tprice_eglips  + tprice_lazada + tprice_lazada_eglips +tprice_beautybox +tprice_sendo +tprice_tiki ;
                        arr_shop_total.push(tprice_shop_total);
                        tprice_wholesaler_total=tprice_wholesaler + tprice_eglips_wholesaler;
                        arr_wholesaler_total.push(tprice_wholesaler_total)
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
                        var index_shop = "";
                        var tprice_sky007 = 0;
                        var tprice_wholesaler = 0;
                        var tprice_shoppe = 0;
                        var tprice_shoppe_eglips = 0;
                        var tprice_lotte = 0;                        
                        var tprice_eglips = 0;
                        var tprice_sendo = 0;
                        var tprice_eglips_wholesaler = 0;
                        var tprice_lazada = 0;
                        var tprice_lazada_eglips = 0;
                        var tprice_beautybox = 0;
                        var tprice_tiki = 0;                        
                        for (var j = 0; j < data.length; j++) {
                            var time = data[j]['time'];

                            if (date_element == time) {
                                index_shop = j;
                            }
                        }
                        tprice_sky007 = parseInt(data[index_shop]['total_sky007']);
                        arr_sky007.push(tprice_sky007);
                        tprice_wholesaler = parseInt(data[index_shop]['total_wholesaler']);
                        arr_wholesaler.push(tprice_wholesaler);
                        tprice_shoppe = parseInt(data[index_shop]['total_shoppe']);
                        arr_shoppe.push(tprice_shoppe);
                        tprice_shoppe_eglips = parseInt(data[index_shop]['total_shoppe_eglips']);
                        arr_shoppe_eglips.push(tprice_shoppe_eglips);
                        tprice_lotte = parseInt(data[index_shop]['total_lotte']);
                        arr_lotte.push(tprice_lotte); 
                        tprice_sendo = parseInt(data[index_shop]['total_sendo']);
                        arr_sendo.push(tprice_sendo);                        
                        tprice_eglips = parseInt(data[index_shop]['total_eglips']);
                        arr_eglips.push(tprice_eglips);
                        tprice_eglips_wholesaler = parseInt(data[index_shop]['total_eglips_wholesaler']);
                        arr_eglips_wholesaler.push(tprice_eglips_wholesaler);
                        tprice_lazada = parseInt(data[index_shop]['total_lazada']);
                        arr_lazada.push(tprice_lazada);
                        tprice_lazada_eglips = parseInt(data[index_shop]['total_lazada_eglips']);
                        arr_lazada_eglips.push(tprice_lazada_eglips);
                        tprice_beautybox = parseInt(data[index_shop]['total_beautybox']);
                        arr_beautybox.push(tprice_beautybox);
                        tprice_tiki = parseInt(data[index_shop]['total_tiki']);
                        arr_tiki.push(tprice_tiki);
                        tprice_shop_total = tprice_sky007 + tprice_shoppe + tprice_shoppe_eglips + tprice_lotte + tprice_eglips  + tprice_lazada + tprice_lazada_eglips + tprice_beautybox + tprice_tiki;
                        arr_shop_total.push(tprice_shop_total);
                        tprice_wholesaler_total=tprice_wholesaler + tprice_eglips_wholesaler;
                        arr_wholesaler_total.push(tprice_wholesaler_total);

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
                        name: 'Lotte',
                        data: arr_lotte
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
                        name: 'Beautybox',
                        data: arr_beautybox
                    }, {
                        name: 'Tiki',
                        data: arr_tiki
                    }]
                });

              /*  Highcharts.chart('order_monthly_sale_comparison_wholesaler', {
                    chart: {
                        type: 'area'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: 'Source: Sky007.vn'
                    },
                    xAxis: {
                        categories: arr_date_char,
                        tickmarkPlacement: 'on',
                        title: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Percent'
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} )<br/>',
                        split: true
                    },
                    plotOptions: {
                        area: {
                            stacking: 'percent',
                            lineColor: '#ffffff',
                            lineWidth: 1,
                            marker: {
                                lineWidth: 1,
                                lineColor: '#ffffff'
                            }
                        }
                    },
                    series: [{
                        name: 'Wholesaler',
                        data: arr_wholesaler_total
                    }, {
                        name: 'Shop',
                        data: arr_shop_total
                    }]
                }); */
                
                
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
            get_data_number_order(fromdate, todate, "14", "order_lotte", "Number Order Lotte");
            get_data_number_order(fromdate, todate, "15", "order_marketing_lotte", "Number Order Lotte Marketing");
            get_data_number_order(fromdate, todate, "16", "order_sendo", "Number Order Sendo");
            get_data_number_order(fromdate, todate, "17", "order_marketing_sendo", "Number Order Sendo Marketing");
            get_data_number_order(fromdate, todate, "18", "order_eglips", "Number Order Eglips");
            get_data_number_order(fromdate, todate, "19", "order_marketing_eglips", "Number Order Eglips Marketing");
            get_data_number_order(fromdate, todate, "20", "order_lazada", "Number Order Lazada Bbia");
            get_data_number_order(fromdate, todate, "21", "order_marketing_lazada", "Number Order Lazada Bbia Marketing");            
            get_data_number_order(fromdate, todate, "22", "order_eglips_wholesaler", "Number Order Eglips Wholesaler");
            get_data_number_order(fromdate, todate, "24", "order_shopee_eglips", "Number Order Shopee Eglips");
            get_data_number_order(fromdate, todate, "25", "order_marketing_shopee_eglips", "Number Order Shopee Eglips Marketing");            
            get_data_number_order(fromdate, todate, "26", "order_lazada_eglips", "Number Order Lazada Eglips");
            get_data_number_order(fromdate, todate, "27", "order_marketing_lazada_eglips", "Number Order Lazada Eglips Marketing");
            get_data_number_order(fromdate, todate, "34", "order_beautybox", "Number Order Beautybox");
            get_data_number_order(fromdate, todate, "35", "order_marketing_beautybox", "Number Order Beautybox Marketing");
            get_data_number_order(fromdate, todate, "36", "order_tiki", "Number Order Tiki");
            get_data_number_order(fromdate, todate, "37", "order_marketing_tiki", "Number Order Tiki Marketing");


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
                        var membership_type_name = ["Customer", "Shopee", "Lotte", "Eglips", "Lazada","ShopeeEglips","LazadaEglips",'Sendo','Beautybox','Tiki'];
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
                                        arr_Customer_total[i] = total_order;
                                    } else if (roles_type == "10" && date_element == time) {
                                        arr_Shopee_total[i] = total_order;
                                    } else if (roles_type == "14" && date_element == time) {
                                        arr_Lotte_total[i] = total_order;
                                    } else if (roles_type == "16" && date_element == time) {
                                        arr_Sendo_total[i] = total_order;
                                    } else if (roles_type == "18" && date_element == time) {
                                        arr_Eglips_total[i] = total_order;
                                    } else if (roles_type == "20" && date_element == time) {
                                        arr_Lazada_total[i] = total_order;
                                    } else if (roles_type == "24" && date_element == time) {
                                        arr_ShopeeEglips_total[i] = total_order;
                                    } else if (roles_type == "26" && date_element == time) {
                                        arr_LazadaEglips_total[i] = total_order;
                                    } else if (roles_type == "34" && date_element == time) {
                                        arr_Beautybox_total[i] = total_order;
                                    } else if (roles_type == "36" && date_element == time) {
                                        arr_Tiki_total[i] = total_order;
                                    }

                                }
                                // console.log(arr_Customer_total);
                                for (var j = 0; j < data_number.length; j++) {
                                    var roles_type = data_number[j]['ord_category'];
                                    var time = parseInt(data_number[j]['date']);
                                    var total_order = parseInt(data_number[j]['total_order']);
                                    time = (time - 1);
                                    if (roles_type == "0" && date_element == time) {
                                        arr_Customer_number[i] = total_order;
                                    } else if (roles_type == "10" && date_element == time) {
                                        arr_Shopee_number[i] = total_order;
                                    } else if (roles_type == "14" && date_element == time) {
                                        arr_Lotte_number[i] = total_order;
                                    } else if (roles_type == "16" && date_element == time) {
                                        arr_Sendo_number[i] = total_order;
                                    } else if (roles_type == "18" && date_element == time) {
                                        arr_Eglips_number[i] = total_order;
                                    } else if (roles_type == "20" && date_element == time) {
                                        arr_Lazada_number[i] = total_order;
                                    } else if (roles_type == "24" && date_element == time) {
                                        arr_ShopeeEglips_number[i] = total_order;
                                    } else if (roles_type == "26" && date_element == time) {
                                        arr_LazadaEglips_number[i] = total_order;
                                    } else if (roles_type == "34" && date_element == time) {
                                        arr_Beautybox_number[i] = total_order;
                                    }else if (roles_type == "36" && date_element == time) {
                                        arr_Tiki_number[i] = total_order;
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
                                            arr_Customer_total[i] = total_order;
                                        } else if (roles_type == "10" && date_element == time) {
                                            arr_Shopee_total[i] = total_order;
                                        } else if (roles_type == "14" && date_element == time) {
                                            arr_Lotte_total[i] = total_order;
                                        } else if (roles_type == "16" && date_element == time) {
                                            arr_Sendo_total[i] = total_order;
                                        } else if (roles_type == "18" && date_element == time) {
                                            arr_Eglips_total[i] = total_order;
                                        } else if (roles_type == "20" && date_element == time) {
                                            arr_Lazada_total[i] = total_order;
                                        } else if (roles_type == "24" && date_element == time) {
                                            arr_ShopeeEglips_total[i] = total_order;
                                        } else if (roles_type == "26" && date_element == time) {
                                            arr_LazadaEglips_total[i] = total_order;
                                        } else if (roles_type == "34" && date_element == time) {
                                            arr_Beautybox_total[i] = total_order;
                                        } else if (roles_type == "36" && date_element == time) {
                                            arr_Tiki_total[i] = total_order;
                                        }

                                    }
                                    // console.log(arr_Customer_total);
                                    for (var j = 0; j < data_number.length; j++) {
                                        var roles_type = data_number[j]['ord_category'];
                                        var time = data_number[j]['date'];
                                        var total_order = parseInt(data_number[j]['total_order']);
                                        if (roles_type == "0" && date_element == time) {
                                            arr_Customer_number[i] = total_order;
                                        } else if (roles_type == "10" && date_element == time) {
                                            arr_Shopee_number[i] = total_order;
                                        } else if (roles_type == "14" && date_element == time) {
                                            arr_Lotte_number[i] = total_order;
                                        } else if (roles_type == "16" && date_element == time) {
                                            arr_Sendo_number[i] = total_order;
                                        } else if (roles_type == "18" && date_element == time) {
                                            arr_Eglips_number[i] = total_order;
                                        } else if (roles_type == "20" && date_element == time) {
                                            arr_Lazada_number[i] = total_order;
                                        } else if (roles_type == "24" && date_element == time) {
                                            arr_ShopeeEglips_number[i] = total_order;
                                        } else if (roles_type == "26" && date_element == time) {
                                            arr_LazadaEglips_number[i] = total_order;
                                        } else if (roles_type == "34" && date_element == time) {
                                            arr_Beautybox_number[i] = total_order;
                                        } else if (roles_type == "36" && date_element == time) {
                                            arr_Tiki_number[i] = total_order;
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
                            name: 'Shopee Bbia',
                            data: arr_Shopee_total
                        }, {
                            name: 'Lotte',
                            data: arr_Lotte_total
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
                            name: 'Sendo',
                            data: arr_Sendo_total
                        }, {
                            name: 'Beautybox',
                            data: arr_Beautybox_total
                        }, {
                            name: 'Tiki',
                            data: arr_Tiki_total
                        }];

                        //-------------------------------
                        $obj_data_avegare = [{
                            name: 'Customer',
                            data: arr_Customer_average
                        }, {
                            name: 'Shopee Bbia',
                            data: arr_Shopee_average
                        }, {
                            name: 'Lotte',
                            data: arr_Lotte_average
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
                            name: 'Sendo',
                            data: arr_Sendo_average
                        }, {
                            name: 'Beautybox',
                            data: arr_Beautybox_average
                        }, {
                            name: 'Tiki',
                            data: arr_Tiki_average
                        }];
                        //-------------------------------
                        $obj_data_number = [{
                            name: 'Customer',
                            data: arr_Customer_number
                        }, {
                            name: 'Shopee Bbia',
                            data: arr_Shopee_number
                        }, {
                            name: 'Lotte',
                            data: arr_Lotte_number
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
                            name: 'Sendo',
                            data: arr_Sendo_number
                        }, {
                            name: 'Beautybox',
                            data: arr_Beautybox_number
                        }, {
                            name: 'Tiki',
                            data: arr_Tiki_number
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
              
                var data = response["data"];
                   //  console.log(data);return;
                $scope.number_item_eglips = data[0]["eglips_item"];
                $scope.number_cancell_eglips = data[0]["eglips_cancell"];
                $scope.number_order_eglips = data[0]["eglips_order"];
                $scope.number_cancell_eglips_rates = 0 + ' %';
                if (parseInt(data[0]["eglips_cancell"]) != 0) {
                    $scope.number_cancell_eglips_rates = ((parseInt(data[0]["eglips_cancell"]) / parseInt(data[0]["eglips_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_lazada = data[0]["lazada_item"];
                $scope.number_cancell_lazada = data[0]["lazada_cancell"];
                $scope.number_order_lazada = data[0]["lazada_order"];
                $scope.number_cancell_lazada_rates = 0 + ' %';
                if (parseInt(data[0]["lazada_cancell"]) != 0) {
                    $scope.number_cancell_lazada_rates = ((parseInt(data[0]["lazada_cancell"]) / parseInt(data[0]["lazada_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_lotte = data[0]["lotte_item"];
                $scope.number_cancell_lotte = data[0]["lotte_cancell"];
                $scope.number_order_lotte = data[0]["lotte_order"];
                $scope.number_cancell_lotte_rates = 0 + ' %';
                if (parseInt(data[0]["lotte_cancell"]) != 0) {
                    $scope.number_cancell_lotte_rates = ((parseInt(data[0]["lotte_cancell"]) / parseInt(data[0]["lotte_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_sendo = data[0]["sendo_item"];
                $scope.number_cancell_sendo = data[0]["sendo_cancell"];
                $scope.number_order_sendo = data[0]["sendo_order"];
                $scope.number_cancell_sendo_rates = 0 + ' %';
                if (parseInt(data[0]["sendo_cancell"]) != 0) {
                    $scope.number_cancell_sendo_rates = ((parseInt(data[0]["sendo_cancell"]) / parseInt(data[0]["sendo_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
          
                $scope.number_item_sky007 = data[0]["sky007_item"];
                $scope.number_cancell_sky007 = data[0]["sky007_cancell"];
                $scope.number_order_sky007 = data[0]["sky007_order"];
                $scope.number_cancell_sky007_rates = 0 + ' %';
                if (parseInt(data[0]["sky007_cancell"]) != 0) {
                    $scope.number_cancell_sky007_rates = ((parseInt(data[0]["sky007_cancell"]) / parseInt(data[0]["sky007_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_total = data[0]["total_item"];
                $scope.number_item_mt_total = data[0]["total_item_mt"];
                $scope.number_cancell_total = data[0]["total_cancell"];
                $scope.number_order_total = data[0]["total_order"];
                $scope.number_cancell_total_rates = 0 + ' %';
                if (parseInt(data[0]["total_cancell"]) != 0) {
                    $scope.number_cancell_total_rates = ((parseInt(data[0]["total_cancell"]) / parseInt(data[0]["total_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_wholesaler = data[0]["wholesaler_item"];
                $scope.number_cancell_wholesaler = data[0]["wholesaler_cancell"];
                $scope.number_order_wholesaler = data[0]["wholesaler_order"];
                $scope.number_cancell_wholesaler_rates = 0 + ' %';
                if (parseInt(data[0]["wholesaler_cancell"]) != 0) {
                    $scope.number_cancell_wholesaler_rates = ((parseInt(data[0]["wholesaler_cancell"]) / parseInt(data[0]["wholesaler_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_wholesaler_eglips = data[0]["wholesaler_eglips_item"];
                $scope.number_cancell_wholesaler_eglips = data[0]["wholesaler_eglips_cancell"];
                $scope.number_order_wholesaler_eglips = data[0]["wholesaler_eglips_order"];
                $scope.number_cancell_wholesaler_eglips_rates = 0 + ' %';
                if (parseInt(data[0]["wholesaler_eglips_cancell"]) != 0) {
                    $scope.number_cancell_wholesaler_eglips_rates = ((parseInt(data[0]["wholesaler_eglips_cancell"]) / parseInt(data[0]["wholesaler_eglips_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_lazada_eglips = data[0]["lazada_eglips_item"];
                $scope.number_cancell_lazada_eglips = data[0]["lazada_eglips_cancell"];
                $scope.number_order_lazada_eglips = data[0]["lazada_eglips_order"];
                $scope.number_cancell_lazada_eglips_rates = 0 + ' %';
                if (parseInt(data[0]["lazada_eglips_cancell"]) != 0) {
                    $scope.number_cancell_lazada_eglips_rates = ((parseInt(data[0]["lazada_eglips_cancell"]) / parseInt(data[0]["lazada_eglips_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_shopee = data[0]["shopee_item"];
                $scope.number_cancell_shopee = data[0]["shopee_cancell"];
                $scope.number_order_shopee = data[0]["shopee_order"];
                $scope.number_cancell_shopee_rates = 0 + ' %';
                if (parseInt(data[0]["shopee_cancell"]) != 0) {
                    $scope.number_cancell_shopee_rates = ((parseInt(data[0]["shopee_cancell"]) / parseInt(data[0]["shopee_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_shopee_eglips = data[0]["shopee_eglips_item"];
                $scope.number_cancell_shopee_eglips = data[0]["shopee_eglips_cancell"];
                $scope.number_order_shopee_eglips = data[0]["shopee_eglips_order"];
                $scope.number_cancell_shopee_rates_eglips = 0 + ' %';
                if (parseInt(data[0]["shopee_eglips_cancell"]) != 0) {
                    $scope.number_cancell_shopee_rates_eglips = ((parseInt(data[0]["shopee_eglips_cancell"]) / parseInt(data[0]["shopee_eglips_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                $scope.number_item_beautybox = data[0]["beautybox_item"];
                $scope.number_cancell_beautybox = data[0]["beautybox_cancell"];
                $scope.number_order_beautybox = data[0]["beautybox_order"];
                $scope.number_cancell_beautybox_rates = 0 + ' %';
                if (parseInt(data[0]["beautybox_cancell"]) != 0) {
                    $scope.number_cancell_beautybox_rates = ((parseInt(data[0]["beautybox_cancell"]) / parseInt(data[0]["beautybox_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                $scope.number_item_tiki = data[0]["tiki_item"];
                $scope.number_cancell_tiki = data[0]["tiki_cancell"];
                $scope.number_order_tiki = data[0]["tiki_order"];
                $scope.number_cancell_tiki_rates = 0 + ' %';
                if (parseInt(data[0]["tiki_cancell"]) != 0) {
                    $scope.number_cancell_tiki_rates = ((parseInt(data[0]["tiki_cancell"]) / parseInt(data[0]["tiki_order"]) * 100).toString()).substring(0, 4) + ' %';
                }
                
                if (get_all == 1) {
                    $scope.time_search = fromdate + " ~ " + todate;
                } else {
                    $scope.time_search = "Begining";
                }
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
                    // console.log(d);return;                   
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
                  //  console.log(d);//return;
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
//============================ Data report location ========================================

App.controller('RDLocationCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRLocation");
        set_date_time($scope, '7');
        $aa=check_district(" Nhà s? 4, ngõ 31 ph? Phan Ðình Giót, Phu?ng Phuong Li?t, Qu?n Thanh Xuân, Hà N?i","TP HCM");
        console.log($aa);
        $scope.loadData = function() {
           // load_data();
        }
        $scope.data_fillter = function() {
          //  load_data();
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
            var table = $('#tb_loation_report').DataTable();
            table.clear();
            table.destroy();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_data_report_location",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                   // console.log(d);return;
                    var data = $.parseJSON(d);
                 //  console.log(data); 
                //    var list_order=data["list_order"];
                   
                    
                    var table = $('#tb_loation_report').DataTable({
                        "order": [
                            [1, "desc"]
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
                },
                error: function(e) {
                    console.log(e);
                }
            })
            /* TP HCM
            1	Qu?n 1 ; 2	Qu?n 12 ; 3	Qu?n Th? Ð?c; 4	Qu?n 9 ; 5	Qu?n Gò V?p ; 6	Qu?n Bình Th?nh ; 7	Qu?n Tân Bình ;8	Qu?n Tân Phú
            9	Qu?n Phú Nhu?n ; 10	Qu?n 2 ; 11	Qu?n 3 ; 12	Qu?n 10 ; 13	Qu?n 11 ; 14	Qu?n 4 ; 15	Qu?n 5 ; 16	Qu?n 6 ; 17	Qu?n 8
            18	Qu?n Bình Tân ; 19	Qu?n 7 ; 20	Huy?n C? Chi ; 21	Huy?n Hóc Môn ; 22	Huy?n Bình Chánh ; 23	Huy?n Nhà Bè ; 24	Huy?n C?n Gi?
            */
            //------------
            /* Hà N?i
            1	Qu?n Ba Ðình ; 2	Qu?n Hoàn Ki?m ;3	Qu?n Tây H? ; 4	Qu?n Long Biên ; 5	Qu?n C?u Gi?y ; 6	Qu?n Ð?ng Ða ; 7	Qu?n Hai Bà Trung	
            8	Qu?n Hoàng Mai	; 9	Qu?n Thanh Xuân ; 10	Huy?n Sóc Son ; 11	Huy?n Ðông Anh ; 12	Huy?n Gia Lâm ; 13	Qu?n Nam T? Liêm	
            14	Huy?n Thanh Trì	; 15	Qu?n B?c T? Liêm ; 16	Huy?n Mê Linh ; 17	Qu?n Hà Ðông ; 18	Th? xã Son Tây ; 19	Huy?n Ba Vì	
            20	Huy?n Phúc Th?	; 21	Huy?n Ðan Phu?ng ; 22	Huy?n Hoài Ð?c ; 23	Huy?n Qu?c Oai ; 24	Huy?n Th?ch Th?t ; 25	Huy?n Chuong M?	
            26	Huy?n Thanh Oai	; 27	Huy?n Thu?ng Tín ; 28	Huy?n Phú Xuyên ; 29	Huy?n ?ng Hòa ; 30	Huy?n M? Ð?c
            */
            
        }
        function check_district(str,city){
            // check HCM 
            $result=0;
            str=str.toLowerCase();          
            str= str.replace(/è|é|?|?|?|ê|?|?|?|?|?/g,"e");
            str= str.replace(/ì|í|?|?|i/g,"i");
            str= str.replace(/ò|ó|?|?|õ|ô|?|?|?|?|?|o|?|?|?|?|?/g,"o");
            str= str.replace(/ù|ú|?|?|u|u|?|?|?|?|?/g,"u");
            str= str.replace(/?|ý|?|?|?/g,"y");
            str= str.replace(/d/g,"d");
            if(city=="TP HCM"){
                
            }else if(city=="Hà N?i"){ // check Hà N?i 
                
            }
            return str;
        }
    }
]);
//======================== End data report Location ========================================
//============================ Direct Order ========================================

App.controller('RDDirectOrderCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
     //   limit_permisstion_menu("chkDRDirectOrder");
        set_date_time($scope, '0');
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

//============================ Items ========================================

App.controller('RDItemsCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
        limit_permisstion_menu("chkDRItems");
        set_date_time($scope, '30');
        $scope.loadData = function() {
            load_data();
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
            
            
            var html_table='';
            $("#tb_item_report").empty();
            if(company=="0"){                
                html_table='<thead>\
                                <tr style="background-color: #BCBCBC;color: white;">\
                                   <th class="hidden-xs">Items ID</th>\
                                   <th class="hidden-xs">Product Name</th>\
                                   <th class="hidden-xs">Total sales qty</th>\
                                   <th class="hidden-xs">Customer sale qty</th>\
                                   <th class="hidden-xs">Customer Total Price</th>\
                                   <th class="hidden-xs">Sky007 Marketing qty</th>\
                                   \
                                   <th class="hidden-xs">Wholesaler sale qty</th>\
                                   <th class="hidden-xs">Wholesaler Total Price</th>\
                                   \
                                   <th class="hidden-xs">Shopee Bbia sale qty</th>\
                                   <th class="hidden-xs">Shopee Bbia Total Price</th>\
                                   <th class="hidden-xs">Shopee Bbia Marketing qty</th>\
                                   \
                                   <th class="hidden-xs">Lotte sale qty</th>\
                                   <th class="hidden-xs">Lotte Total Price</th>\
                                   <th class="hidden-xs">Lotte Marketing qty</th>\
                                  \
                                   <th class="hidden-xs">Lazada Bbia sale qty</th>\
                                   <th class="hidden-xs">Lazada Bbia Total Price</th>\
                                   <th class="hidden-xs">Lazada Bbia Marketing qty</th>\
                                   \
                                   <th class="hidden-xs">W Jnain Total Price</th>\
                                   <th class="hidden-xs">W Jnain sale qty</th>\
                                   \
                                   <th class="hidden-xs">Beautybox sale qty</th>\
                                   <th class="hidden-xs">Beautybox Total Price</th>\
                                   <th class="hidden-xs">Beautybox Marketing qty</th>\
                                   \
                                   <th class="hidden-xs">Tiki sale qty</th>\
                                   <th class="hidden-xs">Tiki Total Price</th>\
                                   <th class="hidden-xs">Tiki Marketing qty</th>\
                                </tr>\
                             </thead>';
            }else if(company=="1"){               
                html_table='<thead>\
                                <tr style="background-color: #BCBCBC;color: white;">\
                                   <th class="hidden-xs">Items ID</th>\
                                   <th class="hidden-xs">Product Name</th>\
                                   <th class="hidden-xs">Total sales qty</th>\
                                   \
                                   <th class="hidden-xs">Eglips sale qty</th>\
                                   <th class="hidden-xs">Eglips Total Price</th>\
                                   <th class="hidden-xs">Eglips Marketing qty</th>\
                                   \
                                   <th class="hidden-xs">Wholesaler Eglips sale qty</th>\
                                   <th class="hidden-xs">Wholesaler Eglips Total Price</th>\
                                   \
                                   <th class="hidden-xs">Shopee Eglips sale qty</th>\
                                   <th class="hidden-xs">Shopee Eglips Total Price</th>\
                                   <th class="hidden-xs">Shopee Eglips Marketing qty</th>\
                                   \
                                   <th class="hidden-xs">Lazada Eglips sale qty</th>\
                                   <th class="hidden-xs">Lazada Eglips Total Price</th>\
                                   <th class="hidden-xs">Lazada Eglips Marketing qty</th>\
                                   \
                                   <th class="hidden-xs">Robins sale qty</th>\
                                   <th class="hidden-xs">Robins Total Price</th>\
                                   <th class="hidden-xs">Robins Marketing qty</th>\
                                   \
                                   <th class="hidden-xs">Watsons sale qty</th>\
                                   <th class="hidden-xs">Watsons Total Price</th>\
                                   <th class="hidden-xs">Watsons Marketing qty</th>\
                                   \
                                   \
                                   <th class="hidden-xs">Sendo sale qty</th>\
                                   <th class="hidden-xs">Sendo Total Price</th>\
                                   <th class="hidden-xs">Sendo Marketing qty</th>\
                                   \
                                   <th class="hidden-xs">W Actsone Total Price</th>\
                                   <th class="hidden-xs">W Actsone sale qty</th>\
                                   \
                                </tr>\
                             </thead>';
            }
            $("#tb_item_report").append(html_table);
            var obj = {
                "start_date": fromdate,
                "end_date": todate,
                "product_type": product_type,
                "company" :company
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
                    var obj_show_data="";
                    if(company=="0"){
                        obj_show_data=[
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
                                            "data": "total_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "user_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "user_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "wholesaler_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "wholesaler_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "shopee_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "shopee_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "shopee_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "lotte_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "lotte_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "lotte_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "lazada_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "lazada_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "lazada_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "w_jnain_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "w_jnain_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "beautybox_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "beautybox_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "beautybox_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "tiki_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "tiki_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "tiki_marketing_quantity"
                                        }
                                      ];
                    }else if(company=="1"){
                        obj_show_data=[
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
                                            "data": "total_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "eglips_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "eglips_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "eglips_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "wholesaler_eglips_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "wholesaler_eglips_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "shopee_eglips_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "shopee_eglips_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "shopee_eglips_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "lazada_eglips_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "lazada_eglips_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "lazada_eglips_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "robin_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "robin_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "robin_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "watsons_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "watsons_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "watsons_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "sendo_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "sendo_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "sendo_marketing_quantity"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "w_actsone_price"
                                        }, 
                                        {
                                            "width": "30px",
                                            "data": "w_actsone_quantity"
                                        }
                                      ];
                    }
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
//======================== End Items =========================================

//============================ Data Report Preparing Order ========================================

App.controller('RDPreparingOrderCtrl', ['$scope', '$localStorage', '$window', '$http',
    function($scope, $localStorage, $window, $http) {
        checkCookie($scope);
       // limit_permisstion_menu("chkDRPreparingOrder");
        set_date_time($scope, '30');
        $scope.loadData = function() {
            load_data();
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
                   // console.log(d);return;
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
            load_data();
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
                // console.log(d);  return;//$compile(row)($scope);
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
            clear_input();
        }
    }
    $("#btnDelete").click(function(){
        var note = $("#txtDeleteReason").val();
        var order_id = $("#btnDelete").attr("order_id")
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
                "note": note
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_delete",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
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
                    // console.log(d);return;
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
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var name = full["name"].replace(/"/g, " ");
                                    var price = full["price"];
                                    var stock = full["stock"];
                                    var html = '<button class="btn btn-info" ng-click="add_order_html(\'' + id + '\',\'' + price + '\',\'' + name + '\',\'' + stock + '\',\'0\')">Add</button>';
                                    return html;
                                }
                            },
                            {
                                "width": "50px",
                                "data": "price_regular"
                            }, {
                                "width": "50px",
                                "data": "stock_regular"
                            }, {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var html = "";
                                    var id = full["id_regular"];
                                    if (id != null) {
                                        var name = full["name"].replace(/"/g, " ");
                                        var price = full["price_regular"];
                                        var stock = full["stock_regular"];
                                        var html = '<button class="btn btn-danger" ng-click="add_order_html(\'' + id + '\',\'' + price + '\',\'' + name + '\',\'' + stock + '\',\'1\')">Add</button>';

                                    }
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
                //  console.log(d);
                if (d == "false") {
                    alert("This order already remove !");
                    return;
                }
                var dt = $.parseJSON(d);
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
             //   console.log(data_excel);
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
                // console.log(d);
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
                                   $("#btnNotifyFinishCancel").click();                                        
                                },
                                error: function(e) {
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
                   // console.log(d);return;
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

//====================== End Order Management =============================================================================

//====================== Stock Management =================================================================================

//============================ Stock Update =====================================

App.controller('SMUpdateCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSMUpdateStock");
        var flat_qty_stock_total = "no";
        var flat_qty_stock = "no";
        var flat_status_stock = "no";
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
                data:{"warehouse":"0"},
                success: function(d) {
                    // console.log(d);
                    var data = $.parseJSON(d);
                    var data_hand_carried = data["list_item_hand_carried"];
                    var data_regular = data["list_item_regular"];
                    // console.log(data_regular);return;
                    var table = $('#tb_list_item').DataTable({
                        "order": [
                            [5, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 5,
                        data: data_hand_carried,
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
                            }, {
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
                                    var stock_total = full[5];
                                    var stock = full[6];
                                    var status = full[7];
                                    var product_type = "Hand Carried Product";
                                    var html = '<button class="btn btn-info" ng-click="update_item(' + id + ',\'' + name + '\',\'' + stock_total + '\',' + stock + ',\'' + status + '\',\'' + product_type + '\')">Update</button>';
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
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var status_item = full[8];
                                    var html = "";
                                    if (status_item == "private") {
                                        html = '<button class="btn btn-primary" ng-click="even_item_status(' + id + ',\'' + status_item + '\')">Private</button>';
                                    } else if (status_item == "publish") {
                                        html = '<button class="btn btn-danger" ng-click="even_item_status(' + id + ',\'' + status_item + '\')">Publish</button>';
                                    }
                                    return html;
                                }
                            }
                        ]
                    });



                    var table_regular = $('#tb_list_item_regular').DataTable({
                        "order": [
                            [4, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 5,
                        data: data_regular,
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
                            }, {
                                "width": "50px"
                            },
                            {
                                "width": "50px"
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full[0];
                                    var name = full[2].replace(/"/g, " ");
                                    var stock_total = full[5];
                                    var stock = full[6];
                                    var status = full[7];
                                    var product_type = "Regular Product";
                                    var html = '<button class="btn btn-info" ng-click="update_item(' + id + ',\'' + name + '\',\'' + stock_total + '\',' + stock + ',\'' + status + '\',\'' + product_type + '\')">Update</button>';
                                    return html;
                                }
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full[0];
                                    var name = full[2].replace(/"/g, " ");
                                    var html = '<button class="btn btn-warning" ng-click="history_comming(' + id + ',\'' + name + '\')">History</button>';
                                    return html;
                                }
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var status_item = full[8];
                                    var html = "";
                                    if (status_item == "private") {
                                        html = '<button class="btn btn-primary" ng-click="even_item_status(' + id + ',\'' + status_item + '\')">Private</button>';
                                    } else if (status_item == "publish") {
                                        html = '<button class="btn btn-danger" ng-click="even_item_status(' + id + ',\'' + status_item + '\')">Publish</button>';
                                    }
                                    return html;
                                }
                            }
                        ]
                    });
                    $("#img_load_regular").hide();
                    $("#img_load").hide();
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
        $scope.update_item = function(id, name, stock_total, stock, status, product_type) {
            $("#divDetail").show();
            $("#detail_history").hide();
            $("#txtNote").focus();
            $("#txtItemName").val(name);
            $("#txtItemID").val(id);

            $("#txtStock").val(stock);
            $("#txtStockTotal").val(stock_total);
            $("#cboStatus").val(status);
            $("#txtIncoming").attr("product_type", product_type);
            var cboStatus = document.getElementById('cboStatus');
            for (var i = 0; i < cboStatus.options.length; i++) {
                if (cboStatus.options[i].value === status) {
                    cboStatus.selectedIndex = i;
                    break;
                }
            }

        }
        $("#txtStock").change(function() {
            flat_qty_stock = "yes";
        })
        $("#cboStatus").change(function() {
            flat_status_stock = "yes";
        })
        $("#txtStockTotal").change(function() {
            flat_qty_stock_total = "yes";
        })
        $("#btnChange").click(function() {
            var note = $("#txtNote").val();
            var stock_total = $("#txtStockTotal").val();
            var stock = $("#txtStock").val();
            var status = $("#cboStatus").val();
            var item_id = $("#txtItemID").val();
            var manager_name = getCookie("ck_name");
            var product_type = $("#txtIncoming").attr("product_type");
            var obj = {
                "item_id": item_id,
                "status": status,
                "note": note,
                "stock_total": stock_total,
                "stock": stock,
                "flat_stock_total": flat_qty_stock_total,
                "flat_stock": flat_qty_stock,
                "flat_status": flat_status_stock,
                "manager_name": manager_name,
                "product_type": product_type
            };
            if (note == "") {
                $("#txtNote").focus();
                alert("Please write down reaseon !");
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
                    $("#txtIncoming").attr("product_type", "");
                    flat_qty_stock = "no";
                    flat_status_stock = "no";
                    $("#txtNote").val("");
                },
                error: function(e) {
                    alert(e);
                }
            });
        })
        $("#btnSaveBorrow").click(function() {
            var note = $("#txtNoteBorrow").val();           
            var stockSky007 = $("#txtStockSky007").val();         
            var item_id = $("#txtItemID").val();
            var manager_name = getCookie("ck_name");          
            var obj = {
                "item_id": item_id,               
                "note": note,               
                "stock_sky007": stockSky007,              
                "manager_name": manager_name
            };
            if (note == "") {
                $("#txtNote").focus();
                alert("Please write down reaseon !");
                return;
            }if (stockSky007==""){
                $("#txtNoteBorrow").focus();
                alert("Please insert quantity !");
                return;
            }
            $("#btnSaveBorrow").hide();
            $("#imgloadborrow").show();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_borrow_stock_hcm",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    if(d=="true"){
                        $("#btnNotifyFinish").click();
                        $("#imgloadborrow").hide();
                        $("#btnSaveBorrow").show();
                        load_data();
                        $("#divDetail").hide();
                        $("#txtIncoming").attr("product_type", "");                  
                        $("#txtNoteBorrow").val("");
                        $("#txtStockSky007").val(""); 
                    }else{
                        alert(d);                      
                        $("#imgloadborrow").hide();
                        $("#btnSaveBorrow").show();
                        load_data();
                        $("#divDetail").hide();
                        $("#txtIncoming").attr("product_type", "");                  
                        $("#txtNoteBorrow").val("");
                        $("#txtStockSky007").val(""); 
                    }
                  //  console.log(d);
                   
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
                var product_type = $("#txtIncoming").attr("product_type");
                var manager_name= getCookie("ck_name");
                var obj = {
                    "item_id": item_id,
                    "incoming_qty": incoming_qty,
                    "expiration": expiration,
                    "lot_number": lot_number,
                    "manager_name":manager_name,
                    "product_type": product_type
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
                        $("#txtIncoming").attr("product_type", "");
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
                            },
                            {
                                "width": "50px"
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
                            },
                            {
                                "width": "50px"
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
                    var data_hand_carried = data["list_item_hand_carried"];
                    var data_regular = data["list_item_regular"];
                    // console.log(data_regular);return;
                    var table = $('#tb_list_item').DataTable({
                        "order": [
                            [5, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 5,
                        data: data_hand_carried,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data":data_hand_carried["id"]
                            },
                            {
                                "width": "50px",
                                "data":data_hand_carried["sku"]
                            },
                            {
                                "width": "50px",
                                "data":data_hand_carried["name"]
                            },
                            {
                                "width": "50px",  
                                "data":data_hand_carried["o_price"]
                            },
                            {
                                "width": "50px",
                                "data":data_hand_carried["price"]
                            },
                            {
                                "width": "50px",
                                "data":data_hand_carried["stock_total"]
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    var id = full[0];
                                    var name = full[2].replace(/"/g, " ");
                                    var stock_total = full[5];
                                    var stock = full[6];
                                    var status = full[7];
                                    var product_type = "Hand Carried Product";
                                    var html = '<button class="btn btn-info" ng-click="update_item(' + id + ',\'' + name + '\',\'' + stock_total + '\',\'' + product_type + '\')">Update</button>';
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



                    var table_regular = $('#tb_list_item_regular').DataTable({
                        "order": [
                            [4, "desc"]
                        ],
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],
                        pageLength: 5,
                        data: data_regular,
                        lengthMenu: [
                            [5, 10, 20, 30, 50, -1],
                            [5, 10, 20, 30, 50, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                            $compile(row)($scope);
                        },
                        "columns": [{
                                "width": "30px",
                                "data":data_regular["id"]
                            },
                            {
                                "width": "50px",
                                "data":data_regular["sku"]
                            },
                            {
                                "width": "50px",
                                "data":data_regular["name"]
                            },
                            {
                                "width": "50px",  
                                "data":data_regular["o_price"]
                            },
                            {
                                "width": "50px",
                                "data":data_regular["price"]
                            },
                            {
                                "width": "50px",
                                "data":data_regular["stock_total"]
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full[0];
                                    var name = full[2].replace(/"/g, " ");
                                    var stock_total = full[5];
                                    var stock = full[6];
                                    var status = full[7];
                                    var product_type = "Regular Product";
                                    var html = '<button class="btn btn-info" ng-click="update_item(' + id + ',\'' + name + '\',\'' + stock_total + '\',\'' + product_type + '\')">Update</button>';
                                    return html;
                                }
                            },
                            {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full[0];
                                    var name = full[2].replace(/"/g, " ");
                                    var html = '<button class="btn btn-warning" ng-click="history_comming(' + id + ',\'' + name + '\')">History</button>';
                                    return html;
                                }
                            }
                        ]
                    });
                    $("#img_load_regular").hide();
                    $("#img_load").hide();
                },
                error: function(e) {
                    console.log(e);
                }
            })

        }
       
        $scope.update_item = function(id, name, stock_total,  product_type) {
            $("#divDetail").show();
            $("#detail_history").hide();
            $("#txtNote").focus();
            $("#txtItemName").val(name);
            $("#txtItemID").val(id);
            $("#txtStockTotal").val(stock_total);
            $("#txtIncoming").attr("product_type", product_type);
        }       
       
        $("#btnChange").click(function() {
            var note = $("#txtNote").val();
            var stock_total = $("#txtStockTotal").val();
            var stock = $("#txtStock").val();
            var status = $("#cboStatus").val();
            var item_id = $("#txtItemID").val();
            var manager_name = getCookie("ck_name");
            var product_type = $("#txtIncoming").attr("product_type");
            var obj = {
                "item_id": item_id,
                "status": status,
                "note": note,
                "stock_total": stock_total,
                "stock": stock,   
                "manager_name": manager_name,
                "product_type": product_type
            };
            if (note == "") {
                $("#txtNote").focus();
                alert("Please write down reaseon !");
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
                    $("#txtIncoming").attr("product_type", "");
                    flat_qty_stock = "no";
                    flat_status_stock = "no";
                    $("#txtNote").val("");
                },
                error: function(e) {
                    alert(e);
                }
            });
        })
        $("#btnSaveBorrow").click(function() {
            var note = $("#txtNoteBorrow").val();           
            var stockEglips = $("#txtStockEglips").val(); 
            var stockLazadaEglips = $("#txtStockLazadaEglips").val();         
            var item_id = $("#txtItemID").val();
            var manager_name = getCookie("ck_name");          
           
            if (note == "") {
                $("#txtNote").focus();
                alert("Please write down reaseon !");
                return;
            }if (stockLazadaEglips==""){
                stockLazadaEglips=0;
            }if (stockEglips==""){
               stockEglips=0;
            }
            if (stockEglips==0 && stockLazadaEglips==0){
                $("#txtNoteBorrow").focus();
                alert("Please insert quantity !");
                return;
            }
            
             var obj = {
                "item_id": item_id,               
                "note": note,               
                "stock_eglips": stockEglips,  
                "stock_lazada_eglips": stockLazadaEglips,              
                "manager_name": manager_name
            };
            $("#btnSaveBorrow").hide();
            $("#imgloadborrow").show();
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_update_stock_borrow_stock_hn",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
                    if(d=="true"){
                        $("#btnNotifyFinish").click();
                        $("#imgloadborrow").hide();
                        $("#btnSaveBorrow").show();
                        load_data();
                        $("#divDetail").hide();
                        $("#txtIncoming").attr("product_type", "");                  
                        $("#txtNoteBorrow").val("");
                        $("#txtStockEglips").val("");
                        $("#txtStockLazadaEglips").val("");
                    }else{
                        alert(d);
                        $("#imgloadborrow").hide();
                        $("#btnSaveBorrow").show();
                        load_data();
                        $("#divDetail").hide();
                        $("#txtIncoming").attr("product_type", "");                  
                        $("#txtNoteBorrow").val("");
                        $("#txtStockEglips").val("");
                        $("#txtStockLazadaEglips").val("");
                    }
                  //  console.log(d);
                   
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
                var product_type = $("#txtIncoming").attr("product_type");
                var obj = {
                    "item_id": item_id,
                    "incoming_qty": incoming_qty,
                    "expiration": expiration,
                    "lot_number": lot_number,
                    "manager_name": manager_name,
                    "product_type": product_type
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
                        $("#txtIncoming").attr("product_type", "");
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
                            },
                            {
                                "width": "50px"
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
                            },
                            {
                                "width": "50px"
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
        update_new_item();
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

            /*   $.ajax({
                    url: "assets/js/connect/server/sv_share_stock.php",
                    type: "POST",
                    data:{"obj_data":obj}   ,         
                    success: function(d) {
                        console.log(d);
                        return;
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
                       <th class="hidden-xs">Stock Website</th>\
                       <th class="hidden-xs">stock_website</th>\
                       <th class="hidden-xs">Price Website</th>\
                       <th class="hidden-xs">Stock Shopee</th>\
                       <th class="hidden-xs">stock_shopee</th>\
                       <th class="hidden-xs">Price Shopee</th>\
                       <th class="hidden-xs">Stock Lotte</th>\
                       <th class="hidden-xs">stock_lotte</th> \
                       <th class="hidden-xs">Price Lotte</th> \
                       <th class="hidden-xs">Stock Lazada</th>\
                       <th class="hidden-xs">stock_lazada</th> \
                       <th class="hidden-xs">Price Lazada</th>   \
                       <th class="hidden-xs">Stock Tiki</th>\
                       <th class="hidden-xs">stock_tiki</th> \
                       <th class="hidden-xs">Price Tiki</th>   \
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
                            label: "Stock Shopee:",
                            name: "stock_shopee"
                        },
                        {
                            label: "Price Shopee:",
                            name: "price_shopee"
                        },
                        {
                            label: "Stock Lotte:",
                            name: "stock_lotte"
                        },
                        {
                            label: "Price Lotte:",
                            name: "price_lotte"
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
                                var total = parseInt(data['stock_web']) + parseInt(data['stock_shopee']) + parseInt(data['stock_lotte']) + parseInt(data['stock_lazada']) + parseInt(data['stock_tiki']);
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
                            data: "stock_lotte",
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
                            data: "price_lotte",
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
                                       columns: [1, 2, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18 ,19,21]
                                    },
                                    title: 'share_stock_TPHCM' + today


                                },
                                {
                                    extend: 'csv',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18,19,21]
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
        var mg_name = getCookie("ck_name");
        $("#btnUpdateShareStock").click(function() {
            $("#btnUpdateShareStock").hide();
            var warehouse = "0";
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
        update_new_item();
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
           //   testtt(obj);
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
                       <th class="hidden-xs">Stock Robins</th>  \
                       <th class="hidden-xs">stock_robins</th> \
                       <th class="hidden-xs">Price Robins</th>  \
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
                            label: "Price Robins:",
                            name: "price_robins"
                        },
                        {
                            label: "Stock Robins:",
                            name: "stock_robins"
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
                                var total =  parseInt(data['stock_eglips']) + parseInt(data['stock_shopee_eglips'])+ parseInt(data['stock_robins']);
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
                            data: "stock_robins",
                            width: "50px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                return "";
                            },
                            "visible": false
                        },
                        {
                            data: "price_robins",
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

App.controller('SMSBorrowStockCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
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
                       <th class="hidden-xs">Stock Lazada Eglips</th>\
                       <th class="hidden-xs">stock_lazada_eglips</th> \
                       <th class="hidden-xs">Price Lazada Eglips</th>  \
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
                            label: "Price Lazada Eglips:",
                            name: "price_lazada_eglips"
                        },
                        {
                            label: "Stock Lazada Eglips:",
                            name: "stock_lazada_eglips"
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
                                        columns: [1, 2, 3, 4, 5, 7, 8,10,11,13,14,16]
                                    },
                                    title: 'share_stock_borrow_TPHCM' + today


                                },
                                {
                                    extend: 'csv',
                                    exportOptions: {
                                        columns: [1, 2, 3, 4, 5, 7, 8,10,11,13,14,16]
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
]);

//============================= end borrow stock ===============================


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
                       <th class="hidden-xs">Product ID</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Item Name</th>\
                       <th class="hidden-xs">Hand Carried Stock</th>\
                       <th class="hidden-xs">Regular Stock</th> \
                       <th class="hidden-xs">Total Stock</th>\
                       <th class="hidden-xs">Eglips Website (borrow)</th>\
                        <th class="hidden-xs">Lazada Eglips (borrow)</th>\
                    </tr>\
                 </thead>'; 
                $("#tb_list_item").append(html);
          
           
            $obj={"warehouse":warehouse,"brain_name":brain_name};      
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_stock_management_check_stock",
                type: "POST",
                data:{"obj":$obj},
                success: function(d) {
                 //   console.log(d);
                    var data = $.parseJSON(d);                                 
                    // console.log(data_regular);return;
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
                                "data":data["product_id"]
                            },
                            {
                                "width": "50px",
                                "data":data["sku"]
                            },
                            {
                                "width": "50px",
                                "data":data["product_name"]
                            },
                            {
                                "width": "50px",  
                                "data":data["stock_hand"]
                            },
                            {
                                "width": "50px",
                                "data":data["stock_ragular"]
                            },
                            {
                                "width": "50px",
                                "data":data["total_stock"]
                            },
                            {
                                "width": "50px",
                                "data":data["stock_eglips"]
                            },
                            {
                                "width": "50px",
                                "data":data["stock_lazada_eglips"]
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
                       <th class="hidden-xs">Product ID</th>\
                       <th class="hidden-xs">SKU</th>\
                       <th class="hidden-xs">Item Name</th>\
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
                    // console.log(data_regular);return;
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
                                "data":data["product_id"]
                            },
                            {
                                "width": "50px",
                                "data":data["sku"]
                            },
                            {
                                "width": "50px",
                                "data":data["product_name"]
                            },
                            {
                                "width": "50px",  
                                "data":data["stock_hand"]
                            },
                            {
                                "width": "50px",
                                "data":data["stock_ragular"]
                            },
                            {
                                "width": "50px",
                                "data":data["total_stock"]
                            },
                            {
                                "width": "50px",
                                "data":data["stock_web"]
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

//====================== End Stock Management =============================================================================

//====================== Setting ==========================================================================================

//============================ Setting Event Marketing ===========================

App.controller('SEventMarketingCtrl', ['$scope', '$localStorage', '$window', '$http', '$compile',
    function($scope, $localStorage, $window, $http, $compile) {
        checkCookie($scope);
        limit_permisstion_menu("chkSEventMarketing");
        $scope.loadData = function() {
            load_list_item();
            loaddata_event();
        }

        function load_list_item() {
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_marketing_get_list_item",
                type: "GET",
                async: false,
                success: function(d) {
                    var data = $.parseJSON(d);
                    //console.log(data);   return;
                    var table = $('#tb_list_item').DataTable();
                    table.destroy();
                    var table = $('#tb_list_item').DataTable({
                        "order": [
                            [0, "desc"]
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
                        "columns": [{
                            "width": "20px"
                        }, {
                            "width": "100px"
                        }, {
                            "width": "20px"
                        }, {
                            "width": "10px",
                            "render": function(data, type, full, meta) {
                                var id = full[0];
                                var name = full[1].replace(/"/g, " ");
                                var html = '<button class="btn btn-info" ng-click="add_event_html(\'' + id + '\',\'' + name + '\')">Add</button>';
                                return html;
                            }
                        }]
                    });
                },
                error: function(e) {
                    alert(e);
                }

            });
        }
        $scope.add_event_html = function(id, name) {
            var obj = {
                "item_id": id,
                "product_name": name
            };
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_setting_event_marketing_insert_event",
                type: "POST",
                data: {
                    "obj": obj
                },
                success: function(d) {
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
                ajax: "assets/js/connect/server/sv_setting_event_marketing.php",
                table: "#tb_list_event_setting",
                fields: [{
                    label: "Quantity Event:",
                    name: "quantity_event"
                }, {
                    label: "Total Price:",
                    name: "total_price"
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
                    name: "status",
                    type: "select",
                    options: [{
                            label: "Stop",
                            value: "0"
                        },
                        {
                            label: "Start",
                            value: "1"
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
                ajax: "assets/js/connect/server/sv_setting_event_marketing.php",
                order: [
                    [1, 'asc']
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
                    }, {
                        data: "product_name"
                        //	width: "100px"
                    }, {
                        data: "quantity_event"
                        //	width: "20"
                    }, {
                        data: "total_price"
                        //	width: "50px",
                        //	render: $.fn.dataTable.render.number(',', '.', 0, '')
                    }, {
                        data: "start_time"
                    }, {
                        data: "end_time"
                    }, {
                        data: "status",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "Stop";
                            } else if (val == 1) {
                                html = "Start";
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
]);
//======================== End Setting Event Marketing ============================

//======================== Schedule Calendar ======================================




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
        // limit_permisstion("7001");
        $scope.loadData = function() {
            get_list_product();
            loaddata_event();
        }

        function get_list_product() {
            //alert(123);
            $.ajax({
                url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_order_management_update_order_list_product",
                type: "POST",
                data: {
                    "shoptype": 1,
                    "warehouse":0
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
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var id = full["id"];
                                    var name = full["name"].replace(/"/g, " ");
                                    var price = full["price"];
                                    var stock = full["stock"];
                                    var html = '<button class="btn btn-info" ng-click="add_event_html(\'' + id + '\',\'' + price + '\',\'' + name + '\',\'0\')">Add</button>';
                                    return html;
                                }
                            },
                            {
                                "width": "50px",
                                "data": "price_regular"
                            }, {
                                "width": "50px",
                                "data": "stock_regular"
                            }, {
                                "width": "10px",
                                "render": function(data, type, full, meta) {
                                    //  var html = '<input  name="chk" value="' + full[0] + '" type="checkbox" />';
                                    var html = "";
                                    var id = full["id_regular"];
                                    if (id != null) {
                                        var name = full["name"].replace(/"/g, " ");
                                        var price = full["price_regular"];
                                        var stock = full["stock_regular"];
                                        var html = '<button class="btn btn-danger" ng-click="add_event_html(\'' + id + '\',\'' + price + '\',\'' + name + '\',\'1\')">Add</button>';

                                    }
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

        $scope.add_event_html = function(id, price, name, product_type) {
            var obj = {
                "item_id": id,
                "item_price": price,
                "product_name": name,
                "product_type": product_type
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
                        data: "product_type",
                        "render": function(val, type, row) {
                            var html = "";
                            if (val == 0) {
                                html = "Hand Carried Item";
                            } else if (val == 1) {
                                html = "Regular Item";
                            }
                            return html;
                        }

                        //width: "20px"
                    }, {
                        data: "sale_price"
                        //	width: "100px"
                    }, {
                        data: "regular_price"
                        //	width: "20"
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
]);
//======================== End Setting Event Sale of ============================
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
//====================== End Setting ======================================================================================

//====================== liblary ======================================================================================
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