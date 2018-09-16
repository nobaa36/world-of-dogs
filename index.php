<!DOCTYPE html>
<html style='height:100%'>
<head>
    <meta charset="UTF-8">    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="tab_icon.png">
    <link rel="stylesheet" type="text/css" href="psy.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <title>World of Dogs</title>
</head>
<body style='height:100%'>
<div class="header">
    <div class="logo" onclick="location.href='/'"><p>World of Dogs</p></div>
</div>    
<div class="nav">
        <ul>
            <li class='menu' onclick="location.href='/'"> Home</li>
            <li class='menu' onClick="location.href='/contact_form.php'"  >Contact</li>
            <li class='menu' onclick="search()">Search</li>        
            <form id="form" autocomplete="off" >
                <input type=text id="search"  placeholder="Search.." ><div id='hintsContainer'></div>
                </input>
            </form>
            <li id="logIn" onclick="location.href='/log_in.php'">Log In </li>
            <span id=hello> </span>
            
        </ul>
</div>

<div  style="float:left">
    <div class="leftColumn" >
        <table id="leftColumn">
            <tr>
                <th> Breed</th>
            </tr>
        </table>

    </div>

    <div id="mainArea">
        <div id="column0"></div>
        <div id="column1"></div>
        <div id="column2"></div>
        <div id="pagination"></div>
    </div>

</div>    
    <div class="footer">
         <?php echo "Copyright © 2017- ".date("Y"). " Lukasz Jaworski. All rights reserved";  ?>
    </div>
    
    <div id="hiddenWindow" >
        <span id="close" onClick=closeHiddenWindow()>&times;</span>
        <div id="biggerPicAndDesc">
            <div id="prevPic" onClick=newPic(0)>❮</div> 
            <img id="biggerPic">
            <div id="nextPic" onClick=newPic(1)>❯</div>
            <div id="caption"></div>
    </div>
    </div>


    <script src="script.js"></script> 

    </body>
    </html>