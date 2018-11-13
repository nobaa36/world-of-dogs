$(document).ready(function(){                                
    //Sctivate searching (onkeyup event)                    
    search();                                            
    //Return true if mobile phone detected                        
    detectmobile();                                       
    //A few adjustments for mobile devices                       
    mobileAdjustments(window.innerWidth,window.innerHeight);                     
  });

//Show user name if logged in
checkLogIn();                                                   
//Load breed names using free API                 
getApi("https://dog.ceo/api/breeds/list/all",loadLeftColumn);      
//Load random dog pictures using free API             
loadRandomDogs();                                                                
counter=0;
counter2=0;
dogsArray=[];
$(window).on("orientationchange",function(){                                     
    mobileAdjustments(window.innerHeight,window.innerWidth);                     
});


///////////////////main code above///////////////////functions under/////////////

//First parameter API's url, second callback function
function getApi(url,cFunction) {                                                  
    var data= new XMLHttpRequest();                                               
    data.onreadystatechange= function() {                                          
        if (data.readyState==4 && data.status==200) {          
            //Convert JSON into a JavaScript object                       
            data=JSON.parse(data.responseText);              
            //Call cunction from second parameter using parsed data                     
            cFunction(data);                                                      
        }
    };
    data.open("GET",url,true);                                                    
    data.send();                                                                  
}
//Inject some html code using received data from free API
function loadLeftColumn(data) {                                                   
    var breed;
    var leftColumnContent="<div onClick='breedDrop()' class='list-group-item bg-light font-weight-bold'>Pick up breed</div>";       
    for ( breed in data.message) {                             
        //If breeds have subbreeds                                                                     
        if (data.message[breed].length!=0){                                                                                         
            var x;
            //Create accordion card
            leftColumnContent+="<div class='card border border-right-0'>"+        
                                //Accordion header collapsable                                                  
                                "<div class='card-header p-0'>"+      
                                    //Breed name, no link                                                              
                                    "<div class='card-link p-3' data-toggle='collapse' href='#collapse"+breed+"'>"+breed+"</div>"+  
                                "</div>"+
                                //Accordion body
                                "<div id='collapse"+breed+"'class='collapse ' data-parent='#accordion'>";  
            //Create subbreeds                         
            for (x=0;x<data.message[breed].length;x++) {                                                                            
                leftColumnContent+="<div class='clickable subbreed card-body border border-bottom-0 border-right-0' onClick=getApi('https://dog.ceo/api/breed/" + breed +"/"+data.message[breed][x] +"/images',loadChosenBreed)>"+breed+"-"+data.message[breed][x]+"</div>";                         
            }  
            leftColumnContent+="</div></div>";                                                                                      
            }
        //If there is no subbreeds,create breeds
        else {                                                                                                                      
            leftColumnContent+="<li class='clickable list-group-item list-group-item-action' onClick=getApi('https://dog.ceo/api/breed/" + breed +"/images',loadChosenBreed)>"+breed+"</li>";
        }   
    }              
    //Inject html code to index page
    $('main div ul').html(leftColumnContent);                                                                                      
}
//Using received data (single url) display single random picture
function getRandomDog(data) {           
    //Store urls in array                                          
    dogsArray.push(data.message);                                                 
    counter++;
    //Choose column
    var columnNo=(counter % 3);                                                   
    var column="#column"+columnNo;  
    //Get content of choosen column add html code for one picture and extracted description (from link)
    var content=$(column).html();                                                 
    content=content+"<div  class='border my-1 my-md-4 text-center text-capitalize'><img class='img-fluid w-100 img-thumbnail border border-0' onClick='enlargePix(this.src)' src='"+data.message+"'>"+
                    "<div class='bg-light'>"+getDogName(data.message)+"</div></div>";     //             
    $(column).html(content);                                                      
    
}
function loadRandomDogs() {                         
    //Clear array (it is needed for displaying bigger pictures one by one)                     
    dogsArray=[];                                                                 
    var x;
    //Set limit pictures per page, depend on screen orientation
    var pageCapacity=33;                                                                 
    if (detectmobile() && window.innerHeight<window.innerWidth) {
        pageCapacity=80;
    }
    //Request random dog picture (url)
    for (x=0;x<pageCapacity;x++) {                                                       
        getApi("https://dog.ceo/api/breeds/image/random",getRandomDog);
    }   
}
//Triggered by clicking on breed name, first arg is object full of links, second for pagination
function loadChosenBreed(data,start=0) {                  
    //Hide breeds list after choosing one breed when use mobile vertically                         
    if (window.innerWidth<window.innerHeight) {
        $('#accordion .card,#accordion li').css('display','none');               
    }
    dogsArray=[];                                                                   
    clearAllColumns();                                                             
    var content="";
    var x,limit;
    var pageCapacity=30;
    if (detectmobile() && window.innerHeight<window.innerWidth) {
        pageCapacity=80;
    }
    //Set start for pagination
    start=start-1;                                                                 
    start=Math.max(start,0);
    //Set active pagination page
    var activePage=Number(start)+1;                                                
    start*=pageCapacity;
    //In case of small array  <30 limit is length of array
    if (data.message.length<pageCapacity) {                                                                                                
        limit=data.message.length;    
    //In case of big array limit depends on start argument send by pagination buttons                                      
    } else {                                                                       
        limit=pageCapacity+start;     
        //If limit exceed length of array, then it is limited to length of array                                                       
        if (limit>=data.message.length){                                           
            limit=data.message.length;
        }
    }
    for (x=start;x<limit;x++) {                                                      
        dogsArray.push(data.message[x]);                                            
        columnNo=(x % 3);
        column="#column"+columnNo;                                                  
        content=$(column).html();    
        // Add html code for displaying pictures along with descriptions (extracted from links)                                           
        content+="<div class='border text-center text-capitalize my-4 '><img class='img-fluid w-100 img-thumbnail border border-0' onClick='enlargePix(this.src)' src='"+data.message[x]+"'>"+
                    "<div class='bg-light'>"+getDogName(data.message[x])+"</div></div>"; 
        $(column).html(content);                                                    
    }
    //Create pagination when more then 30 pictures
    if (data.message.length>pageCapacity){                                                    
        $('#pagination').append("<ul class='pagination justify-content-center'>"+   
                            "<li id='previous' class='page-item disabled'><div class='page-link' onclick='loadChosenBreed("+JSON.stringify(data)+","+(activePage-1)+")' >Previous</div></li>"+
                            "<li class='page-item'><div id='pagination1' class='page-link' onclick='loadChosenBreed("+JSON.stringify(data)+",(this).innerHTML)'>1</div></li>"+
                            "<li class='page-item'><div id='pagination2' class='page-link' onclick='loadChosenBreed("+JSON.stringify(data)+",(this).innerHTML)'>2</div></li>"+
                            "<li class='page-item'><div id='pagination3' class='page-link' onclick='loadChosenBreed("+JSON.stringify(data)+",(this).innerHTML)'>3</div></li>"+
                            "<li id='next' class='page-item'><div class='page-link' onclick='loadChosenBreed("+JSON.stringify(data)+","+(activePage+1)+")'>Next</div></li>"+
                        "</ul>");
        //If first page active previous button disabled
        if (start==0){                                                              
            $('#previous').addClass('disabled');    
        } else {
            $('#previous').removeClass('disabled');                                 
        }
        //If x reach end of data next button disabled
        if (x==data.message.length) {
            $('#next').addClass('disabled');                                        
        }
        // pages 1,2,3 increase by 1 after next button clicked
        if (activePage>3) {                                                         
            $('#pagination1').text(Number($('#pagination1').text())+activePage-3);
            $('#pagination2').text(Number($('#pagination2').text())+activePage-3);
            $('#pagination3').text(Number($('#pagination3').text())+activePage-3);    
        }
        //Activate one of pages in pagination
        $("li:contains('"+activePage+"')").addClass('active');                      
    }
}
// Makes picture bigger
function enlargePix(link) {                                                        
    $('#hiddenWindow').removeClass('invisible');                                  
    $('#largePix').attr("src",link);                   
    //Extract dog name from link                           
    $('#largePixLabel').text(getDogName(link));        
    //Prevent picture from overdisplaying window                           
    $('#largePix').css('max-height',window.innerHeight*0.8);                      
}
function carousel(data) {                                                          
    var currentLink=$("#largePix").attr("src");  
    //Find index of current link if dogs array                                  
    var indexOfCurrentLink=function() {                                            
        var x;
        for (x in dogsArray) {
            if (dogsArray[x]==currentLink){
                return x;
            }
        }
    }
    //If next clicked
    if (data==="next") {                                                           
        closeHiddenWindow();                       
        //Trigger new hidden window with another link (using found index in dogs array)                                
        enlargePix(dogsArray[Number(indexOfCurrentLink())+1]);    
    //Do the same if prev clicked                 
    } else {                                                                       
        closeHiddenWindow();
        enlargePix(dogsArray[Number(indexOfCurrentLink())-1]);
    }
}
function clearAllColumns() {                                                       
    var x;
    for(x=0;x<3;x++) {
        var column="#column"+x;  
        $(column).html("");                                                       
    }
    $('#pagination').html("");                                                     
}
function closeHiddenWindow() {                                                     
    $('#hiddenWindow').addClass('invisible');
}
//Extract dog name , one parameter (url)
function getDogName(myObj){                                                        
    var myObj=myObj.slice(30);                                                     
    var x;
    var myChar;
    var myDogName="";
    for (x=0;x<myObj.length;x++) {                                                
        myChar=myObj.charAt(x);
        //Search for slash (/)
        if (myObj.charCodeAt(x)==47) {                                             
            return myDogName;                                                     
        }
    //Build dog name letter by letter
    myDogName+=myChar;                                                              
    }   
}
function search() {
    $("#searchInput").on("keyup", function(key) {                                           
        $('#searchHints').css("display","block");                                           
        var value = $(this).val().toLowerCase();
        if (value=="") {
            $('#searchHints').css("display","none");                                                   
        }
        $('#searchHints').text("");
        //Filter breeds by value of input field, show first 5 results 
        $("#accordion .clickable").filter(":contains("+value+"):lt(5)").each(function() {   
            $('#searchHints').append("<div onClick=getApi('https://dog.ceo/api/breed/" + $(this).text() +"/images',loadChosenBreed) class='list-group-item list-group-item-action'>"+$(this).text()+"</div>");
        });                                                                                 
        if (key.which==13) {                                                                
            searchButton();
        }
        //Set width of hints to input width
        $('#searchHints div').css("width",$('#inputWrapper').width());                      
    });
}
function searchButton() {                               
    //Select firs found element                           
    var firstHint=$('#searchHints :first-child').html();    
    //Request free API with choosen breed and load dogs                       
    getApi('https://dog.ceo/api/breed/'+firstHint+'/images',loadChosenBreed);       
    closeHints();                                                                  
}
function closeHints() {
    $('#searchHints').css("display","none");                                       
    $('#searchInput').val("");                                                     
}
function checkLogIn() {
    var cookie=document.cookie;                           
    //Check if browser still has cookie                  
    if (cookie!="" && cookie.length>=12 && cookie.length<30){     
        // Trim string to leave just username         
        cookie=cookie.slice(9);      
        //Set username on top of site                                      
        $('#logInLabel').text(cookie);                                     
        $('#logInButton').text('Log out');                                 
    } else {
        //If no cookies restore default (log out removes cookies)
        deleteAllCookies();                                                
        $('#logInLabel').text('');
        $('#logInButton').text('Log In / Sign Up'); 
    }
}
function deleteAllCookies() {                     
    //Get all cookies to array by spliting them using ;                          
    var cookies = document.cookie.split(";");                              
    for (var i = 0; i < cookies.length; i++) {                             
        var cookie = cookies[i];
        //Find username in cookie using =
        var eqPos = cookie.indexOf("=");                    
         //If found slice string to get username               
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;         
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"; 
    }
}   
//Drop breed list (when vertically mobile is using)
function breedDrop() {                                                                                                          
    if (($('#accordion .card,#accordion li').css('display') === "block") && (window.innerWidth<window.innerHeight)) {
        $('#accordion .card,#accordion li').css('display','none');                                                             
    } else if (($('#accordion .card,#accordion li').css('display') === "none") && (window.innerWidth<window.innerHeight)) {
        $('#accordion .card,#accordion li').css('display','block');                                                            
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
//Match password input and repeat password input 
function passwordMatch() {                                                                      
    var userPassword=$("#userPassword");                                                       
    var userPasswordRepeat=$('#userPasswordRepeat');
    if (userPassword.val().length>7 && (userPassword.val()===userPasswordRepeat.val())) {             
        userPassword.css("border","1px solid green");                                           
        userPasswordRepeat.css("border","1px solid green");
        $('#submitSignUpForm').prop('disabled',false);
    } else {                                                                                   
        userPassword.css("border","1px solid red");
        userPasswordRepeat.css("border","1px solid red");
        $('#submitSignUpForm').prop('disabled',true);
    }
}
function mobileAdjustments(w,h) {   
    //Mobile vertical position                                       
    if (detectmobile() && w<h) {                                  
        //Hide list of breeds by default ( can be expand by click)          
        $('#accordion .card,#accordion li').css('display','none');          
        $('.col-sm-3').addClass('col-sm-2');                                
        $('.col-sm-9').addClass('col-sm-10');
        $('.col-sm-3').removeClass('col-sm-3');
        $('.col-sm-9').removeClass('col-sm-9');
        $('#map').addClass('h-75');                                         
    } else if (detectmobile() && w>h) {        
        //Mobile horizontal position                             
        $('#accordion .card,#accordion li').css('display','block');         
        $('.col-sm-2').addClass('col-sm-3');                                
        $('.col-sm-10').addClass('col-sm-9');
        $('.col-sm-2').removeClass('col-sm-2');
        $('.col-sm-10').removeClass('col-sm-10');
        $('#map').removeClass('h-75');                                     
    }
}
