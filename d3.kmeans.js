'use strict';
function kmeans(arrayToProcess, numberOfClusters, accessor) {
    var groups = new Array();
    var centroids = new Array();
    var oldCentroids = new Array();
    var changed = false;

    if (!accessor) {
      accessor = function(d) { return d; };
    }

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
          distance = Math.abs(centroids[j] - accessor(arrayToProcess[i]));
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
      for (j = 0 ; j < numberOfClusters; j++ ) {
        var total = 0;
        var newCentroid = 0;
        for (i=0; i < groups[j].length; i++) {
          total += accessor(groups[j][i]);
        } 
        newCentroid = total / groups[newGroup].length;  
        centroids[j] = newCentroid;
      }

      for (j=0;j < numberOfClusters; j++ ) {
        if (centroids[j] != oldCentroids[j]) {
          changed = true;
        }
      }
    } while (changed == true);
    return groups;
}
if (typeof d3 !== "undefined") {
  d3.kmeans = kmeans;
}
