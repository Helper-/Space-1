$(function(){

  getDate();
  $(startTime);
  $(table);
  $(poll);


});

/* Drop Down Dates */
var monthtext=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
var name_element = document.getElementById('hourdropdown');

function populatedropdown(dayfield, monthfield, yearfield) {
  var today=new Date();
  var dayfield=document.getElementById(dayfield);
  var monthfield=document.getElementById(monthfield);
  var yearfield=document.getElementById(yearfield);
  for (var i=0; i<31; i++) {
    dayfield.options[i]=new Option(i+1, i+2);
    dayfield.options[today.getDate()]=new Option(today.getDate(), today.getDate(), true, true); //select today's day
  }
  for (var m=0; m<12; m++) {
    monthfield.options[m]=new Option(monthtext[m], monthtext[m]);
    monthfield.options[today.getMonth()]=new Option(monthtext[today.getMonth()], monthtext[today.getMonth()], true, true); //select today's month
  }
  var thisyear=today.getFullYear();
  for (var y=0; y<20; y++){
    yearfield.options[y]=new Option(thisyear, thisyear);
    thisyear+=1;
  }
  yearfield.options[0]=new Option(today.getFullYear(), today.getFullYear(), true, true); //select today's year
}

/* Drop Down Times */
var nighttext=['AM','PM'];

function timedropdown(hourfield, minutefield, nightfield) {
  var today=new Date();
  var hourfield=document.getElementById(hourfield);
  var minutefield=document.getElementById(minutefield);
  var nightfield=document.getElementById(nightfield);
  for (var h=0; h<12; h++) {
    hourfield.options[h]=new Option(h+1, h+2);
  }
    minutefield.options[0]=new Option(00);
    minutefield.options[1]=new Option(15);
    minutefield.options[2]=new Option(30);
    minutefield.options[3]=new Option(45);
  for (var g=0; g<2; g++) {
    nightfield.options[g]=new Option(nighttext[g], nighttext[g]);
  }
}

/* Gold Team Scripts */
function dateToString(date) {
	var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December' ];
    var month = date.getMonth() ;
    var day = date.getDate();
    var dateOfString = (('' + month).length < 2 ? '' : '') +  monthNames[month] + ' ';
    dateOfString += (('' + day).length < 2 ? '0' : '') + day + ' ';
    dateOfString += date.getFullYear();
    return dateOfString;
}

function getDate(){
	var currentdate = new Date();
	var datetime= '';
	datetime += dateToString(currentdate );


	var $header = $('<h1/>');
	 $header.append(datetime);
	$('#currentDate').replaceWith($header);

}

function startTime() {
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    var dn='AM';
	if (h>12){
		dn='PM';
		h=h-12;
	}
    m = checkTime(m);
    s = checkTime(s);
    $('#txt').html('Current Time: ' +h+':'+m+':'+s+ ' '+ dn);
    setTimeout(function(){startTime();},500);
}

function checkTime(i) {
    if (i<10) {i = '0' + i;}  // add zero in front of numbers < 10
    return i;
}

function table() {

    var cols,$btn;

    $.get('/api/employee/'+eid+'/appointments/today', function( data ){

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


function poll() {
    setTimeout(function(){
        table();

        //poll();
    },1000);//checks every 1000 millisecond
}

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
