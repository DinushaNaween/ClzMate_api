const Attendance = require('../models/attendance');

function stringToNumber(month) {
    console.log("controller function");
    // const month = req.params.month;
    console.log(month)
    if(month == "All"){
        month = 0;
    }else if(month == "January"){
        month = 1;  
    } else if(month == "February"){
        month = 2;
    } else if(month == "March"){
        month = 3;
    } else if(month == "April"){
        month = 4;
    } else if(month == "May"){
        month = 5;
    } else if(month == "June"){
        month = 6;
    } else if(month == "July"){
        month = 7;
    } else if(month == "August"){
        month = 8;
    } else if(month == "September"){
        month = 9;
    } else if(month == "Octomber"){
        month = 10;
    } else if(month == "November"){
        month = 11;
    } else if(month == "December"){
        month = 12;
    }
    return month;
}

module.exports = {
    stringToNumber: stringToNumber
};