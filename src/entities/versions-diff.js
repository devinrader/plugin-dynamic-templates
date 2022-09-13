function diffLocalAndRemoteVersions(remoteVersions, localVersionConfigurations) {
  let deploymentConfigurations = [];
  deploymentConfigurations = compareLocalToRemoteVersion(deploymentConfigurations, remoteVersions, localVersionConfigurations);
  deploymentConfigurations = compareRemoteToLocalVersion(deploymentConfigurations, remoteVersions, localVersionConfigurations);
  return deploymentConfigurations;
}

function compareRemoteToLocalVersion(deploymentConfigurations, remoteVersions, localVersionConfigurations) {
  for (const remote of remoteVersions) {
    // If this version id is already in the diffed array go ahead and continue
    if (deploymentConfigurations.some(d => d.vid === remote.id)) {
      console.log(`Version Already Found: ${remote.id}.  Continuing`);
      continue;
    }

    // does this remote version exist locally?
    let localVersionConfiguration = localVersionConfigurations.find(v => v.vid === remote.id);
    if (localVersionConfiguration) { // yes
    // has the remote version been updated since the last deploy of local
      if (remote.updated_at > localVersionConfiguration.updated_at) {
        // since the remote is newer, skip deploying the local and warn // we should add a force option later
      }

      // Add the version to the diffed array and set its state to UPDATE so we know to use update API calls
      deploymentConfigurations.push({
        vid: remote.id,
        name: remote.name,
        hasLocal: true,
        hasRemote: true,
        action: 'UPDATE',
        versionConfig: localVersionConfiguration
      });
    } else { // no
    // do nothing - we'll add a sync/pull command later to pull remote server changes to local "repos"
      deploymentConfigurations.push({
        vid: remote.id,
        name: remote.name,
        hasLocal: false,
        hasRemote: true,
        action: 'NONE',
        versionConfig: null
      });
    }
  }
  return deploymentConfigurations;
}

function compareLocalToRemoteVersion(deploymentConfigurations, remoteVersions, localVersionConfigurations) {
  for (const localVersionConfiguration of localVersionConfigurations) {
    // If this version id is already in the diffed array go ahead and continue
    if (deploymentConfigurations.some(v => v.vid === localVersionConfiguration.config.vid)) {
      continue;
    }

    // does this local version exist remotely?
    let remoteVersion = remoteVersions.find(v => v.id === localVersionConfiguration.config.vid);
    if (remoteVersion) { // yes
      // has the remote version been updated since the last deploy of local
      if (remoteVersion.updated_at > localVersionConfiguration.updated_at) {
        // since the remote is newer, skip deploying the local and warn
        // we should add a force option later
      }

      // Add the version to the diffed array and set its
      // state to UPDATE so we know to use update API calls
      deploymentConfigurations.push({
        vid: localVersionConfiguration.config.vid,
        name: localVersionConfiguration.name,
        hasLocal: true,
        hasRemote: true,
        action: 'UPDATE',
        versionConfig: localVersionConfiguration
      });
    } else { // no
      // does the local version of a vid which would indicate its been
      // deployed previously and we need to delete?
      const deploymentConfiguration = {
        vid: localVersionConfiguration.config.vid,
        name: localVersionConfiguration.name,
        hasLocal: true,
        hasRemote: false,
        versionConfig: localVersionConfiguration
      };

      if (localVersionConfiguration.vid) {
        deploymentConfiguration.action = 'DELETELOCAL';
      } else {
        deploymentConfiguration.action = 'CREATE';
      }

      deploymentConfigurations.push(deploymentConfiguration);
    }
  }
  return deploymentConfigurations;
}

// function compareRemoteToLocalVersion(deploymentConfigurations, remoteVersions, localVersionConfigurations) {
//   for (const remote of remoteVersions) {
//     // If this version id is already in the diffed array go ahead and continue
//     if (deploymentConfigurations.some(d => d.vid === remote.id)) {
//       console.log(`Version Already Found: ${remote.id}.  Continuing`);
//       continue;
//     }

//     // does this remote version exist locally?
//     let localVersionConfiguration = localVersionConfigurations.find(v => v.vid === remote.id);
//     if (localVersionConfiguration) { // yes
//     // has the remote version been updated since the last deploy of local
//       if (remote.updated_at > localVersionConfiguration.updated_at) {
//         // since the remote is newer, skip deploying the local and warn // we should add a force option later
//       }

//       // Add the version to the diffed array and set its state to UPDATE so we know to use update API calls
//       deploymentConfigurations.push({
//         vid: remote.id,
//         name: remote.name,
//         hasLocal: true,
//         hasRemote: true,
//         action: 'UPDATE',
//         versionConfig: localVersionConfiguration
//       });
//     } else { // no
//     // do nothing - we'll add a sync/pull command later to pull remote server changes to local "repos"
//       deploymentConfigurations.push({
//         vid: remote.id,
//         name: remote.name,
//         hasLocal: false,
//         hasRemote: true,
//         action: 'NONE',
//         versionConfig: null
//       });
//     }
//   }
//   return deploymentConfigurations;
// }

module.exports = {
  diffLocalAndRemoteVersions
};
