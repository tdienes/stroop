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
 * File: script.js
 * Contains Implements the combination of various code blocks
 * =============================================================================
 */



if (!window.Node) {
    window.Node = {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        COMMENT_NODE: 8,
        DOCUMENT_Node: 9,
        DOCUMENT_FRAGMENT_NODE: 11
    }
}

/**
 * Configurable Elements
 */
var silo = new TypeSilo(3); //Edit number to change the amount of tests given.
                            //See classes.js for more information.

/**
 * Global Elements
 */
var info = new ColorInfo(); //Information about colors

//References to elements
var displayOfMessage, displayOfColoredWord, input;
var textscreen, screenInstructions, screenInformation, screenExperiment;
var body, buttonEditKeys;
var fields = new Object();
var screensPossible = new Object();

var wordArray = new Array(); //List of colored words to test
var counter = 0; //Tracker of current colored word we're testing

var pageloading = true; //false when ini() is called
var state = 'notstarted'; //Current state of testing

var timeStart; //Timer global variables for determining
var timeStop;  //how long it took for the user to report the color

var keyToColor = new Object();
keyToColor['r'] = 'red';
keyToColor['g'] = 'green';
keyToColor['b'] = 'blue';
keyToColor['y'] = 'yellow';
keyToColor['x'] = 'cancel';

/**
 * Initializes the script by assigning references to variables and initializing
 * the word array. Concludes by focusing on the input box.
 * 
 * @event body onload
 */
function ini() {
    
    displayOfMessage     = document.getElementById('displayOfMessage');
    displayOfColoredWord = document.getElementById('displayOfColoredWord');
    input                = document.getElementById('input');
    screenInstructions   = document.getElementById('screenInstructions');
    screenInformation    = document.getElementById('screenInformation');
    screenExperiment     = document.getElementById('screenExperiment');
    var_screenResults    = document.getElementById('screenResults');
    buttonEditKeys       = document.getElementById('buttonEditKeys');
    var_linkToResults        = document.getElementById('linkToResults');
    var_textareaResults      = document.getElementById('textareaResults');
    body                 = document.getElementById('body');
    
    screensPossible.instructions = screenInstructions;
    screensPossible.experiment   = screenExperiment;
    screensPossible.information  = screenInformation;
    screensPossible.results      = var_screenResults;
    
    fields['red']    = document.getElementById('colorkey_red_input');
    fields['green']  = document.getElementById('colorkey_green_input');
    fields['yellow'] = document.getElementById('colorkey_yellow_input');
    fields['blue']   = document.getElementById('colorkey_blue_input');
    fields['cancel'] = document.getElementById('colorkey_cancel_input');
    
    state = 'notstarted';
    iniWordArray();
    //input.focus();
    
    pageloading = false;
}

/**
 * Creates the wordArray variable, an array of colored words cycled through
 * during the interactive test.
 */
function iniWordArray() {
    
    var i = 0;
    
    //Don't break unless we tell you to.
    while (true) {
        //Determine the type of this word randomly
        var type = silo.selectRandom();
        
        //If there are no more cases, break.
        if (type == 'empty') {
            break;
        }
        
        //Determine the color of this word randomly
        var color = silo[type].selectRandom();
        
        //Initialize the new Object for this wordArray
        wordArray[i] = new WordSilo();
        //wordArray[i] = new Object();
        wordArray[i].type = type;
        
        if (type == 'diff') {
            wordArray[i].color   = info[color].color;
            wordArray[i].hex     = info[color].hex;
            //Display for diff must not be the same, so we select a random color
            //passing the real color as the exclusion parameter
            var random = info.selectRandom(color);
            wordArray[i].display = info[random].display;
        } else if (type == 'same') {
            //One-to-one relationship
            wordArray[i].color   = info[color].color;
            wordArray[i].hex     = info[color].hex;
            wordArray[i].display = info[color].display;
        } else {
            //Shouldn't happen, break the loop.
            break;
        }
        
        silo[type].deplete(color); //decrement the used color field
        i++; //increment to the next empty wordArray key
        
    }
}

