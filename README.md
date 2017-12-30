# d3-kmeans

A simple, lightweight k-means clustering algorithm implemented in javascript for d3.

d3-kmeans uses the same pattern as d3, you can provide the accessor to cluster the data:

```js
var clusters = d3.kmeans(dataset, 3, function(d) { return d.value; });
```

Multi-dimensional data is also possible:

```js
var clusters = d3.kmeans(dataset, 3, function(d){ return [d.x, d.y, d.z]});
```