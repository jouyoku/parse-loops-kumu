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
  for(let j=0;j<loop.length;j++) {
    tmp.push(kumu[loop[j]][0]);
    if(kumu[loop[j]][3] == '-') {
      minus++;
    }
  }
  let type = 'R';
  if((minus % 2) == 1) {
    type = 'B';
  }
  let row = [];
  row.push(type);
  row.push(tmp.length);
  row.push(tmp);
  final2.push(row);
}

console.log(JSON.stringify(final2), final2.length);
