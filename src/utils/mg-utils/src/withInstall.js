/*
 * @Author: yinmingdi
 * @Date: 2022-03-07 18:53:03
 * @Description:
 *
 */

export function withInstall(component) {
  component.install = (app) => {
    const { name } = component;
    app.component(name, component);
  };

  return component;
}

export function withMultiInstall(components) {
  const install = (app) => {
    components.forEach(component => {
      if (!component.install) withInstall(component);
      component.install(app);
    });
  };

  return {
    install
  };
}
