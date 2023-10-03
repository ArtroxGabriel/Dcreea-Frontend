import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { StateService } from "src/app/services/states.service";
import { Game, State } from "src/app/shared/models/api";

@Component({
  selector: "app-drag",
  templateUrl: "./drag.component.html",
  styleUrls: ["./drag.component.css", "../../shared/styles/style.css"],
})
export class DragComponent implements OnInit {
  @Input() game: Game;
  @Input() showSaveBtn: boolean;
  @Output("save") saveEmitter = new EventEmitter<string[]>();
  canvasWidth: number;
  canvasHeight: number;
  tileWidth: number;
  tileHeight: number;
  stateWidth: number;
  stateHeight: number;
  graphBreadth: number = 1; // largura do grafo

  //////////////////////

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  statesDraw: StateDraw[] = [];
  linesDraw: LineDraw[] = [];

  mouseDown = false;

  selectedStateDraw: StateDraw;
  xCompensation = -20;
  yCompensation = -110;

  xw: number = 0;
  yw: number = 0;
  amarelo: string = "#B5A661";

  statesMoved: string[] = [];

  constructor(private gameService: GameService, private stateService: StateService) {}

  ngOnInit(): void {
    this.setCanvas();
    this.setObjects();
    this.setMouseEvents();
    this.drawAll();
  }

  save() {
    console.log("drag when save", this.statesMoved);
    this.saveEmitter.emit(this.statesMoved);
  }

  drawAll() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.linesDraw.forEach((line: LineDraw) => {
      line.draw(this.ctx);
    });

    this.statesDraw.forEach((st: StateDraw) => {
      st.draw(this.ctx);
    });
  }

  setCanvas() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    var scrolling = (e) => {
      this.yCompensation = -this.canvas.getBoundingClientRect().top;
      this.xCompensation = -this.canvas.getBoundingClientRect().left;
    };

    window.addEventListener("scroll", scrolling);
    // resizing
    window.addEventListener("resize", this.resize);
  }

  resize = () => {
    this.canvas.height = window.innerHeight * 0.7;
    this.canvas.width = window.innerWidth;
    this.drawAll();
  };

  setObjects() {
    // setting states
    this.game.states.forEach((st) => {
      var std = new StateDraw(st._id, st.x, st.y, st.width, st.height, st.color, st.label);
      std.condition = st.conditionalRule ? new ConditionDraw(st.x, st.y + st.height / 2 + 15, 21, 21, this.amarelo, st.label) : null;
      this.statesDraw.push(std);
    });

    // setting edges
    this.statesDraw.forEach((std) => {
      var st = this.findState(std.text);

      // if condition edges from diamond
      if (st.conditionalRule) {
        st.conditionalRule.conditions.forEach((c) => {
          this.linesDraw.push(new LineDraw(std.condition, this.findStateDraw(c.stateIfTrue), this.amarelo));
        });
        this.linesDraw.push(new LineDraw(std.condition, this.findStateDraw(st.conditionalRule.failureCondition.stateIfTrue), "#61B5A6"));
      } else {
        if (st.label !== "Game Over") this.linesDraw.push(new LineDraw(std, this.findStateDraw(st.transition), "#61B5A6"));
      }
    });
  }

  setMouseEvents() {
    this.canvas.addEventListener("mousedown", this.startPosition);
    this.canvas.addEventListener("mouseup", this.finishPosition);
    this.canvas.addEventListener("mousemove", this.mousemove);
  }

  mousemovewindow(e: MouseEvent) {
    this.xw = e.clientX;
    this.yw = e.clientY;
  }

  startPosition = (e: MouseEvent) => {
    this.mouseDown = true;
    var newx = e.clientX + this.xCompensation;
    var newy = e.clientY + this.yCompensation;

    this.selectedStateDraw = null;

    for (var i = 0; i < this.statesDraw.length; i++) {
      if (this.statesDraw[i].isTouching(newx, newy)) {
        if (this.game.states[i].x != newx || this.game.states[i].y != newy) {
          this.game.states[i].x = newx;
          this.game.states[i].y = newy;

          var notContains = true;
          for (let i = 0; i < this.statesMoved.length; i++) {
            if (this.statesMoved[i] == this.game.states[i]._id) {
              notContains = false;
              break;
            }
          }

          if (notContains) this.statesMoved.push(this.game.states[i]._id);
        }

        this.selectedStateDraw = this.statesDraw[i];
        console.log("state", this.game.states[i].label, this.game.states[i].x, this.game.states[i].y);
        break;
      }
    }

    // this.mousemove(e); // for when just press
    // var st = new StateDraw(e.clientX - 10, e.clientY - 60, 60, 30, "black");
    // st.draw(ctx);
  };

  finishPosition = () => {
    this.mouseDown = false;
    this.ctx.beginPath();
  };

  mousemove = (e: MouseEvent) => {
    if (!this.mouseDown) return;
    // ctx.beginPath();

    if (this.selectedStateDraw) this.selectedStateDraw.update(e.clientX + this.xCompensation, e.clientY + this.yCompensation);
    this.drawAll();

    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";

    // this.ctx.lineTo(e.clientX + this.xCompensation, e.clientY + this.yCompensation);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.moveTo(e.clientX + this.xCompensation, e.clientY + this.yCompensation);
  };

  ///////////////////

  ///////////////////

  goDeep() {
    var state = this.findState("Game Start");
    this.findBreadth(state);
  }

  findBreadth(state: State, stack: State[] = [], breadth: number = 1) {
    if (!state || state.label === "Game Over" || this.findStateInStack(state.label, stack)) {
      return breadth;
    }

    stack.push(state);

    if (state.conditionalRule && state.conditionalRule.conditions.length > 0) {
      var repeated = 0;
      state.conditionalRule.conditions.forEach((cond) => {
        if (this.findStateInStack(cond.stateIfTrue, stack)) repeated += -1;
      });
      if (this.findStateInStack(state.conditionalRule.failureCondition.stateIfTrue, stack)) repeated += -1;
      repeated = repeated == 0 ? -1 : repeated;

      var thisBreadth = breadth + state.conditionalRule.conditions.length + 1 + repeated;
      if (this.graphBreadth < thisBreadth) this.graphBreadth = thisBreadth;
      state.conditionalRule.conditions.forEach((cond) => {
        this.findBreadth(this.findState(cond.stateIfTrue), stack, thisBreadth);
      });
      this.findBreadth(this.findState(state.conditionalRule.failureCondition.stateIfTrue), stack, thisBreadth);
    } else {
      this.findBreadth(this.findState(state.transition), stack, breadth);
    }
  }

  findState(label: string): State {
    return this.game.states.find((x) => x.label.toLowerCase() === label.toLowerCase());
  }

  findStateDraw(label: string): StateDraw {
    return this.statesDraw.find((x) => x.text.toLowerCase() === label.toLowerCase());
  }

  findStateInStack(state: string, stack: State[]) {
    return stack.find((x) => x.label.toLowerCase() === state.toLowerCase());
  }
}

