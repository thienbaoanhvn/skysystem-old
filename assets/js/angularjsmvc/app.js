/*
 *  Document   : app.js
 *  Author     : pixelcave
 *  Description: Setting up and vital functionality for our App
 *
 */

// Create our angular module
var App = angular.module('app', [
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad'
]);

// Router configuration
App.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider            
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'assets/views/dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/slick/slick.min.css',
                                'assets/js/plugins/slick/slick-theme.min.css'                                
                            ]
                        });
                    }]
                }
            })
            .state('ctCustomer', {
                url: '/chartreport/customer',
                templateUrl: 'assets/views/report_chart_customer.html',
                controller: 'RCCustomerCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert2/sweetalert2.min.css'
                            ]
                        });
                    }]
                }
            })
            .state('ctCategory', {
                url: '/chartreport/category',
                templateUrl: 'assets/views/report_chart_category.html',
                controller: 'RCCategoryCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert2/sweetalert2.min.css'
                            ]
                        });
                    }]
                }
            })
            .state('ctLocation', {
                url: '/chartreport/location',
                templateUrl: 'assets/views/report_chart_location.html',
                controller: 'RCLocationCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert2/sweetalert2.min.css'
                            ]
                        });
                    }]
                }
            })
            .state('ctItems', {
                url: '/chartreport/items',
                templateUrl: 'assets/views/report_chart_items.html',
                controller: 'RCItemsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.1.0/css/buttons.dataTables.min.css"
                                
                            ]
                        });
                    }]
                }
            })
            .state('ctHeatmap', {
                url: '/chartreport/heatmap',
                templateUrl: 'assets/views/report_chart_heatmap.html',
                controller: 'RCHeatmapCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://code.highcharts.com/modules/heatmap.js",                          
                                "https://code.highcharts.com/modules/export-data.js",
                                "https://code.highcharts.com/modules/accessibility.js"                                
                               
                                
                            ]
                        });
                    }]
                }
            })
            .state('ctTimeBased', {
                url: '/chartreport/timebased',
                templateUrl: 'assets/views/report_chart_time_based.html',
                controller: 'RCTimeBasedCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert2/sweetalert2.min.css'
                            ]
                        });
                    }]
                }
            }) 
            .state('ctMonthlySale', {
                url: '/chartreport/monthlysale',
                templateUrl: 'assets/views/report_chart_monthly_sale.html',
                controller: 'RCMonthlySaleCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert2/sweetalert2.min.css'
                            ]
                        });
                    }]
                }
            }) 
            .state('ctOrder', {
                url: '/chartreport/order',
                templateUrl: 'assets/views/report_chart_order.html',
                controller: 'RCOrderCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert2/sweetalert2.min.css'
                            ]
                        });
                    }]
                }
            }) 
            .state('ctMembershipOrder', {
                url: '/chartreport/membership_order',
                templateUrl: 'assets/views/report_chart_membership_order.html',
                controller: 'RCMembershipOrderCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert2/sweetalert2.min.css'
                            ]
                        });
                    }]
                }
            })
            .state('ctMonthlyMembershipOrder', {
                url: '/chartreport/monthly_membership_order',
                templateUrl: 'assets/views/report_chart_monthly_membership.html',
                controller: 'RCMonthlyMembershipOrderCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert2/sweetalert2.min.css'
                            ]
                        });
                    }]
                }
            })
            .state('drShipping', {
                url: '/datareport/shipping',
                templateUrl: 'assets/views/report_data_shipping.html',
                controller: 'RDShippingCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })  
            .state('drOrder', {
                url: '/datareport/order',
                templateUrl: 'assets/views/report_data_order.html',
                controller: 'RDOrderCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('drOrderVNPAY', {
                url: '/datareport/order_vnpay',
                templateUrl: 'assets/views/report_data_order_vnpay.html',
                controller: 'RDOrderVNpayCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('drLocation', {
                url: '/datareport/location',
                templateUrl: 'assets/views/report_data_location.html',
                controller: 'RDLocationCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('drLocationCompare', {
                url: '/datareport/location_compare',
                templateUrl: 'assets/views/report_data_location_compare.html',
                controller: 'RDLocationCompareCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('drDirectOrder', {
                url: '/datareport/direct_order',
                templateUrl: 'assets/views/report_data_direct_order.html',
                controller: 'RDDirectOrderCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })   
            .state('drShopItems', {
                url: '/datareport/shop_items',
                templateUrl: 'assets/views/report_data_shop_items.html',
                controller: 'RDShopItemsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('drItems', {
                url: '/datareport/items',
                templateUrl: 'assets/views/report_data_items.html',
                controller: 'RDItemsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('drHeatmap', {
                url: '/datareport/heatmap',
                templateUrl: 'assets/views/report_data_heatmap.html',
                controller: 'RDHeatmapCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('drWatsons', {
                url: '/datareport/watsons',
                templateUrl: 'assets/views/report_data_watsons.html',
                controller: 'RDWatsonsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('drPreparingOrder', {
                url: '/datareport/PreparingOrder',
                templateUrl: 'assets/views/report_data_prepare_order.html',
                controller: 'RDPreparingOrderCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })  
            
            /*.state('drTax', {
                url: '/datareport/Tax',
                templateUrl: 'assets/views/report_data_tax.html',
                controller: 'RDTaxCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })  */
            .state('drCancelled', {
                url: '/datareport/cancelled',
                templateUrl: 'assets/views/report_data_cancelled.html',
                controller: 'RDUCancelledCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })   
            .state('drMarketing', {
                url: '/datareport/marketing',
                templateUrl: 'assets/views/report_data_marketing.html',
                controller: 'RDUMarketingCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            }) 
            .state('drMembershipOrder', {
                url: '/datareport/membership_order',
                templateUrl: 'assets/views/report_data_membership_order.html',
                controller: 'RDMembershipOrderCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            }) 
            .state('drCoupon', {
                url: '/datareport/coupon',
                templateUrl: 'assets/views/report_data_coupon.html',
                controller: 'RDCouponCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('customers', {
                url: '/customers',
                templateUrl: 'assets/views/customers_management_customer.html',
                controller: 'CMCustomersCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })  
            .state('historyorder', {
                url: '/history-customers',
                templateUrl: 'assets/views/customers_management_history_order.html',
                controller: 'CMHistoryCustomersCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('analysys', {
                url: '/customers-analysys',
                templateUrl: 'assets/views/customers_management_analysys.html',
                controller: 'CMAnalysysCustomersCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            })
            .state('oupdate', {
                url: '/order-update',
                templateUrl: 'assets/views/order_management_update_order.html',
                controller: 'OMUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",                                
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                            ]
                        });
                    }]
                }
            })  
            .state('otracking', {
                url: '/order-tracking',
                templateUrl: 'assets/views/order_management_tracking_order.html',
                controller: 'OMTrackingCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css',
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css"
                            ]
                        });
                    }]
                }
            }) 
            .state('oshipping', {
                url: '/order-shipping',
                templateUrl: 'assets/views/order_management_shipping_order.html',
                controller: 'OMShippingCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css" ,
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',                             
                                
                            ]
                        });
                    }]
                }
            }) 
            .state('ogetdatavat', {
                url: '/get-data-vat',
                templateUrl: 'assets/views/order_management_check_vat.html',
                controller: 'OMGetDataVATCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css" ,
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',                             
                                
                            ]
                        });
                    }]
                }
            }) 
            .state('oCBS', {
                url: '/cancel-bs',
                templateUrl: 'assets/views/order_management_cancel_bfs.html',
                controller: 'OMCancelBSTCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css" ,
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',                             
                                
                            ]
                        });
                    }]
                }
            })
            .state('supdate', {
                url: '/stock-update',
                templateUrl: 'assets/views/stock_management_update_stock.html',
                controller: 'SMUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                            ]
                        });
                    }]
                }
            })           
            .state('sshare', {
                url: '/stock-share',
                templateUrl: 'assets/views/stock_management_share_stock.html',
                controller: 'SMShareCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css"
                            ]
                        });
                    }]
                }
            }) 
            .state('supdatehn', {
                url: '/stock-update-hn',
                templateUrl: 'assets/views/stock_management_update_stock_hn.html',
                controller: 'SMUpdateHNCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                            ]
                        });
                    }]
                }
            })           
            .state('ssharehn', {
                url: '/stock-share-hn',
                templateUrl: 'assets/views/stock_management_share_stock_hn.html',
                controller: 'SMShareHNCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css"
                            ]
                        });
                    }]
                }
            }) 
            .state('ssharems', {
                url: '/share-stock-mixsoon',
                templateUrl: 'assets/views/stock_managemnet_share_stock_mixsoon.html',
                controller: 'SMShareMSCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            }) 
            .state('ssharehince', {
                url: '/share-stock-hince',
                templateUrl: 'assets/views/stock_management_share_stock_hince.html',
                controller: 'SMShareHinceCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            }) 
          /*  .state('ssborrow', {
                url: '/stock-borrow',
                templateUrl: 'assets/views/stock_management_borrow_stock.html',
                controller: 'SMSBorrowStockCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css"
                            ]
                        });
                    }]
                }
            }) */
            .state('ssborrow', {
                url: '/stock-borrow',
                templateUrl: 'assets/views/stock_management_borrow_stock.html',
                controller: 'SMSBorrowStockCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css"
                            ]
                        });
                    }]
                }
            }) 
            
            .state('scheck', {
                url: '/stock-check',
                templateUrl: 'assets/views/stock_management_check_stock.html',
                controller: 'SMCheckStockCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css"
                            ]
                        });
                    }]
                }
            }) 
            .state('shistory', {
                url: '/stock-history',
                templateUrl: 'assets/views/stock_management_history_stock.html',
                controller: 'SMHistoryStockCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css"
                              
                            ]
                        });
                    }]
                }
            })
            .state('sshopmall', {
                url: '/shop-mall',
                templateUrl: 'assets/views/stock_management_shopmall.html',
                controller: 'SMShopMallCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css"
                              
                            ]
                        });
                    }]
                }
            })
            .state('scalendar', {
                url: '/schedule/calendar',
                templateUrl: 'assets/views/schedule_calendar.html',
                controller: 'SCalendarCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/fullcalendar/fullcalendar.min.css',
                                'assets/js/plugins/jquery-ui/jquery-ui.min.js',
                                'assets/js/plugins/fullcalendar/moment.min.js',
                                'assets/js/plugins/fullcalendar/fullcalendar.min.js',
                                'assets/js/plugins/fullcalendar/gcal.min.js',
                                'assets/js/plugins/select2/select2.min.css',
                                'assets/js/plugins/select2/select2-bootstrap.min.css',
                                'assets/js/plugins/select2/select2.full.min.js',
                     
                            ]
                        });
                    }]
                }
            })
            .state('ssettingcombo', {
                url: '/setting-combo',
                templateUrl: 'assets/views/setting_combo.html',
                controller: 'SsettingcomboCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            }) 
            .state('ssettingtiki', {
                url: '/setting-tiki',
                templateUrl: 'assets/views/setting_event_tiki.html',
                controller: 'SsettingtikiCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            }) 
            .state('ssettingflashsale', {
                url: '/setting-flash-sale',
                templateUrl: 'assets/views/setting_flash_sale.html',
                controller: 'SEventflashsaleCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            })
            .state('seventsaleof', {
                url: '/setting-event-sale-of',
                templateUrl: 'assets/views/setting_event_sale_of.html',
                controller: 'SEventSaleOfCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                                          
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            })
            .state('seventsaleofeglips', {
                url: '/setting-event-sale-of-eglips',
                templateUrl: 'assets/views/setting_event_eglipsvn.html',
                controller: 'SEventSaleOfEglipsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                                          
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            })
            .state('ssettingflashsaleeglipsvn', {
                url: '/setting-flash-sale-eglips',
                templateUrl: 'assets/views/setting_flash_sale_eglips.html',
                controller: 'SEventflashsaleeglipsvnCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            })
            .state('seventsaleofmixsoon', {
                url: '/setting-event-sale-of-mixsoon',
                templateUrl: 'assets/views/setting_event_sale_mixsoonvn.html',
                controller: 'SEventSaleOfMixsoonCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                                          
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            })
            .state('supdatemembership', {
                url: '/setting-update-membership',
                templateUrl: 'assets/views/setting_update_membership.html',
                controller: 'SupdatemembershipCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            })
            .state('ssettingaccount', {
                url: '/setting-account',
                templateUrl: 'assets/views/setting_account.html',
                controller: 'SsettingaccountCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js'
                                
                            ]
                        });
                    }]
                }
            })
            .state('ssettingnewproduct', {
                url: '/setting-new-procut',
                templateUrl: 'assets/views/setting_new_product.html',
                controller: 'SsettingnewproductCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js'
                                
                            ]
                        });
                    }]
                }
            })
            .state('ssettingmembership', {
                url: '/setting-membership',
                templateUrl: 'assets/views/setting_membership.html',
                controller: 'SsettingmembershipCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css",
                                "assets/js/plugins/datatables/responsive.dataTables.min.css",
                                "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
                                "https://cdn.datatables.net/select/1.2.1/css/select.dataTables.min.css",
                                "assets/js/plugins/datatable_editor/css/dataTables.editor.css",
                                "assets/js/plugins/datatable_editor/css/editor.dataTables.min.css",
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js'
                                
                            ]
                        });
                    }]
                }
            })
    }
]);

