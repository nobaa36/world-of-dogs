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
app.secret_key=b'8avn4nw8v'                                                                     ## set secret key for session

if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")                                               ##SET IT MANUALY (LINK WITH DETAILS TO POSTGRE )
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


@app.route("/")                                                                                 ## when user open main page
def index():                                                                                    
    per_page=33
    breeds = requests.get("https://dog.ceo/api/breeds/list/all")                                ## get list of all breeds ( JSON format)
    session['breeds']=breeds.json()['message']
    randomDogs=[]
    for x in range(per_page):                                                                   ## get 33 random pictures 
        random = requests.get("https://dog.ceo/api/breeds/image/random")
        random = random.json()['message']
        randomDogs.append(random)
    return render_template("index.html",breeds=session['breeds'],randomDogs=randomDogs)         ## send python data to jinja ( index template)
    
@app.route("/breeds/<string:breed>")                                                            ## when user open route with dog name 
@app.route("/breeds/<string:breed>/<string:subbreed>")
def breed(breed,subbreed=None):                                                                 ## data from path 
    per_page=33
    page = request.args.get(get_page_parameter(), type=int, default=1)                          ## request page number for pagination
    dogs=[]
    if subbreed==None:
        dogLinks = requests.get("https://dog.ceo/api/breed/"+breed+"/images")                   ## get dogs requried by user
    else:    
        dogLinks = requests.get("https://dog.ceo/api/breed/"+breed+"/"+subbreed+"/images")
    dogs = dogLinks.json()['message']
    offset=(page-1)*per_page                                                                    ## offset for pagination
    dogs = dogs[offset:offset+per_page]                                                         
    pagination = Pagination(page=page, total=len(dogs), search=False, record_name=dogs,css_framework='bootstrap4')

    return render_template("breed.html",breeds=session['breeds'],dogs=dogs,pagination=pagination)  ## send python data to jinja ( generate breed tamplate)

    
@app.route("/contact",methods=["GET","POST"])                                                   ## when user open route cotanct ( two methods)
def contact():
    result_msg=""
    if request.method=="POST":                                                                  ## if user sending form 
        email=cgi.escape(request.form.get('email'))                                             ## escape html and get all form fields
        message=cgi.escape(request.form.get('message'))

        toaddr = "lukaszjaworski1987@gmail.com"                                     
        msg = MIMEMultipart()                                                                   
        msg['From'] = cgi.escape(request.form.get('fullName'))
        msg['To'] = toaddr
        msg['Subject'] = cgi.escape(request.form.get('subject'))
        msg.attach(MIMEText(message, 'plain'))                                                  ## create email

        server = smtplib.SMTP('smtp.123-reg.co.uk',25)                                          ## server settings
        server.ehlo()
        server.login("", "")                                 ##-----------------> remove this data before sending to GitHub
        text = msg.as_string()
        try:
            server.sendmail(email, toaddr, text)                                                ## send email and display massage if ok or not
            result_msg=('We have sent your message. Thank you.')
        except smtplib.SMTPException:
            result_msg=("Something went wrong...We couldn't send your message.Try again later please.")
        
    return render_template("contact.html",result_msg=result_msg)                                ## send short message to jinja

@app.route("/login",methods=["GET","POST"])                                                     ## when user open route login
def login():
    log_in_message=""
    session.clear()                                                                             
    if request.method=="POST":
        try:                                                                                                #sign up    
            email=cgi.escape(request.form.get('email'))                                         ## escape html and get form data
            userPassword=cgi.escape(request.form.get('userPassword'))
            userPassword=bytes(str(userPassword), encoding='utf-8')
            hashed = bcrypt.hashpw(userPassword, bcrypt.gensalt())                              ## encrypt password for database
            data=db.execute("SELECT username FROM users").fetchall()                            ## check if username already exist ( get username column)
            for i in range(len(data)):
                if data[i]["username"]==email:
                    log_in_message="Sorry. Username already exist"
                    return render_template('login.html',log_in_message=log_in_message)          ## if username exist stop here and render site with short message
            db.execute("INSERT INTO users (username,password) VALUES (:a,:b)",{"a":email,"b":hashed.decode('ascii')})  ## if user doesn't exist isert data to database
            db.commit()
            log_in_message="Success! You can log in now."
        except:                                                                                             #login
            emailLogIn=cgi.escape(request.form.get('emailLogIn'))                               ## escape html and get form data
            userPasswordLogIn=cgi.escape(request.form.get('userPasswordLogIn'))                 
            userPasswordLogIn=bytes(str(userPasswordLogIn), encoding='utf-8')                   ## encrypt password for check
            data=db.execute("SELECT * FROM users WHERE username = :a",{"a":emailLogIn}).fetchone()                  ##select data from databese to comapre with user input
            if data!=None:
                if data.username==emailLogIn and bcrypt.checkpw(userPasswordLogIn, data.password.encode('ascii')): ## if same add username to session and 
                    session["username"]=emailLogIn
                    return redirect(url_for("index"))                                           ## go to index
                else:
                    log_in_message="Wrong email or password. Try again."
            else:
                log_in_message="Wrong email or password. Try again."                            ## in case of any errors render login page with short message
    return render_template('login.html',log_in_message=log_in_message)


