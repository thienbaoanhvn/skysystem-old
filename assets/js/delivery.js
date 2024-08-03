$(document).ready(function() {
    
}); 
function load_data(){
    
    
   
}
var data_excel="";
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
                //console.log(data_excel);
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
                var table = $('#tb_list_shipping').DataTable();
                table.clear();
                table.destroy();              
                $.ajax({
                    url: "assets/js/connect/gateway.php?controller=ct_skysys.ct_report_shipping_by_excel",
                    type: "POST",
                    data: {
                        "data": data_excel
                    },
                    success: function(d) {                       
                        var data = $.parseJSON(d);
                        $("#btnUpdate").show();
                        var table = $('#tb_list_shipping').DataTable({
                        "order": [
                            [2, "desc"]
                        ],
                        pageLength: 50,
                        data: data,                        
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ],                        
                        lengthMenu: [
                            [ 50,100,200, -1],
                            [ 50,100,200, "ALL"]
                        ],
                        createdRow: function(row, data, dataIndex) {
                           
                        },   
                        "columns": [{
                                "width": "20px",
                                "data": "order_id"
                            }, {
                                "width": "50px",
                                "data": "shop_delivery_id"
                            }, {
                                "width": "50px",
                                "data": "shop_order_id"
                            }
                        ]
                    });
                      
                    },
                    error: function(e) {

                    }
                });
              
            }

        });