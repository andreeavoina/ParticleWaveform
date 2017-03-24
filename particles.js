var SPRITE_SIZE = 10
var NUM_SUBSETS = 150;
var NUM_LEVELS = 1;
var NUM_POINTS = NUM_POINTS_SUBSET * NUM_SUBSETS;
var NUM_POINTS_SUBSET = 1000;

var SCALE_FACTOR = 10;
var hueValues = [];

var A_MIN = -30;
var A_MAX = 30;
var B_MIN = .2;
var B_MAX = 1.8;
var C_MIN = 5;
var C_MAX = 17;
var D_MIN = 0;
var D_MAX = 10;
var E_MIN = 0;
var E_MAX = 12;

var orbit = {
    subsets: [],
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
    scaleX: 0,
    scaleY: 0
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------
for (var i = 0; i < NUM_SUBSETS; i++){
    var subsetPoints = [];
    for (var j = 0; j < NUM_POINTS_SUBSET; j++){
        subsetPoints[j] = {
            x: 0,
            y: 0,
            vertex:  new THREE.Vector3(0,0,0)
        };
    }
    orbit.subsets.push(subsetPoints);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
function initParticles(){    
    generateOrbit();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function makeParticle(color, num){ 
    for (var s = 0; s < NUM_SUBSETS; s++){hueValues[s] = Math.random();}

    var material = new THREE.PointsMaterial( { color: color, size:(SPRITE_SIZE ), map: sprite1, 
                    blending: THREE.AdditiveBlending,
                    depthTest: false, transparent : true } );   
    
    //material.color.setHSL(Math.random(), Math.random(), Math.random());

    var geometry = new THREE.Geometry();  
    
    for (var i = 0; i < NUM_POINTS_SUBSET; i++)
        geometry.vertices.push( orbit.subsets[num][i].vertex);    
    
    var particles = new THREE.Points( geometry, material );
    particles.rotation.y += Math.PI / 2;
    return particles;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function generateOrbit(){
    var x, y, z, x1;
    var idx = 0;

    prepareOrbit();
    var al = a;
    var bl = b;
    var cl = c;
    var dl = d;
    var el = e;
    var subsets = orbit.subsets;
    var num_points_subset_l = NUM_POINTS_SUBSET;
    var num_points_l = NUM_POINTS;
    var scale_factor_l = SCALE_FACTOR;

    var xMin = 0, xMax = 0, yMin = 0, yMax = 0;

        for (var s = 0; s < NUM_SUBSETS; s++){
            x = 0;
            y = 0;

    var curSubset = subsets[s];

    for (var i = 0; i < num_points_subset_l; i++){

// Iteration formula (generalization of the Barry Martin's original one)
    z = (dl + Math.sqrt(Math.abs(bl * x - cl)));
        if (x > 0) {x1 = y - z;}
        else if (x == 0) {x1 = y;}
            else {x1 = y + z;}
            y = al - x;
            x = x1 + el;

        curSubset[i].x = x;
        curSubset[i].y = y;

        if (x < xMin) {xMin = x;}
        else if (x > xMax) {xMax = x / 2;}
        if (y < yMin) {yMin = y;}
        else if (y > yMax) {yMax = y;}

        idx++;
        }
    }
    var scaleX = 2 * scale_factor_l / (xMax - xMin);
    var scaleY = 2 * scale_factor_l / (yMax - yMin);

    orbit.xMin = xMin;
    orbit.xMax = xMax;
    orbit.yMin = yMin;
    orbit.yMax = yMax;
    orbit.scaleX = scaleX;
    orbit.scaleY = scaleY;

    // Normalize and update vertex data
    for (var s = 0; s < NUM_SUBSETS; s++){
    var curSubset = subsets[s];
        for (var i = 0; i < num_points_subset_l; i++){
            curSubset[i].vertex.x = scaleX * (curSubset[i].x - xMin) - scale_factor_l;
            curSubset[i].vertex.y = scaleY * (curSubset[i].y - yMin) - scale_factor_l;
            }
        }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function prepareOrbit(){
    
    shuffleParams();
    
    orbit.xMin = 0;
    orbit.xMax = 0;
    orbit.yMin = 0;
    orbit.yMax = 0;
    }
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function shuffleParams() {
    a = A_MIN + Math.random() * (A_MAX - A_MIN);
    b = B_MIN + Math.random() * (B_MAX - B_MIN);
    c = C_MIN + Math.random() * (C_MAX - C_MIN);
    d = D_MIN + Math.random() * (D_MAX - D_MIN);
    e = E_MIN + Math.random() * (E_MAX - E_MIN);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function updateOrbit(){
    generateOrbit();
    
    for (var s = 0; s < NUM_SUBSETS; s++){
        hueValues[s] = Math.random();
    }
    for( i = 0; i < scene.objects.length; i++ ) {
        scene.objects[i].verticesNeedUpdate = 1;
    }

}