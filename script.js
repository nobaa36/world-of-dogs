
sessionStorage.clear();
 $(function() { 
    
    
});
setBody();
 $(window).on("orientationchange",function() {
    window.setTimeout(function() { 
        sessionStorage.clear();
        setBody();
        getPosition(); 
        
    }, 400);  
});

 loadLeftColumn();

 
arrayLength=0; // //// make it global for next button 
var a;
for (a=0;a<30;a++){
    var b=(a % 3);
    var column="column"+b;
    loadRandomDog(column,a);
}
checkLogIn();

if (window.location.href=="https://www.worldofdogs.info/?search"){      
    window.location.href = "/";
}
if (document.referrer=="https://www.worldofdogs.info/?search"){      
    search();
}     
if (window.location=="https://worldofdogs.info/contact_form.php" || window.location=="https://www.worldofdogs.info/contact_form.php" ||
    window.location=="https://worldofdogs.info/log_in.php" || window.location=="https://www.worldofdogs.info/log_in.php") {
   
   getPosition();
}
var previousActiveBreed; // this is for active breed
var previousActiveHint;
var activeHint=0;
var hintIdNo='#hint0';


////////// above is main code, below are functions

function checkLogIn() {
    var cookie=document.cookie; 
    if (cookie!="" && cookie.length>=12 && cookie.length<30){
    cookie=cookie.slice(9);
    cookie=firstBigLetter(cookie);
    
    $('#hello').text('Logged in: '+cookie);
    $('#logIn').text('Log out');
    } else {
    deleteAllCookies();
    $('#logIn').text('Log in');
    $('#hello').text('');
    }
    
 
 }
    

function loadLeftColumn() {
    
    breedsArray=[];
    var data= new XMLHttpRequest();
    data.onreadystatechange= function() {
    if (this.readyState==4 && this.status==200)
    {
        var myObj=JSON.parse(this.responseText);   
        var breed;       
        for ( breed in myObj.message) {
            
            if (myObj.message[breed].length!=0){
                var x;
                var codeForBreed="<div class=hiddenSubbreeds>";
                for (x=0;x<myObj.message[breed].length;x++){
                    breedsArray.push(breed+"-"+myObj.message[breed][x]);

                    codeForBreed+="<div onClick=loadBreedImages('"+ breed + "','"+myObj.message[breed][x]+"') class=subbreed>"+ firstBigLetter(myObj.message[breed][x]) +"</div>";
                }
                codeForBreed+="</div>";
          document.getElementById('leftColumn').innerHTML+="<tr><td id='"+breed+"' class='masterBreed' >" +
          firstBigLetter(breed)+ codeForBreed+ "</div></td></tr>";   
            }
            else {
            document.getElementById('leftColumn').innerHTML+="<tr><td id='"+breed+"' onClick=loadBreedImages('"+ breed + "')>" +
            firstBigLetter(breed)+ "</td></tr>"; 
            breedsArray.push(breed);
            getPosition();
            
        }
            
        } 
             
    }
    };
    data.open("GET","https://dog.ceo/api/breeds/list/all",true);
    data.send();
    
    }


function loadBreedImages(breed,subbreed) {
                       // bottom two lines are for loading 3xcolumns to mainArea after contact form
    document.getElementById('mainArea').innerHTML="<div id='column0'></div><div id='column1'></div><div id='column2'></div><div id='pagination' ><ul>"+
    "<li id='paginationBack'  onClick=loadLessDogs() >❮</li><label>Page &nbsp;</label><p id='currentPage'>1</p><li id='paginationNext' onClick=loadMoreDogs()>❯</li></ul>";
    
    document.getElementById('hintsContainer').style.visibility="hidden"; // this is for removing hints after click
    document.getElementById('search').value="";                          // this is for removing hints after click
    window.scroll(0,0);
    document.getElementById('pagination').style.visibility="visible";
    document.getElementById('paginationBack').style.visibility="hidden";
    document.getElementById('paginationNext').style.visibility="visible";
    document.getElementById('currentPage').innerText="1";
    clearColumns();
    
    var data= new XMLHttpRequest();
    
    data.onreadystatechange= function() {
        
    if (this.readyState==4 && this.status==200)
    {
          
          myObj=JSON.parse(this.responseText);      /// obiekt full of pic from breed , global
          currentBreed=getDogName(myObj.message[0]);   /// currenBreed is Global neme of breed plus
          
          activeBreed();
          arrayLength=myObj.message.length;           //// make it global for next button
          
         if (myObj.message.length<30){
             document.getElementById('pagination').style.visibility="hidden";
             document.getElementById('paginationNext').style.visibility="hidden";
         }
         
            var breedId;
            
            for (breedId in myObj.message) {
                if (breedId>=0 && breedId<30) {
                var b=(breedId % 3);
                var column="column"+b;
                document.getElementById(column).innerHTML += "<div class='picAndDesc'><img id='"+currentBreed+breedId + "'alt='" + currentBreed +  "' src=" +
                myObj.message[breedId] + " onClick=enlargePic('"+ breedId +"') ><div class='description'>"+ firstBigLetter(currentBreed)  +"</div></div>";
                getPosition();
                }                                                                                      
            }  
    }
    };  
       if (subbreed==="undefined" || subbreed===undefined){
        data.open("GET","https://dog.ceo/api/breed/" + breed +"/images",true);
        data.send();
    } else {
        
        data.open("GET","https://dog.ceo/api/breed/" + breed +"/"+subbreed+"/images",true);
        data.send();
    }
    
    }

