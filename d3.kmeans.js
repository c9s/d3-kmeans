'use strict';
function kmeans(arrayToProcess, numberOfClusters, accessor) {
    var groups = new Array();
    var centroids = new Array();
    var oldCentroids = new Array();
    var changed = false;

    if (!accessor) {
      accessor = function(d) { return [d]; };
    }

    var dist = function (a, b) {
      if (typeof a !== Array || typeof b !== Array) {
        throw "Accessor has to return an array of values."
      }
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
          group.map(function(p) { return p[i];})
              .reduce(function (prevVal, currVal, currIdx) {
                    return prevVal + currVal;
                  }) / group.length );
      }
      return centroid;
    };

    var moveCentroids = function(groups) {
      return groups.map(calCentroid);
    };

    var centroidsChanged = function(old, curr) {
      var ret = false;
      for (var i = 0; i < groups; i++) {
        ret = ret ||
        old.reduce(function(prevVal, currVal, j) {
          return prevVal ||
          currVal.reduce(function(prevVal, currVal, k){
            return prevVal || currVal !== curr[j][k];
          }, false);
        }, false);
      }
      return ret;
    };

    // initialise group arrays
    for (var initGroups = 0; initGroups < numberOfClusters; initGroups++ ) {
      groups[initGroups] = new Array();
    }

    // pick initial centroids
    var initialCentroids = Math.round(arrayToProcess.length / (numberOfClusters+1));
    var i, j, idx;

    for (i=0; i < numberOfClusters; i++) {
      idx = initialCentroids * (i+1);
      centroids[i] = accessor(arrayToProcess[idx]);
    }

    do {
      for( j=0; j < numberOfClusters; j++ ) {
        groups[j] = [];
      }

      changed = false;

      for (i=0; i < arrayToProcess.length; i++) {
        var distance = -1;
        var oldDistance = -1
        var newGroup;
        for (j=0; j < numberOfClusters; j++) {
          distance = dist(centroids[j], accessor(arrayToProcess[i]));
          if (oldDistance == -1) {
            oldDistance = distance;
            newGroup = j;
          } else if (distance <= oldDistance) {
            newGroup = j;
            oldDistance = distance;
          }
        }
        groups[newGroup].push( arrayToProcess[i] );
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
