class TheStockGuy {
  static fleetPositions = [];

  static addShipToFleet(ship) {
    TheStockGuy.fleetPositions.push(ship);
  }

  static thisShipIsAlreadyInTheFleet(ship) {
    for (let loggedShip of TheStockGuy.fleetPositions) {
      for (let newShipIndex of ship.indexArray) {
        const pointToFind = newShipIndex;
        const loggedShipPoints = loggedShip.indexArray;

        if (
          loggedShipPoints.some(
            (arr) => arr[0] === pointToFind[0] && arr[1] === pointToFind[1]
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }

  static thisNewShipIsValid(ship, shakaWhenTheWallsFell) {
    if (
      ship.checkValidLength() &&
      ship.checkValidPlacement(shakaWhenTheWallsFell)
    ) {
      return true;
    }
    return false;
  }
}

class BoatyMcBoatFace {
  constructor(startingIndex, rHowLongsTheBeakMeBoi, orientation) {
    this.startingIndex = startingIndex;
    this.length = rHowLongsTheBeakMeBoi;
    this.orientation = orientation; // [0,1] = horizontal [1,0] = vertical
    this.indexArray = this.getIndexArray();
  }

  getIndexArray() {
    let indexArray = [];

    for (let i = 0; i < this.length; i++) {
      indexArray.push([
        this.startingIndex.row + i * this.orientation[0],
        this.startingIndex.col + i * this.orientation[1],
      ]);
    }
    return indexArray;
  }

  getPosition() {
    let tinyArray = [this.startingIndex.row, this.startingIndex.col];
    return tinyArray;
  }

  checkValidLength() {
    return this.length > 0 && this.length < 5 ? true : false;
  }

  checkValidPlacement(field) {
    // start at stern and check lengths of ship
    if (checkForOnesInShipRightBottom(this, field)) {
      return false;
    }
    return true;
  }
}

function validateBattlefield(field) {
  let sequenceLength = 0;
  let shipOrientation;
  let newBoat;

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (field[row][col] === 1) {
        shipOrientation = susOutMyDelta(row, col, field);
        sequenceLength = getSequenceLength(shipOrientation, row, col, field);

        newBoat = new BoatyMcBoatFace(
          { row, col },
          sequenceLength,
          shipOrientation
        );

        if (!TheStockGuy.thisNewShipIsValid(newBoat, field)) {
          return false;
        } else if (!TheStockGuy.thisShipIsAlreadyInTheFleet(newBoat)) {
          TheStockGuy.addShipToFleet(newBoat);
        }
      } else {
        continue;
      }
    }
  }

  return checkFleetNumbers(TheStockGuy.fleetPositions);
}

function susOutMyDelta(row, col, array) {
  if (array[row][col + 1] === undefined || array[row][col + 1] === 0) {
    if (array[row + 1][col] === 1) {
      return [1, 0];
    } else if (array[row + 1][col] === 0 || array[row + 1][col] === undefined) {
      return [0, 0];
    }
  } else if (array[row][col + 1] === 1) {
    return [0, 1];
  }
}

function getSequenceLength(delta, row, col, array) {
  let sequenceLength = 1;
  if (delta[0] === 0 && delta[1] === 0) {
    return 1;
  }

  while (array[row + delta[0]][col + delta[1]] === 1) {
    sequenceLength += 1;
    row += delta[0];
    col += delta[1];
  }

  return sequenceLength;
}

function checkForOnesInShipRightBottom(ship, battleField) {
  let endingIndex = ship.indexArray[ship.indexArray.length - 1];
  let startingIndex = ship.indexArray[0];
  // Vertical ships
  if (ship.orientation[0] === 1) {
    for (let shipIndex of ship.indexArray) {
      if (battleField[shipIndex[0]][shipIndex[1] + 1] === 1) {
        return true;
      }

      //Check bottom
      if (battleField[endingIndex[0] + 1][endingIndex[1]] === 1) {
        return true;
      }
    }
  }

  // Horizontal ships
  else if (ship.orientation[1] === 1) {
    for (let shipIndex of ship.indexArray) {
      if (battleField[shipIndex[0] + 1][shipIndex[1]] === 1) {
        return true;
      }
    }
    //Check right end of ship
    if (battleField[endingIndex[0]][endingIndex[1] + 1] === 1) {
      return true;
    }
  }

  // Corners/ submarines
  if (
    battleField[startingIndex[0] + 1][startingIndex[1] - 1] === 1 ||
    battleField[startingIndex[0] + 1][startingIndex[1] + 1] === 1 ||
    battleField[endingIndex[0] + 1][endingIndex[1] + 1 === 1] ||
    battleField[endingIndex[0] + 1][endingIndex[1] - 1] === 1
  ) {
    return true;
  }

  return false;
}

function checkFleetNumbers(fleet) {
  let battleShipCount = 0;
  let submarineCount = 0;
  let twoByThreeCount = 0;
  let threeByTwoCount = 0;

  for (let ship of fleet) {
    if (ship.length === 1) {
      submarineCount += 1;
    } else if (ship.length === 2) {
      twoByThreeCount += 1;
    } else if (ship.length === 3) {
      threeByTwoCount += 1;
    } else if (ship.length === 4) {
      battleShipCount += 1;
    }
  }

  if (
    submarineCount === 4 &&
    battleShipCount === 1 &&
    threeByTwoCount === 2 &&
    twoByThreeCount === 3
  ) {
    return true;
  }
  return false;
}
