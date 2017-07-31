const fetch = require('isomorphic-fetch');
const play = require('play');

if (process.argv.length < 3) {
  console.log('USAGE: node deliveroo.js <postcode>');
  process.exit();
}

const postcode = process.argv[2];
const endpoint = `https://deliveroo.co.uk/restaurants/postcode=${postcode}`;
const timeoutDuration = 30000;
const normalNumberOfAsapRestaurants = 3;

const fetchFunction = (currentTimeout = null) => {
  fetch(endpoint, {
    headers: {
      Accept: 'application/json',
    } })
        .then(result => result.json())
        .then(({ restaurants }) => {
          const availableRestaurants = restaurants.filter(({ asap }) => asap);
          if (availableRestaurants.length < normalNumberOfAsapRestaurants) {
            console.log('Deliveroo is not available at the moment');
            console.log(`Checking again in ${timeoutDuration}msec`);
            const timeout = setTimeout(() => fetchFunction(timeout), timeoutDuration);
          } else {
            clearTimeout(currentTimeout);
            console.log('Deliveroo is available');
            play.sound('./node_modules/wavs/sfx/alarm.wav');
          }
        })
        .catch((error) => {
          console.error(error);
          clearTimeout(currentTimeout);
        });
};

fetchFunction();
