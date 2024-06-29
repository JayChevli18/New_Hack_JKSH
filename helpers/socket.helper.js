const UserModel = require("../models/user.model");

let logger = console;
const socket = {};

socket.config = (server) => {
  const io = require("socket.io")(server, {
    transports: ["websocket", "polling"],
    cors: {
      origin: "*",
    },
  });
  socket.io = io;

  const agents = {};

  // Map to store connected users in each room
  const usersInRoom = new Map();

  // Map to store connected userIds in each room
  const userIdsInRoom = new Map();

  io.sockets.on("connection", (socket) => {
    let address = socket.request.connection.remoteAddress;

    logger.info(`New Connection`, {
      address,
      id: socket.id,
    });

    // Function to update the list of users in a room and emit the updated list
    async function updateUsersInRoom(room) {
      try {
        const users = Array.from(io.sockets.adapter.rooms.get(room) || []);
        usersInRoom.set(room, users);

        const arrayOfObjects = Array.from(userIdsInRoom, ([key, value]) => ({ [key]: value }));
        const findObj = arrayOfObjects.find((a) => {
          return Object.keys(a)[0] === users[0]
        })
        console.log(arrayOfObjects, findObj);
        const firstUser = await UserModel.findById(findObj[users[0]])
        const currentUser = await UserModel.findById(socket.user)

        // Emit the updated list to all clients in the room
        io.to(room).emit("usersInRoom", {
          room,
          users,
          ...(firstUser ? { firstUser: firstUser } : {}),
          ...(currentUser ? { currentUser: currentUser } : {})
        });

      } catch (error) {
        console.log(error.message);
      }
    }

    socket.on("leave", (params) => {
      logger.info("leaved", {
        ...params,
        address,
        id: socket.id,
        method: "leave",
      });
      socket.leave(params.room);

      // Remove userId from map 
      userIdsInRoom.delete(socket.id)

      // Update the list of users in the room
      updateUsersInRoom(params.room);
    });

    socket.on("join", async (params, cb) => {
      socket.join(params.room, {
        ...params,
      });

      socket.user = params?.userId;
      userIdsInRoom.set(socket.id, params?.userId)

      logger.info("join", {
        ...params,
        address,
        id: socket.id,
        method: "join",
      });

      // Update the list of users in the room
      updateUsersInRoom(params.room);

      if (typeof cb === "function")
        cb({
          room: params.room,
        });
    });

    // Track activity
    socket.on('activity', () => {
      if (agents[socket.id]) {
        clearTimeout(agents[socket.id].idleTimer);
      }

      // Reset idle timer
      agents[socket.id] = {
        idleTimer: setTimeout(() => {
          agents[socket.id].isIdle = true;
          socket.emit('idle', 'You are idle. Click here to be active again.');
        }, 10 * 60 * 1000), // 10 minutes
        isIdle: false
      };
    });

    socket.on('active', () => {
      if (agents[socket.id]) {
        clearTimeout(agents[socket.id].idleTimer);
        agents[socket.id].isIdle = false;

        // Reset idle timer
        agents[socket.id].idleTimer = setTimeout(() => {
          agents[socket.id].isIdle = true;
          socket.emit('idle', 'You are idle. Click here to be active again.');
        }, 10 * 60 * 1000); // 10 minutes
      }
    });

    socket.on("disconnect", () => {
      logger.info("disconnected", {
        id: socket.id,
        method: "disconnect",
      });

      // Remove userId from map 
      userIdsInRoom.delete(socket.id)

      // Remove the user from all rooms and update the lists
      const rooms = Object.keys(socket.rooms);
      rooms.forEach((room) => {
        socket.leave(room);
        updateUsersInRoom(room);
      });
    });
  });
};

module.exports = socket;
