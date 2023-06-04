function validateBattlefield(field) {
  // Is this location part of a ship? Outside bounds are treated as empty.
  const map = (x, y) => {
    if (x < 0 || y < 0 || x >= 10 || y >= 10) {
      return false;
    }
    return field[y][x] == 1;
  }

  // Assuming a valid ship grid, if this position is a populated, grab it out
  // and return the length of the ship, marking the positions as visited.
  const getShip = (x, y) => {
    let length = 0;

    if (map(x,y)) {
      let xOffs = 0, yOffs=0;

      // Does the ship go right or down? 
      if (map(x+1,y))
        xOffs = 1;
      else
        yOffs = 1;

      while (map(x, y)) {
        field[y][x] = 0;
        length++;
        x += xOffs;
        y += yOffs;
      }
    }

    return length;
  }

  // Prevalidate; all cells must have no diagonal connects. This also validates
  // that there are no improperly touching ships because to do so would require
  // a diagonal touch.
  for (let y = 0 ; y < 10 ; y++) {
    for (let x = 0 ; x < 10 ; x++) {
      if (map(x,y) == false) continue;

      if (map(x-1, y-1) || map(x+1, y-1) || map(x-1, y+1) || map(x+1, y+1))
        return false
    }
  }

  // Grab all ships out; keys in the dict are lengths and values are the number
  // of that size found.
  const shipList = {}
  for (let y = 0 ; y < 10 ; y++) {
    for (let x = 0 ; x < 10 ; x++) {
      const ship = getShip(x, y);
      if (ship !== 0)
        shipList[ship] = (shipList[ship] || 0) + 1;
    }
  }

  // There must be exactly 4 kinds of ships, and exact numbers of each length
  if (Object.keys(shipList).length !== 4) return false;
  if (shipList[1] != 4) return false;
  if (shipList[2] != 3) return false;
  if (shipList[3] != 2) return false;
  if (shipList[4] != 1) return false;

  return true;
}
