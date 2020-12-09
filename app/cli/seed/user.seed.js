const faker = require("faker");
const User = require("../../models/User");

module.exports = async (consoleArguments) => {
  let max = consoleArguments.n || 1;
  for (let index = 0; index < max; index++) {
    const user = new User({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "password@123",
    });

    await user.save();

    console.log(index + 1, "User created");
  }
};
