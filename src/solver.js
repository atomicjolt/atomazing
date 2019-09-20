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
  [ 'y', 1 ],
  [ 'z', 2 ],
  [ 'w', 3 ],
]);

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
     * you can make.
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
