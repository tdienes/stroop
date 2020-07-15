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
 * File: painter.js
 * Contains functions that modify text on page.
 * =============================================================================
 */


/**
 * Wrapper function to paint colored word.
 */
function paintColoredWord(value, color) {
    if (pageloading) {
        return false;
    }
    displayOfColoredWord.style.cssText = 'color:' + color + ';';
    displayOfColoredWord.value = value;
}

/**
 * Wrapper function to paint message.
 */
function paintMessage(value) {
    if (pageloading) {
        return false;
    }
    displayOfMessage.value = value;
}

function paintResultLink() {
    var_linkToResults.style.display = 'list-item';
}

function paintResult() {
     var size = wordArray.length;
     var output = '';
     
     output += "Raw Output:\n";
     output += "MATCH - time in ms : color/WORD\n\n";
     
     var cum_diff = 0;
     var cum_same = 0;
     
     var num_diff = 0;
     var num_same = 0;
     
     for(var i = 0; i < size; i++) {
        output += wordArray[i].type.toUpperCase()+' - '+wordArray[i].time+' : '+
          wordArray[i].color + '/' + wordArray[i].display+"\n";
        if (wordArray[i].type == 'diff') {
            cum_diff += wordArray[i].time;
            num_diff++;
        } else {
            cum_same += wordArray[i].time;
            num_same++;
        }
     }
     
     output += "\n";
     output += "--------------------------------------------------------------------\n"
     output += "Cumulative time for words that were different from color: " + cum_diff + "\n";
     output += "Cumulative time for words that matched the color: " + cum_same + "\n";
     output += "--------------------------------------------------------------------\n"
     output += "\n";
     output += "Average time for different color/word: " + cum_diff / num_diff + "\n";
     output += "Average time for same color/word: " + cum_same / num_same + "\n";
     output += "\n"
     output += "If your average time for the different color/word combinations"+
     " was longer, your results are consistent with the Stroop effect. If your"+
     " results don't seem to match these predictions, try doing the "+
     "experiment again: you might have phased out on one of the words.";
     
     
     var_textareaResults.value = output;
}

var screenState = 'experiment';
/**
 * Handles display switching between tester, information, etc.
 */
function displayScreen(screen) {
    
    if (pageloading) {
        return false;
    }
    if (screenState == screen) {
        return false;
    }
    
    for(var name in screensPossible) {
        if (name == screen) {
            screensPossible[name].style.display = 'block';
        } else {
            screensPossible[name].style.display = 'none';
        }
    }
    
    screenState = screen;
    return true;
}