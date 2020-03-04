# Embridge

Embridge got it's name from the combination of EMPLOYMENT AND BRIDGE. Think of it as where employers or job seekers go to find who to work for or whom to work with. Since I'm a new Angular Developer, I'm building this app to implement my knowledge on the frame work and also have something to add the project section on my resume.

# While building this, I learned the following:

### Starting with Angular

- JavaScript, TypeScript

  - ES2015
  - TypeScript

- The TypeScript module system

  - Dividing a program into modules / files

- Templates and bindings
  - Template binding expressions
  - Null coalescing / safe traversal
  - Events and event bindings
- Multiple Components
  - Using inspector tooling to understand the component hierarchy
- Multiple NgModules
  - Inter-module dependencies
  - Imports and Exports
  - entryComponents
- Lazy loading
  - Routes as the unit of lazy loading
  - Preloading: eager lazy routes

### Building with Components

- Development tooling
  - Angular CLI - the powerful default choice
  - Webpack - for custom builds
- Starting a project with Angular CLI
  - Creating your component hierarchy
  - Visual wireframing
- Essential built-in directives
  - Branching with `*ngIf`
  - Iteration with `*ngFor`
- Pipes
  - Using the built-in pipes
  - When are pipes the right solution?
- Class and style bindings
  - [class.x] bindings
  - [style.y] bindings
  - [ngClass] for more complex class selection
- Component data binding
  - Bind data "downward" with @Input()
  - Use events to send data upward with @Output()

### Services, reactivity, and HTTP

- Dependency injection
  - Introducing injection with HTTP
  - Why dependency injection?
  - What can be injected?
- Creating services
  - Making a service available for dependency injection
  - Inject HTTP into a service instead of a component
- Observables
  - The least you need to know about Observables
  - Observables as the pipeline of data flow in Angular.
- The async pipe
  - Observables as a source of tedium and boilerplate
  - Automatic subscription and unsubscription

### Application state, forms, navigation, and data flow

- Reactive forms
  - Control groups
  - FormBuilder
  - ngSubmit
- Component-local State
  - Suitable uses for component-local state
  - Where component-local state becomes problematic
- Route as navigational state
  - Nested routes
  - Routing to components
  - Configuring the router
  - HTML5 vs hash routes
  - Route parameters - navigational state to a specific entity
  - Route-driven observable data loading
- Sharing state with a Service
  - Data fields in a Service
  - Observable data in a Service

### Node and MongoDB

- Store user data in MongoDB, with the passwords hashed
- Build CRUD functions in an Express API — Create (register), Read (login, get profile), Update, Delete
- Use an Angular application to make calls to multiple APIs and deals with the responses
- Generate a JSON Web Token (JWT, pronounced “Jot”) upon registration or login, and passes this to the Angular application with Express API
- Use the Angular application to store the JWT in order to maintain the user’s session
- Checks the validity of the JWT when displaying protected views
- Pass the JWT back to Express when calling protected API routes.

# Run Locally

To run, you just have MongoDB installed and running, and NodeJS installed.

- Start MongoDB
- Clone the repo
- `npm install` to install API dependencies and `npm start` to start the API
- Open a new terminal and navigate to the `client` directory, `npm install` to setup the Angular dependencies, and `npm start` to start the local development server
- Open http://localhost:4200 to see the application
