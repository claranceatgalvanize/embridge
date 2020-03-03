const mongoose = require("mongoose");

let dbURI = "mongodb://localhost/embridge",
  gracefulShutdown;

if (process.env.NODE_ENV === "production") {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on("error", err => {
  console.log(`Mongoose connected error ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log(`Mongoose disconnected`);
});

gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    process.kill(process.pid, "SIGURS2");
  });
};

process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => {
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  gracefulShutdown("Heroku app termination", () => {
    process.exit(0);
  });
});

require("./users");
