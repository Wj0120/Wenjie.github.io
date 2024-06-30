p5.disableFriendlyErrors = true; // To help performance.

class Edge {
    constructor(_x, _y, _w, _h) {
        this.pos = createVector(_x, _y);
        this.wid = _w;
        this.hid = _h;
    }

    checkHit(_b) {
        let newV = createVector();
        let eRad = 0;

        if (this.wid > this.hid) {
            newV = createVector(_b.pos.x, this.pos.y);
            eRad = this.hid / 2;
        } else {
            newV = createVector(this.pos.x, _b.pos.y);
            eRad = this.wid / 2;
        }

        let dist = p5.Vector.sub(_b.pos, newV);
        dist = dist.mag();

        return dist < _b.rad + eRad;
    }

    render() {
        rectMode(CENTER);
        fill('brown');
        stroke(200);
        strokeWeight(2);
        rect(this.pos.x, this.pos.y, this.wid, this.hid);
    }
}

class Ball extends Edge {
    constructor(_x, _y, _dia, _color, _number) {
        super(_x, _y, _dia);
        this.dia = _dia;
        this.rad = this.dia / 2;
        this.color = _color;
        this.number = _number;
        this.vel = createVector();
        this.acc = createVector();
    }

    checkCol(_b) {
        let dist = p5.Vector.sub(_b.pos, this.pos);
        let nDist = dist.mag();

        if (nDist <= _b.rad + this.rad) {
            dist = dist.normalize();
            this.pos.sub(dist.mult(0.1));

            let _dist = p5.Vector.sub(this.pos, _b.pos);
            _dist = _dist.normalize();

            let nV = createVector(-_dist.y, _dist.x);
            nV.normalize();

            let vStore = _b.vel.mag();

            this.vel.mult(0.9);
            _b.vel.mult(0.75);

            this.acc.add(_dist.mult(0.5 * vStore));
            _b.acc.add(-nV.mult(0.5 * vStore));
        }
    }

    render() {
        fill(this.color);
        stroke(255, 101);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(this.dia / 2);
        text(this.number, this.pos.x, this.pos.y);
    }

    move() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        if (this.vel.mag() > 0.02)
            this.vel.mult(0.99);
        else {
            this.vel.x = 0;
            this.vel.y = 0;
        }

        this.acc.mult(0);
    }
}

class CueBall extends Ball {
    constructor(_diameter) {
        super(width / 2 - 100, height / 2, _diameter, color(255), 0);
    }

    render() {
        fill(255);
        stroke(0);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.dia, this.dia);
    }
}

class Pocket extends Edge {
    constructor(_x, _y) {
        super(_x, _y, 40, 40);
        this.hue = 0;
    }

    render() {
        this.hue += Math.sin(frameCount / 255);
        this.hue = constrain(this.hue, 0, 255);
        fill(this.hue);
        stroke(0, 147, 0);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.wid, this.wid);
    }

    checkSink(_b) {
        let dist = p5.Vector.sub(_b.pos, this.pos);
        dist = dist.mag();
        return dist < _b.rad + this.wid / 2;
    }
}

class Cue extends Edge {
    constructor() {
        super(mouseX, mouseY, 32, 32);
        this.tip = createVector(0, 0);
    }

    update(_sunk) {
        this.pos.x = mouseX;
        this.pos.y = mouseY;

        if (!_sunk) {
            let toCB = p5.Vector.sub(balls[0].pos, this.pos);
            toCB = toCB.normalize();
            let backCB = toCB.copy();
            stroke(200, 101, 0);
            strokeWeight(9);
            let l1 = p5.Vector.add(this.pos, toCB.mult(100));
            let l2 = p5.Vector.sub(this.pos, backCB.mult(280));
            line(l1.x, l1.y, l2.x, l2.y);
            stroke(200);
            strokeWeight(11);
            point(l1.x, l1.y);
            this.tip = l1.copy();
        }
    }

    render() {
        fill(cueActive ? 'rgba(0,0,255,142)' : 'rgba(255,101,101)');
        stroke(255);
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, this.wid, this.wid);
    }

    checkStrike(_b) {
        if (cueBsunk) {
            let dist = p5.Vector.sub(_b.pos, this.pos);
            let mDist = dist.mag();
            if (mDist < _b.rad + (this.wid / 2)) {
                _b.acc = dist.mult(0.1);
            }
        } else {
            let dist = p5.Vector.sub(_b.pos, this.tip);
            let mDist = dist.mag();
            if (mDist < _b.rad + 9) {
                dist = dist.normalize();
                _b.acc = dist.mult(3.14);
            }
        }
    }
}

