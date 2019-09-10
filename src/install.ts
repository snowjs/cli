import {confirm, run} from './utils';

export default async () => {
  interface IDependency {
    label: string;
    detectCmd: string;
    installCmd: string;
    detectAdvanced?(output: string): boolean;
  }

  const dependencies: IDependency[] = [
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
      label: 'Kubernetes (kubectl)',
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
    },
    {
      label: 'Digital Ocean CLI (doctl)',
      detectCmd: 'which doctl',
      installCmd: 'brew install doctl'
    },
  ];

  async function tryInstall(label: string, installCmd: string) {
    if (await confirm(`Install ${label}`)) {
      await run(installCmd);
    }
  }

  for (const { label, detectCmd, detectAdvanced, installCmd } of dependencies) {
    try {
      const { stdout } = await run(detectCmd, {silent: true});
      if (detectAdvanced && detectAdvanced(stdout)) {
        await tryInstall(label, installCmd);
      }
    } catch (error) {
      await tryInstall(label, installCmd);
    }
  }
};
