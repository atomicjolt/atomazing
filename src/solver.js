const genPQueue = require('@datastructures-js/priority-queue');
const exampleMaze = require('../data/example_maze.json')
const {
  strTupToArray,
  arrayOfSize,
  nextCoordForMove,
  padToFour,
  serialize,
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

  /**
   * Find the accessible adjacent locations
   * @param location {Array<number>[4]}
   */
  adjacenciesFor(location) {
    const moves = this.movesFor(location);

    return moves.split('').map(
      move => nextCoordForMove(location, move)
    );
  }

  /**
   * Find the shortest path between a and b. Returns
   * data in this structure:
   *  [
   *    { loc: Array<number>[4], move: null },
   *    { loc: Array<number>[4], move: 'x' }, . . .
   *  ]
   */
  shortestPathBetween(a, b) {
    // Create the priority queue
    const queue = genPQueue();

    // Create a "came from" data structure
    const cameFrom = new Map;

    // Create a "visited" data structure
    const visited = new Map;

    // Enqueue the start
    queue.enqueue({ loc: this.start, move: null }, Infinity);

    // Add a termination case for reconstruction
    cameFrom.set(serialize(this.start));

    // While queue is not empty
    while (!queue.isEmpty()) {
      const location = queue.dequeue();

      for (const neighbor of this.adjacenciesFor(location)) {
        const loc = serialize(neighbor);

        if (!visited.has(loc)) {
          queue.enqueue(neighbor, 123 /* TODO */);
        }
      }
    }

    //  Dequeue best option

    //  Enqueue it's neighbors
  }
}

const solver = new MazeSolver(exampleMaze);

console.log(solver.adjacenciesFor(solver.start));
