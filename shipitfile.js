var commandExists = require("command-exists").sync;
if (!commandExists("rsync")) {
  throw "RSync not found in local system. Deployment WILL fail!";
}

module.exports = (shipit) => {
  require("shipit-deploy")(shipit);
  require("shipit-shared")(shipit);

  shipit.initConfig({
    default: {
      copy: false,
      deployTo: "/opt/apps/greeting-cards-freshcut",
      repositoryUrl: "git@github.com:start-jobs/giftCards-core.git",
      branch: "without-multinode",
      keepReleases: 1,
      keepWorkspace: true,
      shallowClone: true,
      ignores: [
        ".git",
        "node_modules",
        ".dependabot",
        ".idea",
        ".next",
        ".env",
        "coverage",
        ".DS_Store",
        "logs",
        "*.log",
        "config/tunnel.pid",
        ".editorconfig",
        ".env.example",
        ".eslintignore",
        ".eslintrc.js",
        ".gitignore",
        ".prettierignore",
        ".stylelintignore",
        ".stylelintrc.js",
        ".travis.yml",
      ],
    },
    shared: {
      overwrite: false,
      basePath: "/opt/apps/greeting-cards-freshcut",
      files: [
        "/shared/.env",
        {
          path: ".env",
          overwrite: false,
          chmod: "655",
        },
      ],
    },
    prod: {
      servers: [
        {
          host: "v020.vpool.p01.otmsrv.lan",
          user: process.env.DEPLOY_USER,
        },
        {
          host: "v021.vpool.p01.otmsrv.lan",
          user: process.env.DEPLOY_USER,
        },
      ],
    },
  });

  // TODO: this is not actually correct. Failure here will NOT fail the task!
  // ... but because Shipit is lame, there is no way to deal with this either...
  shipit.on("updated", async () => {
    await shipit.remote(
      `cd ${shipit.releasePath} && npm14 install --only=production`
    );

    await shipit.remote(
      `ln -sf /opt/apps/greeting-cards-freshcut/shared/.env ${shipit.releasePath}/.env`
    );

    await shipit.remote(
      `cd ${shipit.releasePath} && NODE_ENV=production BABEL_DISABLE_CACHE=true npm14 run build`
    );

    await shipit.remote(`setfacl -R -bn ${shipit.releasePath}`);
    await shipit.remote(`chgrp -R developers ${shipit.releasePath}`);
    await shipit.remote(`setfacl -R -n -m m::rwX ${shipit.releasePath}`);
    await shipit.remote(`setfacl -R -m g:developers:rwX ${shipit.releasePath}`);

    await shipit.remote("sudo systemctl restart greeting-cards-freshcut@9200", {
      tty: true,
    });
  });
};
