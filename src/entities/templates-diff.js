function diffLocalAndRemoteTemplates(remoteTemplates,localTemplateConfigurations) {
  let templateConfigurations = [];
  templateConfigurations = CompareLocalToRemoteTemplates(templateConfigurations,remoteTemplates,localTemplateConfigurations);
  templateConfigurations = CompareRemoteToLocalTemplates(templateConfigurations,remoteTemplates,localTemplateConfigurations);
  return templateConfigurations;
}

function diffLocalAndRemoteTemplate(remoteTemplate, localtemplateconfig) {
  if (localtemplateconfig.tid) {
    if (remoteTemplate.id === localtemplateconfig.tid) {
      deploymentConfiguration = {
        tid: localtemplateconfig.tid,
        name: localtemplateconfig.name,
        hasLocal: true,
        hasRemote: true,
        action: 'UPDATE'
      };  
    } else {
      // this should error because these should not be different
    }
  } else {
    deploymentConfiguration = {
      tid: '',
      name: localtemplateconfig.name,
      hasLocal: true,
      hasRemote: false,
      action: 'CREATE'
    };
  }
  return deploymentConfiguration;
};

function CompareLocalToRemoteTemplates(templateConfigurations, remoteTemplates, localTemplateConfigurations) {
  for(const localTemplateConfiguration of localTemplateConfigurations) {

    //If this version id is already in the diffed array go ahead and continue
    if (templateConfigurations.some(t=>t.tid === localTemplateConfiguration.tid)) {
      console.log(`Template Already Found: Continuing`);
      continue;
    }

    //does this local version exist remotely?
    console.log(`Locating remote version of local template ${localTemplateConfiguration.tid}`)
    let remoteTemplate = remoteTemplates.find(t=>t.id === localTemplateConfiguration.tid)
    if (remoteTemplate) { // yes
      
      console.log(`Remote Version ${remoteTemplate.id} Found ${localTemplateConfiguration.tid}`)

      // has the remote version been updated since the last deploy of local
      if (remoteTemplate.updated_at > localTemplateConfiguration.updated_at) {
        // since the remote is newer, skip deploying the local and warn // we should add a force option later
      }

      //Add the version to the diffed array and set its state to UPDATE so we know to use update API calls
      templateConfigurations.push({
        tid: localTemplateConfiguration.tid,
        name: localTemplateConfiguration.name,
        hasLocal: true,
        hasRemote: true,
        action: 'UPDATE',
        template_config: localTemplateConfiguration
      });

    } else { // no
      
      //does the local version of a vid which would indicate its been deployed previously and we need to delete?
      if (localTemplateConfiguration.tid) {

        templateConfigurations.push({
          tid: localTemplateConfiguration.tid,
          name: localTemplateConfiguration.name,
          hasLocal: true,
          hasRemote: false,
          action: 'DELETELOCAL',
          version_config: localTemplateConfiguration
        });  
      } else {

        templateConfigurations.push({
          tid: localTemplateConfiguration.tid,
          name: localTemplateConfiguration.name,
          hasLocal: true,
          hasRemote: false,
          action: 'CREATE',
          version_config: localTemplateConfiguration
        });
      }
    }
  }
  return templateConfigurations;
}

function CompareRemoteToLocalTemplates(templateConfigurations, remoteTemplates, localTemplateConfigurations) {
  for(const remote of remoteTemplates) {
  
    //If this version id is already in the diffed array go ahead and continue
    if (templateConfigurations.some(t=>t.tid === remote.id)) {
      console.log(`Version Already Found: ${remote.id}.  Continuing`);
      continue;
    }
  
      //does this remote version exist locally?
      let localTemplateConfiguration = localTemplateConfigurations.find(t=>t.tid === remote.id)
      if (localTemplateConfiguration) { // yes
      
      // has the remote version been updated since the last deploy of local
      if (remote.updated_at > localTemplateConfiguration.updated_at) {
          // since the remote is newer, skip deploying the local and warn // we should add a force option later
      }
  
      //Add the version to the diffed array and set its state to UPDATE so we know to use update API calls
      templateConfigurations.push({
          tid: remote.id,
          name: remote.name,
          hasLocal: true,
          hasRemote: true,
          action: 'UPDATE',
          version_config: localTemplateConfiguration
      });
  
      } else { // no
      //do nothing - we'll add a sync/pull command later to pull remote server changes to local "repos"
      templateConfigurations.push({
          tid: remote.id,
          name: remote.name,
          hasLocal: false,
          hasRemote: true,
          action: 'NONE',
          version_config: null
      });
      }
  }
  return templateConfigurations;
  }
  

module.exports = { 
  diffLocalAndRemoteTemplates,
  diffLocalAndRemoteTemplate 
};