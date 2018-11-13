<!DOCTYPE html>
<html style="height:100%">
<head>
    <meta charset="UTF-8">    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="tab_icon.png">
    <link rel="stylesheet" type="text/css" href="styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"> 
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <title>World of Dogs</title>
</head>
<body style="height:100%">
    <div class="container-fluid h-5 text-right text-capitalize">  
        <label id='logInLabel'></label>
        <button id='logInButton' type="button" class="btn btn-outline-primary m-2" onClick="location.href='/login.php'">Log In / Sign Up</button>
    </div>                                                        
    <header class="row align-items-center no-gutters">            
        <div class="col-sm-6  text-center text-sm-right"  ><h1 onClick="location.href='/'">World of Dogs</h1></div>
        <div class="col-sm-6 " ><img class="img-fluid" src="header.jpg" ></div>
    </header>                                                     
    <nav class="container-fluid row no-gutters">                 
        <div class="col-sm-6 d-flex justify-content-start">
            <button type="button" class="bg-white btn btn-outline-primary my-2 m-sm-2" onClick="location.href='/'">Home</button>
            <button type="button" class="bg-white btn btn-outline-primary m-2" onClick="location.href='/contact.php'">Contact</button>
        </div>
        <div class="col-sm-6 d-flex justify-content-center justify-content-sm-end">
            <div class='my-2' id='inputWrapper'>
                <input id='searchInput' class="form-control " type="text">
                <div id='searchHints' onClick="closeHints()" class="list-group text-capitalize"></div>          
            </div>
            <button class="btn btn-info my-2" onClick='searchButton()'>Search</button>
        </div>
    </nav>                                                       
    <main class="row w-100 no-gutters">                           
        <div class="col-sm-2"  id='leftColumn' >
            <ul class="list-group list-group-flush text-center text-capitalize" id="accordion">
            </ul>
        </div>
        <div class="col-sm-10">
            <div class='row w-100 no-gutters'>
                <div class="col-sm-12 d-flex align-self-start ">
                    <div id="column0" class="col-sm-4 "></div>
                    <div id="column1" class="col-sm-4 "></div>
                    <div id="column2" class="col-sm-4 "></div>
                </div> 
                <div id="pagination" class="container-fluid"></div>
            </div>
        </div>
    </main>                                                        
    <div id='hiddenWindow' class='container-fluid h-100 invisible d-flex justify-content-center'>   
        <div id='biggerPixWrapper' class='text-center text-capitalize align-self-center carousel slide'>
            <div class='carousel-control-next' onClick='carousel("next")'><span class="carousel-control-next-icon"></span></div>
            <div class='carousel-control-prev' onClick='carousel("prev")'><span class="carousel-control-prev-icon"></span></div>
            <div class='bg-light'>
                <button type="button" onClick='closeHiddenWindow()' class="close text-white">&times;</button>
            </div>
            <img id='largePix' class='img-fluid img-thumbnail border border-0' >
            <div id='largePixLabel' class='bg-light'></div>
        </div>     
    </div>                                                                                          
    <div class="container-fluid text-center">                     
            <?php echo "Copyright © 2017- ".date("Y"). " Lukasz Jaworski. All rights reserved";  ?>
    </div>                                                        
<script src="script.js"></script>
</body>
</html>