// Tooltips and Popovers configuration
App.config(['$uibTooltipProvider',
    function ($uibTooltipProvider) {
        $uibTooltipProvider.options({
            appendToBody: true
        });
    }
]);

// Custom UI helper functions
App.factory('uiHelpers', function () {
    return {
        // Handles active color theme
        uiHandleColorTheme: function (themeName) {
            var colorTheme = jQuery('#css-theme');

            if (themeName) {
                if (colorTheme.length && (colorTheme.prop('href') !== 'assets/css/themes/' + themeName + '.min.css')) {
                    jQuery('#css-theme').prop('href', 'assets/css/themes/' + themeName + '.min.css');
                } else if (!colorTheme.length) {
                    jQuery('#css-main').after('<link rel="stylesheet" id="css-theme" href="assets/css/themes/' + themeName + '.min.css">');
                }
            } else {
                if (colorTheme.length) {
                    colorTheme.remove();
                }
            }
        },
        // Handles #main-container height resize to push footer to the bottom of the page
        uiHandleMain: function () {
            var lMain       = jQuery('#main-container');
            var hWindow     = jQuery(window).height();
            var hHeader     = jQuery('#header-navbar').outerHeight();
            var hFooter     = jQuery('#page-footer').outerHeight();

            if (jQuery('#page-container').hasClass('header-navbar-fixed')) {
                lMain.css('min-height', hWindow - hFooter);
            } else {
                lMain.css('min-height', hWindow - (hHeader + hFooter));
            }
        },
        // Handles transparent header functionality (solid on scroll - used in frontend pages)
        uiHandleHeader: function () {
            var lPage = jQuery('#page-container');

            if (lPage.hasClass('header-navbar-fixed') && lPage.hasClass('header-navbar-transparent')) {
                jQuery(window).on('scroll', function(){
                    if (jQuery(this).scrollTop() > 20) {
                        lPage.addClass('header-navbar-scroll');
                    } else {
                        lPage.removeClass('header-navbar-scroll');
                    }
                });
            }
        },
        // Handles sidebar and side overlay custom scrolling functionality
        uiHandleScroll: function(mode) {
            var windowW            = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var lPage              = jQuery('#page-container');
            var lSidebar           = jQuery('#sidebar');
            var lSidebarScroll     = jQuery('#sidebar-scroll');
            var lSideOverlay       = jQuery('#side-overlay');
            var lSideOverlayScroll = jQuery('#side-overlay-scroll');

            // Init scrolling
            if (mode === 'init') {
                // Init scrolling only if required the first time
                uiHandleScroll();
            } else {
                // If screen width is greater than 991 pixels and .side-scroll is added to #page-container
                if (windowW > 991 && lPage.hasClass('side-scroll') && (lSidebar.length || lSideOverlay.length)) {
                    // If sidebar exists
                    if (lSidebar.length) {
                        // Turn sidebar's scroll lock off (slimScroll will take care of it)
                        jQuery(lSidebar).scrollLock('disable');

                        // If sidebar scrolling does not exist init it..
                        if (lSidebarScroll.length && (!lSidebarScroll.parent('.slimScrollDiv').length)) {
                            lSidebarScroll.slimScroll({
                                height: lSidebar.outerHeight(),
                                color: '#fff',
                                size: '5px',
                                opacity : .35,
                                wheelStep : 15,
                                distance : '2px',
                                railVisible: false,
                                railOpacity: 1
                            });
                        }
                        else { // ..else resize scrolling height
                            lSidebarScroll
                                .add(lSidebarScroll.parent())
                                .css('height', lSidebar.outerHeight());
                        }
                    }

                    // If side overlay exists
                    if (lSideOverlay.length) {
                        // Turn side overlay's scroll lock off (slimScroll will take care of it)
                        jQuery(lSideOverlay).scrollLock('disable');

                        // If side overlay scrolling does not exist init it..
                        if (lSideOverlayScroll.length && (!lSideOverlayScroll.parent('.slimScrollDiv').length)) {
                            lSideOverlayScroll.slimScroll({
                                height: lSideOverlay.outerHeight(),
                                color: '#000',
                                size: '5px',
                                opacity : .35,
                                wheelStep : 15,
                                distance : '2px',
                                railVisible: false,
                                railOpacity: 1
                            });
                        }
                        else { // ..else resize scrolling height
                            lSideOverlayScroll
                                .add(lSideOverlayScroll.parent())
                                .css('height', lSideOverlay.outerHeight());
                        }
                    }
                } else {
                    // If sidebar exists
                    if (lSidebar.length) {
                        // If sidebar scrolling exists destroy it..
                        if (lSidebarScroll.length && lSidebarScroll.parent('.slimScrollDiv').length) {
                            lSidebarScroll
                                .slimScroll({destroy: true});
                            lSidebarScroll
                                .attr('style', '');
                        }

                        // Turn sidebars's scroll lock on
                        jQuery(lSidebar).scrollLock('enable');
                    }

                    // If side overlay exists
                    if (lSideOverlay.length) {
                        // If side overlay scrolling exists destroy it..
                        if (lSideOverlayScroll.length && lSideOverlayScroll.parent('.slimScrollDiv').length) {
                            lSideOverlayScroll
                                .slimScroll({destroy: true});
                            lSideOverlayScroll
                                .attr('style', '');
                        }

                        // Turn side overlay's scroll lock on
                        jQuery(lSideOverlay).scrollLock('enable');
                    }
                }
            }
        },
        // Handles page loader functionality
        uiLoader: function (mode) {
            var lBody       = jQuery('body');
            var lpageLoader = jQuery('#page-loader');

            if (mode === 'show') {
                if (lpageLoader.length) {
                    lpageLoader.fadeIn(250);
                } else {
                    lBody.prepend('<div id="page-loader"></div>');
                }
            } else if (mode === 'hide') {
                if (lpageLoader.length) {
                    lpageLoader.fadeOut(250);
                }
            }
        },
        // Handles blocks API functionality
        uiBlocks: function (block, mode, button) {
            // Set default icons for fullscreen and content toggle buttons
            var iconFullscreen         = 'si si-size-fullscreen';
            var iconFullscreenActive   = 'si si-size-actual';
            var iconContent            = 'si si-arrow-up';
            var iconContentActive      = 'si si-arrow-down';

            if (mode === 'init') {
                // Auto add the default toggle icons
                switch(button.data('action')) {
                    case 'fullscreen_toggle':
                        button.html('<i class="' + (button.closest('.block').hasClass('block-opt-fullscreen') ? iconFullscreenActive : iconFullscreen) + '"></i>');
                        break;
                    case 'content_toggle':
                        button.html('<i class="' + (button.closest('.block').hasClass('block-opt-hidden') ? iconContentActive : iconContent) + '"></i>');
                        break;
                    default:
                        return false;
                }
            } else {
                // Get block element
                var elBlock = (block instanceof jQuery) ? block : jQuery(block);

                // If element exists, procceed with blocks functionality
                if (elBlock.length) {
                    // Get block option buttons if exist (need them to update their icons)
                    var btnFullscreen  = jQuery('[data-js-block-option][data-action="fullscreen_toggle"]', elBlock);
                    var btnToggle      = jQuery('[data-js-block-option][data-action="content_toggle"]', elBlock);

                    // Mode selection
                    switch(mode) {
                        case 'fullscreen_toggle':
                            elBlock.toggleClass('block-opt-fullscreen');

                            // Enable/disable scroll lock to block
                            if (elBlock.hasClass('block-opt-fullscreen')) {
                                jQuery(elBlock).scrollLock('enable');
                            } else {
                                jQuery(elBlock).scrollLock('disable');
                            }

                            // Update block option icon
                            if (btnFullscreen.length) {
                                if (elBlock.hasClass('block-opt-fullscreen')) {
                                    jQuery('i', btnFullscreen)
                                        .removeClass(iconFullscreen)
                                        .addClass(iconFullscreenActive);
                                } else {
                                    jQuery('i', btnFullscreen)
                                        .removeClass(iconFullscreenActive)
                                        .addClass(iconFullscreen);
                                }
                            }
                            break;
                        case 'fullscreen_on':
                            elBlock.addClass('block-opt-fullscreen');

                            // Enable scroll lock to block
                            jQuery(elBlock).scrollLock('enable');

                            // Update block option icon
                            if (btnFullscreen.length) {
                                jQuery('i', btnFullscreen)
                                    .removeClass(iconFullscreen)
                                    .addClass(iconFullscreenActive);
                            }
                            break;
                        case 'fullscreen_off':
                            elBlock.removeClass('block-opt-fullscreen');

                            // Disable scroll lock to block
                            jQuery(elBlock).scrollLock('disable');

                            // Update block option icon
                            if (btnFullscreen.length) {
                                jQuery('i', btnFullscreen)
                                    .removeClass(iconFullscreenActive)
                                    .addClass(iconFullscreen);
                            }
                            break;
                        case 'content_toggle':
                            elBlock.toggleClass('block-opt-hidden');

                            // Update block option icon
                            if (btnToggle.length) {
                                if (elBlock.hasClass('block-opt-hidden')) {
                                    jQuery('i', btnToggle)
                                        .removeClass(iconContent)
                                        .addClass(iconContentActive);
                                } else {
                                    jQuery('i', btnToggle)
                                        .removeClass(iconContentActive)
                                        .addClass(iconContent);
                                }
                            }
                            break;
                        case 'content_hide':
                            elBlock.addClass('block-opt-hidden');

                            // Update block option icon
                            if (btnToggle.length) {
                                jQuery('i', btnToggle)
                                    .removeClass(iconContent)
                                    .addClass(iconContentActive);
                            }
                            break;
                        case 'content_show':
                            elBlock.removeClass('block-opt-hidden');

                            // Update block option icon
                            if (btnToggle.length) {
                                jQuery('i', btnToggle)
                                    .removeClass(iconContentActive)
                                    .addClass(iconContent);
                            }
                            break;
                        case 'refresh_toggle':
                            elBlock.toggleClass('block-opt-refresh');

                            // Return block to normal state if the demostration mode is on in the refresh option button - data-action-mode="demo"
                            if (jQuery('[data-js-block-option][data-action="refresh_toggle"][data-action-mode="demo"]', elBlock).length) {
                                setTimeout(function(){
                                    elBlock.removeClass('block-opt-refresh');
                                }, 2000);
                            }
                            break;
                        case 'state_loading':
                            elBlock.addClass('block-opt-refresh');
                            break;
                        case 'state_normal':
                            elBlock.removeClass('block-opt-refresh');
                            break;
                        case 'close':
                            elBlock.hide();
                            break;
                        case 'open':
                            elBlock.show();
                            break;
                        default:
                            return false;
                    }
                }
            }
        }
    };
});

