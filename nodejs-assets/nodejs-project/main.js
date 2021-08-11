var rn_bridge = require('rn-bridge');

const OPERATIONS = {};

const sleep = milliseconds => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
const randomString = () => Math.random().toString()

const waitOperation = (id, resolve) => {
  function check() {
    if (OPERATIONS[id] === 'loading') {
      setTimeout(() => check(), 50)
    } else {
      const res = OPERATIONS[id];
      OPERATIONS[id] = null;
      resolve(res);
    }
  }

  check();
}

const create = (name, data) => {
  return new Promise((resolve) => {
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

    waitOperation(id, resolve);
  });
}

const find = (name, query, args) => {
  return new Promise((resolve) => {
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

    waitOperation(id, resolve);
  })
}

async function realmSampleCode(resultsCallback) {
  const users = await find('User', '');

  if (users && users.length > 0) {
    resultsCallback('FOUND IT : ' + JSON.stringify(users));
  } else {
    await create('User', { email: 'Julien' });
    resultsCallback('CREATED : ' + JSON.stringify(await find('User', '')));
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
