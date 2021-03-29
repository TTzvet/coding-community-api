const mongoose = require('mongoose');

// alt db connection use mongodb://localhost/nodeapi
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('connected', () => {            
  console.log(`Mongoose has been connected to ${process.env.MONGO_URI}`);       
});                                                    
mongoose.connection.on('error', err => {               
  console.log('Mongoose has connection error:', err);      
});                                                    
mongoose.connection.on('disconnected', () => {         
  console.log('Mongoose has been disconnected');                
}); 

const gracefulShutdown = (msg, callback) => {               
  mongoose.connection.close( () => {                        
    console.log(`Mongoose disconnected through ${msg}`);    
    callback();                                             
  });                                                       
};                                                          
// For nodemon restarts                                     
process.once('SIGUSR2', () => {                             
  gracefulShutdown('nodemon restart', () => {               
    process.kill(process.pid, 'SIGUSR2');                   
  });                                                       
});                                                         
// For app termination                                      
process.on('SIGINT', () => {                                
  gracefulShutdown('app termination', () => {               
    process.exit(0);                                        
  });                                                       
});                                                         
// For Heroku app termination                               
process.on('SIGTERM', () => {                               
  gracefulShutdown('Heroku app shutdown', () => {           
    process.exit(0);                                        
  });                                                       
}); 