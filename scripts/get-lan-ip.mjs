import os from 'node:os';

const preferredInterfaces = ['en0', 'en1', 'Wi-Fi', 'WiFi'];

function findLanIp() {
  const interfaces = os.networkInterfaces();

  for (const name of preferredInterfaces) {
    const entries = interfaces[name] ?? [];
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

const lanIp = findLanIp();

if (!lanIp) {
  process.exitCode = 1;
  console.error('Unable to detect a LAN IPv4 address.');
} else {
  process.stdout.write(lanIp);
}