function activeBreed() {
        $(previousActiveBreed).removeClass('activeBreed');
        activeBreed=findBreedAndSubBreed(currentBreed);
        var activeBreed="#"+activeBreed[0].toLowerCase();  
        $(activeBreed).addClass('activeBreed');
        previousActiveBreed=activeBreed;      
    }
function loadMoreDogs() {   
    clearColumns();
    window.scroll(0,0);
    document.getElementById('paginationBack').style.visibility="visible";
    var pages=Math.ceil(myObj.message.length/30);
    if (document.getElementById('currentPage').innerText<pages){   
          var start=30*document.getElementById('currentPage').innerText;  
          var breedId;
          for(breedId in myObj.message) { 
                if (breedId>=start && breedId<start+30) {
                    var b=(breedId % 3);
                    var column="column"+b;
                    document.getElementById(column).innerHTML += "<div class='picAndDesc'><img  id='"+currentBreed+breedId + 
                    "' onClick=enlargePic('"+breedId +"') alt='"+ currentBreed +  "' src=" +
                    myObj.message[breedId] + "><div class='description'>"+ firstBigLetter(currentBreed) +"</div></div>";  
                    getPosition();  
                }  
            }
        document.getElementById('currentPage').innerText++;
    }
    if (document.getElementById('currentPage').innerText==pages){
        document.getElementById('paginationNext').style.visibility="hidden";
    }
    }

function loadLessDogs() {
      clearColumns();
    window.scroll(0,0);
    document.getElementById('paginationNext').style.visibility="visible";
    if (document.getElementById('currentPage').innerText>0){   
        var start=(30*document.getElementById('currentPage').innerText)-60;
            for(breedId in myObj.message) { 
                if (breedId>=start && breedId<start+30) {           
                var b=(breedId % 3);
                var column="column"+b;
                document.getElementById(column).innerHTML += "<div class='picAndDesc'><img id='"+currentBreed+breedId + "' alt='" + currentBreed +  "' src=" +
                myObj.message[breedId] + " onClick=enlargePic('"+breedId+"')><div class='description'>"+ firstBigLetter(currentBreed) +"</div></div>";    
                getPosition();
                }
            }    
            document.getElementById('currentPage').innerText--;
    }
    if (document.getElementById('currentPage').innerText=="1"){
        document.getElementById('paginationBack').style.visibility="hidden";
    }  
  }
    
 
function enlargePic(dogId) {
        
        id=dogId;  // make it global for newPic , only for random picx
        var hiddenWindow=document.getElementById('hiddenWindow');
        var biggerPic=document.getElementById('biggerPic');
        var caption=document.getElementById('caption');
       if (currentBreed=="") {
           dogId="random"+dogId;
       } else {
           dogId=currentBreed+dogId;
       }
        var smallerPic=document.getElementById(dogId);
        hiddenWindow.style.display="block";
        
        biggerPic.src=smallerPic.src;
        var naturalWidth=biggerPic.naturalWidth+"px";
        document.getElementById('biggerPicAndDesc').style.width= naturalWidth;
        caption.innerHTML=getDogName(biggerPic.src);
        
       firstOrLast(id);
       biggerPictureSettings();
    }

function biggerPictureSettings(){
    if(window.innerWidth>window.innerHeight) {
        $('#biggerPic').css("max-height","35vw");
      } else {
        $('#biggerPic').css("max-height","80vw");  
      }

       $('#biggerPicAndDesc').css("width",biggerPic.width);

       $('#nextPic').css("width",biggerPic.width*0.5);
       $('#nextPic').css("height",biggerPic.height);
       $('#prevPic').css("width",biggerPic.width*0.5);
       $('#prevPic').css("height",biggerPic.height); 
 }

window.addEventListener("resize", function() {
    biggerPictureSettings();  
    },false);
        
