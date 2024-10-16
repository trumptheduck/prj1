const { SocketEvents } = require('../common/enums/socket_events.enum.js');
require('dotenv').config();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

let connectionsMap = new Map();

function addConnection(tableId, socket) {
    let socketlist = connectionsMap.get(tableId)??[];
    connectionsMap.set(tableId, [...socketlist, socket]);
}

function removeConnection(tableId, socket) {
    let socketlist = connectionsMap.get(tableId)??[];
    let result = socketlist.filter(e => e.id == socket.id);
    connectionsMap.set(tableId, result);
}

function getConnections(tableId) {
    return connectionsMap.get(tableId)??[];
}

io.on('connection', (socket) => {
    let tableId = null;
    socket.on(SocketEvents.SUBSCRIBE_TO_TABLE, (id) => {
        tableId = id;
        addConnection(id, socket);
    })
    socket.on(SocketEvents.UNSUBSCRIBE_TO_TABLE, (id) => {
        tableId = null;
        removeConnection(id, socket);
    })
    socket.on(SocketEvents.JOIN_ROOM, (rooms, callback) => {
        console.log("Joining rooms:", rooms);
        socket.join(rooms);
        callback();
    })
    socket.on(SocketEvents.UPDATE_ORDER_DATA, (rooms, data, callback) => {
        console.log("Updating data:", rooms, data);
        socket.to(rooms).emit(SocketEvents.UPDATE_ORDER_DATA, data);
        callback();
    })
    socket.on('disconnect', () => {
        if (tableId) {
            removeConnection(tableId, socket);
        }
    });
});

app.post('/emit/table', function (req, res) {
    const {event, tableId, data} = req.body;
    if (!event||!tableId||!data) return res.status(400).json({msg: "Invalid request format!"});
    getConnections().forEach(socket => {
        socket.emit(event, data);
    })
})

// server.listen(process.env.port);
server.listen(3001);