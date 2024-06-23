let angle = 0;
let timer = 0;
let y1 = -200;
let y2 = -100;

let diamonds = [];
let squares = [];
let circles = [];
let balls = [];
let lines = [];

let img;

function preload() {
    img = loadImage('ciclogo.jpg');
}

function setup() {
    createCanvas(1280, 720);
    background(0);
    angleMode(DEGREES);
    rectMode(CENTER);
    strokeCap(ROUND);

    diamonds.push(new Diamond(140, 0, 0, 0, 255, 8, 0));
    diamonds.push(new Diamond(75, 0, 0, 0, 0, 8, 255));
    diamonds.push(new Diamond(50, 0, 0, 0, 0, 15, 255));
    diamonds.push(new Diamond(15, 0, 0, 0, 0, 0, 0));

    diamonds.push(new Diamond(0, 0, 25, 0, 0, 0, 0));
    diamonds.push(new Diamond(0, 0, 50, 0, 255, 8, 0));
    diamonds.push(new Diamond(0, 0, 75, 0, 0, 8, 255));
    diamonds.push(new Diamond(0, 0, 140, 0, 0, 15, 255));

    squares.push(new Square(0, 0, 0, 30, 255, 170, 0));
    squares.push(new Square(0, 0, 0, 30, 255, 0, 140));
    squares.push(new Square(0, 0, 0, 30, 255, 0, 170));

    circles.push(new Circle(0, -360, 255, 2, 255, 20));

    balls.push(new Ball(0, 110, 25, 0));
    balls.push(new Ball(0, 47, 20, 0.2));
    balls.push(new Ball(0, 0, 20, 1));

    lines.push(new Line(0,-400,0,-350));
}

function draw() {
    background(0);
    image(img, 0, 0);
    // Timer
    timer += deltaTime / 1000;
    if (timer > 8) {
        timer = 0;
        diamonds.forEach(diamond => { diamond.reset(); });
        squares.forEach(square => { square.reset(); });
        circles.forEach(circle => { circle.reset(); });
        balls.forEach(ball => { ball.reset(); });
        lines.forEach(line => { line.reset(); });
    }

    // Display timer
    // fill('red');
    // noStroke();
    // textSize(20);
    // text(timer, 20, 50);

    // Rotate the canvas
    push();
    translate(width / 2, height / 2);
    rotate(angle);
    translate(-width / 2, -height / 2);

    // Update and display shapes
    if (timer >= 0 && timer < 2) {
        diamonds[0].update();
        diamonds[0].display();
        squares[0].update();
        squares[0].display();

        diamonds[1].update();
        diamonds[1].display();
        diamonds[2].update();
        diamonds[2].display();
        diamonds[3].update();
        diamonds[3].display();

        balls[2].scala1();
        balls[2].display1();
    }

    if (timer >= 2) {
        squares[1].update1();
        squares[1].display();
        diamonds[4].update1();
        diamonds[4].display();
    }

    if (timer >= 0.3) {
        circles[0].update();
        circles[0].display();
        lines[0].update();
        lines[0].display(); 
    }

    if (timer >= 6) {
        diamonds[7].update2();
        diamonds[7].display();
        squares[2].update2();
        squares[2].display();

        diamonds[6].update2();
        diamonds[6].display();
        diamonds[5].update2();
        diamonds[5].display();
    }

    if (timer >= 5){
        balls[0].update();
        balls[0].display();
    }

    if (timer >= 5.3){
        balls[1].update();
        balls[1].scala();
        balls[1].display1();
    }

    pop();
}


class Diamond {
    constructor(x, y, targetX, targetY, strokeColor, strokeWeightValue, fillColor) {
        this.position = createVector(x, y);
        this.initialposition = createVector(x, y);
        this.targetPosition = createVector(targetX, targetY);
        this.strokeColor = strokeColor;
        this.strokeWeightValue = strokeWeightValue;
        this.fillColor = fillColor;
        this.hidden = false;
        this.angle = 0;
        this.state = 0;
    }

    hide() {
        this.hidden = true;
    }

    reset() {
        this.position = createVector(this.initialposition.x, this.initialposition.y);
        this.hidden = false;
        this.angle = 0;
        this.state = 0;
        this.size = 0;
    }