class StateDraw {
  _id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  fontSize: number = 15;
  public condition: ConditionDraw;

  constructor(_id, x, y, width, height, color = "#326e4e", text: string) {
    this._id = _id;
    this.x = x;
    this.y = y;
    this.height = height;
    this.color = color;
    this.text = text;
    this.width = width + text.length * 3;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = "#707070";
    ctx.fillRect(this.x - this.width / 2 - 1, this.y - this.height / 2 - 1, this.width + 1, this.height + 1);

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

    ctx.fill();

    // draw text

    ctx.font = this.fontSize + "px Verdana";
    ctx.fillStyle = "white";
    var [line1, line2] = this.text.length > 8 ? this.getFirstWords() : [this.text, ""];
    var lineReadjust = line2 !== "" ? 5 : 0;

    ctx.fillText(line1, this.x - (line1.length * 3 * this.fontSize) / 10, this.y - lineReadjust, this.width - 2);
    ctx.fillText(line2, this.x - (line2.length * 3 * this.fontSize) / 10, this.y + 2.5 * lineReadjust, this.width - 2);

    if (this.condition) this.condition.draw(ctx);
  }

  isTouching(x, y) {
    return x > this.x - this.width / 2 && y > this.y - this.height / 2 && x < this.x + this.width / 2 && y < this.y + this.height / 2;
  }

  update(x, y) {
    this.x = x;
    this.y = y;

    if (this.condition) this.condition.update(x, y + this.height / 2 + 15);
  }

  getFirstWords(): string[] {
    var words = this.text.split(" ");
    if (words.length == 1) {
      return [this.text, ""];
    }
    var line = "";
    for (let i = 0; i < words.length; i++) {
      line = line + " " + words[i];
      if (line.length > 8) {
        break;
      }
    }
    return [line.trim(), this.text.split(line.trim()).join("")];
  }
}

class LineDraw {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;

  state1: StateDraw;
  state2: StateDraw;