var topEdge;
var balls = [];
var pockets = [];
var cueActive = false;
var cue;
var cueBsunk = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);

    topEdge = new Edge(width / 2, 64, width * 0.75, 32);
    botEdge = new Edge(width / 2, height - 64, width * 0.75, 32);
    leftEdge = new Edge(width / 2 - (width * 0.75) / 2, height / 2, 32, botEdge.pos.y - topEdge.pos.y);
    rightEdge = new Edge(width / 2 + (width * 0.75) / 2, height / 2, 32, botEdge.pos.y - topEdge.pos.y);

    setupBalls();
    setupPockets();

    cue = new Cue();
}

function draw() {
    background(0, 101, 202);
    noStroke();

    fill(0, 122, 0);
    rect(width / 2, height / 2, topEdge.wid, leftEdge.hid);

    topEdge.render();
    botEdge.render();
    leftEdge.render();
    rightEdge.render();

    for (let i = balls.length - 1; i >= 0; i--) {
        if ((cueActive && balls[i] instanceof CueBall) || cueBsunk)
            cue.checkStrike(balls[i]);

        for (let j = 0; j < balls.length; j++) {
            if (i !== j) {
                balls[i].checkCol(balls[j]);
            }
        }

        if (topEdge.checkHit(balls[i]) || botEdge.checkHit(balls[i])) {
            balls[i].vel.y = -balls[i].vel.y;
        }
        if (leftEdge.checkHit(balls[i]) || rightEdge.checkHit(balls[i])) {
            balls[i].vel.x = -balls[i].vel.x;
        }

        balls[i].render();
        balls[i].move();

        var sunk = false;
        for (let k = 0; k < pockets.length; k++) {
            if (pockets[k].checkSink(balls[i])) {
                if (balls[i] instanceof CueBall) cueBallSunk();
                balls.splice(i, 1);
                sunk = true;
            }
            if (sunk) break;
        }
    }

    for (let k = 0; k < pockets.length; k++) {
        pockets[k].render();
    }

    cue.update(cueBsunk);
    cue.render();
}

function mouseDragged() {
    cueActive = true;
}

function touchStarted() {
    cueActive = true;
}

function touchEnded() {
    cueActive = false;
}

function cueBallSunk() {
    cueBsunk = true;
}

function setupBalls() {
    balls.push(new CueBall(22));

    let bD = 25;
    let ori = createVector(width / 2, height / 2);
    let colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0), color(255, 0, 255), color(0, 255, 255)];
    let colorIndex = 0;

    let ballNumber = 1;
    for (let i = 1; i <= 4; i++) {
        let posX = ori.x + i * (bD + 2);
        for (let j = 0; j < i; j++) {
            let posY = ori.y - ((bD + 2) * j) + (i / 2 * (bD + 2)) + (bD / 2);
            let ballColor = colors[colorIndex % colors.length];
            balls.push(new Ball(posX, posY, bD, ballColor, ballNumber));
            ballNumber++;
            colorIndex++;
        }
    }
}

function setupPockets() {
    for (let i = 0; i < 6; i++) {
        pockets.push(new Pocket(0, 0));
    }
    pockets[0].pos.x = topEdge.pos.x - topEdge.wid / 2 * 0.96;
    pockets[0].pos.y = topEdge.pos.y + topEdge.hid * 0.2;
    pockets[1].pos.x = topEdge.pos.x + topEdge.wid / 2 * 0.96;
    pockets[1].pos.y = topEdge.pos.y + topEdge.hid * 0.2;
    pockets[2].pos.x = botEdge.pos.x - botEdge.wid / 2 * 0.96;
    pockets[2].pos.y = botEdge.pos.y - botEdge.hid * 0.2;
    pockets[3].pos.x = botEdge.pos.x + botEdge.wid / 2 * 0.96;
    pockets[3].pos.y = botEdge.pos.y - botEdge.hid * 0.2;
    pockets[4].pos.x = width / 2;
    pockets[4].pos.y = botEdge.pos.y;
    pockets[5].pos.x = width / 2;
    pockets[5].pos.y = topEdge.pos.y;
}
