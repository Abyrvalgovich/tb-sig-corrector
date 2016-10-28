/* ***** BEGIN LICENSE BLOCK *****
 * Copyright © 2015 tux. <mozilla@tuxproject.de>
 *
 * This work is free. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License, Version 2,
 * as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
 *
 * ***** END LICENSE BLOCK ***** */

var QFO = {
   

insertFuckOff: function() {
		
	let editor = GetCurrentEditor();
	let editor_type = GetCurrentEditorType(); 
	let prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	let prefServiceBranch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	let prefs = prefService.getBranch("extensions.qfo.");
	var composeFields;
	composeFields = gMsgCompose.compFields;

	//removing VR-SPAM in subject if it's there because why would you reply to legit spam
	if (QFO.isSpamRemove()) {
		
		var checkSpam = /\[VR\-SPAM\]/;
		var subject = composeFields.subject;
		var spamHere = checkSpam.test(subject);
		var none = "";
		if (spamHere) {
			subject = subject.replace(checkSpam,none); 
			composeFields.subject = subject; 
			document.getElementById("msgSubject").value = gMsgCompose.compFields.subject;
		}
	}
	
	//if at least one signature option is checked, get data we need later
	if (QFO.isShout() || QFO.isAlwaysPlain()) {	
		
		//copy original body
		editor.beginTransaction();
		editor.selectAll();
		var fulltext = editor.outputToString('text/html', 1);	
		editor.beginningOfDocument();  
		editor.endTransaction();
	
		//cheking sig and forwarding state
		var checkSig = /(cols=".{1,3}">)([\s\S]*?)(<\/pre>)/i;
		var checkNotFirst = /<blockquote cite|moz-forward-container/;
		var notFirst = checkNotFirst.test(fulltext);

		//is there even a signature? 
		if (notFirst) {
			var checkmessagebodybeforequote = /([\s\S]*?)<blockquote cite|moz-forward-container/;
			var textbodybeforequote = fulltext.match(checkmessagebodybeforequote); 
			var sigHere = checkSig.test(textbodybeforequote[1]);
		} else {
			var sigHere = checkSig.test(fulltext);
		}



	


		//if internal emails need short sigs
		if (QFO.isShout() && (sigHere)) {	
		
			//set domains you need here
			var checkTo = /[-_A-Za-z0-9\.]+(@|.)drweb.com/ig;
			var checkEmails = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/ig;

			//count email adresses
			var fieldtocontains = composeFields.to;
			var fieldcopycontains = composeFields.cc;
			var drwebTo = fieldtocontains.match(checkTo); 
			var truedrwebTo = drwebTo ? drwebTo.length : 0;
			var drwebCC = fieldcopycontains.match(checkTo); 
			var truedrwebCC = drwebCC ? drwebCC.length : 0;
			var allTo = fieldtocontains.match(checkEmails); 
			var trueallTo = allTo ? allTo.length : 0;
			var allCC = fieldcopycontains.match(checkEmails); 
			var trueallCC = allCC ? allCC.length : 0;
			//so, is it internal email?
			var internally = (truedrwebTo + truedrwebCC) > ((trueallTo + trueallCC) / 2) ? true : false;

			if ((internally) && ((QFO.isWorkingInFirst()) || (notFirst))) {	

var shortSig = prefs.getComplexValue("short",
Components.interfaces.nsISupportsString).data;
	
				var shortSigReady = "$1" + shortSig + "$3";
				var newtext = fulltext.replace(checkSig,shortSigReady);
				//replace body
				editor.beginTransaction();
				editor.selectAll();      
				editor.insertHTML(newtext);
				editor.beginningOfDocument();
				editor.endTransaction();
			}
				
		}

		//if english sigs are enabled
		if (QFO.isAlwaysPlain() && (sigHere)) {	
		
			var checkmessagebody = /([\s\S]*?)(<pre)/i;
			var checkforkeywords = /(Hello|^hi,|^hi\s|^hi\b|good day|regards|sincerely yours|thank|sure|of course|good afternoon|good evening|good morning|good night|dear)/i;
			var textbody = fulltext.match(checkmessagebody); 
			var foreign = checkforkeywords.test(textbody[1]);

			if (foreign) {	

				var checkSig = /(cols=".{1,3}">)([\s\S]*?)(<\/pre>)/;
	
var engSig = prefs.getComplexValue("eng",
Components.interfaces.nsISupportsString).data;              
				  
				var engSigReady = "$1" + engSig + "$3";
				var newtext = fulltext.replace(checkSig,engSigReady);
				//replace body
				editor.beginTransaction();
				editor.selectAll();
				editor.insertHTML(newtext);
				editor.beginningOfDocument();
				editor.endTransaction();
			}
		}  
	}
},
	
	isShout: function() {
      
        let prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        let prefServiceBranch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");

        if (prefServiceBranch.getPrefType('extensions.qfo.shoutcloud')) {
           
            let prefs = prefService.getBranch("extensions.qfo.");
            return prefs.getBoolPref("shoutcloud"); 
        }
        return false;
    },

    isAlwaysPlain: function() {
        
        let prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        let prefServiceBranch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");

        if (prefServiceBranch.getPrefType('extensions.qfo.plaintext')) {
            
            let prefs = prefService.getBranch("extensions.qfo.");
			return prefs.getBoolPref("plaintext"); 
        }
        return false;
    },
	
    isWorkingInFirst: function() {
       
        let prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        let prefServiceBranch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");

        if (prefServiceBranch.getPrefType('extensions.qfo.first')) {
           
    		let prefs = prefService.getBranch("extensions.qfo.");
			return prefs.getBoolPref("first"); 
        }
        return false;
    },
	
	  isSpamRemove: function() {
       
        let prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        let prefServiceBranch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");

        if (prefServiceBranch.getPrefType('extensions.qfo.spam')) {
            
            let prefs = prefService.getBranch("extensions.qfo.");
			return prefs.getBoolPref("spam"); 
        }
        return false;
    }
 

  
}

addEventListener("compose-send-message", function (event) {
QFO.insertFuckOff()
  }, true)