    update() {
        this.position.x = lerp(this.position.x, this.targetPosition.x, 0.05);
        this.position.y = lerp(this.position.y, this.targetPosition.y, 0.05);
    }

    update1() {
        this.position.x = lerp(this.position.x, this.targetPosition.x, 0.03);
        this.position.y = lerp(this.position.y, this.targetPosition.y, 0.03);
        switch (this.state) {
            case 0:
                this.angle = lerp(this.angle, 390, 0.1); // Rotate to 390 degrees
                if (abs(this.angle - 390) < 1) {
                    this.state = 1;
                }
                break;
            case 1:
                this.angle = lerp(this.angle, 330, 0.06);
                if (abs(this.angle - 330) < 1) {
                    this.state = 2;
                }
                break;
            case 2:
                this.angle = lerp(this.angle, 360, 0.06);
                if (abs(this.angle - 360) < 1) {
                    this.state = 3;
                }
                break;
        }
    }

    update2() {
        this.position.x = lerp(this.position.x, this.targetPosition.x, 0.05);
        this.position.y = lerp(this.position.y, this.targetPosition.y, 0.05);
    }

    display() {
        if (this.hidden) return;
        push();
        translate(width / 2, height / 2);
        rotate(this.angle);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeightValue);
        fill(this.fillColor);
        beginShape();
        vertex(-this.position.x, this.position.y);
        vertex(this.position.y, -this.position.x);
        vertex(this.position.x, this.position.y);
        vertex(this.position.y, this.position.x);
        endShape(CLOSE);
        pop();
    }
}

class Square {
    constructor(x, y, strokeColor, strokeWeightValue, fillColor, size, targetsize) {
        this.position = createVector(x, y);
        this.initialposition = createVector(x, y);
        this.strokeColor = strokeColor;
        this.strokeWeightValue = strokeWeightValue;
        this.fillColor = fillColor;
        this.hidden = false;
        this.size = size;
        this.initialsize = size;
        this.targetsize = targetsize;
        this.initialtargetsize = targetsize;
        this.angle = 0;
        this.state = 0;
    }

    hide() {
        this.hidden = true;
    }

    reset() {
        this.position = createVector(this.initialposition.x, this.initialposition.y);
        this.hidden = false;
        this.size = this.initialsize;
        this.targetsize = this.initialtargetsize;
        this.angle = 0;
        this.state = 0;
    }

    update() {
        this.size = lerp(this.size, 0, 0.05);
    }

    update1() {
        this.size = lerp(this.size, this.targetsize, 0.05);
        switch (this.state) {
            case 0:
                this.angle = lerp(this.angle, 390, 0.07); // Rotate to 390 degrees
                if (abs(this.angle - 390) < 1) {
                    this.state = 1;
                }
                break;
            case 1:
                this.angle = lerp(this.angle, 330, 0.07);
                if (abs(this.angle - 330) < 1) {
                    this.state = 2;
                }
                break;
            case 2:
                this.angle = lerp(this.angle, 360, 0.085);
                if (abs(this.angle - 360) < 1) {
                    this.state = 3;
                }
                break;
        }
    }
    update2() {
        this.size = lerp(this.size, 170, 0.05);
    }

    display() {
        if (this.hidden) return;
        push();
        translate(width / 2 + this.position.x, height / 2 + this.position.y);
        rotate(this.angle);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeightValue);
        fill(this.fillColor);
        rect(0, 0, this.size);
        pop();
    }
}

class Circle {
    constructor(x, y, strokeColor, strokeWeightValue, fillColor, size) {
        this.position = createVector(x, y);
        this.initialposition = createVector(x, y);
        this.targetPosition = createVector(0, -40);
        this.finalPosition = createVector(0, -85);
        this.upPosition = createVector(0, 0);
        this.strokeColor = strokeColor;
        this.strokeWeightValue = strokeWeightValue;
        this.fillColor = fillColor;
        this.hidden = false;
        this.size = size;
        this.state = 0;
        this.angle = 0;
    }

    hide() {
        this.hidden = true;
    }

    reset() {
        this.position = createVector(this.initialposition.x, this.initialposition.y);
        this.hidden = false;
        this.size = 20;
        this.state = 0;
        this.angle = 0;
        this.fillColor = 255; // Reset color to initial value
    }

