var resedentialAssociationsSrc = "http://www.window.google.com/maps/d/u/0/kml?forcekml=1&mid=1EhA2C9e8eKnb1edGd8gyBj0yhTY&ver=" + Date.now();

var torontoCenter = { lat: 43.72, lng: -79.3849 };
var torontoBounds = { north: 43.9, east: -78.75, south: 43.56, west: -80 };

function captureOpen() {
  var capture = document.getElementById("capture");
  if (!capture.classList.contains("open")) {
    capture.classList.add("open");
  }
}

// function captureClose() {
//   var capture = document.getElementById("capture");
//   if (capture.classList.contains("open")) {
//     capture.classList.remove("open");
//   }
// }

// document.getElementById("capture-close").addEventListener("click", captureClose);

function createFeatureItem(title, content) {
  return "<div class='feature-item'><div class='feature-item-title'>" + title + "</div>" + content + "</div>";
}

function toCapitalCase(str) {
  var lowerStr = str.toLowerCase();
  var capitalStr = lowerStr.replace(/\b\w/g, function(c){ return c.toUpperCase() });
  return capitalStr;
}

function clickHandler(event) {
  var name = "";
  var content = "";
  if (event.featureData) {
    var nameItem = createFeatureItem("name", event.featureData.name);
    var descriptionItem = createFeatureItem("description", event.featureData.description || "");
    name = event.featureData.name;
    content += nameItem + descriptionItem;
  } else {
    name = toCapitalCase(event.feature.getProperty("name"));
    event.feature.forEachProperty(function(value, key) {
      var item = createFeatureItem(key, key === "name" ? toCapitalCase(value) : value);
      content += item;
    });
  }
  var captureTitle = document.getElementById('capture-title');
  var captureContent = document.getElementById('capture-content');
  captureTitle.innerHTML = name;
  captureContent.innerHTML = content;
  captureOpen();
}

function wardClickHandler(event) {
  var name = event.feature.getProperty("AREA_NAME");
  var nameItem = createFeatureItem("name", name);
  var wardNumber = event.feature.getProperty("AREA_S_CD");
  var wardItem = createFeatureItem("ward", wardNumber);
  var content = nameItem + wardItem;
  var captureTitle = document.getElementById('capture-title');
  var captureContent = document.getElementById('capture-content');
  captureTitle.innerHTML = name;
  captureContent.innerHTML = content;
  captureOpen();
}

function toggleLayer(element, layer, map) {
  element.checked ? layer.setMap(map) : layer.setMap(null);
}

