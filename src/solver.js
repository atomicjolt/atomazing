const exampleMaze = require('../data/example_maze.js')

/**
 * 4D Maze solving algorithm
 */

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

class MazeSolver {
  constructor({
    dimensions,
    size,
    spaces,
    start,
    end,
    prizes,
  }) {
    /**
     * Stash away some of the obvious info
     */
    this.dimensionLabels = dimensions;
    this.dimensions = dimensions.length;
    this.size = size;

    /**
     * Turn start and end data into readable format:
     * Array<number>[2]
     */
    this.start = strTupToArray(start);
    this.end = strTupToArray(end);

    /**
     * Prizes encoded as follows:
     *  [
     *    {
     *      location: Array<number>[2],
     *      points: number,
     *    }, . . .
     *  ]
     */
    this.prizes = Object
      .entries(prizes)
      .map(([ locStr, points ]) => ({
        location: strTupToArray(locStr),
        points,
      }));

    /**
     * Create the maze (always 4D)
     */
    this.maze = (
      arrayOfSize(this.size).map(
        _ => arrayOfSize(this.size).map(
          _ => arrayOfSize(this.size).map(
            _ => arrayOfSize(this.size).map(
              _ => ''
            )
          )
        )
      )
    );

    /**
     * Populate the maze. Each location has a string of which moves
     * you can make. for-of loops are a lot faster than forEach, which
     * matters when we are talking about n**4 items to parse.
     */
    for (const { x, y, z, w, moves } of spaces) {
      const [ X, Y, Z, W ] = [ x, y, z, w ].map(
        coord => coord !== undefined ? coord : 0
      );

      this.maze[X][Y][Z][W] = moves;
    }
  }
}

new MazeSolver(exampleMaze);
