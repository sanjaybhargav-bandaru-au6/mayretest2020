const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://sanjay:sanjay@cluster0-p6kve.azure.mongodb.net/mayretest',
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then(function () {
    console.log(`Database Connected`);
  })
  .catch(function (err) {
    console.log('Error in database');
  });

// mongodb://<username>:<password>@cluster0-shard-00-00-zehhl.mongodb.net:27017,cluster0-shard-00-01-zehhl.mongodb.net:27017,cluster0-shard-00-02-zehhl.mongodb.net:27017/test?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin
