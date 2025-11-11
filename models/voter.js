const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  "Assembly Constituency No": Number,
  "Assembly Constituency Name": String,
  "Reservation Status": String,
  "Part No": Number,
  "Section Name": String,
  "Polling Station No": Number,
  "Polling Station Name": String,
  "Polling Station Address": String,
  "Serial No": Number,
  "EPIC No": String,
  "Name": String,
  "Relation Name": String,
  "Relation Type": String,
  "House No": String,
  "Age": Number,
  "Gender": String,
  "Photo Available": String,
  "mobileNumber": String
}, { collection: 'electiondata' });

module.exports = mongoose.model('Voter', voterSchema);
