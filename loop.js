let kumu = require('./array2.json')

function findNextConnections(index) {
  let list = [];
  for(let i=0;i<kumu.length;i++) {
    if(index == i) {
      continue;
    }

    if(kumu[index][1] == kumu[i][0]) {
      list.push(i);
    }
  }

  return list;
}

function getLoop(trace, current) {
  //console.log('getLoop', trace, current, kumu[current][0]);
  if(kumu[current][1] == kumu[trace[0]][0]) {
    return [current];
  }

  if(trace.includes(current)) {
    return [];
  }

  let next = findNextConnections(current);
  if(next.length == 0) {
    return [];
  }

  for(let i=0;i<next.length;i++) {
    let tmp = [...trace];
    tmp.push(current)
    //console.log('aaa')
    let result = getLoop(tmp, next[i]);
    if(result.length > 0) {
      result.push(current);
    }
    return result;
  }
}

for(let j=0;j<kumu.length;j++) {
  let next = findNextConnections(j);

  //console.log(kumu[j][0]);
  for(let i=0;i<next.length;i++) {
    let tmp = [];
    tmp.push(j);
    //console.log('bbb')
    let result = getLoop(tmp, next[i]);
    if(result.length > 0) {
      result.push(j);

      let nodes = [];
      for(let j=0;j<result.length;j++) {
        nodes.push(kumu[result[j]][0]);
      }
      console.log(nodes, "\n");
    }
  }

}
