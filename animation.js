let canvas = document.querySelector('#myCanvas');
let c = canvas.getContext("2d");

// set size of canvas to be the size of window
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// a color pallet to choose from
let color1 = ['#F3FEB0', '#FEA443', '#705E78', '#A5AAA3', '#0812F33']
let color2 = ['#FBA922', '#F0584A', '#2B5877', '#1194A8', '#1FC7B7']
let color3 = ['#66D1D1', '#48A2A3', '#115569', '#FCE66F', '#FFFAE8']
let color4 = ['#BF303C', '#082640', '#D9BA82', '#F2522E', '#D92323']

let colorPallets = [color1, color2, color3, color4]

colors = colorPallets[getRandomIntFromRange(0,colorPallets.length-1)];

particleCount = 100;
// a pixel offset
safetyMargin = 3;
// generate sizes
minGenSize = 5;
maxGenSize = 50;
// generated speeds
minGenSpeed = -1;
maxGenSpeed = 1;

// generate a random integer inside a range
function getRandomIntFromRange(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
};

// generate a random color from colors
function getRandomColor(){
    return colors[getRandomIntFromRange(0, colors.length-1)];
}

// calculate distance between particles
function distance(x1, y1, x2, y2){
    const xDist = x2-x1;
    const yDist = y2-y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

// create a mouse variable to store the mouse position from the event handler
var mouse = {
    x: undefined,
    y: undefined
}

// add mouseover event listener for mouse interactivity
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

// add a resize event listener
addEventListener('resize', () =>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})

// a class that represents the circle, with two methods, draw and update
function Particle(x, y, dx, dy, radius, fill) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: dx,
        y: dy
    };
    this.radius = radius;
    this.mass = Math.PI*Math.pow(radius, 2);
    this.fill = fill;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        // c.fillStyle
        c.strokeStyle = this.fill;
        // c.fill()
        c.stroke();
        c.closePath()
    }

    this.update = particles => {
        this.draw();

        // collision detect check
        for(let i=0; i<particles.length; i++){
            if(this === particles[i]) continue;
            if(distance(this.x, this.y, particles[i].x, particles[i].y) - (this.radius + particles[i].radius) < 0){
                resolveCollision(this, particles[i]);
            }
        }

        // bounding collision conditions
        if(this.x - this.radius <= 0 || this.x + this.radius >= innerWidth){
            this.velocity.x = -this.velocity.x;
        }
        if(this.y - this.radius <= 0 || this.y + this.radius >= innerHeight){
            this.velocity.y = -this.velocity.y;
        }
        
        // move particle
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// initialize vis
function init(){
    particles = [];

    for(let i=0; i< particleCount; i++){
        const radius = getRandomIntFromRange(minGenSize, maxGenSize);
        let x = getRandomIntFromRange(radius+safetyMargin, innerWidth-(radius+safetyMargin));
        let y = getRandomIntFromRange(radius+safetyMargin, innerHeight-(radius+safetyMargin));
        const dx = getRandomIntFromRange(minGenSpeed, maxGenSpeed);
        const dy = getRandomIntFromRange(minGenSpeed, maxGenSpeed);
        const fill = getRandomColor();

        // skip first call
        if (i !== 0){
            for(let j=0; j < particles.length; j++){
                // if the distance isn't larger than the two radius's added and an offset of 5 to make sure they aren't close
                if(distance(x, y, particles[j].x, particles[j].y) - (radius + particles[j].radius + safetyMargin) < 0){
                    x = getRandomIntFromRange(radius, innerWidth-radius);
                    y = getRandomIntFromRange(radius, innerHeight-radius);
                    
                    // restart the j counter
                    j = -1;
                }
            }
        }

        particles.push(new Particle(x, y, dx, dy, radius, fill));
    }
}

// a function that animates the screen with a recursive running loop
function animate(){
    //  calls a specified function to update an animation before the next repaint
    // this is creating a recursive animation call
    requestAnimationFrame(animate);
    // clear the rectangular view each animation cycle
    c.clearRect(0, 0, innerWidth, innerHeight);

    particles.forEach(particle => {
        particle.update(particles);
    })
}

// IMPLEMENTATION
particles = [];

init();
animate();