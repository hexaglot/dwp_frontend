const axios = require("axios");
const { convertDistance, getDistance, isValidCoordinate } = require("geolib");

const CITYNAME = "London";
const CENTER_OF_LONDON = {
  latitude: 51.509865,
  longitude: -0.118092,
};

// pointA and pointB can be anything which responds with a valid
// latitude/longitude value
const isWithinRadius = (pointA, pointB, miles) =>
  isValidCoordinate(pointA) &&
  isValidCoordinate(pointB) &&
  convertDistance(getDistance(pointA, pointB), "mi") < miles;

// check if user is in array by comparing ids
const isInArray = (user, array) => {
  const userEquals = (userA, userB) =>
    typeof userA.id === "number" &&
    typeof userB.id === "number" &&
    userA.id === userB.id;
  return array.some((u) => userEquals(u, user));
};

async function get(url) {
  const config = {
    baseURL: "https://bpdts-test-app.herokuapp.com",
    timeout: 8000, // in ms
    headers: { accept: "application/json" },
  };
  const agent = axios.create(config);
  return agent.get(url);
}

// Perform the API requests and return the users living in London
async function londonerService(radius_miles = 50) {
  const [allUsers, givenLondonUsers] = await Promise.all([
    get(`/users`),
    get(`/city/${CITYNAME}/users`),
  ]);

  const isLondoner = (user) =>
    isWithinRadius(user, CENTER_OF_LONDON, radius_miles) ||
    isInArray(user, givenLondonUsers.data);

  return allUsers.data.filter(isLondoner);
}

module.exports = { londonerService };
