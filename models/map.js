var mongoose = require('mongoose');

var Map = mongoose.Schema({
  title: {type: String, required: true};,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  lastModified: {type: Date, default: Date.now},
  graphData: {}
});

mongoose.model('Map', Map);