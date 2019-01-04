const { confirm, run } = require('./utils');

module.exports = async function() {
  const dependencies = [
    {
      label: 'Virtualbox',
      detectCmd: 'which virtualbox',
      installCmd: 'brew cask install virtualbox'
    },
    {
      label: 'Docker',
      detectCmd: 'which docker',
      installCmd: 'brew cask install docker'
    },
    {
      label: 'Kubernetes',
      detectCmd: 'which kubectl',
      installCmd: 'brew install kubernetes-cli'
    },
    {
      label: 'Helm',
      detectCmd: 'which helm',
      installCmd: 'brew install kubernetes-helm'
    },
    {
      label: 'Minikube',
      detectCmd: 'which minikube',
      installCmd: 'brew cask install minikube'
    },
    {
      label: 'Google Cloud SDK (gcloud)',
      detectCmd: 'which gcloud',
      installCmd: 'brew cask install google-cloud-sdk'
    },
    {
      label: 'Google Cloud SDK (gcloud) Beta Commands',
      detectCmd: 'gcloud components list --filter="gcloud Beta Commands"',
      installCmd: 'gcloud components install beta --quiet',
      detectAdvanced: output => {
        return output.indexOf('Not Installed | gcloud Beta Commands') > -1;
      }
    }
  ];

  async function tryInstall(label, installCmd) {
    if (await confirm(`Install ${label}`)) {
      await run(installCmd);
    }
  }

  for (const { label, detectCmd, detectAdvanced, installCmd } of dependencies) {
    try {
      const { stdout } = await run(detectCmd);
      if (detectAdvanced && detectAdvanced(stdout)) {
        tryInstall(label, installCmd);
      }
    } catch (error) {
      tryInstall(label, installCmd);
    }
  }
};