  constructor(state1, state2, color: string = "#52a798") {
    this.state1 = state1;
    this.state2 = state2;
    this.color = color;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    var [p1, p2] = this.chooseEdgePoints();

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(p1.x, p1.y);
    // ctx.bezierCurveTo(p1.x, p2.y, p2.x, p1.y, p2.x, p2.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = this.color;
    ctx.stroke();

    const l = 15;

    var p = { x: p2.x + (p1.x - p2.x) * 0.04, y: p2.y + (p1.y - p2.y) * 0.04 };
    var pr1 = this.rotate(p2.x, p2.y, p.x, p.y, (30 * Math.PI) / 180);
    var pr2 = this.rotate(p2.x, p2.y, p.x, p.y, (-30 * Math.PI) / 180);

    var pointColor = "#868786";
    var pointWidth = 3;

    ctx.beginPath();
    ctx.lineWidth = pointWidth;
    ctx.moveTo(pr1[0], pr1[1]);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = pointColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = pointWidth;
    ctx.moveTo(pr2[0], pr2[1]);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = pointColor;
    ctx.stroke();
  };

  rotate(x1, y1, x2, y2, angle): number[] {
    var xp = x2 - x1;
    var yp = y2 - y1;

    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    xp = xp * cos - yp * sin;
    yp = xp * sin + yp * cos;

    xp += x2;
    yp += y2;

    return [xp, yp];
  }

  chooseEdgePoints(): Point[] {
    const euclidDist = (p1: Point, p2: Point) => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };
    var pointsSt1 = [
      new Point(this.state1.x, this.state1.y + this.state1.height / 2),
      new Point(this.state1.x + 20, this.state1.y + this.state1.height / 2),
      new Point(this.state1.x - 20, this.state1.y + this.state1.height / 2),

      new Point(this.state1.x + this.state1.width / 2, this.state1.y),
      new Point(this.state1.x + this.state1.width / 2, this.state1.y + 20),
      new Point(this.state1.x + this.state1.width / 2, this.state1.y - 20),

      new Point(this.state1.x, this.state1.y - this.state1.height / 2),
      new Point(this.state1.x + 20, this.state1.y - this.state1.height / 2),
      new Point(this.state1.x - 20, this.state1.y - this.state1.height / 2),

      new Point(this.state1.x - this.state1.width / 2, this.state1.y),
      new Point(this.state1.x - this.state1.width / 2, this.state1.y + 20),
      new Point(this.state1.x - this.state1.width / 2, this.state1.y - 20),
    ];

    var pointsSt2 = [
      new Point(this.state2.x, this.state2.y + this.state2.height / 2),
      new Point(this.state2.x + 10, this.state2.y + this.state2.height / 2),
      new Point(this.state2.x - 10, this.state2.y + this.state2.height / 2),

      new Point(this.state2.x + this.state2.width / 2, this.state2.y),
      new Point(this.state2.x + this.state2.width / 2, this.state2.y + 10),
      new Point(this.state2.x + this.state2.width / 2, this.state2.y - 10),

      new Point(this.state2.x, this.state2.y - this.state2.height / 2),
      new Point(this.state2.x + 10, this.state2.y - this.state2.height / 2),
      new Point(this.state2.x - 10, this.state2.y - this.state2.height / 2),

      new Point(this.state2.x - this.state2.width / 2, this.state2.y),
      new Point(this.state2.x - this.state2.width / 2, this.state2.y + 10),
      new Point(this.state2.x - this.state2.width / 2, this.state2.y - 10),
    ];

    var chosen: Point[] = [];

    var minDist = 100000000000;
    for (let i = 0; i < pointsSt1.length; i++) {
      for (let j = 0; j < pointsSt2.length; j++) {
        const d = euclidDist(pointsSt1[i], pointsSt2[j]);
        if (d < minDist) {
          minDist = d;
          chosen = [pointsSt1[i], pointsSt2[j]];
        }
      }
    }

    return chosen;
  }
}

class ConditionDraw extends StateDraw {
  constructor(x, y, width, height, color = "#c6c6c6", text: string) {
    super("", x, y, width, height, color, text);
    this.x = x;
    this.y = y;
    this.height = height;
    this.color = color;
    this.text = text;
    this.width = width;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);

    // top left edge
    ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2);

    // bottom left edge
    ctx.lineTo(this.x, this.y + this.height);

    // bottom righeight edge
    ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);

    // closing the path automatically creates
    // the top right edge
    ctx.closePath();

    ctx.fillStyle = this.color;
    ctx.fill();
  }

  isTouching(x, y) {
    return x > this.x - this.width / 2 && y > this.y - this.height / 2 && x < this.x + this.width / 2 && y < this.y + this.height / 2;
  }

  update(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
