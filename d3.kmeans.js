'use strict';
function kmeans(arrayToProcess, numberOfClusters, accessor) {
  var groups = new Array();
  var centroids = new Array();
  var oldCentroids = new Array();
  var changed = false;
  /*
   * 1. no accessor provided
   * 2. accessor returns a single value (1-dimensional)
   * 3. accessor returns an array (multi-dimentioanl)
   */
  if (!accessor) {
    accessor = function (d) { return [d]; };
  }

  var dist = function (a, b) {
    a = (typeof a === Array) ? a : [a];
    b = (typeof b === Array) ? b : [b];
    if (a.length !== b.length) {
      throw "Number of dimensions not aligned between data points."
    }

    var ds = 0;
    for (var i = 0; i < a.length; i++) {
      ds += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(ds);
  };

  var calCentroid = function (group) {
    var centroid = [];
    var dim = group[0].length;
    for (var i = 0; i < dim; i++) {
      centroid.push(
        group.map(function (p) { return p[i]; })
          .reduce(function (prevVal, currVal) {
            return prevVal + currVal;
          }, 0) / group.length);
    }
    return centroid;
  };

  var moveCentroids = function (groups) {
    return groups.map(calCentroid);
  };

  var identicalCoordinate = function(a, b) {
    for (var d = 0; d <= a.length; d++) {
      if (a[d] !== b[d]) return false;
    }
    return true;
  };

  var existsIn = function(basket, p) {
    for(var j = 0; j <= basket.length; j++) {
      if (identicalCoordinate(basket[j], p)) {
        return true;
      }
    }
    return false;
  };

  var centroidsChanged = function (oldSet, currSet) {
    // every old centroid should be found in new set, otherwise consider centroids changed
    for (var i = 0;i < oldSet.length; i++) {
      if (!existsIn(currSet, oldSet[i])) return true;
    }
    return false;
  };

  // initialise group arrays
  for (var initGroups = 0; initGroups < numberOfClusters; initGroups++) {
    groups[initGroups] = new Array();
  }

  // hop for systemical sampling
  var hop = Math.round(arrayToProcess.length / (numberOfClusters + 1));
  var i, j, idx;

  for (i = 0; i < numberOfClusters; i++) {
    idx = hop * (i + 1);
    centroids[i] = accessor(arrayToProcess[idx]);
  }

  do {
    for (j = 0; j < numberOfClusters; j++) {
      groups[j] = [];
    }

    changed = false;

    for (i = 0; i < arrayToProcess.length; i++) {
      var distance = -1;
      var oldDistance = -1
      var newGroup;
      for (j = 0; j < numberOfClusters; j++) {
        distance = dist(centroids[j], accessor(arrayToProcess[i]));
        if (oldDistance == -1) {
          oldDistance = distance;
          newGroup = j;
        } else if (distance <= oldDistance) {
          newGroup = j;
          oldDistance = distance;
        }
      }
      groups[newGroup].push(arrayToProcess[i]);
    }

    oldCentroids = centroids;
    centroids = moveCentroids(groups);
    changed = centroidsChanged(oldCentroids, centroids);
  } while (changed == true);

  return groups;
}
if (typeof d3 !== "undefined") {
  d3.kmeans = kmeans;
}
