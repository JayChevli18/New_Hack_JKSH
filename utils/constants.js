module.exports = {
  database: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  user: {
    roles: ["Admin", "User"],
  },
  roles: {
    admin: "Admin",
    user: "User",
  },
  taskStatus:{
    status: ["PENDING", "COMPLETED", "IN PROGRESS", "UPCOMMING"]
  }
};
