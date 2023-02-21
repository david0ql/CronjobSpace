const { exec } = require("child_process");

const diskSpaceService = () => {
  return new Promise((resolve, reject) => {
    exec(
      "df / | grep / | awk '{ print $5}' | sed 's/%//g'",
      (_, stdout, __) => {
        resolve(stdout);
      }
    );
  });
};

const diskStructureService = () => {
  return new Promise((resolve, reject) => {
    exec("ls -la", (_, stdout, __) => {
      resolve(stdout);
    });
  });
};

const diskStatus = async () => {
  const data = await Promise.all([diskSpaceService(), diskStructureService()]);
  return {
    space: data[0],
    structure: data[1]
  };
};

module.exports = diskStatus;
