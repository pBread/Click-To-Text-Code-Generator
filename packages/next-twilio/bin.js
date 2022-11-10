const { promisify } = require("util");
const concurrently = require("concurrently");
const fs = require("fs");
const fsp = require("fs/promises");
const glob = require("glob-promise");
const path = require("path");
const Spinner = require("ora");

require("dotenv").config();

const shell = promisify(require("child_process").exec);

const { ACCOUNT_SID, AUTH_TOKEN } = process.env;
const twlo = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

const cwd = process.cwd();
const dist = path.resolve(cwd, ".twilio");

const assetsFrom = path.resolve("out");
const assetsTo = path.resolve(dist, "assets");

const fnsFrom = path.resolve(cwd, "pages", "api");
const fnsTo = path.resolve(dist, "functions", "api");

const infoFrom = path.join(dist, ".twiliodeployinfo");
const infoTo = path.join(cwd, ".twiliodeployinfo");

async function main() {
  switch (process.argv[2]) {
    case "build":
      await build();
      break;

    case "deploy":
      await deploy();
      break;

    case "help":
    default:
      console.log(``);
  }
}

main();

/****************************************************
 Build
****************************************************/
async function build() {
  // prepare folder
  await shell(`rm -f -r ${dist};`);
  await shell(`mkdir ${dist}`);

  await Promise.all([
    shell(`mkdir -p ${assetsTo}`),
    shell(`mkdir -p ${fnsTo}`),
    shell(`cp -f -p .env ${dist}/.env`),
    fs.existsSync(".twiliodeployinfo") && shell(`cp -f -p .twiliodeployinfo ${dist}/.twiliodeployinfo`),
  ]);

  // compile
  await concurrently(
    [
      {
        command: `next build; next export -o .twilio/assets;`,
        prefixColor: "gray",
        name: "next",
      },
      {
        command: `yarn babel ${fnsFrom} --config-file=next/babel --delete-dir-on-start --extensions \".ts\",\".js\" --out-dir ${fnsTo} || true`,
        prefixColor: "gray",
        name: "babel",
      },
    ],
    { prefix: "{name}\t" }
  );

  // create package.json
  const pkg = require(`${cwd}/package.json`);
  const { devDependencies, scripts, ..._pkg } = pkg;

  const apiFiles = await glob(`${fnsTo}/**/*.js`);

  const importedDeps = await Promise.all(
    apiFiles.map((file) =>
      fsp
        .readFile(file, { encoding: "utf-8" })
        .then((text) =>
          text.match(/require\("(.*)"\)/gi)?.map((match) => match.replace(/require\("/, "").replace(/"\)$/, ""))
        )
    )
  ).then((imports) => imports.flat());

  const dependencies = Object.entries(pkg.dependencies)
    .filter(([dep]) => importedDeps.includes(dep))
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

  await fsp.writeFile(`${dist}/package.json`, JSON.stringify({ ..._pkg, dependencies }, null, 2));
}

/****************************************************
 Deploy
****************************************************/
async function deploy() {
  await concurrently(
    [
      {
        command: `twilio serverless:deploy --cwd=.twilio --override-existing-project --password=${AUTH_TOKEN} --username=${ACCOUNT_SID};`,
        name: "twilio",
        prefixColor: "gray",
      },
    ],
    { prefix: "{name}\t" }
  );

  const infoText = await fsp.readFile(infoFrom);
  const svcSid = Object.values(JSON.parse(infoText))[0].serviceSid;

  await Promise.all([
    await twlo.serverless.services(svcSid).update({ uiEditable: true }),
    shell(`cp ${infoFrom} ${infoTo}`),
  ]);

  const lastBuild = await twlo.serverless
    .services(svcSid)
    .builds.list()
    .then((items) => items[0]);

  const pageAssetVersions = lastBuild.assetVersions.filter((asset) => /\.html$/i.test(asset.path));

  const newPageVersions = await Promise.all(pageAssetVersions.map(createVersion));

  const assetVersions = lastBuild.assetVersions.filter((asset) => !/\.html$/i.test(asset.path)).concat(newPageVersions);

  const newBuild = await twlo.serverless.services(svcSid).builds.create({
    accountSid: lastBuild.accountSid,
    assetVersions: assetVersions.map((it) => it.sid),
    dependencies: lastBuild.dependencies,
    functionVersions: lastBuild.functionVersions,
    serviceSid: lastBuild.serviceSid,
  });

  const spinner = Spinner("Publishing build").start();

  await publish(newBuild, "dev");
  spinner.stop();
}

async function createVersion({ asset_sid, path, service_sid }) {
  const contentPath = `${assetsTo}${path}`;
  const route = path.replace(/\.html$/i, "").replace(/index$/i, "");
  const command = `
    curl -X POST "https://serverless-upload.twilio.com/v1/Services/${service_sid}/Assets/${asset_sid}/Versions" \
        -F "Content=@${contentPath}; type=text/html" \
        -F "Path=${route}" \
        -F "Visibility=public" \
        -u "${ACCOUNT_SID}:${AUTH_TOKEN}"
  `;

  const result = await shell(command);
  return JSON.parse(result.stdout);
}

async function publish(build, env = "dev", envSid) {
  envSid = envSid
    ? envSid
    : await twlo.serverless
        .services(build.serviceSid)
        .environments.list()
        .then((it) => it.filter((i) => i.domainSuffix === env))
        .then((it) => it[0].sid);

  const status = await twlo.serverless
    .services(build.serviceSid)
    .builds(build.sid)
    .fetch()
    .then((it) => it.status);

  if (status === "failed") throw Error("Build Failed");
  if (status == "building") return publish(build, env, envSid);

  await twlo.serverless.services(build.serviceSid).environments(envSid).deployments.create({ buildSid: build.sid });
}
