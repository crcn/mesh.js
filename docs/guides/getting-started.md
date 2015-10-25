The easiest way to get started with Mesh is to download the [NPM](http://npmjs.org) or [bower](http://bower.io/) packages. Here are the commands you can use to do that:

```
npm install mesh --save
npm install bower
```

After that you can start using the library.

#### Organization

This is just my preference, but I typically only have **one** main bus which is used throughout the application. This bus handles all operations executed by other parts of the application. Here's how I typically organize my bus code:

```
src/ - application source
  bus/ - ALL bus code
    index.js - the file which ties everything together
    commands/ - application commands
      users.js - user specific commands such as signup, resetPassword, etc
      ...
    database/ - bus database adapters
      mock.js - mock database adapter than can be swapped in for testing
      mongo.js - database adapter used for production
    realtime/ - realtime bus adapters
      socket-io.js
  models/ - model code
    user.js
    organization.js
  components/
    main/
      index.jsx
      pages/
        auth/
          signup.jsx
          forgot-password.jsx
```

The additional folders above: `models`, and `components` are included to demonstrate how `bus` fits into a front-end application as a whole. Note that the folder structure above can also be adapted to APIs.

#### Implementation

TODO
