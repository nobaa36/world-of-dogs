$(document).ready(function(){         
    //activate searching (onkeyup event)                                           
    search();                  
    //return true if mobile phone detected                                                  
    detectmobile();                                  
    //a few adjustments for mobile devices                            
    mobileAdjustments();                     
  });



$(window).on("orientationchange",function(){                                     
    mobileAdjustments();                     
});

///////////////////main code above///////////////////functions under/////////////




function search() {
    $("#searchInput").on("keyup", function(key) {                                           
        $('#searchHints').css("display","block");                                           
        var value = $(this).val().toLowerCase();
        if (value=="") {
            $('#searchHints').css("display","none");                                                   
        }
        $('#searchHints').text("");
        //filter breeds by value of input field, show first 5 results
        $("#accordion .clickable").filter(":contains("+value+"):lt(5)").each(function() {    
            $('#searchHints').append("<a href=/breeds/"+$(this).text().replace("-", "/")+"><div class='list-group-item list-group-item-action'>"+$(this).text()+"</div></a>");
        });                                                                              
        if (key.which==13) {                                                                
            searchButton();
        }
        //set width of hints to input width
        $('#searchHints div').css("width",$('#inputWrapper').width());                       
    });
}
function searchButton() {                           
    //select firs found element                               
    var firstHint=$('#searchHints a :first-child').html();                         
    window.location=("/breeds/"+firstHint.replace("-", "/"));
    closeHints();                                                                  
}
function closeHints() {
    $('#searchHints').css("display","none");                                       
    $('#searchInput').val("");                                                    
}
function enlargePix(link) {                                                       
    $('#hiddenWindow').removeClass('invisible');                                  
    $('#largePix').attr("src",link);                    
    //extract dog name from link                          
    $('#largePixLabel').text(getDogName(link));                 
    //prevent picture from overdisplaying window                  
    $('#largePix').css('max-height',window.innerHeight*0.8);                      
}
function closeHiddenWindow() {                                                     
    $('#hiddenWindow').addClass('invisible');
}
function carousel(data,dogsArray) {                                                
    dogsArray=dogsArray.split(",");
    var currentLink=$("#largePix").attr("src"); 
    //find index of current link if dogs array                                   
    var indexOfCurrentLink=function() {                                            
        for (x in dogsArray) {
            if (trimLink(dogsArray[x])==currentLink){
                return x;
            }
        }
    }
    //if next clicked
    if (data==="next") {                                                           
        closeHiddenWindow();       
        //trigger new hidden window with another link (using found index in dogs array)                                                
        enlargePix(trimLink(dogsArray[Math.min(Number(indexOfCurrentLink())+1,dogsArray.length-1)]));                     
    } else {                                                                       
        closeHiddenWindow();
        //do the same if prev clicked
        enlargePix(trimLink(dogsArray[Math.max(Number(indexOfCurrentLink())-1,0)]));;
    }
}
function trimLink(link) {
    return link.replace("[","").replace("]","").replace(/'/g,"").trim()
}
//extract dog name , one parameter (url)
function getDogName(myObj){                                                        
    var myObj=myObj.slice(30);                                                     
    var x;
    var myChar;
    var myDogName="";
    //for every letter in link
    for (x=0;x<myObj.length;x++) {                                                 
        myChar=myObj.charAt(x);
        //search for slash (/)
        if (myObj.charCodeAt(x)==47) {                                             
            return myDogName;                                                      
        }
    //build dog name letter by letter
    myDogName+=myChar;                                                              
    }   
}
function detectmobile() {                                                           
    if( navigator.userAgent.match(/Android/i)                                        
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
function mobileAdjustments() {                                          
    if (detectmobile())  {                    
        //hide list of breeds by default ( can be expand by click)                          
        $('.hide').css('display','none');                                

    }
}
//drop breed list (when vertically mobile is using) 
function breedDrop() {        
    if ($('.hide').css('display') === "block") {
        $('.hide').css('display','none');                                                              
    } else if ($('.hide').css('display') === "none") {
        $('.hide').css('display','block');                                                             
    }
}
