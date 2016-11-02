/**
 * POC test for ALMighty REST API - goal is to create/delete NNN workitems daily and track 
 * the throughput to track trends over time
 * See: http://frisbyjs.com/
 * @author ldimaggi, pbhat
 * 
 * Prerequisites:
 * npm install --save-dev frisby
 * npm install -g jasmine-node
 * 
 * Run by: jasmine-node <script name>
 * 
 * TODO - Generate login token during test ("bin/alm-cli generate login -H demo.almighty.io")
 */

'use strict';

var frisby = require("frisby");
//var url = "http://demo.api.almighty.io/api/";
var url = "http://localhost:8080/api/";

/* frisby.globalSetup is used by all REST requests */
frisby.globalSetup({ 
  request: {
    headers: { 'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization' : 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IlRlc3QgRGV2ZWxvcGVyIiwiaW1hZ2VVUkwiOiIiLCJ1dWlkIjoiNGI4Zjk0YjUtYWQ4OS00NzI1LWI1ZTUtNDFkNmJiNzdkZjFiIn0.ML2N_P2qm-CMBliUA1Mqzn0KKAvb9oVMbyynVkcyQq3myumGeCMUI2jy56KPuwIHySv7i-aCUl4cfIjG-8NCuS4EbFSp3ja0zpsv1UDyW6tr-T7jgAGk-9ALWxcUUEhLYSnxJoEwZPQUFNTWLYGWJiIOgM86__OBQV6qhuVwjuMlikYaHIKPnetCXqLTMe05YGrbxp7xgnWMlk9tfaxgxAJF5W6WmOlGaRg01zgvoxkRV-2C6blimddiaOlK0VIsbOiLQ04t9QA8bm9raLWX4xOkXN4ubpdsobEzcJaTD7XW0pOeWPWZY2cXCQulcAxfIy6UmCXA14C07gyuRs86Rw'
             }
           }
});

/* Verify successful connection to REST API - access workitems endpoint */
var test1 = frisby.create('Should be successful in connecting to REST API - workitems endpoint')
  test1.get(url + 'workitems').expectStatus(200);
  // test1..inspectHeaders();
test1.toss();

/* Verify successful connection to REST API - access workitem types endpoint */
var test2 = frisby.create('Should be successful in connecting to REST API - workitem types endpoint')
  test2.get(url + 'workitemtypes').expectStatus(200);
  // test2.inspectHeaders();
test2.toss();

/* Verify successful creation and deletion of new workitems */

for (var i = 0; i < 10; i++) {

var test3 = frisby.create('Should be successful in creating new workitems')

  test3.post(url + 'workitems', {"type": "system.bug", "fields": { "system.title":"remove this workitem", "system.owner": "tjones", "system.state": "open", "system.creator":"jsmith" }},{ json: true })
  test3.expectHeaderContains('Content-Type', 'application/vnd.workitem+json');

  test3.expectStatus(201);
  // test3.inspectBody();

  test3.expectJSONTypes({
    id: String,    
    type: String,
    version: Number
  });

  test3.afterJSON(function(workitem) {
    console.log("workitem id = " + workitem.id);
    frisby.create('Get User')
      .get(url + 'workitems/' + workitem.id).expectStatus(200).inspectHeaders()
//      .delete(url + 'workitems/' + workitem.id).expectStatus(200).inspectHeaders()
    .toss()
  });
test3.toss();

}



