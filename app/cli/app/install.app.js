const inquirer = require("inquirer");

const User = require("../../models/User");

module.exports = async (consoleArguments) => {
  console.log("Create new admin account");

  let data = await inquirer.prompt([
    { name: "name", type: "input" },
    { name: "email", type: "input" },
    { name: "password", type: "password" },
  ]);

  let userObj = new User(data);

  await userObj.save();

  console.log("Admin account created successfully");
};
