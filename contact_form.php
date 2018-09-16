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
            <li class='menu' onClick="location.href='/contact_form.php'">Contact</li>
            <li class='menu' onclick="search()">Search</li>
            <form id="form" autocomplete="off" >
                <input type=text id="search"  placeholder="Search.." ><div id='hintsContainer'></div>
                </input>
            </form>
            <li id="logIn" onclick="location.href='/log_in.php'">Log In </li>
            <span id=hello> </span>
            
        </ul>
</div>

<div id="formAndMap">
    <form id="contactForm" autocomplete="on" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
    
    <fieldset id="fieldset">
    <legend>Contac Us</legend>
    <div class="field"><input type="text"id="fullName" name="fullName" required></input> Full name </div>
    <div class="field"><input type="text"id="subject" name="subject"required></input> Subject    </div>
    <div class="field"><input type="email" id="email" name="email" required></input> E-mail address</div>  
    <textarea id="message" name="message" class="field" style="width:80%; height:30vh;"   placeholder="Your message.." required>
    </textarea> <br>
    <input type="submit" id="submitContactForm" value="Submit"> </input>
    </fieldset>
    </form>
    
    <div id="map"> 
    google map
    </div>

    
</div>
<div class="footer">
         <?php echo "Copyright © 2017- ".date("Y"). " Lukasz Jaworski. All rights reserved";  ?>
    </div>

<?php
$fullName=$subject=$email=$message="";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
$fullName=testInput($_POST["fullName"]);
$subject=testInput($_POST["subject"]);
$email=testInput($_POST["email"]);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {   // email validation
    $emailErr = "Invalid email format";
  }
$email="From:".$email; 
$message=testInput($_POST["message"]);
$to="lukaszjaworski1987@gmail.com";   //lukaszjaworski1987@gmail.com
if (mail($to,$subject,$message,$email)) {
        echo "<script>alert('We have sent your message. Thank you.');</script>";
    
} else {
  echo "<script>alert('Something went wrong...We couldn't send your message.Try again later please.');</script>";
}

}
function testInput($data){
$data=trim($data);
$data = stripslashes($data);
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
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var marker = new google.maps.Marker({
    position: myCenter,
    animation: google.maps.Animation.BOUNCE
  });
  marker.setMap(map);
}
</script> 
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUyPXkEvv89n_s4wfTTBbLPYocbCPMhrs&callback=myMap"></script>
<script src="script.js"></script> 
</body>
</html>