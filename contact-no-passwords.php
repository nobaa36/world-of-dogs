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
    </nav>                                                        
    <main class='container-fluid row no-gutters h-75 w-100'>      
        <div class="col-sm-6">
            <form class="form-inlineb bg-light border border-light my-5 p-2" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
            <legend class='text-center'>Contact Us</legend>
                <label for="text">Full name</label>
                <input type="text" class="form-control w-50" name="fullName" required>
                <label for="text">Subject</label>
                <input type="text" class="form-control w-50" name="subject" required>
                <label for="email">Email address:</label>
                <input type="email" class="form-control w-50" name="email" required>
                <label for="textarea">Your message...</label>
                <textarea  class='w-100' name="message"  required></textarea>
                <input type="submit" id="submitContactForm" value="Submit">
            </form>
        </div>
        <div class="col-sm-6 h-75 my-5 border border-light " id='map'>          
            google map      
        </div>
        <div id='footer' class="container-fluid text-center">
            <?php echo "Copyright © 2017- ".date("Y"). " Lukasz Jaworski. All rights reserved";  ?>
        </div>
    </main>                                                      
   
    <!-- PHP form handle-->
    <?php                                                         
    $fullName=$subject=$email=$message="";
    if ($_SERVER["REQUEST_METHOD"] == "POST") {     
        //Using POST method get form data and validate it using funtion from the end of php sript                 
        $fullName=testInput($_POST["fullName"]);                  
        $subject=testInput($_POST["subject"]);
        $email=testInput($_POST["email"]);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {   
            $emailErr = "Invalid email format";
        }
        $email="From:".$email; 
        $message=testInput($_POST["message"]);
        $to="lukaszjaworski1987@gmail.com";   
        //Mail to my email all data and show message on screen
        if (mail($to,$subject,$message,$email)) {                 
            echo "<script>alert('We have sent your message. Thank you.');</script>";
        } else {
            echo "<script>alert('Something went wrong...We couldn't send your message.Try again later please.');</script>";
        }
    }
    function testInput($data){        
    //Strip unnecessary characters (extra space, tab, newline)                             
    $data=trim($data);             
    //Remove backslashes (\)                                                     
    $data = stripslashes($data);         
    //Escape HTML tags                          
    $data = htmlspecialchars($data);                               
    return $data;
    }                                                              
    ?>
    <script>                                                       
    function myMap() {
        var mapCanvas = document.getElementById("map");                              
        var myCenter =new google.maps.LatLng(51.508742,-0.120850); 
        var mapOptions = {                                         
            center: myCenter , zoom: 5
        };
        //Create map with my options
        var map = new google.maps.Map(mapCanvas, mapOptions);        
        var marker = new google.maps.Marker({                      
            position: myCenter,
            animation: google.maps.Animation.BOUNCE
        });
        //Set marker on map
        marker.setMap(map);                                        
    }                                                              
    </script> 
<script src="https://maps.googleapis.com/maps/api/js?key==myMap"></script>      <!-- Google maps API key REMOVE !!!-->
<script src="script.js"></script>
</body>
</html>