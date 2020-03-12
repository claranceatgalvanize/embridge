`In this article, we’re going to look at managing user authentication in the MEAN stack. We’ll use the most common MEAN architecture of having an Angular single-page app using a REST API built with Node, Express and MongoDB.

When thinking about user authentication, we need to tackle the following things:

let a user register
save their data, but never directly store their password
let a returning user log in
keep a logged in user’s session alive between page visits
have some pages that can only been seen by logged in users
change output to the screen depending on logged in status (e.g. a “login” button or a “my profile” button).
Before we dive into the code, let’s take a few minutes for a high-level look at how authentication is going to work in the MEAN stack.

The MEAN Stack Authentication Flow
So what does authentication look like in the MEAN stack?

Still keeping this at a high level, these are the components of the flow:

user data is stored in MongoDB, with the passwords hashed
CRUD functions are built in an Express API — Create (register), Read (login, get profile), Update, Delete
an Angular application calls the API and deals with the responses
the Express API generates a JSON Web Token (JWT, pronounced “Jot”) upon registration or login, and passes this to the Angular application
the Angular application stores the JWT in order to maintain the user’s session
the Angular application checks the validity of the JWT when displaying protected views
the Angular application passes the JWT back to Express when calling protected API routes.
JWTs are preferred over cookies for maintaining the session state in the browser. Cookies are better for maintaining state when using a server-side application.

The Example Application
The code for this article is available on GitHub. To run the application, you’ll need to have Node.js installed, along with MongoDB. (For instructions on how to install, please refer to Mongo’s official documentation — Windows, Linux, macOS).

The Angular App
To keep the example in this article simple, we’ll start with an Angular app with four pages:

home page
register page
login page
profile page
The pages are pretty basic and look like this to start with:

Screenshots of the app

The profile page will only be accessible to authenticated users. All the files for the Angular app are in a folder inside the Angular CLI app called /client.

We’ll use the Angular CLI for building and running the local server. If you’re unfamiliar with the Angular CLI, refer to the Angular 2 Tutorial: Create a CRUD App with Angular CLI to get started.

The REST API
We’ll also start off with the skeleton of a REST API built with Node, Express and MongoDB, using Mongoose to manage the schemas. This API has three routes:

/api/register (POST) — to handle new users registering
/api/login (POST) — to handle returning users logging in
/api/profile/USERID (GET) — to return profile details when given a USERID.
The code for the API is all held in another folder inside the Express app, called api. This holds the routes, controllers and model, and is organized like this:

Screenshot of api folder structure

At this starting point, each of the controllers simply responds with a confirmation, like this:

module.exports.register = function(req, res) {
console.log("Registering user: " + req.body.email);
res.status(200);
res.json({
"message" : "User registered: " + req.body.email
});
};
Okay, let’s get on with the code, starting with the database.

Creating the MongoDB Data Schema with Mongoose
There’s a simple user schema defined in /api/models/users.js. It defines the need for an email address, a name, a hash and a salt. The hash and salt will be used instead of saving a password. The email is set to unique as we’ll use it for the login credentials. Here’s the schema:

var userSchema = new mongoose.Schema({
email: {
type: String,
unique: true,
required: true
},
name: {
type: String,
required: true
},
hash: String,
salt: String
});
Managing the Password without Saving It
Saving user passwords is a big no-no. Should a hacker get a copy of your database, you want to make sure they can’t use it to log in to accounts. This is where the hash and salt come in.

The salt is a string of characters unique to each user. The hash is created by combining the password provided by the user and the salt, and then applying one-way encryption. As the hash can’t be decrypted, the only way to authenticate a user is to take the password, combine it with the salt and encrypt it again. If the output of this matches the hash, the password must have been correct.

To do the setting and the checking of the password, we can use Mongoose schema methods. These are essentially functions that you add to the schema. They’ll both make use of the Node.js crypto module.

At the top of the users.js model file, require crypto so that we can use it:

var crypto = require('crypto');
Nothing needs installing, as crypto ships as part of Node. Crypto itself has several methods; we’re interested in randomBytes to create the random salt and pbkdf2Sync to create the hash (there’s much more about Crypto in the Node.js API docs).

Setting the Password
To save the reference to the password, we can create a new method called setPassword on the userSchema schema that accepts a password parameter. The method will then use crypto.randomBytes to set the salt, and crypto.pbkdf2Sync to set the hash:

userSchema.methods.setPassword = function(password){
this.salt = crypto.randomBytes(16).toString('hex');
this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};
We’ll use this method when creating a user. Instead of saving the password to a password path, we’ll be able to pass it to the setPassword function to set the salt and hash paths in the user document.

Checking the Password
Checking the password is a similar process, but we already have the salt from the Mongoose model. This time we just want to encrypt the salt and the password and see if the output matches the stored hash.

Add another new method to the users.js model file, called validPassword:

userSchema.methods.validPassword = function(password) {
var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
return this.hash === hash;
};
Generating a JSON Web Token (JWT)
One more thing the Mongoose model needs to be able to do is generate a JWT, so that the API can send it out as a response. A Mongoose method is ideal here too, as it means we can keep the code in one place and call it whenever needed. We’ll need to call it when a user registers and when a user logs in.

To create the JWT, we’ll use a module called jsonwebtoken which needs to be installed in the application, so run this on the command line:

npm install jsonwebtoken --save
Then require this in the users.js model file:

var jwt = require('jsonwebtoken');
This module exposes a sign method that we can use to create a JWT, simply passing it the data we want to include in the token, plus a secret that the hashing algorithm will use. The data should be sent as a JavaScript object, and include an expiry date in an exp property.

Adding a generateJwt method to userSchema in order to return a JWT looks like this:

userSchema.methods.generateJwt = function() {
var expiry = new Date();
expiry.setDate(expiry.getDate() + 7);

return jwt.sign({
\_id: this.\_id,
email: this.email,
name: this.name,
exp: parseInt(expiry.getTime() / 1000),
}, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};
Note: It’s important that your secret is kept safe: only the originating server should know what it is. It’s best practice to set the secret as an environment variable, and not have it in the source code, especially if your code is stored in version control somewhere.

That’s everything we need to do with the database.

Set Up Passport to Handle the Express Authentication
Passport is a Node module that simplifies the process of handling authentication in Express. It provides a common gateway to work with many different authentication “strategies”, such as logging in with Facebook, Twitter or Oauth. The strategy we’ll use is called “local”, as it uses a username and password stored locally.

To use Passport, first install it and the strategy, saving them in package.json:

npm install passport --save
npm install passport-local --save
Configure Passport
Inside the api folder, create a new folder config and create a file in there called passport.js. This is where we define the strategy.

Before defining the strategy, this file needs to require Passport, the strategy, Mongoose and the User model:

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
For a local strategy, we essentially just need to write a Mongoose query on the User model. This query should find a user with the email address specified, and then call the validPassword method to see if the hashes match. Pretty simple.

There’s just one curiosity of Passport to deal with. Internally, the local strategy for Passport expects two pieces of data called username and password. However, we’re using email as our unique identifier, not username. This can be configured in an options object with a usernameField property in the strategy definition. After that, it’s over to the Mongoose query.

So all in, the strategy definition will look like this:

passport.use(new LocalStrategy({
usernameField: 'email'
},
function(username, password, done) {
User.findOne({ email: username }, function (err, user) {
if (err) { return done(err); }
// Return if user not found in database
if (!user) {
return done(null, false, {
message: 'User not found'
});
}
// Return if password is wrong
if (!user.validPassword(password)) {
return done(null, false, {
message: 'Password is wrong'
});
}
// If credentials are correct, return the user object
return done(null, user);
});
}
));
Note how the validPassword schema method is called directly on the user instance.

Now Passport just needs to be added to the application. So in app.js we need to require the Passport module, require the Passport config and initialize Passport as middleware. The placement of all of these items inside app.js is quite important, as they need to fit into a certain sequence.

The Passport module should be required at the top of the file with the other general require statements:

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
The config should be required after the model is required, as the config references the model.

require('./api/models/db');
require('./api/config/passport');
Finally, Passport should be initialized as Express middleware just before the API routes are added, as these routes are the first time that Passport will be used.

app.use(passport.initialize());
app.use('/api', routesApi);
We’ve now got the schema and Passport set up. Next, it’s time to put these to use in the routes and controllers of the API.

Configure API Endpoints
With the API we’ve got two things to do:

make the controllers functional
secure the /api/profile route so that only authenticated users can access it.
Code the Register and Login API Controllers
In the example app the register and login controllers are in /api/controllers/authentication.js. In order for the controllers to work, the file needs to require Passport, Mongoose and the user model:

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
The Register API Controller
The register controller needs to do the following:

take the data from the submitted form and create a new Mongoose model instance
call the setPassword method we created earlier to add the salt and the hash to the instance
save the instance as a record to the database
generate a JWT
send the JWT inside the JSON response.
In code, all of that looks like this:

module.exports.register = function(req, res) {
var user = new User();

user.name = req.body.name;
user.email = req.body.email;

user.setPassword(req.body.password);

user.save(function(err) {
var token;
token = user.generateJwt();
res.status(200);
res.json({
"token" : token
});
});
};
This makes use of the setPassword and generateJwt methods we created in the Mongoose schema definition. See how having that code in the schema makes this controller really easy to read and understand.

Don’t forget that, in reality, this code would have a number of error traps, validating form inputs and catching errors in the save function. They’re omitted here to highlight the main functionality of the code.

The Login API Controller
The login controller hands over pretty much all control to Passport, although you could (and should) add some validation beforehand to check that the required fields have been sent.

For Passport to do its magic and run the strategy defined in the config, we need to call the authenticate method as shown below. This method will call a callback with three possible parameters err, user and info. If user is defined, it can be used to generate a JWT to be returned to the browser:

module.exports.login = function(req, res) {

passport.authenticate('local', function(err, user, info){
var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }

})(req, res);

};
Securing an API Route
The final thing to do in the back end is make sure that only authenticated users can access the /api/profile route. The way to validate a request is to ensure that the JWT sent with it is genuine, by using the secret again. This is why you should keep it a secret and not in the code.

Configuring the Route Authentication
First we need to install a piece of middleware called express-jwt:

npm install express-jwt --save
Then we need to require it and configure it in the file where the routes are defined. In the sample application, this is /api/routes/index.js. Configuration is a case of telling it the secret, and — optionally — the name of the property to create on the req object that will hold the JWT. We’ll be able to use this property inside the controller associated with the route. The default name for the property is user, but this is the name of an instance of our Mongoose User model, so we’ll set it to payload to avoid confusion:

var jwt = require('express-jwt');
var auth = jwt({
secret: 'MY_SECRET',
userProperty: 'payload'
});
Again, don’t keep the secret in the code!

Applying the Route Authentication
To apply this middleware, simply reference the function in the middle of the route to be protected, like this:

router.get('/profile', auth, ctrlProfile.profileRead);
If someone tries to access that route now without a valid JWT, the middleware will throw an error. To make sure our API plays nicely, catch this error and return a 401 response by adding the following into the error handlers section of the main app.js file:

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
if (err.name === 'UnauthorizedError') {
res.status(401);
res.json({"message" : err.name + ": " + err.message});
}
});
Using the Route Authentication
In this example, we only want people to be able to view their own profiles, so we get the user ID from the JWT and use it in a Mongoose query.

The controller for this route is in /api/controllers/profile.js. The entire contents of this file look like this:

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

// If no user ID exists in the JWT return a 401
if (!req.payload.\_id) {
res.status(401).json({
"message" : "UnauthorizedError: private profile"
});
} else {
// Otherwise continue
User
.findById(req.payload.\_id)
.exec(function(err, user) {
res.status(200).json(user);
});
}

};
Naturally, this should be fleshed out with some more error trapping — for example, if the user isn’t found — but this snippet is kept brief to demonstrate the key points of the approach.

That’s it for the back end. The database is configured, we have API endpoints for registering and logging in that generate and return a JWT, and also a protected route. On to the front end!

Create Angular Authentication Service
Most of the work in the front end can be put into an Angular service, creating methods to manage:

saving the JWT in local storage
reading the JWT from local storage
deleting the JWT from local storage
calling the register and login API endpoints
checking whether a user is currently logged in
getting the details of the logged-in user from the JWT.
We’ll need to create a new service called AuthenticationService. With the CLI, this can be done by running ng generate service authentication, and making sure it’s listed in the app module providers. In the example app, this is in the file /client/src/app/authentication.service.ts.

Local Storage: Saving, Reading and Deleting a JWT
To keep a user logged in between visits, we use localStorage in the browser to save the JWT. An alternative is to use sessionStorage, which will only keep the token during the current browser session.

First, we want to create a few interfaces to handle the data types. This is useful for type checking our application. The profile returns an object formatted as UserDetails, and the login and register endpoints expect a TokenPayload during the request and return a TokenResponse object:

export interface UserDetails {
\_id: string;
email: string;
name: string;
exp: number;
iat: number;
}

interface TokenResponse {
token: string;
}

export interface TokenPayload {
email: string;
password: string;
name?: string;
}
This service uses the HttpClient service from Angular to make HTTP requests to our server application (which we’ll use in a moment) and the Router service to navigate programmatically. We must inject them into our service constructor.

Then we define four methods that interact with the JWT token. We implement saveToken to handle storing the token into localStorage and onto the token property, a getToken method to retrieve the token from localStorage or from the token property, and a logout function that removes the JWT token from memory and redirects to the home page.

It’s important to note that this code doesn’t run if you’re using server-side rendering, because APIs like localStorage and window.atob aren’t available, and there are details about solutions to address server-side rendering in the Angular documentation.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

// Interfaces here

@Injectable()
export class AuthenticationService {
private token: string;

constructor(private http: HttpClient, private router: Router) {}

private saveToken(token: string): void {
localStorage.setItem('mean-token', token);
this.token = token;
}

private getToken(): string {
if (!this.token) {
this.token = localStorage.getItem('mean-token');
}
return this.token;
}

public logout(): void {
this.token = '';
window.localStorage.removeItem('mean-token');
this.router.navigateByUrl('/');
}
}

Now let’s add a method to check for this token — and the validity of the token — to find out if the visitor is logged in.

Getting Data from a JWT
When we set the data for the JWT (in the generateJwt Mongoose method) we included the expiry date in an exp property. But if you look at a JWT, it seems to be a random string, like this following example:

eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NWQ0MjNjMTUxMzcxMmNkMzE3YTRkYTciLCJlbWFpbCI6InNpbW9uQGZ1bGxzdGFja3RyYWluaW5nLmNvbSIsIm5hbWUiOiJTaW1vbiBIb2xtZXMiLCJleHAiOjE0NDA1NzA5NDUsImlhdCI6MTQzOTk2NjE0NX0.jS50GlmolxLoKrA_24LDKaW3vNaY94Y9EqYAFvsTiLg
So how do you read a JWT?

A JWT is actually made up of three separate strings, separated by a dot .. These three parts are:

Header — an encoded JSON object containing the type and the hashing algorithm used
Payload — an encoded JSON object containing the data, the real body of the token
Signature — an encrypted hash of the header and payload, using the “secret” set on the server.
It’s the second part we’re interested in here — the payload. Note that this is encoded rather than encrypted, meaning that we can decode it.

There’s a function called atob() that’s native to modern browsers, and which will decode a Base64 string like this.

So we need to get the second part of the token, decode it and parse it as JSON. Then we can check that the expiry date hasn’t passed.

At the end of it, the getUserDetails function should return an object of the UserDetails type or null, depending on whether a valid token is found or not. Put together, it looks like this:

public getUserDetails(): UserDetails {
const token = this.getToken();
let payload;
if (token) {
payload = token.split('.')[1];
payload = window.atob(payload);
return JSON.parse(payload);
} else {
return null;
}
}
The user details that are provided include the information about the user’s name, email, and the expiration of the token, which we’ll use to check if the user session is valid.

Check Whether a User Is Logged In
Add a new method called isLoggedIn to the service. It uses the getUserDetails method to get the token details from the JWT token and checks the expiration hasn’t passed yet:

public isLoggedIn(): boolean {
const user = this.getUserDetails();
if (user) {
return user.exp > Date.now() / 1000;
} else {
return false;
}
}
If the token exists, the method will return if the user is logged in as a boolean value. Now we can construct our HTTP requests to load data, using the token for authorization.

Structuring the API Calls
To facilitate making API calls, add the request method to the AuthenticationService, which is able to construct and return the proper HTTP request observable depending on the specific type of request. It’s a private method, since it’s only used by this service, and exists just to reduce code duplication. This will use the Angular HttpClient service; remember to inject this into the AuthenticationService if it’s not already there:

private request(method: 'post'|'get', type: 'login'|'register'|'profile', user?: TokenPayload): Observable<any> {
let base;

if (method === 'post') {
base = this.http.post(`/api/${type}`, user);
} else {
base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
}

const request = base.pipe(
map((data: TokenResponse) => {
if (data.token) {
this.saveToken(data.token);
}
return data;
})
);

return request;
}
It does require the map operator from RxJS in order to intercept and store the token in the service if it’s returned by an API login or register call. Now we can implement the public methods to call the API.

Calling the Register and Login API Endpoints
Just three methods to add. We’ll need an interface between the Angular app and the API, to call the login and register endpoints and save the returned token, or the profile endpoint to get the user details:

public register(user: TokenPayload): Observable<any> {
return this.request('post', 'register', user);
}

public login(user: TokenPayload): Observable<any> {
return this.request('post', 'login', user);
}

public profile(): Observable<any> {
return this.request('get', 'profile');
}
Each method returns an observable that will handle the HTTP request for one of the API calls we need to make. That finalizes the service; now to tie everything together in the Angular app.

Apply Authentication to Angular App
We can use the AuthenticationService inside the Angular app in a number of ways to give the experience we’re after:

wire up the register and sign-in forms
update the navigation to reflect the user’s status
only allow logged-in users access to the /profile route
call the protected /api/profile API route.
Connect the Register and Login Controllers
We’ll begin by looking at the register and login forms.

The Register Page
The HTML for the registration form already exists and has NgModel directives attached to the fields, all bound to properties set on the credentials controller property. The form also has a (submit) event binding to handle the submission. In the example application, it’s in /client/src/app/register/register.component.html and looks like this:

<form (submit)="register()">
  <div class="form-group">
    <label for="name">Full name</label>
    <input type="text" class="form-control" name="name" placeholder="Enter your name" [(ngModel)]="credentials.name">
  </div>
  <div class="form-group">
    <label for="email">Email address</label>
    <input type="email" class="form-control" name="email" placeholder="Enter email" [(ngModel)]="credentials.email">
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" name="password" placeholder="Password" [(ngModel)]="credentials.password">
  </div>
  <button type="submit" class="btn btn-default">Register!</button>
</form>
The first task in the controller is to ensure our AuthenticationService and the Router are injected and available through the constructor. Next, inside the register handler for the form submit, make a call to auth.register, passing it the credentials from the form.

The register method returns an observable, which we need to subscribe to in order to trigger the request. The observable will emit success or failure, and if someone has successfully registered, we’ll set the application to redirect them to the profile page or log the error in the console.

Report Advertisement
In the sample application, the controller is in /client/src/app/register/register.component.ts and looks like this:

import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
templateUrl: './register.component.html'
})
export class RegisterComponent {
credentials: TokenPayload = {
email: '',
name: '',
password: ''
};

constructor(private auth: AuthenticationService, private router: Router) {}

register() {
this.auth.register(this.credentials).subscribe(() => {
this.router.navigateByUrl('/profile');
}, (err) => {
console.error(err);
});
}
}
The Login Page
The login page is very similar in nature to the register page, but in this form we don’t ask for the name, just email and password. In the sample application, it’s in /client/src/app/login/login.component.html and looks like this:

<form (submit)="login()">
  <div class="form-group">
    <label for="email">Email address</label>
    <input type="email" class="form-control" name="email" placeholder="Enter email" [(ngModel)]="credentials.email">
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" name="password" placeholder="Password" [(ngModel)]="credentials.password">
  </div>
  <button type="submit" class="btn btn-default">Sign in!</button>
</form>
Once again, we have the form submit handler, and NgModel attributes for each of the inputs. In the controller, we want the same functionality as the register controller, but this time called the login method of the AuthenticationService.

In the sample application, the controller is in /client/src/app/login/login.controller.ts and look like this:

import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
templateUrl: './login.component.html'
})
export class LoginComponent {
credentials: TokenPayload = {
email: '',
password: ''
};

constructor(private auth: AuthenticationService, private router: Router) {}

login() {
this.auth.login(this.credentials).subscribe(() => {
this.router.navigateByUrl('/profile');
}, (err) => {
console.error(err);
});
}
}
Now users can register and sign in to the application. Note that, again, there should be more validation in the forms to ensure that all required fields are filled before submitting. These examples are kept to the bare minimum to highlight the main functionality.

Change Content Based on User Status
In the navigation, we want to show the Sign in link if a user isn’t logged in, and their username with a link to the profile page if they are logged in. The navbar is found in the App component.

First, we’ll look at the App component controller. We can inject the AuthenticationService into the component and call it directly in our template. In the sample app, the file is in /client/src/app/app.component.ts and looks like this:

import { Component } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Component({
selector: 'app-root',
templateUrl: './app.component.html'
})
export class AppComponent {
constructor(public auth: AuthenticationService) {}
}
That’s pretty simple, right? Now, in the associated template we can use auth.isLoggedIn() to determine whether to display the sign-in link or the profile link. To add the user’s name to the profile link, we can access the name property of auth.getUserDetails()?.name. Remember that this is getting the data from the JWT. The ?. operator is a special way to access a property on an object that may be undefined, without throwing an error.

In the sample app, the file is in /client/src/app/app.component.html and the updated part looks like this:

<ul class="nav navbar-nav navbar-right">
  <li *ngIf="!auth.isLoggedIn()"><a routerLink="/login">Sign in</a></li>
  <li *ngIf="auth.isLoggedIn()"><a routerLink="/profile">{{ auth.getUserDetails()?.name }}</a></li>
  <li *ngIf="auth.isLoggedIn()"><a (click)="auth.logout()">Logout</a></li>
</ul>
Protect a Route for Logged in Users Only
In this step, we’ll see how to make a route accessible only to logged-in users, by protecting the /profile path.

Angular allows you to define a route guard, which can run a check at several points of the routing life cycle to determine if the route can be loaded. We’ll use the CanActivate hook to tell Angular to load the profile route only if the user is logged in.

To do, this we need to create a route guard service, ng generate service auth-guard. It must implement the CanActivate interface, and the associated canActivate method. This method returns a boolean value from the AuthenticationService.isLoggedIn method (basically checks if the token is found, and still valid), and if the user is not valid also redirects them to the home page:

import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

constructor(private auth: AuthenticationService, private router: Router) {}

canActivate() {
if (!this.auth.isLoggedIn()) {
this.router.navigateByUrl('/');
return false;
}
return true;
}
}
To enable this guard, we have to declare it on the route configuration. There’s a property called canActivate, which takes an array of services that should be called before activating the route. Ensure you also declare these services in the App NgModule’s providers array. The routes are defined in the App module, which contains the routes like you see here:

const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] }
];
With that route guard in place, now if an unauthenticated user tries to visit the profile page, Angular will cancel the route change and redirect to the home page, thus protecting it from unauthenticated users.

Call a Protected API Route
The /api/profile route has been set up to check for a JWT in the request. Otherwise, it will return a 401 unauthorized error.

To pass the token to the API, it needs to be sent through as a header on the request, called Authorization. The following snippet shows the main data service function, and the format required to send the token. The AuthenticationService already handles this, but you can find this in /client/src/app/authentication.service.ts.

base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
Remember that the back-end code is validating that the token is genuine when the request is made, by using the secret known only to the issuing server.

To make use of this in the profile page, we just need to update the controller, in /client/src/app/profile/profile.component.ts in the sample app. This will populate a details property when the API returns some data, which should match the UserDetails interface.

import { Component } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';

@Component({
templateUrl: './profile.component.html'
})
export class ProfileComponent {
details: UserDetails;

constructor(private auth: AuthenticationService) {}

ngOnInit() {  
 this.auth.profile().subscribe(user => {
this.details = user;
}, (err) => {
console.error(err);
});
}
}
Then, of course, it’s just a case of updating the bindings in the view (/client/src/app/profile/profile.component.html). Again, the ?. is a safety operator for binding properties that don’t exist on first render (since data has to load first).

<div class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-3 control-label">Full name</label>
    <p class="form-control-static">{{ details?.name }}</p>
  </div>
  <div class="form-group">
    <label class="col-sm-3 control-label">Email</label>
    <p class="form-control-static">{{ details?.email }}</p>
  </div>
</div>
And here’s the final profile page, when logged in:

Screenshot of the profile page

That’s how to manage authentication in the MEAN stack, from securing API routes and managing user details to working with JWTs and protecting routes. If you’ve implemented an authentication system like this in one of your own apps and have any tips, tricks, or advice, be sure to share them in the comments below!`