    update() {
        switch (this.state) {
            case 0:
                // Move the circle down
                this.position.y = lerp(this.position.y, this.targetPosition.y, 0.045);
                if (abs(this.position.y - this.targetPosition.y) < 1) {
                    this.state = 1;
                }
                break;
            case 1:
                // Move the circle further down
                this.position.y = lerp(this.position.y, this.finalPosition.y, 0.045);
                if (abs(this.position.y - this.finalPosition.y) < 0.5) {
                    this.state = 2;
                }
                break;
            case 2:
                // Rotate the circle
                this.angle += 3; // Increment the angle for rotation
                if (this.angle >= 180) {
                    this.state = 3;
                }
                break;
            case 3:
                // Move the circle up
                this.position.y = lerp(this.position.y, this.upPosition.y, 0.045);
                // Change color to black when reaching the finalPosition
                if (abs(this.position.y - this.finalPosition.y) < 1) {
                    this.fillColor = 0;
                }
                break;
        }
    }

    display() {
        if (this.hidden) return;
        push();
        translate(width / 2, height / 2); // Translate to the center of the canvas
        if (this.state === 2 || this.state === 3) {
            rotate(this.angle); // Apply the rotation
        }
        translate(this.position.x, this.position.y); // Move to the circle's position
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeightValue);
        fill(this.fillColor);
        ellipse(0, 0, this.size);
        pop();
    }
}

class Ball {
    constructor(x, y, size, scale) {
        this.position = createVector(x, y);
        this.initialPosition = createVector(x, y);
        this.size = size;
        this.initialSize = size;
        this.startAngle = 360;
        this.endAngle = 0;
        this.scale = scale;
        this.initialscale = scale;
        this.hidden = false;
    }

    reset() {
        this.position = createVector(this.initialPosition.x, this.initialPosition.y);
        this.size = this.initialSize;
        this.startAngle = 360;
        this.endAngle = 0;
        this.scale = this.initialscale;
        this.hidden = false;
    }

    hide() {
        this.hidden = true;
    }

    update() {
        this.position.y = lerp(this.position.y, 0, 0.05);
        this.startAngle = lerp(this.startAngle, 181, 0.06);
        this.endAngle = lerp(this.endAngle, 181, 0.06);
    }

    display() {
        if (this.hidden) return;
        push();
        fill(0);
        translate(width / 2 + this.position.x , height / 2 + this.position.y);
        rotate(270);
        arc(0, 0, this.size, this.size, this.startAngle, this.endAngle, CHORD);
        pop();
    }

    display1(){
        if (this.hidden) return;
        push();
        fill(255);
        translate(width / 2 + this.position.x , height / 2 + this.position.y);
        scale(this.scale);
        circle(0, 0, this.size);
        pop();
    }

    scala(){
            this.scale = lerp(this.scale, 0.6, 0.03);
        
    }
    scala1(){
            this.scale = lerp(this.scale, 0, 0.03);
    }
    
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.start = createVector(x1, y1);
        this.end = createVector(x2, y2);
        this.initialStart = createVector(x1, y1);
        this.initialEnd = createVector(x2, y2);
        this.state = 0;
        this.hidden = false;
    }

    reset() {
        this.start = createVector(this.initialStart.x, this.initialStart.y);
        this.end = createVector(this.initialEnd.x, this.initialEnd.y);
        this.state = 0;
        this.hidden = false;
    }

    hide() {
        this.hidden = true;
    }

    update() {
        switch(this.state){
            case 0:
                console.log(`${abs(this.end.y  -104)},${this.state}`)
                this.start.y = lerp(this.start.y, -200, 0.03);
                this.end.y = lerp(this.end.y, -105, 0.04);
                if (abs(this.start.y + 140) < 61 && abs(this.end.y + 65) < 41) {
                    this.state = 1;
            }break; 
            case 1:
                this.end.y = lerp(this.end.y, -150, 0.1);
                this.start.y = lerp(this.start.y, -150, 0.1);
                if (this.end.y > -149.5) {
                    this.state = 2; 
                }
            case 3:
                if (this.state ) {
                    this.hide(); // Hide the line when it reaches the limit
                }
                break;
            }
    }

    display() {
        if (this.hidden) return;
        push();
        stroke(255); // Ensure the line is white
        strokeWeight(5);
        translate(width / 2, height / 2);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
        pop();
    }
}