// Run our App
App.run(function($rootScope, uiHelpers) {
    // Access uiHelpers easily from all controllers
    $rootScope.helpers = uiHelpers;

    // On window resize or orientation change resize #main-container & Handle scrolling
    var resizeTimeout;

    jQuery(window).on('resize orientationchange', function () {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function(){
            $rootScope.helpers.uiHandleScroll();
            $rootScope.helpers.uiHandleMain();
        }, 150);
    });
});

// Application Main Controller
App.controller('AppCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Template Settings
        $scope.oneui = {
            version: '3.1', // Template version
            localStorage: false, // Enable/Disable local storage
            settings: {
                activeColorTheme: false, // Set a color theme of your choice, available: 'amethyst', 'city, 'flat', 'modern' and 'smooth'
                sidebarLeft: true, // true: Left Sidebar and right Side Overlay, false: Right Sidebar and left Side Overlay
                sidebarOpen: true, // Visible Sidebar by default (> 991px)
                sidebarOpenXs: false, // Visible Sidebar by default (< 992px)
                sidebarMini: false, // Mini hoverable Sidebar (> 991px)
                sideOverlayOpen: false, // Visible Side Overlay by default (> 991px)
                sideOverlayHover: false, // Hoverable Side Overlay (> 991px)
                sideScroll: true, // Enables custom scrolling on Sidebar and Side Overlay instead of native scrolling (> 991px)
                headerFixed: true // Enables fixed header
            }
        };

        // If local storage setting is enabled
        if ($scope.oneui.localStorage) {
            // Save/Restore local storage settings
            if ($scope.oneui.localStorage) {
                if (angular.isDefined($localStorage.oneuiSettings)) {
                    $scope.oneui.settings = $localStorage.oneuiSettings;
                } else {
                    $localStorage.oneuiSettings = $scope.oneui.settings;
                }
            }

            // Watch for settings changes
            $scope.$watch('oneui.settings', function () {
                // If settings are changed then save them to localstorage
                $localStorage.oneuiSettings = $scope.oneui.settings;
            }, true);
        }

        // Watch for activeColorTheme variable update
        $scope.$watch('oneui.settings.activeColorTheme', function () {
            // Handle Color Theme
            $scope.helpers.uiHandleColorTheme($scope.oneui.settings.activeColorTheme);
        }, true);

        // Watch for sideScroll variable update
        $scope.$watch('oneui.settings.sideScroll', function () {
            // Handle Scrolling
            setTimeout(function () {
                $scope.helpers.uiHandleScroll();
            }, 150);
        }, true);

        // When view content is loaded
        $scope.$on('$viewContentLoaded', function () {
            // Hide page loader
            $scope.helpers.uiLoader('hide');

            // Resize #main-container
            $scope.helpers.uiHandleMain();
        });
    }
]);


/*
 * Partial views controllers
 *
 */

// Side Overlay Controller
App.controller('SideOverlayCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
            // Handle Scrolling
            $scope.helpers.uiHandleScroll();
        });
    }
]);

// Sidebar Controller
App.controller('SidebarCtrl', ['$scope', '$localStorage', '$window', '$location',
    function ($scope, $localStorage, $window, $location) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
            // Handle Scrolling
            $scope.helpers.uiHandleScroll();

            // Get current path to use it for adding active classes to our submenus
            $scope.path = $location.path();
        });
    }
]);

// Header Controller
App.controller('HeaderCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
            // Transparent header functionality
            $scope.helpers.uiHandleHeader();
        });
    }
]);