function newPic(nextOrPrev) {
     var numberOnly;
      if (currentBreed==""){
        if (nextOrPrev == 0) {      
        id--;
        } else if (nextOrPrev == 1) {      
        id++;
        } 
        numberOnly="random"+id;
        
      }  else {
        if (nextOrPrev == 0) {  
            if ((id%30)==0 && id!=0){
                loadLessDogs();
            }   
            id--;
             //to do    
            } else if (nextOrPrev == 1) {      
            id++;
              if ((id%30)==0 && id!=0){
                  loadMoreDogs();
              }
            } 
           numberOnly=currentBreed+id;
           
      }
      
       var smallerPic=document.getElementById(numberOnly);
       biggerPic.src=smallerPic.src;
       var naturalWidth=biggerPic.naturalWidth+"px";
       document.getElementById('biggerPicAndDesc').style.width= naturalWidth; 
       caption.innerHTML=getDogName(biggerPic.src);;
       
       firstOrLast(id);
       biggerPictureSettings();
      
   }

function loadRandomDog(column,dogId) {
    
    currentBreed="";  // this is for nextPic function
    var data= new XMLHttpRequest();
    data.onreadystatechange= function() {
    if (this.readyState==4 && this.status==200)
    {
        var myObj=JSON.parse(this.responseText);  
       /// this is object full of links // global
        document.getElementById(column).innerHTML += "<div class='picAndDesc'><img id='random"+dogId + 
        "' onClick=enlargePic('"+dogId +"') alt='" + myObj.message +  "' src=" +
         myObj.message + " ><div class='description'>"+ getDogName(myObj.message)+"</div></div>";   
         getPosition();  
    }                                               
    }
    
    data.open("GET","https://dog.ceo/api/breeds/image/random",true);
    data.send();
    }

function getDogName(myObj){
    
    var myObj=myObj.slice(30);   // before bylo 58

    var x;
    var myChar;
    var myDogName="";
    for (x=0;x<myObj.length;x++) {
        myChar=myObj.charAt(x);
        if (myObj.charCodeAt(x)==47)  //47 is slash "/"
        {
            return firstBigLetter(myDogName);
        }
        myDogName+=myChar;
        
    }   
    }
function firstBigLetter(word){
    var firstLetter="",newWord;
    firstLetter=word.charAt(0);
    firstLetter=firstLetter.toUpperCase();
    newWord=firstLetter + word.slice(1);
    return newWord;
    }
function clearColumns() {
    document.getElementById('column0').innerHTML="";
    document.getElementById('column1').innerHTML="";
    document.getElementById('column2').innerHTML="";
    }
function closeHiddenWindow() {
    hiddenWindow.style.display = "none";
    }

function firstOrLast(pixId) {
    if (pixId==0) {        
    document.getElementById('prevPic').style.visibility="hidden";
    } else {    
        document.getElementById('prevPic').style.visibility="visible";
    }  
    if ((pixId==29 && currentBreed=="") || pixId==arrayLength-1) {        
    document.getElementById('nextPic').style.visibility="hidden";
    } else {
         document.getElementById('nextPic').style.visibility="visible";
    }
  }

function search() {
    if (window.location.href!="https://worldofdogs.info/" && window.location.href!="https://www.worldofdogs.info/" ){      
        window.location.href = "https://www.worldofdogs.info/?search";
    } else {     
        var search=document.getElementById('search');
        search.style.visibility="visible";
        search.style.width="15vw";
        search.style.transition= "width 0.5s";
        
    }
    }    
  
$('#search').on("input propertychange keypress",function (e){ 
   
    var hintsContainer=document.getElementById('hintsContainer');
    hintsContainer.style.visibility="visible";
    var input=document.getElementById('search');
    
    if (input.value=="")
    {
        hintsContainer.style.visibility="hidden"; 
    }
    var firstLetters;
    var x;
    var codeForHints="";
    var breedAndSubBreed=[];
    hintNo=0;
    for (x=0;x<breedsArray.length;x++){
        firstLetters=breedsArray[x].slice(0,input.value.length);
        if (input.value.toLowerCase()==firstLetters){
        hintNo++;
        breedAndSubBreed=findBreedAndSubBreed(breedsArray[x]);  
        codeForHints+="<div class='hint' id='hint"+hintNo+"' onclick=loadBreedImages('"+breedAndSubBreed[0]+"','"+breedAndSubBreed[1]+"')><strong>"+
        firstLetters+"</strong>"+breedsArray[x].slice(input.value.length,breedsArray[x].length)+ "</div>";
        }
        
    }
    

    hintsContainer.innerHTML=codeForHints;
    getPosition();

    hintLength=hintNo;
    if (codeForHints==""){
        hintsContainer.style.visibility="hidden";
         
    }

   


    if (e.keyCode==13 ) {
        if (hintsContainer.style.visibility=='hidden'){
            return false;
        }
        if (hintIdNo=='#hint0'){
            hintIdNo='#hint1';
        }        
        breedAndSubBreed=findBreedAndSubBreed($(hintIdNo).text());
        loadBreedImages(breedAndSubBreed[0],breedAndSubBreed[1]);
        e.preventDefault();  
    }

    if (e.keyCode==40 ) {    //arrow down
                $('.hint:first').css("backgroundColor","white"); 

                $(previousActiveHint).css("backgroundColor","white"); 
                activeHint++;
                activeHint=Math.min(activeHint,hintLength);
                 hintIdNo="#hint"+activeHint;
                e.preventDefault();
                $(hintIdNo).css("backgroundColor","rgb(231, 231, 231)");  
                previousActiveHint=hintIdNo;
                
            }       
            
    if (e.keyCode==38 ) {   //arrow up
            $('.hint:first').css("backgroundColor","white"); 

            $(previousActiveHint).css("backgroundColor","white"); 
            activeHint--;
            activeHint=Math.max(activeHint,1);
             hintIdNo="#hint"+activeHint;
            e.preventDefault();
            $(hintIdNo).css("backgroundColor","rgb(231, 231, 231)");  
            previousActiveHint=hintIdNo; 
             

     }   
  
 });

