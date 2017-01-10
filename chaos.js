

const RADIUS = 2;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other) {
    return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
  }

  split(ratio, other) {
    const x = this.x * ratio + other.x * (1 - ratio);
    const y = this.y * ratio + other.y * (1 - ratio);
    return new Point(x, y);
  }
}

class App {
  constructor() {
    this.reset();
  }
  
  reset() {
    /* There are 3 states:
     * - DRAWING_POLYGON.
     *   In this state, the user's clicks will define the corners of the
     *   polygon. When the "set polygon" button is clicked, this should be set
     *   to false. When the "reset" button is clicked, this should be set to true.
     *
     * - SETTING_START.
     *   In this state, the user's next click will define a starting point.
     *
     * - STEPPING.
     *   In the final state, the user's clicks on the canvas will advance the
     *   algorithm by the number of steps in the "how many steps?" text input.
     */
    this.canvasState = "DRAWING_POLYGON";

    /* the list of points that define the corners of the polygon. */
    this.corners = [];

    /* this determines how the next point will be chosen; if `d` is the length
     * of the line segment between the last point and a randomly chosen corner,
     * the next point will be drawn at distance `ratio ⨉ d` from the last point
     * along this line segment.
     */
    this.ratio = 0.5;

    /* the last point that was generated */
    this.lastPoint = undefined;
    this.steps = 1;

    document.getElementById('ratioText').value = this.ratio;
    document.getElementById('nextText').value = "";

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  parseRatio() {
    const ratioText = document.getElementById('ratioText');
    return Number.parseFloat(ratioText.value);
  }

  parseSteps() {
    const nextText = document.getElementById('nextText');
    return Number.parseInt(nextText.value);
  }

  chooseCorner() {
    const randomIndex = Math.floor(Math.random() * this.corners.length);
    return this.corners[randomIndex];
  }

  step(canvasContext, steps) {
    for (let i = 0; i < steps; i++) {
      const lastPoint = this.lastPoint || this.corners[0];
      const newPoint = lastPoint.split(this.ratio, this.chooseCorner());

      canvasContext.beginPath();
      canvasContext.arc(newPoint.x, newPoint.y, RADIUS, 0, 2*Math.PI);
      canvasContext.fill();
      this.lastPoint = newPoint;
    }
  }

  setup() {
    const canvas = document.getElementById('canvas');
    if (!canvas.getContext) {
      alert('Your browser does not support HTML canvas. Get Firefox!');
      return;
    }
    const ctx = canvas.getContext('2d');

    const polygonButton = document.getElementById('polygonButton');
    const resetButton = document.getElementById('resetButton');
    const nextText = document.getElementById('nextText');
    const nextButton = document.getElementById('nextButton');

    canvas.addEventListener('click', (e) => {
      this.ratio = this.parseRatio() || this.ratio;

      const canvas =  document.getElementById('canvas');
      const rect = canvas.getBoundingClientRect();

      const clickPoint = new Point(e.clientX - rect.left, e.clientY - rect.top);

      switch (this.canvasState) {
        case "DRAWING_POLYGON":
          this.corners.push(clickPoint);
          console.log('click');
          console.log(clickPoint);

          ctx.beginPath();
          ctx.arc(clickPoint.x, clickPoint.y, RADIUS, 0, 2*Math.PI);
          ctx.fill();
          break;
        case "SETTING_START":
          this.canvasState = "STEPPING";

          ctx.beginPath();
          ctx.arc(clickPoint.x, clickPoint.y, RADIUS, 0, 2*Math.PI);
          ctx.fill();
          this.lastPoint = clickPoint;
          break;
        case "STEPPING":
          this.steps = this.parseSteps() || this.steps;
          this.step(ctx, this.steps);
          break;
      }
    });

    polygonButton.addEventListener('click', () => {
      if (this.corners.length < 3) {
        alert('You must enter at least three points.');
      }
      else {
        this.canvasState = "SETTING_START";
      }
    });

    resetButton.addEventListener('click', () => this.reset());

    nextButton.addEventListener('click', () => {
      this.ratio = this.parseRatio() || this.ratio;
      this.steps = this.parseSteps() || this.steps;
      this.step(ctx, this.steps);
    });
  }
}


