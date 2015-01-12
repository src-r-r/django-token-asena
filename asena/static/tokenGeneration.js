// Default values

console.log("Hello, world!");

ASENA_TOKEN_GET_TOKEN_URL='/token/generate';

/**
 * NOTE: To be used for Django testing only!
 **/
TEST_ASENA_TOKEN_GET_TOKEN_URL='http://localhost:8000/token/generate';

function ajaxRequest(){
    // Thanks to http://tinyurl.com/5mmjcj for the boilerplate code!
    var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]    //  activeX 
                                                                //  versions     
                                                                //  to check for
                                                                //  in IE
                                                                
    if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first 
                                // (as XMLHttpRequest in IE7 is broken)
        for (var i=0; i<activexmodes.length; i++){
            try{
                return new ActiveXObject(activexmodes[i])
            }
            catch(e){
                //suppress error
            }
        }
    }
    else if (window.XMLHttpRequest) // if Mozilla, Safari etc
        return new XMLHttpRequest()
        else
            return false
}

//Sample call:
//var myajaxrequest=new ajaxRequest()

/**
 * Get the parent element of the element.
 * Recursively get the parent until either the parent or the "BODY" 
 * element is reached. See http://tinyurl.com/kngq4 for parentNode details and
 * http://tinyurl.com/kngq4 for nodeName details.
 * @name getParent
 * @param element The HTML DOM element
 * @param tag The tag name, e.g. "FORM". Must be in upper-case to comply with
 *            W3C standards.
 * @return The parent element, or ``null`` if not found.
 **/
function getParent(element, tag){
    parent = element.parentNode;
    if (parent.nodeName == "BODY") {
        console.warn("getParent(): Reached body. Tag %s not found", tag);
        return null;
    } else if (parent.nodeName == tag) {
        console.log("getParent(): `%s' found. Returning", tag);
        return parent;
    }
    console.log("Getting parent for %s", element.nodeName)
    return getParent(parent, tag);
}

function getChild(element, name){
    nm = element.getAttribute("name");
    
    if (element.nodeName == name){
        console.log("getChild(): Found %s", element);
        return element;
    }
    
    children = element.children;
    
    for (var i = 0; i < children.length; ++i){
        var c = element.children[i];
        console.log("getChild(): Checking child %s", c.nodeName);
        if (c != null){
            console.log("getChild(): Found %s", c.nodeName);
            return c;
        }
    }
    console.warn("getChild(): Child not found!");
    return null;
}

function fillSelectList(field, stringResult){
    var results = stringResult.split(',');
    console.log("Filling with %d results", results.length);
    // First, clear the list.
    field.innerHTML = "";
    for (var i = 0; i < results.length; ++i){
        res = results[i];
        option = '<option value="' + res + '">' + res + '</option>\n';
        console.log("Appending %s to element.", option);
        field.innerHTML = field.innerHTML + option;
    }
}

function isSelectMultiple(element){
    if (element != null)
        return (element.getAttribute('name') == 'INPUT' &&
            element.getAttribute('type') == 'SELECT' &&
            element.getAttribute('multiple') != null);
    return false;
}

function generateAsenaTokens(element_id){
    
    var button = document.getElementById(element_id);
    var parentForm = getParent(button, "FORM");
    
    var selectField = getChild(parentForm, "SELECT");
    
    if (selectField == null){
        console.error("generateAsenaTokens(): selectField is null! " +
                "Stopping...");
        return;
    }
    
    var mygetrequest=new ajaxRequest();
    
    // Set up a callback
    mygetrequest.onreadystatechange=function(){
        if (mygetrequest.readyState==4){
            if (mygetrequest.status==200 || 
                window.location.href.indexOf("http")==-1){
                    console.log("Got response:");
                    console.log(mygetrequest.responseText);
                    fillSelectList(selectField, mygetrequest.responseText)
                }
            else{
                console.error("An error has occured making the request");
            }
        }
    }
    
    // Get the values from the fields. This will require a bit of detective
    // work. We need to find the elements by id instead of name since the ID 
    // may change from form to form.
    
    var countElement = getChild(parentForm, "count");
    var lengthElement = getChild(parentForm, "length");
    
    var count = countElement.value;
    var length = lengthElement.value;
    
    if (count == null)
        count = '';
    if (length == null)
        length = '';
    
    console.log("Count is %d and length is %d", count, length);
    
//     var baseUrl = ASENA_TOKEN_GET_TOKEN_URL;
//     var baseUrl = TEST_ASENA_TOKEN_GET_TOKEN_URL;
    var baseUrl = '';
    
    // Open and send the request.
    var requestUrl = baseUrl + "/" + count + "/" + length;
    console.log("Querying %s", requestUrl);
    mygetrequest.open("GET", requestUrl, true);
    mygetrequest.send(null);
}