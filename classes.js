/**
 * =============================================================================
 * Stroop Effect - An XHTML 1.0 Strict JavaScript based Interactive Program
 * Copyright (C) 2005  Edward Z. Yang <edwardzyang@thewritingpot.com>
 * Updates 2020 Thomas J. Dienes <tdienes@mit.edu>
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301,
 * USA.
 * 
 * File: classes.js
 * Contains constructor functions for classes used in program.
 * =============================================================================
 */

/**
 * This object holds information about the colors we will use in the
 * experiment.
 * 
 * Configuration Options:
 * - Change exact hexadecimal values of each color (oh, the blue is too dark)
 * - Theoretically, change the entire mechanisms of a color
 *   - Warning: this is not a good idea, because it's still known as the
 *     same keyword internally, so someone looking at your modification
 *     will find it *very* counter-intuitive
 * - Part of the objects you will have to modify in order to add or subtract
 *       colors.
 */
function ColorInfo() { //Edit this
    this.cycle  = ['red','yellow','green','blue']
    this.red    = new ColorInfo_Key('red',   'RED',   '#F00');
    this.yellow = new ColorInfo_Key('yellow','YELLOW','#FF0');
    this.green  = new ColorInfo_Key('green', 'GREEN', '#0F0');
    this.blue   = new ColorInfo_Key('blue',  'BLUE',  '#55F');
}
new ColorInfo(); //mark as constructor

/**
 * Selects a random color from the colors currently registered. Optionally
 * takes a parameter which tells us to exclude a certain color from this
 * random pick. Used internally to get a display string for our colored words.
 */
ColorInfo.prototype.selectRandom = function(exclude) {
    if (arguments.length == 0) {
        exclude = '';
    }
    var selection = new Array();
    var j = 0;
    for (var i = 0; i < this.cycle.length; i++) {
        if (this.cycle[i] != exclude) {
            selection[j] = this.cycle[i];
            j++;
        }
    }
    var index = randomBetween(0, selection.length - 1);
    return selection[index];
}

/**
 * Internal object constructor inside ColorInfo
 */
function ColorInfo_Key(color,display, hex) {
    this.color   = color;
    this.display = display;
    this.hex     = hex;
}





function ColorSilo(r, y, g, b) {
    this.cycle  = ['red','yellow','green','blue']
    this.red    = new ColorSilo_Part('red',   r);
    this.yellow = new ColorSilo_Part('yellow',y);
    this.green  = new ColorSilo_Part('green', g);
    this.blue   = new ColorSilo_Part('blue',  b);
    this.size   = r + y + g + b;
}






new ColorSilo(0,0,0,0); //mark as constructor
ColorSilo.prototype.selectRandom = function() {
    //This selects a random color from the ones that haven't been depleted
    
    var selection = new Array();
    var j = 0;
    var size = this.cycle.length;
    for (var i = 0; i < size; i++) {
        if (this[this.cycle[i]].value > 0) {
            selection[j] = this.cycle[i];
            j++;
        }
    }
    var index = randomBetween(0, selection.length - 1);
    return selection[index];
    
}
ColorSilo.prototype.deplete = function(color) {
    this[color].value--;
    this.size--;
}
ColorSilo.prototype.toString = function() {
    var output = '';
    output += '-Red: '    + this.red.value    + "\n";
    output += '-Yellow: ' + this.yellow.value + "\n";
    output += '-Green: '  + this.green.value  + "\n";
    output += '-Blue: '   + this.blue.value   + "\n";
    
    return output;
}
//Color Silo helps determine the number of each color we'll use
function ColorSilo_Part(color,value) {
    this.color = color;
    this.value = value;
}








//Type Silo is the overarching silo of everything
function TypeSilo(s_r, s_y, s_g, s_b,   //Same numbers
                  d_r, d_y, d_g, d_b) { //Different numbers
    if (arguments.length == 1) {
        s_y = s_g = s_b = d_r = d_y = d_g = d_b = s_r; //set them all equal
    }
    if (arguments.length == 2) {
        var diff = s_y;
        s_y = s_g = s_b = s_r;
        d_r = d_y = d_g = d_b = diff;
    }
    this.same = new ColorSilo(s_r, s_y, s_g, s_b);
    this.diff = new ColorSilo(d_r, d_y, d_g, d_b);
}
new TypeSilo(0); //mark as constructor
TypeSilo.prototype.toString = function() {
    var output = '';
    output += 'Silo for same:\n' + this.same + "\n";
    output += 'Silo for diff:\n' + this.diff + "\n";
    return output;
}
TypeSilo.prototype.selectRandom = function() {
    if (this.same.size == 0 && this.diff.size == 0) {
        return 'empty';
    }
    
    if (this.same.size == 0) {
        return 'diff';
    } else if (this.diff.size <= 0) {
        return 'same';
    }
    var selection = new Array();
    selection[0] = 'diff';
    selection[1] = 'same';
    var index = randomBetween(0, 1);
    return selection[index];
}


function WordSilo () {
    this.color   = '';
    this.hex     = '#000';
    this.display = '';
    this.time    = 0;
}
new WordSilo(); //mark as constructor
WordSilo.prototype.toString = function() {
    var output = '';
    output += this.color + '/' + this.display + ' - ' + this.hex + "\n";
    output += 'Time: ' + this.time + ', Type: ' + this.type + "\n";
    return output;
}