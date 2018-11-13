import requests
import os
import json
import smtplib
import cgi
import bcrypt
from flask import Flask,render_template,session,request,redirect,url_for
from flask_paginate import Pagination, get_page_parameter

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


app = Flask(__name__)
#Set secret key for a session
app.secret_key=b'8avn4nw8v'                                                                     
#Set database (link with details to postgre database )
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")                                               
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


@app.route("/")                                                                                
def index():                                                                                    
    per_page=33
    # Get list of all breeds ( JSON format)
    breeds = requests.get("https://dog.ceo/api/breeds/list/all")                                
    session['breeds']=breeds.json()['message']
    randomDogs=[]
    # Get 33 random pictures
    for x in range(per_page):                                                                    
        random = requests.get("https://dog.ceo/api/breeds/image/random")
        random = random.json()['message']
        randomDogs.append(random)
    # Send python data to jinja ( index template)
    return render_template("index.html",breeds=session['breeds'],randomDogs=randomDogs)         
    
@app.route("/breeds/<string:breed>")                                                            
@app.route("/breeds/<string:breed>/<string:subbreed>")
def breed(breed,subbreed=None):                                                                  
    per_page=33
    # Request page number for pagination
    page = request.args.get(get_page_parameter(), type=int, default=1)                          
    dogs=[]
    # Get dogs requried by user
    if subbreed==None:
        dogLinks = requests.get("https://dog.ceo/api/breed/"+breed+"/images")                   
    else:    
        dogLinks = requests.get("https://dog.ceo/api/breed/"+breed+"/"+subbreed+"/images")
    dogs = dogLinks.json()['message']
    # Offset for pagination
    offset=(page-1)*per_page                                                                    
    dogs = dogs[offset:offset+per_page]                                                         
    pagination = Pagination(page=page, total=len(dogs), search=False, record_name=dogs,css_framework='bootstrap4')
    # Send python data to jinja ( generate breed tamplate)
    return render_template("breed.html",breeds=session['breeds'],dogs=dogs,pagination=pagination)  

    
@app.route("/contact",methods=["GET","POST"])                                                   
def contact():
    result_msg=""
    if request.method=="POST":       
        # Escape html and get all form fields                                                            
        email=cgi.escape(request.form.get('email'))                                             
        message=cgi.escape(request.form.get('message'))

        toaddr = "lukaszjaworski1987@gmail.com"                                     
        msg = MIMEMultipart()                                                                   
        msg['From'] = cgi.escape(request.form.get('fullName'))
        msg['To'] = toaddr
        msg['Subject'] = cgi.escape(request.form.get('subject'))
        # Create email
        msg.attach(MIMEText(message, 'plain'))                                                 
        # Server settings
        server = smtplib.SMTP('',25)                           #-----------------> Remove this data before sending to GitHub               
        server.ehlo()
        server.login("", "")                                 
        text = msg.as_string()
        # Send email and display massage if ok or not
        try:
            server.sendmail(email, toaddr, text)                                                
            result_msg=('We have sent your message. Thank you.')
        except smtplib.SMTPException:
            result_msg=("Something went wrong...We couldn't send your message.Try again later please.")
    # Send short message to jinja   
    return render_template("contact.html",result_msg=result_msg)                                

@app.route("/login",methods=["GET","POST"])                                                     
def login():
    log_in_message=""
    session.clear()                                                                             
    if request.method=="POST":
        #Sign Up
        try:                                                                                                    
            email=cgi.escape(request.form.get('email'))                                         
            userPassword=cgi.escape(request.form.get('userPassword'))
            userPassword=bytes(str(userPassword), encoding='utf-8')
            # Encrypt password for database
            hashed = bcrypt.hashpw(userPassword, bcrypt.gensalt())                              
            data=db.execute("SELECT username FROM users").fetchall()                            
            for i in range(len(data)):
                if data[i]["username"]==email:
                    log_in_message="Sorry. Username already exist"
                    return render_template('login.html',log_in_message=log_in_message)          
            db.execute("INSERT INTO users (username,password) VALUES (:a,:b)",{"a":email,"b":hashed.decode('ascii')})  
            db.commit()
            log_in_message="Success! You can log in now."
        except:          
            # Login                                                                                   
            emailLogIn=cgi.escape(request.form.get('emailLogIn'))                               
            userPasswordLogIn=cgi.escape(request.form.get('userPasswordLogIn'))                 
            userPasswordLogIn=bytes(str(userPasswordLogIn), encoding='utf-8')                   
            data=db.execute("SELECT * FROM users WHERE username = :a",{"a":emailLogIn}).fetchone()                  
            if data!=None:
                if data.username==emailLogIn and bcrypt.checkpw(userPasswordLogIn, data.password.encode('ascii')): 
                    # if same add username to session 
                    session["username"]=emailLogIn
                    return redirect(url_for("index"))                                           
                else:
                    log_in_message="Wrong email or password. Try again."
            else:
                log_in_message="Wrong email or password. Try again."                            
    return render_template('login.html',log_in_message=log_in_message)


