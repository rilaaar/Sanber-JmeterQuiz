/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9615384615384616, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 7"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 6"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 9"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 1"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 2"], "isController": true}, {"data": [1.0, 500, 1500, "LOGIN"], "isController": false}, {"data": [1.0, 500, 1500, "LOGOUT USER"], "isController": false}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 10"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 10"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 3"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 3"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 2"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 4"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 1"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 6"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 10"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 7"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 9"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 3"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 4"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 1"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 2"], "isController": true}, {"data": [1.0, 500, 1500, "UPDATE USER"], "isController": false}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 7"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 6"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 9"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 3"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 10"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 4"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 10"], "isController": true}, {"data": [1.0, 500, 1500, "ADD USER"], "isController": false}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 1"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 2"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 7"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 6"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 4"], "isController": true}, {"data": [1.0, 500, 1500, "GET USER PROFILE"], "isController": false}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 3"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 2"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 9"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 1"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 7"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 6"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 9"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 9"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 7"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 6"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 4"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 10"], "isController": true}, {"data": [1.0, 500, 1500, "DELETE USER"], "isController": false}, {"data": [0.5, 500, 1500, "GET AUTH"], "isController": false}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 4"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 3"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 2"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 1"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 70, 0, 0.0, 504.9285714285713, 276, 1456, 376.0, 1298.8, 1388.45, 1456.0, 8.655867441572894, 8.266425860949672, 4.514865679485594], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["USERS_TR_UPDATEUSER - 8", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 2.6303695820433437, 2.2373258513931886], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 7", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 2.413662997159091, 2.053000710227273], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 6", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 1.9397474315068493, 1.6499001141552512], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 5", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 2.5408168038922154, 2.160717627245509], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 9", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 2.2068774606299213, 1.894172408136483], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 1", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 1.8540534420289856, 1.8172554347826089], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 2", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 1.9443271396396395, 1.882742117117117], "isController": true}, {"data": ["LOGIN", 10, 0, 0.0, 386.79999999999995, 329, 445, 387.5, 444.0, 445.0, 445.0, 2.2246941045606228, 2.7437169771968852, 0.9924221357063403], "isController": false}, {"data": ["LOGOUT USER", 10, 0, 0.0, 357.0, 296, 440, 330.5, 439.5, 440.0, 440.0, 2.2172949002217295, 1.428682788248337, 1.2840389412416853], "isController": false}, {"data": ["USERS_TR_LOGINUSER - 10", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 3.04088025990099, 1.1022586633663365], "isController": true}, {"data": ["USERS_TR_ADDUSER - 10", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 3.851828560371517, 1.547987616099071], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 3", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 1.6904985313315926, 1.5120145234986946], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 3", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 1.488415948275862, 1.441271551724138], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 2", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 1.5229724702380953, 1.378813244047619], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 4", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 2.0296581112852663, 1.9653702978056427], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 1", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 2.0370969347133756, 1.8442724920382165], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 5", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 2.042463525236593, 1.9777701104100947], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 6", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 2.042463525236593, 1.9777701104100947], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 10", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 2.1158854166666665, 2.0488664215686274], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 7", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 1.5872169665012406, 1.5557149503722083], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 8", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 2.151033014950166, 2.082900747508306], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 9", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 1.887641217201166, 1.8278516763848396], "isController": true}, {"data": ["USERS_TR_ADDUSER - 3", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 3.010670731707317, 1.2147484756097562], "isController": true}, {"data": ["USERS_TR_ADDUSER - 4", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 2.8398886494252875, 1.147180316091954], "isController": true}, {"data": ["USERS_TR_ADDUSER - 1", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 2.9436052553444183, 1.1853288301662708], "isController": true}, {"data": ["USERS_TR_ADDUSER - 2", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 3.4328471260387814, 1.382336391966759], "isController": true}, {"data": ["UPDATE USER", 10, 0, 0.0, 385.0, 323, 448, 386.0, 447.0, 448.0, 448.0, 2.204099625303064, 1.861861499889795, 1.59237588163985], "isController": false}, {"data": ["USERS_TR_ADDUSER - 7", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 3.7109375, 1.4896222014925373], "isController": true}, {"data": ["USERS_TR_ADDUSER - 8", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 2.925091911764706, 1.1741727941176472], "isController": true}, {"data": ["USERS_TR_ADDUSER - 5", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 3.743489583333333, 1.5121922348484849], "isController": true}, {"data": ["USERS_TR_ADDUSER - 6", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 3.1569693094629154, 1.2737771739130435], "isController": true}, {"data": ["USERS_TR_ADDUSER - 9", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 3.603374094202899, 1.4464447463768118], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 3", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 2.691806891025641, 1.580654046474359], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 10", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 2.5157416044776117, 2.160097947761194], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 4", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 2.547940340909091, 1.494436553030303], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 10", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 1.8821538880813955, 1.6834347747093024], "isController": true}, {"data": ["ADD USER", 10, 0, 0.0, 377.6, 323, 435, 376.0, 434.0, 435.0, 435.0, 2.140869192892314, 2.652879803575251, 1.0681348346178547], "isController": false}, {"data": ["USERS_TR_GETUSERPROFILE - 1", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 2.60718074845679, 1.5221113040123457], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 2", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 2.05078125, 1.2028391768292683], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 7", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 2.2874199797843664, 1.3292831873315365], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 8", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 2.660290948275862, 1.5459688479623823], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 5", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 2.1504355818414322, 1.261289162404092], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 6", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 2.545514264264264, 1.4809731606606606], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 4", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 2.7826544943820224, 1.0028967696629214], "isController": true}, {"data": ["GET USER PROFILE", 10, 0, 0.0, 346.5, 276, 410, 331.5, 408.9, 410.0, 410.0, 2.2114108801415306, 1.8669577205882353, 1.0905883735072976], "isController": false}, {"data": ["USERS_TR_LOGINUSER - 3", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 3.313995114555256, 1.2029354784366577], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 2", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 3.681114333832335, 1.3361947979041915], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 9", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 2.1268992794486214, 1.236000156641604], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 1", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 3.700348268072289, 1.3413027108433735], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 8", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 2.864131221064815, 1.0330765335648149], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 7", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 3.7608045212765955, 1.3565017097264438], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 6", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 2.936646377672209, 1.0600690320665083], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 5", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 2.8466235632183907, 1.025951867816092], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 9", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 2.1873680320945947, 1.9564241976351353], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 9", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 3.3684717465753424, 1.2227097602739727], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 8", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 2.0767806412337664, 1.8801998782467533], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 7", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 1.4704561781609196, 1.331267959770115], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 6", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 2.042463525236593, 1.8268188091482649], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 5", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 2.0685652955271565, 1.8501647364217253], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 4", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 1.4715021306818181, 1.3161399147727273], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 10", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 3.0499886775362315, 1.786826313405797], "isController": true}, {"data": ["DELETE USER", 10, 0, 0.0, 341.90000000000003, 301, 435, 326.0, 431.8, 435.0, 435.0, 2.221728504776716, 1.4350109697844922, 1.3929196289713397], "isController": false}, {"data": ["GET AUTH", 10, 0, 0.0, 1339.7, 1218, 1456, 1350.0, 1453.6, 1456.0, 1456.0, 1.729804532087874, 2.1335382070576028, 0.4920820900363259], "isController": false}, {"data": ["USERS_TR_UPDATEUSER - 4", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 2.1529331841432224, 1.8482257033248082], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 3", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 1.9351652298850575, 1.6612787356321839], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 2", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 2.0358845338983054, 1.7474084443099274], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 1", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 1.8790108816964286, 1.6130719866071428], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 70, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
