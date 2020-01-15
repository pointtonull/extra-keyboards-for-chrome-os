
/*
Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/




var AltGr = { PLAIN: "plain", ALTERNATE: "alternate" };
var Shift = { PLAIN: "plain", SHIFTED: "shifted" };

var contextID = -1;
var altGrState = AltGr.PLAIN;
var shiftState = Shift.PLAIN;
var lastRemappedKeyEvent = undefined;

var lut = {

//!        #     =  nm           S          nm           S  A  A+S
//keycode  0x16  =  BackSpace    BackSpace  BackSpace
//keycode  0x1A  =  ntilde       Ntilde     asciitilde
//keycode  0x3F  =  KP_Multiply  NoSymbol   KP_Multiply
//keycode  0x42  =  Escape       NoSymbol   Escape

//! Numbers, main reason for this file to exist
//!        #   =  nm              S  nm              S  A            A+S
//keycode  10  =  exclam          1  exclam          1  bar          onesuperior
//keycode  11  =  quotedbl        2  quotedbl        2  at           twosuperior
//keycode  12  =  periodcentered  3  periodcentered  3  numbersign   threesuperior
//keycode  13  =  dollar          4  dollar          4  asciitilde   onequarter
//keycode  14  =  percent         5  percent         5  brokenbar    fiveeighths
//keycode  15  =  ampersand       6  ampersand       6  notsign      threequarters
//keycode  16  =  slash           7  slash           7  onehalf      seveneighths
//keycode  17  =  parenleft       8  parenleft       8  oneeighth    threeeighths
//keycode  18  =  parenright      9  parenright      9  asciicircum
//keycode  19  =  equal           0  equal           0  grave        dead_doubleacute

//! Other fixes for Dvorak to work for me
//!        #   =  nm            S             nm          S             A            A+S
//keycode  20  =  question      apostrophe    apostrophe  question      dead_macron  dead_ogonek
//keycode  21  =  questiondown  exclamdown    exclamdown  questiondown  dead_breve   dead_abovedot
//keycode  22  =  BackSpace     NoSymbol      BackSpace
//keycode  23  =  Tab           ISO_Left_Tab  Tab         ISO_Left_Tab
//keycode  24  =  period        colon         less        less          less         less
//keycode  25  =  comma         semicolon     greater     greater       greater      greater
//keycode  26  =  ntilde        Ntilde        ntilde      Ntilde        asciitilde   asciitilde
//keycode  52  =  minus         underscore    greater     less          greater      less

//! Greek goodies λ
//!        #   =  nm  S  nm  S  A              A+S
//keycode  27  =  p   P  p   P  Greek_pi       paragraph
//keycode  30  =  g   G  g   G  Greek_gamma    Greek_GAMMA
//keycode  32  =  h   H  h   H  Greek_phi      Greek_PHI
//keycode  33  =  l   L  l   L  Greek_lamda    sterling
//keycode  38  =  a   A  a   A  Greek_alpha    Greek_ALPHA
//keycode  39  =  o   O  o   O  Greek_omega    Greek_OMEGA
//keycode  40  =  e   E  e   E  Greek_epsilon  EuroSign
//keycode  43  =  d   D  d   D  Greek_delta    Greek_DELTA
//keycode  45  =  t   T  t   T  Greek_tau      thorn
//keycode  47  =  s   S  s   S  Greek_sigma    Greek_SIGMA
//keycode  57  =  b   B  b   B  Greek_beta     Greek_BETA

//!keycode 9 = Escape NoSymbol Escape
//!add Lock = Caps_Lock

//"KeyW": { "plain": {"plain": "q", "shifted": "Q"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyQ"},
//"KeyE": { "plain": {"plain": "b", "shifted": "B"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyB"},
//"KeyR": { "plain": {"plain": "y", "shifted": "Y"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyY"},
//"KeyT": { "plain": {"plain": "u", "shifted": "U"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyU"},
//"KeyY": { "plain": {"plain": "r", "shifted": "R"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyR"},
//"KeyU": { "plain": {"plain": "s", "shifted": "S"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyS"},
//"KeyI": { "plain": {"plain": "o", "shifted": "O"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyO"},
//"KeyO": { "plain": {"plain": ".", "shifted": ">"}, "alternate": {"plain": "", "shifted":""}, "code": "Period"},
//"KeyP": { "plain": {"plain": "6", "shifted": "^"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit6"},
//"BracketLeft": { "plain": {"plain": "5", "shifted": "%"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit5"},
//"BracketRight": { "plain": {"plain": "=", "shifted": "+"}, "alternate": {"plain": "", "shifted":""}, "code": "Equal"},
//"KeyA": { "plain": {"plain": "-", "shifted": "_"}, "alternate": {"plain": "", "shifted":""}, "code": "Minus"},
//"KeyS": { "plain": {"plain": "k", "shifted": "K"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyK"},
//"KeyD": { "plain": {"plain": "c", "shifted": "C"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyC"},
//"KeyF": { "plain": {"plain": "d", "shifted": "D"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyD"},
//"KeyG": { "plain": {"plain": "t", "shifted": "T"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyT"},
//"KeyJ": { "plain": {"plain": "e", "shifted": "E"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyE"},
//"KeyK": { "plain": {"plain": "a", "shifted": "A"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyA"},
//"KeyL": { "plain": {"plain": "z", "shifted": "Z"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyZ"},
//"Semicolon": { "plain": {"plain": "8", "shifted": "*"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit8"},
//"Quote": { "plain": {"plain": "7", "shifted": "&"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit7"},
//"KeyZ": { "plain": {"plain": "'", "shifted": "\""}, "alternate": {"plain": "", "shifted":""}, "code": "Quote"},
//"KeyX": { "plain": {"plain": "x", "shifted": "X"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyX"},
//"KeyC": { "plain": {"plain": "g", "shifted": "G"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyG"},
//"KeyV": { "plain": {"plain": "v", "shifted": "V"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyV"},
//"KeyB": { "plain": {"plain": "w", "shifted": "W"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyW"},
//"KeyN": { "plain": {"plain": "n", "shifted": "N"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyN"},
//"KeyM": { "plain": {"plain": "l", "shifted": "L"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyL"},
//"Comma": { "plain": {"plain": ",", "shifted": "<"}, "alternate": {"plain": "", "shifted":""}, "code": "Comma"},
//"Period": { "plain": {"plain": "0", "shifted": ")"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit0"},
//"Slash": { "plain": {"plain": "9", "shifted": "("}, "alternate": {"plain": "", "shifted":""}, "code": "Digit9"},
};


chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

function updateAltGrState(keyData) {
  altGrState = (keyData.code == "AltRight") ? ((keyData.type == "keydown") ? AltGr.ALTERNATE : AltGr.PLAIN)
                                              : altGrState;
}

function updateShiftState(keyData) {
  shiftState = ((keyData.shiftKey && !(keyData.capsLock)) || (!(keyData.shiftKey) && keyData.capsLock)) ? 
                 Shift.SHIFTED : Shift.PLAIN;
}

function isPureModifier(keyData) {
  return (keyData.key == "Shift") || (keyData.key == "Ctrl") || (keyData.key == "Alt");
}

function isRemappedEvent(keyData) {
  // hack, should check for a sender ID (to be added to KeyData)
  return lastRemappedKeyEvent != undefined &&
         (lastRemappedKeyEvent.key == keyData.key &&
          lastRemappedKeyEvent.code == keyData.code &&
          lastRemappedKeyEvent.type == keyData.type
         ); // requestID would be different so we are not checking for it  
}


chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;

      if (isRemappedEvent(keyData)) {
        lastRemappedKeyEvent = undefined;
        return handled;
      }

      updateAltGrState(keyData);
      updateShiftState(keyData);

      if (lut[keyData.code]) {
          var remappedKeyData = keyData;
          remappedKeyData.key = lut[keyData.code][altGrState][shiftState];
          remappedKeyData.code = lut[keyData.code].code;

        if (chrome.input.ime.sendKeyEvents != undefined) {
          chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [remappedKeyData]});
          handled = true;
          lastRemappedKeyEvent = remappedKeyData;
        } else if (keyData.type == "keydown" && !isPureModifier(keyData)) {
          chrome.input.ime.commitText({"contextID": contextID, "text": remappedKeyData.key});
          handled = true;
        }
      }

      return handled;
});
