import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import net from 'node:net';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

function findLanIp() {
  const interfaces = os.networkInterfaces();
  const preferredInterfaces = ['en0', 'en1', 'Wi-Fi', 'WiFi'];

  for (const interfaceName of preferredInterfaces) {
    const entries = interfaces[interfaceName] ?? [];
    const match = entries.find(entry => entry && entry.family === 'IPv4' && !entry.internal);
    if (match?.address) {
      return match.address;
    }
  }

  for (const entries of Object.values(interfaces)) {
    const match = (entries ?? []).find(entry => entry && entry.family === 'IPv4' && !entry.internal);
    if (match?.address) {
      return match.address;
    }
  }

  return null;
}

function spawnProcess(command, args, extraEnv) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...extraEnv,
    },
  });

  child.on('exit', code => {
    if (code !== 0) {
      process.exitCode = code ?? 1;
    }
  });

  return child;
}

function isPortOpen(port) {
  return new Promise(resolve => {
    const socket = new net.Socket();
    const finish = isOpen => {
      socket.destroy();
      resolve(isOpen);
    };

    socket.setTimeout(400);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, '127.0.0.1');
  });
}

const lanHost = findLanIp();
if (!lanHost) {
  console.error('Unable to detect a LAN IPv4 address. Connect to Wi-Fi first.');
  process.exit(1);
}

console.log(`Using LAN host ${lanHost}`);

const currentDir = dirname(fileURLToPath(import.meta.url));
const generatedHostFile = resolve(currentDir, '../src/config/devHost.generated.ts');
writeFileSync(generatedHostFile, `export const developmentLanHost = ${JSON.stringify(lanHost)};\n`);

const run = async () => {
  const shouldStartTravelApi = !(await isPortOpen(3001));
  const shouldStartMetro = !(await isPortOpen(8081));

  if (shouldStartTravelApi) {
    spawnProcess('npm', ['run', 'travel-api:lan'], {
      HOST: '0.0.0.0',
    });
  } else {
    console.log('Travel API already running on port 3001.');
  }

  if (shouldStartMetro) {
    spawnProcess('npm', ['run', 'start:lan'], {
      LAN_DEV_HOST: lanHost,
    });
  } else {
    console.log('Metro already running on port 8081.');
  }

  if (!shouldStartTravelApi && !shouldStartMetro) {
    console.log('Both dev services are already running.');
  }
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
