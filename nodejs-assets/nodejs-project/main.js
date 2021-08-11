var rn_bridge = require('rn-bridge');

const OPERATIONS = {};

const sleep = milliseconds => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
const randomString = () => Math.random().toString()

const waitOperation = (id) => {
  while (true) {
    if (OPERATIONS[id] === 'loading') {
      sleep(50);
    } else {
      const res = OPERATIONS[id];
      OPERATIONS[id] = null;
      return res;
    }
  }
}

const create = (name, data) => {
  const id = randomString();
  OPERATIONS[id] = 'loading';

  rn_bridge.channel.post(
    'realm-create',
    {
      id,
      name,
      data,
    }
  );

  return waitOperation(id);
}

const find = (name, query, args) => {
  const id = randomString();
  OPERATIONS[id] = 'loading';

  rn_bridge.channel.post(
    'realm-find',
    {
      id,
      name,
      query,
      args,
    }
  );

  return waitOperation(id);
}

function realmSampleCode(resultsCallback) {
  const users = find('User', '');

  if (users && users.length > 0) {
    resultsCallback('FOUND IT : ' + JSON.stringify(users));
  } else {
    create('User', { email: 'Julien' });
    resultsCallback('CREATED : ' + JSON.stringify(find('User', '')));
  }
}

rn_bridge.channel.on('message', (msg) => {
  try {
    switch (msg) {
      case 'versions':
        rn_bridge.channel.send(
          "Versions: " +
          JSON.stringify(process.versions)
        );
        break;
      case 'realm':
        realmSampleCode((result) =>
          rn_bridge.channel.send(
            result
          )
        );
        break;
      default:
        rn_bridge.channel.send(
          "unknown request:\n" +
          msg
        );
        break;
    }
  } catch (err) {
    rn_bridge.channel.send("Error: " + JSON.stringify(err) + " => " + err.stack);
  }
});

rn_bridge.channel.on('realm-response', (data) => {
  rn_bridge.channel.send("ddddd: " + JSON.stringify(data || {}));

  if (data.id) {
    OPERATIONS[data.id] = data.data;
  }
});

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized. Versions: " + JSON.stringify(process.versions));
