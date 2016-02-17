function submitURL() {
  var adRequestURL = document.getElementById("adrequest").value;
  //adRequestURL = encodeURIComponent(adRequestURL);

  adResponse = document.getElementById("adresponse");
  adResponse.innerHTML = "retrieving response";

  loadURL(adRequestURL);
}

function loadURL(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.readyState == 4) {
      if (xmlHttp.status == 200) {
        console.log("correctly fetched");
        callback(xmlHttp.responseText);
      }
      else {
        console.log("wrong status");
        console.log(xmlHttp.status);
      }
    }
  }
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
}

function callback(text) {
  var adResponse = document.getElementById("adresponse");

  /*
  var xmlText = new XMLSerializer().serializeToString(xml);
  var xmlTextNode = document.createTextNode(xmlText);
  adResponse.innerHTML = "";
  adResponse.appendChild(xmlTextNode);
  */
  var xmlTextNode = document.createTextNode(text);
  adResponse.innerHTML = "";
  adResponse.appendChild(xmlTextNode);

  parseXML(text);
}

function parseXML(text) {
  var parser = new DOMParser();
  var xml = parser.parseFromString(text, "text/xml");

  console.log(xml.getElementsByTagName("VAST"));
  xml = xml.getElementsByTagName("VAST")[0];
  console.log(xml);

  /*
  if(!xml.getElementsByTagName("Error")[0] == undefined) {
    console.log("no ad");
    return;
  }
  */

  var version = xml.getAttribute("version");

  if(version == "3.0") {
    console.log("VAST 3.0");

    var creativeURL = xml.getElementsByTagName("MediaFile")[0].childNodes[0].data;
    var creativeType = xml.getElementsByTagName("MediaFile")[0].getAttribute("type");
    console.log(creativeURL);
    console.log(creativeType);

    createPlayer(creativeURL, creativeType);

    videoFunctions();

  } else if (version == "2.0") {
    console.log("VAST 2.0");
  } else {
    console.log("unknown version of vast");
  }
}

function createPlayer(url, type) {
  document.getElementById("yoshiplayer").remove();

  var video = document.createElement("video");
  video.id = "yoshiplayer";
  video.width = "320";
  video.height = "240";
  video.setAttribute("controls", "");
  video.setAttribute("autoplay", "");

  document.getElementById("videodiv").appendChild(video);

  var source = document.createElement("source");
  source.src = url;
  source.type = type;

  document.getElementById("yoshiplayer").appendChild(source);

}

function videoFunctions() {
  document.getElementById("yoshiplayer").addEventListener('ended', videoComplete, false);
}

function videoComplete() {
  console.log("video completed");
}