/**
 * Handles input into the input field and automatically clears the field so
 * it doesn't overflow. Returns true for no apparent reason.
 * 
 * event input#input onkeyup
 */
function eventInput() {
    var value = input.value;
    input.value = ''; //clear the field
    displayScreen('experiment');
    
    //If we haven't started, start it if the value is a space
    if (state == 'notstarted') {
        if (value != ' ') {
            paintMessage('Press SPACE to start.');
            return true;
        }
        
        state = 'standby';
        paintMessage('Starting...');
        setTimeout("setStandby()",1000);
        return true;
    }
    
    //Why isn't "state == 'standby'" here?
    //The standby state is transient and automatically switches into the next
    //state (response). It is handled by setStandby() and is unaffected by
    //input events.
    
    //Grab the response.
    if (state == 'response') {
        
        //Make sure response is correct.
        if (wordArray[counter - 1].color == keyToColor[value]) {
            timeEnd = (new Date()).getTime();
            var time = timeEnd - timeStart
            wordArray[counter - 1].time = time;
            paintMessage('Correct. Press SPACE to continue.');
        } else if (keyToColor[value] == 'cancel') {
            paintMessage('Okay, Trial Discarded.');
            shuffleLast();
        } else {
            //Response was incorrect, reassign it to a later area.
            //TODO: port this to a function and make it random
            paintMessage('INCORRECT. Don\'t Rush!');
            shuffleLast();
        }
        
        state = 'afteranswer';
        return true;
    }
    
    //After there is an answer, make sure we're not finished. If not, wait
    //till the user presses spacebar to move into the next standby
    if (state == 'afteranswer' && value == ' ') {
        
        if (counter == wordArray.length) {
            //TODO: setTimeOut for message display
            paintMessage('You are done! There is a link to your results above.');
            paintColoredWord('HOORAY!','#FFF');
            paintResult();
            paintResultLink();
            return true;
        }
        
        state = 'standby';
        setStandby();
        return true;
    }
    
}

function shuffleLast() {
    counter--;
    var save = wordArray[counter];
    wordArray.splice(counter, 1);
    var index = randomBetween(counter + 1,wordArray.length);
    wordArray.splice(index,0,save);
}


/**
 * Waiting mode... show the dot on the screen and randomly switch it with the
 * word.
 */
function setStandby() {
    
    paintMessage('');
    paintColoredWord('.','#FFF');
    
    setTimeout("setWord()", randomBetween(500, 2500));
    
}

/**
 * Paints the current colored word on the screen, increments the counter, and
 * sets the timeStart variable.
 */
function setWord() {
    state = 'response';
    var display = wordArray[counter].display;
    var color = wordArray[counter].hex;
    timeStart = (new Date()).getTime();
    paintColoredWord(display,color);
    counter++;
}

var editKeysState = false;

function eventEditKeys() {
    
    if (editKeysState == false) {
        buttonEditKeys.value = 'Set';
        for (var name in fields) {
            fields[name].readOnly = false;
            fields[name].style.setProperty('border','1px solid #999','');
            fields[name].onclick = function() {this.select();}
        }
    } else {
        
        var kill = false;
        var temp = new Object();
        for (var name in fields) {
            fields[name].style.setProperty('border','1px solid #999','');
            if (typeof (temp[fields[name].value]) == 'string') {
                fields[name].style.setProperty('border','1px solid #F00','');
                kill = true;
            }
            temp[fields[name].value] = name;
        }
        if (kill) {
            return false;
        }
        buttonEditKeys.value = 'Edit';
        for (var name in fields) {
            fields[name].readOnly = true;
            fields[name].style.setProperty('border','1px solid #FFF','');
            fields[name].onclick = function() {}
        }
        keyToColor = temp;
    }
    editKeysState = ! editKeysState;
}

/**
 * Convenience function random number between numbers you choose, exclusive.
 */
function randomBetween(start, stop) {
    
    if (start == stop) { //if equal, return it.
        return start;
    } else if (start > stop) { //if one is greater than other, switch them
        var temp;
        temp = stop;
        stop = start;
        start = temp;
    }
    
    var range = stop - start;
    var notrounded = Math.random() * range;
    return Math.round(notrounded + start);
}
