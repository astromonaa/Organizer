const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
  }
});
const path = require('path');
const cors = require('cors');

const Datastore = require('nedb');

const contacts = new Datastore({
  filename: path.resolve(__dirname, 'db', 'contacts.json'),
  autoload: true,
})

const events = new Datastore({
  filename: path.resolve(__dirname, 'db', 'events.json'),
  autoload: true,
})

app.use(express.json());
app.use(cors());

app.get('/contacts', (req, res) => {
  contacts.find({}, (err, docs) => {
    if (err){
      return res.status(500).json({message: 'Unexpected error'})
    }
    res.json(docs);
  });
})

app.get('/events', (req, res) => {
  events.find({}, (err, docs) => {
    if (err){
      return res.status(500).json({message: 'Unexpected error'})
    }
    res.json(docs);
  });
});

app.put('/contacts/:id', (req, res) => {
  contacts.remove({_id: req.params.id})
  contacts.insert({...req.body}, () => {
    res.json({message: 'success'})
  });
})

app.put('/events/:id', (req, res) => {
  events.remove({_id: req.params.id})
  events.insert({
    eventDate: req.body.eventDate,
    event: req.body.event,
    tiedContact: req.body.tiedContact,
    _id: req.body._id
  }, () => {
    res.json({message: 'success'})
  })
})

app.delete('/contacts/:id', (req, res) => {
  contacts.remove({_id: req.params.id}, (err) => {
    if (err){
      return res.status(500).json({message: 'Unexpected error'})
    }
    res.json({message: 'succes'})
  })
})
app.delete('/events/:id', (req, res) => {
  events.remove({_id: req.params.id}, (err) => {
    if (err){
      return res.status(500).json({message: 'Unexpected error'})
    }
    res.json({message: 'succes'})
  })
})

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnected', () => {
    console.log('user disconnected');
  })

  socket.on('new contact', (body) => {
    contacts.insert({...body}, (err, newDoc) => {
      socket.broadcast.emit('new contact', newDoc)
      socket.emit('new contact', newDoc);
    });
  });
  socket.on('event date', (body) => {
    events.insert({...body}, (err, newDoc) => {
      socket.broadcast.emit('event date', newDoc)
      socket.emit('event date', newDoc);
    });
  });
  socket.on('add event', (body) => {
    events.insert({...body}, (err, newDoc) => {
      socket.broadcast.emit('add event', newDoc)
      socket.emit('add event', newDoc);
    });
  })
});

server.listen(3000, function(){
  console.log('Listening 3000 port')
})