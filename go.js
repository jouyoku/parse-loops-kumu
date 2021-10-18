let kumu = require('./connections.json')

function findNextConnections(index) {
  let list = [];
  for (let i = 0; i < kumu.length; i++) {
    if (index == i) {
      continue;
    }

    if (kumu[index][1] == kumu[i][0]) {
      list.push(i);
    }
  }

  return list;
}

let nexts = [];
for (let i = 0; i < kumu.length; i++) {
  let next = findNextConnections(i);
  nexts.push(next);
}

//console.log(JSON.stringify(nexts));

let loops = [];

function forward(trace0) {
  let next = nexts[trace0[trace0.length - 1]];
  for(let i=0;i<next.length;i++) {
    let trace = [];
    for(let j=0;j<trace0.length;j++) {
      trace.push(trace0[j]);
    }
    let connection = next[i];
    if(connection == trace[0]) {  //found
      //trace.push(connection);
      loops.push(trace);
      continue;
    }
    if(trace.includes(connection)) {
      continue;
    }
    trace.push(connection);
    forward(trace);
  }
}

for (let i=0;i<nexts.length; i++) {
  let tmp = [];
  tmp.push(i);
  let trace = forward(tmp);
}

//console.log(JSON.stringify(loops), loops, loops.length);

const equals = (a, b) =>
  a.length === b.length &&
  a.every((v, i) => v === b[i]);

let final = [];
for(let i=0;i<loops.length;i++) {
  let loop = loops[i];
  let same = false;
  for(let j=0;j<final.length;j++) {
    let length = loop.length;
    for(let k=0;k<length;k++) {
      if(equals(final[j], loop)) {
        same = true;
      }
      loop.unshift(loop.pop());
    }
  }
  if(!same) {
    final.push(loops[i]);
  }
}

final.sort(function(a, b) {
  return a.length - b.length;
});

//console.log(JSON.stringify(final), final, final.length);

let final2 = [];
for(let i=0;i<final.length;i++) {
  let loop = final[i];
  let tmp = [];
  let minus = 0;
  let occured = false;
  for(let j=0;j<loop.length;j++) {
    for(let k=0;k<tmp.length;k++) {
      if(tmp[k] == kumu[loop[j]][0]) {
        occured = true;
        break;
      }
    }
    if(occured) {
      break;
    }
    tmp.push(kumu[loop[j]][0]);
    if(kumu[loop[j]][3] == '-') {
      minus++;
    }
  }
  if(occured) {
    continue;
  }
  if(tmp.length < 3) {
    continue;
  }
  let type = 'R';
  if((minus % 2) == 1) {
    type = 'B';
  }
  let row = [];
  row.push(type + (final2.length + 1));
  row.push(tmp.length);
  row.push(tmp);
  final2.push(row);
}

console.log(JSON.stringify(final2), final2.length);

let tagNode = {};
let tagTie = {};
for(let i=0;i<final2.length;i++) {
  let nodes = final2[i][2];
  for(let j=0;j<nodes.length;j++) {
    let node = nodes[j];
    let tie = node + "-" + nodes[(j + 1) % nodes.length];
    if(!tagNode.hasOwnProperty(node)) {
      tagNode[node] = 'lp' + (i+1);
    } else {
      tagNode[node] = tagNode[node] +' | lp' + (i+1);
    }

    if(!tagTie.hasOwnProperty(tie)) {
      tagTie[tie] = 'lp' + (i+1);
    } else {
      tagTie[tie] = tagTie[tie] +' | lp' + (i+1);
    }
  }
}

console.log(JSON.stringify(tagNode), Object.keys(tagNode).length);
console.log(JSON.stringify(tagTie), Object.keys(tagTie).length);
