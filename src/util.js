// Convert (a, b) into [a, b]
const strTupToArray = str => JSON.parse(
  str
    .replace('(', '[')
    .replace(')', ']')
);

// Create an empty array of size n
const arrayOfSize = n => (new Array(n)).fill();

// Convenience lookup for maze indexes
const indexFor = label => _indexFor.get(label);
const _indexFor = new Map([
  [ 'x', 0 ],
  [ 'X', 0 ],
  [ 'y', 1 ],
  [ 'Y', 1 ],
  [ 'z', 2 ],
  [ 'Z', 2 ],
  [ 'w', 3 ],
  [ 'W', 3 ],
]);

// Given a location, give the next coord given a move
const nextCoordForMove = (current, move) => {
  // ASCII with value > 95 is lower case, below is upper
  const signedDir = move.charCodeAt(0) > 95 ? -1 : 1;

  let out = [ ...current ];

  out[indexFor(move)] += signedDir;

  return out;
}

// Take an array of any size and pad it with zeroes to four elements
const padToFour = arr => ([
  ...arr,
  ...[ 0, 0, 0, 0 ],
]).slice(0, 4);

// Get the distance between any two points
const manhattanDistance = (a, b) => {
  let dist = 0;

  for (let i = 0; i < 3; ++i) {
    dist += Math.abs(a[i] - b[i]);
  }

  return dist;
}

// serialize a location
const serialize = loc => loc.join('');

module.exports = {
  indexFor,
  manhattanDistance,
  strTupToArray,
  arrayOfSize,
  nextCoordForMove,
  padToFour,
  serialize,
};
