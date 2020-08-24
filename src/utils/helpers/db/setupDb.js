import mongoose from 'mongoose'

const setupDb = (connectionString, databaseName) => {

    // Create the database connection
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, dbName: databaseName });


    // Log successful connection
    mongoose.connection.on("connected", function () {
        console.log(`Mongoose connection open to database`);
    });

    // If the connection throws an error, log it and then exit the application
    mongoose.connection.on("error", function (err) {
        console.error("Mongoose connection error", err);
        process.exit(0);
    });

    // Log disconnected
    mongoose.connection.on("disconnected", function () {
        console.log("Mongoose connection disconnected");
    });

    // If the user attempts to close the app by terminating it then cleanup and exit
    process.on("SIGINT", function () {
        mongoose.connection.close(function () {
            process.exit(0);
        });
    });

    return mongoose;
};

export default setupDb;
