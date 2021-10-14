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

function getLoop(trace, current) {
  if (kumu[current][1] == kumu[trace[0]][0]) {
    return [current];
  }

  if (trace.includes(current)) {
    return [];
  }

  let next = findNextConnections(current);
  if (next.length == 0) {
    return [];
  }

  for (let i = 0; i < next.length; i++) {
    let tmp = [...trace];
    tmp.push(current)
    let result = getLoop(tmp, next[i]);
    if (result.length > 0) {
      result.push(current);
    }
    return result;
  }
}

let loops = [];
let kumuLength = kumu.length;
for (let z = 0; z < kumuLength; z++) {
  for (let j = 0; j < kumu.length; j++) {
    let next = findNextConnections(j);

    for (let i = 0; i < next.length; i++) {
      let tmp = [];
      tmp.push(j);
      let result = getLoop(tmp, next[i]);
      if (result.length > 0) {
        result.push(j);

        let nodes = [];
        let count = 0;
        for (let j = 0; j < result.length; j++) {
          if(kumu[result[j]][3] == '-') {
            count++;
          }
          nodes.push(kumu[result[j]][0]);
        }
        let type = 'R';
        if((count % 2) == 1) {
          type = 'B'
        }

        let loop = [];
        loop.push(type);
        loop.push(nodes);
        loops.push(loop);
      }
    }

  }

  kumu.unshift(kumu.pop());

}

const equals = (a, b) =>
  a.length === b.length &&
  a.every((v, i) => v === b[i]);

let final = [];
for(let i=0;i<loops.length;i++) {
  let loop = loops[i][1];
  let same = false;
  for(let j=0;j<final.length;j++) {
    let length = loop.length;
    for(let k=0;k<length;k++) {
      if(equals(final[j][1], loop)) {
        same = true;
      }
      loop.unshift(loop.pop());
    }
  }
  if(!same) {
    final.push(loops[i]);
  }
}

console.log(final);
