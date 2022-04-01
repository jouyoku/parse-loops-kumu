
let kumu = require('./kumu-cid-tfrd-gta.json')
let elements = kumu.elements;

function getElement(id) {
  for(let i=0;i<elements.length;i++) {
    if(elements[i]['_id'] == id) {
      return elements[i];
    }
  }
}

function rearrange(connections) {
  let list = [];
  for(let i=0;i<connections.length;i++) {
    if(connections[i]['attributes']['connection type'] == '+'
    || connections[i]['attributes']['connection type'] == '-') {
      if(connections[i]['attributes']['label']
      && connections[i]['attributes']['label'].length > 0) {
        if(connections[i]['reversed']) {
          let tmp = connections[i]['from'];
          connections[i]['from'] = connections[i]['to'];
          connections[i]['to'] = tmp;
          connections[i]['reversed'] = false;
        }
        list.push(connections[i]);
        continue;
      }
    }
    if(connections[i]['attributes']['connection type'] == 'Flow') {
      if(connections[i]['reversed']) {
        let tmp = connections[i]['from'];
        connections[i]['from'] = connections[i]['to'];
        connections[i]['to'] = tmp;
        connections[i]['reversed'] = false;
      }
      connections[i]['attributes']['connection type'] = '+';
      list.push(connections[i]);

      //continue;

      let from = getElement(connections[i]['from']);
      let to = getElement(connections[i]['to']);
      if(from['attributes']['element type'] == 'Stock'
      && to['attributes']['element type'] == 'Flow') {
        //console.log(from['attributes']['label'], to['attributes']['label'])
        list.push({
          '_id': 'cid-conn-' + i,
          'attributes': {
            'connection type': "-",
            'label': connections[i]['attributes']['label'],
            'tags': connections[i]['attributes']['tags']
          },
          'from': connections[i]['to'],
          'to': connections[i]['from']
        });
      }
      continue;
    }
  }
  return list;
}

let connections = rearrange(kumu.connections);
//console.log(connections.length, elements.length);

function findNextConnections(connection) {
  let list = [];
  for(let i=0;i<connections.length;i++) {
    if(connections[i]['_id'] == connection['id']) {
      continue;
    }

    if(connection['to'] == connections[i]['from']) {
      list.push(connections[i]);
    }
  }

  return list;
}

function getLoop(start, current) {
  console.log(getElement(current['from'])['attributes']['label']);
  if(current['to'] == start['from']) {
    return [current];
  }

  let next = findNextConnections(current);
  if(next.length == 0) {
    return [];
  }

  for(let i=0;i<next.length;i++) {
    let result = getLoop(start, next[i]);
    if(result.length > 0) {
      result.push(current);
    }
    return result;
  }
}

for(let j=0;j<connections.length;j++) {
  let next = findNextConnections(connections[j]);
  console.log("\n\n\n");
  console.log(getElement(connections[j]['from'])['attributes']['label']);
  for(let i=0;i<next.length;i++) {
    let result = getLoop(connections[j], next[i]);
    if(result.length > 0) {
      result.push(connections[j]);
      console.log(result);
    }
  }
}
