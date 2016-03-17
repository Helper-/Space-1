
function table() {

    var cols,$btn;
    console.log("we are in the appointment table function");
    $.get('/webapi/employee/'+eid+'/appointments/today', function( data ){

        var count = 0;
        //empty's the table
        $('#tblBody').empty();

        //for loop to reload the table
        for(var i=0; i<data.length; i++){

            if(data[i].state == 'done'){
                continue;
            }

            var $img = $('<img id="Image" src="http://placehold.it/50x50" />');
            count++;

            var appTime = getAppDate(data[i].date);


            if (data[i].state === 'checkedIn' || data[i].state === 'roomed') {

                var url = '/viewform/' + data[i]._id;
                var $form = $('<a href="'+url+'" onclick="window.open(\''+url+'\', \'newwindow\', \'width=600, height=400\'); return false;" >View Forms</a>');

                if (data[i].state === 'checkedIn'){
                    var $check = $('<input type="checkbox">').data('appid',data[i]._id);
                    $check.change(function(){
                        var $appid = $(this).data('appid');

                        $.ajax({
                            url :  '/api/appointments/'+$appid+'/state',
                            type : 'PUT'
                        });
                    });

                    cols = [count,data[i].fname + ' ' + data[i].lname,$form,appTime,data[i].state,$check,$img,""];
                }

                else if(data[i].state === 'roomed') {
                    $btn = $('<button class="btn btn-primary"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span></button>');
                    var x = data[i]._id;
                    $btn.click(function() {
                        $.ajax({
                            url: '/api/appointments/'+x+'/state',
                            type: 'PUT',
                        });
                    });

                    cols = [count,data[i].fname + ' ' + data[i].lname,$form,appTime,data[i].state,$btn,$img,""];

                }
            }

            else {
                cols = [count,data[i].fname + ' ' + data[i].lname,$btn = false,appTime,data[i].state,$btn = false,$img,""];
            }

            insRow(cols);
        }//end of for loop

    });//end of $get()
}//end of table()



//function to get the appointment's time in a formatted string
function getAppDate(date){
    var appDate = new Date(date);
    //parsing to get time
    var fhours = appDate.getHours();
    var appTime;
    if(fhours/12 < 1){
        var hours = ('0'+appDate.getHours()).slice(-2); //returns 0-
        var minutes = ('0'+appDate.getMinutes()).slice(-2); //returns 0-59
        appTime = hours+':'+minutes + ' AM';
    }
    else{
        var pmHours = appDate.getHours()%12;

        if(pmHours === 0) {
            pmHours = 12;
        }

        var hoursPM = ('0'+pmHours).slice(-2); //returns 0-
        var minutesPM = ('0'+appDate.getMinutes()).slice(-2); //returns 0-59
        appTime = hoursPM+':'+minutesPM + ' PM';
    }

    return appTime;
}

// JQuery Insert Row
function insRow(cols) {
    var $row = $('<tr/>'); // Create a r

    // Loop through data
    for (var i = 0; i < cols.length; i++) {
        var $col;

        if(i===cols.length-1 && cols[4]=="checkedIn"){
            $col = $('<td/style="background-color:#00FF00;width:1px">'); // Create a column
        } else{
            $col= $('<td/>');
        }

        $col.append(cols[i]); // Append column data to column
        $row.append($col); // Append column to row
    }

    $('#tblBody').append($row); // Append to top of element using prepend
}

