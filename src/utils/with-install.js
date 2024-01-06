import { camelize } from './format';

function makeInstall(app, component) {
  const { name } = component;
  app.component(camelize(`-${name}`), component);
}

export function withInstall(component) {
  component.install = (app) => makeInstall(app, component);

  return component;
}

export function withInstallAll(components) {
  const install = (app) => {
    Object.values(components).forEach(component => {
      makeInstall(app, component);
    });
  };

  return {
    install
  };
}
