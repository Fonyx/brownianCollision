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

particleCount = 10;
minGenSize = 100;
maxGenSize = 100;

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
function Particle(x, y, radius, fill) {
    this.x = x;
    this.y = y;
    this.radius = radius;
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

    this.update = function() {
        this.draw();
    }
}

// initialize vis
function init(){
    particles = [];

    for(let i=0; i< particleCount; i++){
        const radius = getRandomIntFromRange(minGenSize, maxGenSize);
        let x = getRandomIntFromRange(radius, innerWidth-radius);
        let y = getRandomIntFromRange(radius, innerHeight-radius);
        const fill = getRandomColor();

        // skip first call
        if (i !== 0){
            for(let j=0; j < particles.length; j++){
                // if the distance isn't larger than the two radius's added, then
                if(distance(x, y, particles[j].x, particles[j].y) - (radius + particles[j].radius) < 0){
                    x = getRandomIntFromRange(radius, innerWidth-radius);
                    y = getRandomIntFromRange(radius, innerHeight-radius);
                    
                    // restart the j counter
                    j = -1;
                }
            }
        }

        particles.push(new Particle(x, y, radius, fill));
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
        particle.update();
    })

}

// IMPLEMENTATION
particles = [];

init();
animate();