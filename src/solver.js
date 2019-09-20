const exampleMaze = require('../data/example_maze.json')
const {
  strTupToArray,
  arrayOfSize,
  nextCoordForMove,
  padToFour,
} = require('./util.js');

/**
 * 4D Maze solving algorithm
 */

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
     * Array<number>[4]
     */
    this.start = padToFour(strTupToArray(start));
    this.end = padToFour(strTupToArray(end));

    /**
     * Prizes encoded as follows:
     *  [
     *    {
     *      location: Array<number>[4],
     *      points: number,
     *    }, . . .
     *  ]
     */
    this.prizes = Object
      .entries(prizes)
      .map(([ locStr, points ]) => ({
        location: padToFour(strTupToArray(locStr)),
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

  /**
   * get the moves for a given location
   * @param location {Array<number>[4]}
   * @return string
   */
  movesFor(location) {
    const [ x, y, z, w ] = location;

    return this.maze[x][y][z][w];
  }
}

const solver = new MazeSolver(exampleMaze);

console.log(solver.movesFor(solver.start));
