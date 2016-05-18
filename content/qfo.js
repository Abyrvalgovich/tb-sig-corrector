var QFO = {
   

    insertFuckOff: function() {
       
		
		
let editor = GetCurrentEditor();
let editor_type = GetCurrentEditorType();
     
let prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
let prefServiceBranch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
let prefs = prefService.getBranch("extensions.qfo.");
       
						
			

var composeFields;

 composeFields = gMsgCompose.compFields;
 

 

 
 if (QFO.isSpamRemove())
	 
	 {
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


	
	
	
	if (QFO.isShout() || QFO.isAlwaysPlain()) {	
		
////////////////
editor.beginTransaction();

editor.selectAll();

var fulltext = editor.outputToString('text/html', 1);	

editor.beginningOfDocument();
            
editor.endTransaction();
///////////////		

Application.console.log(fulltext);

var checkSig = /(cols=".{1,3}">)([\s\S]*?)(<\/pre>)/i;

var checkNotFirst = /<blockquote cite|moz-forward-container/;

var notFirst = checkNotFirst.test(fulltext);

Application.console.log("Not first:" + notFirst);




if (notFirst) {
	var checkmessagebodybeforequote = /([\s\S]*?)<blockquote cite|moz-forward-container/;
	
	var textbodybeforequote = fulltext.match(checkmessagebodybeforequote); 

Application.console.log("Text -quote: " + textbodybeforequote[1]);

var sigHere = checkSig.test(textbodybeforequote[1]);
	
	
} else {
	
	var sigHere = checkSig.test(fulltext);
	
}


Application.console.log("Sig here:" + sigHere);
	


if (QFO.isShout() && (sigHere)) {	
	
var checkTo = /[-_A-Za-z0-9\.]+(@|.)DOMAINNAME.com/ig;

var checkEmails = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/ig;



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



 var internally = (truedrwebTo + truedrwebCC) > ((trueallTo + trueallCC) / 2) ? true : false;




if ((internally) && ((QFO.isWorkingInFirst()) || (notFirst))) {	



	
	
	var shortSig = prefs.getComplexValue("short",
      Components.interfaces.nsISupportsString).data;
	
	
	var shortSigReady = "$1" + shortSig + "$3";
	

	
    var newtext = fulltext.replace(checkSig,shortSigReady);
				  


editor.beginTransaction();

editor.selectAll();
            
editor.insertHTML(newtext);

editor.beginningOfDocument();

editor.endTransaction();



}

			
			
			
			
			
}


if (QFO.isAlwaysPlain() && (sigHere)) {	
	

var checkmessagebody = /([\s\S]*?)(<pre)/i;
var checkforkeywords = /(Hello|hi,|hi\s|hi\b|good day|regards|sincerely yours|thank|sure|of course|good afternoon|good evening|good morning|good night|dear)/i;

var textbody = fulltext.match(checkmessagebody); 

var foreign = checkforkeywords.test(textbody[1]);




if (foreign) {	





var checkSig = /(cols=".{1,3}">)([\s\S]*?)(<\/pre>)/;


	
	var engSig = prefs.getComplexValue("eng",
      Components.interfaces.nsISupportsString).data;              
				  
				  
	var engSigReady = "$1" + engSig + "$3";
	

	
                  var newtext = fulltext.replace(checkSig,engSigReady);

				  Application.console.log(fulltext);
Application.console.log(newtext);	

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
