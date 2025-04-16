const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.playerPosition = { x: 0, y: 0 };
  }

  print() {
    const display = this.field.map(row => row.join('')).join('\n');
    console.log(display);
  }

  static generateField(height, width, holePercentage = 0.2) {
    const field = new Array(height).fill(null).map(() => new Array(width).fill(fieldCharacter));

    // Places holes at random
    const totalTiles = height * width;
    const numHoles = Math.floor(totalTiles * holePercentage);

    for (let i = 0; i < numHoles; i++) {
      let holePlaced = false;
      while (!holePlaced) {
        const randY = Math.floor(Math.random() * height);
        const randX = Math.floor(Math.random() * width);
        if (randY !== 0 || randX !== 0 && field[randY][randX] !== hole) {
          field[randY][randX] = hole;
          holePlaced = true;
        }
      }
    }

    // This places the hat
    let hatPlaced = false;
    while (!hatPlaced) {
      const randY = Math.floor(Math.random() * height);
      const randX = Math.floor(Math.random() * width);
      if ((randY !== 0 || randX !== 0) && field[randY][randX] === fieldCharacter) {
        field[randY][randX] = hat;
        hatPlaced = true;
      }
    }

    // Starting position
    field[0][0] = pathCharacter;

    return field;
  }

  play() {
    let playing = true;

    while (playing) {
      this.print();
      const input = prompt('Which way? (w = up, a = left, s = down, d = right): ').toLowerCase();

      let { x, y } = this.playerPosition;


    // using wasd here, (do i need to explain!??!? :] )
      switch (input) {
        case 'w': y -= 1; break;
        case 'a': x -= 1; break;
        case 's': y += 1; break;
        case 'd': x += 1; break;
        default:
          console.log('Invalid input. Use u, d, l, r.');
          continue;
      }

      // This checks bounds
      if (y < 0 || y >= this.field.length || x < 0 || x >= this.field[0].length) {
        console.log('Out of bounds! You lose!');
        playing = false;
        break;
      }

      const tile = this.field[y][x];

      // This handles tile type
      if (tile === hole) {
        console.log('You fell in a hole! Game over.');
        playing = false;
      } else if (tile === hat) {
        console.log('You found your hat! You win!');
        playing = false;
      } else {
        this.field[y][x] = pathCharacter;
        this.playerPosition = { x, y };
      }
    }
  }
}

// Game start called
const myField = new Field(Field.generateField(5, 5, 0.2));
myField.play();
