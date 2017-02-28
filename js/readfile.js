"use strict"

const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const files = function(path){
  var s = fs.readdirSync(path)
  return s
}
exports.files = files
