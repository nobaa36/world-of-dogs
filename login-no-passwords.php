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
    <script>             
        // Log out if username exist after log in button was clicked                      
        if (document.cookie!="") {
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ";
            window.location = "/";              
        }
    </script>
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
    <div id="placeForMessage" class='text-center'>
        <h2 class="text-success">Registered.</h2><br>
        <h3>You can log in now.</h3>
    </div>
    <main class='container w-100 bg-light my-5 row mx-auto no-gutters'>                     
        <div class="col-sm-8 ">
             <!-- Send this form to same page (script to handle post method is on the bottom) --> 
            <form class="form-inline border border-info  my-5 p-2" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
            <legend class='text-center'>Sign Up</legend>
                <input type="text" class="form-control w-100 m-1" name="firstName" required placeholder="Your Name" minlength="3" maxlength="20">
                <input type="email" class="form-control w-100 m-1" name="email" required placeholder="Your Email">
                <input type="password" class="form-control w-100 m-1" id="userPassword" name="userPassword" required placeholder="Password" onKeyUp='passwordMatch()' minlength="8" maxlength="15">
                <input type="password" class="form-control w-100 m-1" id="userPasswordRepeat" name="userPasswordRepeat" required placeholder="Confirm Password" onKeyUp="passwordMatch()" minlength="8" maxlength="15">
                <input type="submit" class='w-100 m-1 bg-danger' id="submitSignUpForm" value="Sign Up" disabled>              
            </form>
        </div>
        <div class='col-sm-4 px-1'>
            <form class="form-inline border border-info  my-5 p-2 " action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
            <legend class='text-center'>Log In</legend>
                <input type="email" class="form-control w-100 m-1" name="emailLogIn" required placeholder="Email">
                <input type="password" class="form-control w-100 m-1" name="userPasswordLogIn" required placeholder="Password">
                <input type="submit" class='m-auto m-1 bg-danger' value="Log In">              
            </form>
        </div>
    </main>                                                 
    <!--PHP form handle-->                             
    <?php                                                                                
    $email=$userPassword=$userPasswordRepeat=$firstName="";
    if ($_SERVER["REQUEST_METHOD"] == "POST") {               
        //Database settings--------------------------REMOVE BEFORE SENDING TO GITHUB                           
        $servername = "";                                                      
        $username = "";                                                   
        $password = "";                                                     
        $dbname = "";                                             
        //Set connection using above settings     
        $conn = new mysqli($servername, $username, $password,$dbname);                    
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);                            
        }
        //Sign Up if 4 data received
        if (count($_POST) == 4) {                  
            //Validate users data using function from below      
            $email=testInput($_POST["email"]);                                                
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { 
                $emailErr = "Invalid email format";
            }
            $firstName=testInput($_POST["firstName"]); 
            $userPassword=testInput($_POST["userPassword"]);
            $userPasswordRepeat=testInput($_POST["userPasswordRepeat"]);
            //Hash password in database 
            $userPassword = password_hash($userPassword,  PASSWORD_DEFAULT);       
            //Check if user already exist                      
            $sql="SELECT email FROM users";                                                   
            $result = $conn->query($sql);                                                    
            while($row = $result->fetch_assoc()){                                             
                if ($row["email"]==$email){                                                   
                    echo "<script>                                                            
                    $('#placeForMessage').css('display','block');
                    $('h2').removeClass('text-success');
                    $('h2').addClass('text-danger');
                    $('h2').text('User already exist.');
                    $('h3').text(' ');  
                    </script>";
                }
            }
            $sql = "INSERT INTO users (email,userPassword,firstName ) VALUES ('$email','$userPassword','$firstName')";       
            if ($conn->query($sql) === TRUE) {                                                                              
                echo "<script>$('#placeForMessage').css('display','block');</script>";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;                                                              
            }     
        //Log in if 2 data received                                             
        } else if (count($_POST) == 2) {            
            //Validate users data      
            $email=testInput($_POST["emailLogIn"]);                                         
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $emailErr = "Invalid email format";
            }
            $userPassword=testInput($_POST["userPasswordLogIn"]);
            $sql="SELECT email FROM users";                                                
            $result = $conn->query($sql);                                                   
            while($row = $result->fetch_assoc()){                                           
                if ($row["email"]==$email){                                                 
                    $sql2="SELECT userPassword FROM users WHERE email='$email'";            
                    $result2 = $conn->query($sql2);
                    $row2 = $result2->fetch_assoc();     
                    //Compare users password with database's password
                    $correct = password_verify($userPassword , $row2['userPassword'] );  
                    //If matched select user name from database and save as cookie using JS  
                    if($correct == true) {                                                  
                        $sql3="SELECT firstName FROM users WHERE email='$email'";           
                        $result3 = $conn->query($sql3);
                        $row3=$result3->fetch_assoc();
                        $firstName=$row3["firstName"];
                        echo "<script>;
                        document.cookie='username=$firstName';  
                        document.location='/';
                        </script>";  
                    } else {                                                                
                        echo "<script>$('#placeForMessage').css('display','block');
                        $('h2').removeClass('text-success');
                        $('h2').addClass('text-danger');    
                        $('h2').text('Wrong email or password.');
                        $('h3').text('Try again.'); 
                        </script>";
                    }
                }
            }                                                
            //If email not found in database show error                                
            echo "<script>$('#placeForMessage').css('display','block');
            $('h2').removeClass('text-success');
            $('h2').addClass('text-danger');
            $('h2').text('Wrong email or password.');
            $('h3').text('Try again.');  
            </script>";
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
    <div class="container-fluid text-center">                                                
        <?php echo "Copyright © 2017- ".date("Y"). " Lukasz Jaworski. All rights reserved";  ?>
    </div>                                                                                  
<script src="script.js"></script>
</body>
</html>