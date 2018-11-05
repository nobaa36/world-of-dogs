$(document).ready(function(){                                                    // when document loaded call these functions
    search();                                                                    //activate searching (onkeyup event)
    detectmobile();                                                              //return true if mobile phone detected
    mobileAdjustments(window.innerWidth,window.innerHeight);                     //a few adjustments for mobile devices
  });



$(window).on("orientationchange",function(){                                     // event for mobiles when rotated 
    mobileAdjustments(window.innerHeight,window.innerWidth);                     //a few adjustments for mobile devices
});

///////////////////main code above///////////////////functions under/////////////




function search() {
    $("#searchInput").on("keyup", function(key) {                                           
        $('#searchHints').css("display","block");                                           //show hints under input field
        var value = $(this).val().toLowerCase();
        if (value=="") {
            $('#searchHints').css("display","none");                                        //hide them if nothing inside (for backspace)           
        }
        $('#searchHints').text("");
        $("#accordion .clickable").filter(":contains("+value+"):lt(5)").each(function() {   //filter breeds by value of input field, show first 5 results 
            $('#searchHints').append("<a href=/breeds/"+$(this).text().replace("-", "/")+"><div class='list-group-item list-group-item-action'>"+$(this).text()+"</div></a>");
        });                                                                              
        if (key.which==13) {                                                                //if enter pressed trigger search button
            searchButton();
        }
        $('#searchHints div').css("width",$('#inputWrapper').width());                      //set width of hints to input width 
    });
}
function searchButton() {                                                          //search left columns using user input
    var firstHint=$('#searchHints a :first-child').html();                         //select firs found element
    window.location=("/breeds/"+firstHint.replace("-", "/"));
    closeHints();                                                                  //close hints after all
}
function closeHints() {
    $('#searchHints').css("display","none");                                       //hide hints container
    $('#searchInput').val("");                                                     //clear users input
}
function enlargePix(link) {                                                       // make picture bigger
    $('#hiddenWindow').removeClass('invisible');                                  //show hidden window
    $('#largePix').attr("src",link);                                              //add attribute (link)
    $('#largePixLabel').text(getDogName(link));                                   //extract dog name from link
    $('#largePix').css('max-height',window.innerHeight*0.8);                      //prevent picture from overdisplaying window
}
function closeHiddenWindow() {                                                     //hide hidden window
    $('#hiddenWindow').addClass('invisible');
}
function carousel(data,dogsArray) {                                                //viewing big pictures, argument is next or prev
    dogsArray=dogsArray.split(",");
    var currentLink=$("#largePix").attr("src");                                    //get current picture link
    var indexOfCurrentLink=function() {                                            //find index of current link if dogs array
        for (x in dogsArray) {
            if (trimLink(dogsArray[x])==currentLink){
                return x;
            }
        }
    }
    if (data==="next") {                                                           //if next clicked
        closeHiddenWindow();                                                       //clear hidden window
        enlargePix(trimLink(dogsArray[Math.min(Number(indexOfCurrentLink())+1,dogsArray.length-1)]));                     //trigger new hidden window with another link (using found index in dogs array)
    } else {                                                                       //do the same if prev clicked
        closeHiddenWindow();
        enlargePix(trimLink(dogsArray[Math.max(Number(indexOfCurrentLink())-1,0)]));;
    }
}
function trimLink(link) {
    return link.replace("[","").replace("]","").replace(/'/g,"").trim()
}
function getDogName(myObj){                                                        //extract dog name , one parameter (url)
    var myObj=myObj.slice(30);                                                     //remove some text from front of string
    var x;
    var myChar;
    var myDogName="";
    for (x=0;x<myObj.length;x++) {                                                 //for every letter in link
        myChar=myObj.charAt(x);
        if (myObj.charCodeAt(x)==47) {                                             //search for slash (/)
            return myDogName;                                                      //if found return builded up dog name
        }
    myDogName+=myChar;                                                             //build dog name letter by letter 
    }   
}
function detectmobile() {                                                           
    if( navigator.userAgent.match(/Android/i)                                       //return true if mobile phone detected 
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i) ){
        return true; }
    else {
        return false;
    }
}
function mobileAdjustments() {                                           //first parameter window width, second window height
    if (detectmobile())  {                                               //mobile vertical position
        $('.hide').css('display','none');                                //hide list of breeds by default ( can be expand by click)

    }
}
function breedDrop() {                                                                                                          //drop breed list (when vertically mobile is using)
    if ($('.hide').css('display') === "block") {
        $('.hide').css('display','none');                                                              //hide
    } else if ($('.hide').css('display') === "none") {
        $('.hide').css('display','block');                                                             //show
    }
}
