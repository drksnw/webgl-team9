/**
 * Orbit.js - class handling the orbits between 2 planet objects
 *    @params -
 *        planetAnchor[Planet] - anchor planet to define the orbit around
 *        planetOrbit[Planet] - orbiting planet
 *        distance[float] - distance between the 2 planets
 *        orbitPeriod[float] - the orbit period
 **/
class Orbit {
    constructor(planetAnchor, planetOrbit, distance, orbitPeriod) {
        this.planetAnchor = planetAnchor;
        this.planetOrbit = planetOrbit;
        this.distance = distance;
        this.orbitPeriod = orbitPeriod;
        //Defines a variable to handle the T (time) of the orbit
        this.T = 0;

    }

    //Tick method to animate based on the orbit
    //rotation=>"mvmatrix"
    tick(rotation) {
        //Increase of the time
        var unity = mat4.create();

        this.T++;
        //Calculat the new position for the planet in orbit
        var x = this.distance * Math.cos(((2 * Math.PI * this.T) / this.orbitPeriod));
        var y = this.distance * Math.sin(((2 * Math.PI * this.T) / this.orbitPeriod));

        mat4.translate(this.planetAnchor.mvMatrix, unity, [this.planetAnchor.x, this.planetAnchor.y, this.planetAnchor.z]);
        mat4.multiply(this.planetAnchor.mvMatrix, this.planetAnchor.mvMatrix, rotation);

        mat4.translate(this.planetOrbit.mvMatrix, this.planetAnchor.mvMatrix, [x, y, 0]);

        //Set the position for the orbiting planet
        ///this.planetOrbit.x = this.planetAnchor.x + x;
        ///this.planetOrbit.z = this.planetAnchor.z + y;
    }
}