function findBreedAndSubBreed(fullName) {
    var x,myChar,breed,subbreed;
    var breedAndSubBreed=[];
    for (x=0;x<fullName.length;x++) {
        myChar=fullName.charAt(x);
        if (fullName.charCodeAt(x)==45)  //45 is  "-"
        {
           breed=fullName.slice(0,x);
           subbreed=fullName.slice(x+1,fullName.length);
           return breedAndSubBreed=[breed,subbreed];
        }
        
    }  
    return breedAndSubBreed=[fullName]; 
    }
function deleteAllCookies() {
        var cookies = document.cookie.split(";");
    
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }    


function getPosition() {  //some css settings for responsive 
    if (w<h){ //pionowo
        $('.header').css({'height':'20%','background-position':'85%'});
        $('.header p').css('font-size','8vw');
        $('.nav').css({'height':'7%','background-position-y':'70%'});
        $('.nav li').css('font-size',"1.5vw");
        $('.menu').css('left','-12%');
        $('.logo').css('margin','7% 0 3% 12%');
        $('td').css('font-size','1.5vw'); 
        $('th').css('font-size','1.5vw'); 
        $('.subbreed').css('font-size','1.5vw'); 
        $('#form').css({'height':'41%','left':'33%','font-size':'1.5vw'});
        $('#search').css({'height':'100%','background-size':'20% 90%','font-size':'1.5vw'});
        $('#hintsContainer').css('top','100%');
        $('.hint').css('font-size','1.5vw'); 
        $('.description').css({'font-size':"1.6vw","padding":"0% 0% 5% 0%"});
        $('#pagination ul').css('font-size',"2vw");
        
        $('#contactForm, #map').css({"float":"none","width":"80%","font-size":"2vw","margin":"2% 0 0 8%"});
        $("#fullName, #subject, #email,#submitContactForm,#message").css("font-size","2vw");
        $('.field').css("font-size","2vw");
        $('#message').css("height","20vh");
        $('.footer').css("font-size","2vw");
        $('#loginFieldset, #registerFieldset ').css({"width":"40%","margin":"0vw 0vw 4% 7%"});
        $('#loginFieldset input ,#logInSubmit, #registerSubmit,#registerFieldset input').css('font-size',"2vw");
        $('legend').css('font-size',"2vw");
        $('input').css("width","50%");
        $('#logInSubmit, #registerSubmit').css("width","36%");
        $('#placeForMessage h3').css('font-size',"3vw");
        $('#hello').css('font-size',"2vw");

    } else {  //poziomo
        $('.header').css({'height':'40%','background-position':'70%'});
        $('.header p').css('font-size','5vw');
        $('.nav').css({'height':'15%'});
        $('.nav li').css('font-size',"1vw");
        $('.menu').css('left','-3%');
        $('.logo').css('margin','4.5% 0 3% 15%');
        $('td').css('font-size','1vw'); 
        $('th').css('font-size','1.2vw'); 
        $('.subbreed').css('font-size','1vw'); 
        $('#form').css({'height':'37%','left':'33%','font-size':'1vw'});
        $('#search').css({'height':'100%','background-size':'15% 90%','font-size':'1vw'});
        $('#hintsContainer').css('top','100%');
        $('.hint').css('font-size','1vw'); 
        $('.description').css({'font-size':"1vw","padding":"1% 0% 2% 0%"});

    }
}
    

function setBody() {   //prevent resizing when keyboard on top

    if (sessionStorage.length==0) {
         w = document.documentElement.clientWidth;
         h = document.documentElement.clientHeight;
        sessionStorage.setItem('w',w);
        sessionStorage.setItem('h',h);
    } else {
        w=sessionStorage.getItem('w');
        h=sessionStorage.getItem('h');    
    }
    $("html").css({"width":w,"height":h});
    $("body").css({"width":w,"height":h});

}