function initMap() {
  var map = new window.google.maps.Map(document.getElementById('map'), {
    minZoom: 11,
    zoom: 11,
    center: torontoCenter,
    restriction: {
      latLngBounds: torontoBounds,
      strictBounds: false
    },
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControlOptions: {
      position: window.google.maps.ControlPosition.RIGHT_TOP
    }
  });

  map.data.loadGeoJson("data/toronto-boundary.json");
  map.data.setStyle({ strokeWeight: 0, fillOpacity: 0.3, clickable: false });

  var raKmlLayer = new window.google.maps.KmlLayer(resedentialAssociationsSrc, {
    suppressInfoWindows: true,
    preserveViewport: true,
    map: map
  });
  raKmlLayer.addListener('click', clickHandler);

  var wardLayer = new window.google.maps.Data();
  wardLayer.loadGeoJson("data/toronto-wards.json");
  wardLayer.setStyle({ fillColor: "transparent", strokeColor: "red", strokeWeight: 2, zIndex: 1 });
  wardLayer.addListener('click', wardClickHandler);
  wardLayer.addListener('mouseover', function(e) {
    wardLayer.revertStyle();
    wardLayer.overrideStyle(e.feature, {
      fillColor: "red"
    });
  });
  wardLayer.addListener('mouseout', function(e) {
    wardLayer.revertStyle();
  });

  var libraryLayer = new window.google.maps.Data();
  libraryLayer.loadGeoJson("data/toronto-libraries.json")
  libraryLayer.setStyle({
    icon: {
      url: "http://maps.window.google.com/mapfiles/ms/icons/blue-dot.png",
      scaledSize: new window.google.maps.Size(32, 32)
    },
    zIndex: 2
  })
  libraryLayer.addListener('click', clickHandler);
  libraryLayer.addListener('mouseover', function(e) {
    libraryLayer.revertStyle();
    libraryLayer.overrideStyle(e.feature, {
      icon: {
        url: "http://maps.window.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new window.google.maps.Size(38, 38)
      }
    });
  });
  libraryLayer.addListener('mouseout', function(e) {
    libraryLayer.revertStyle();
  });

  var publicSchoolLayer = new window.google.maps.Data();
  publicSchoolLayer.loadGeoJson("data/toronto_schools.geojson.json")
  publicSchoolLayer.setStyle({
    icon: {
      url: "http://maps.window.google.com/mapfiles/ms/icons/red-dot.png",
      scaledSize: new window.google.maps.Size(32, 32)
    },
    zIndex: 2
  })
  publicSchoolLayer.addListener('click', clickHandler);
  publicSchoolLayer.addListener('mouseover', function(e) {
    publicSchoolLayer.revertStyle();
    publicSchoolLayer.overrideStyle(e.feature, {
      icon: {
        url: "http://maps.window.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(38, 38)
      }
    });
  });
  publicSchoolLayer.addListener('mouseout', function(e) {
    publicSchoolLayer.revertStyle();
  });

  var communityCentresLayer = new window.google.maps.Data();
  communityCentresLayer.loadGeoJson("data/community_centres.geojson.json")
  communityCentresLayer.setStyle({
    icon: {
      url: "http://maps.window.google.com/mapfiles/ms/icons/green-dot.png",
      scaledSize: new window.google.maps.Size(32, 32)
    },
    zIndex: 2
  })
  communityCentresLayer.addListener('click', clickHandler);
  communityCentresLayer.addListener('mouseover', function(e) {
    communityCentresLayer.revertStyle();
    communityCentresLayer.overrideStyle(e.feature, {
      icon: {
        url: "http://maps.window.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new window.google.maps.Size(38, 38)
      }
    });
  });
  communityCentresLayer.addListener('mouseout', function(e) {
    communityCentresLayer.revertStyle();
  });

  var civicCentresLayer = new window.google.maps.Data();
  civicCentresLayer.loadGeoJson("data/civic_centres.geojson.json")
  civicCentresLayer.setStyle({
    icon: {
      url: "http://maps.window.google.com/mapfiles/ms/icons/purple-dot.png",
      scaledSize: new window.google.maps.Size(32, 32)
    },
    zIndex: 2
  })
  civicCentresLayer.addListener('click', clickHandler);
  civicCentresLayer.addListener('mouseover', function(e) {
    civicCentresLayer.revertStyle();
    civicCentresLayer.overrideStyle(e.feature, {
      icon: {
        url: "http://maps.window.google.com/mapfiles/ms/icons/purple-dot.png",
        scaledSize: new window.google.maps.Size(38, 38)
      }
    });
  });
  civicCentresLayer.addListener('mouseout', function(e) {
    civicCentresLayer.revertStyle();
  });

  var meetingPlacesToggle = document.getElementById("toggle-meeting-places");
  meetingPlacesToggle.addEventListener('click', function() {
    toggleLayer(meetingPlacesToggle, libraryLayer, map);
    toggleLayer(meetingPlacesToggle, publicSchoolLayer, map);
    toggleLayer(meetingPlacesToggle, communityCentresLayer, map);
    toggleLayer(meetingPlacesToggle, civicCentresLayer, map);
  });

  var wardToggle = document.getElementById("toggle-bounds");
  wardToggle.addEventListener('click', function() { toggleLayer(wardToggle, wardLayer, map) });
}

export default initMap