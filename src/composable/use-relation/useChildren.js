import {
  isVNode,
  provide,
  reactive,
  getCurrentInstance
} from 'vue';

export function flattenVNodes(children) {
  const result = [];

  const traverse = (children) => {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (isVNode(child)) {
          result.push(child);

          if (child.component?.subTree) {
            result.push(child.component.subTree);
            traverse(child.component.subTree.children);
          }

          if (child.children) {
            traverse(child.children);
          }
        }
      });
    }
  };

  traverse(children);

  return result;
}

// sort children instances by vnodes order
export function sortChildren(
  parent,
  publicChildren,
  internalChildren
) {
  const vnodes = flattenVNodes(parent.subTree.children);

  internalChildren.sort(
    (a, b) => vnodes.indexOf(a.vnode) - vnodes.indexOf(b.vnode)
  );

  const orderedPublicChildren = internalChildren.map((item) => item.proxy);

  publicChildren.sort((a, b) => {
    const indexA = orderedPublicChildren.indexOf(a);
    const indexB = orderedPublicChildren.indexOf(b);
    return indexA - indexB;
  });
}

export function useChildren(key) {
  const publicChildren = reactive([]);
  const internalChildren = reactive([]);
  const parent = getCurrentInstance();

  const linkChildren = (value) => {
    const link = (child) => {
      if (child.proxy) {
        internalChildren.push(child);
        publicChildren.push(child.proxy);
        sortChildren(parent, publicChildren, internalChildren);
      }
    };

    const unlink = (child) => {
      const index = internalChildren.indexOf(child);
      publicChildren.splice(index, 1);
      internalChildren.splice(index, 1);
    };

    provide(
      key,
      Object.assign(
        {
          link,
          unlink,
          children: publicChildren,
          internalChildren
        },
        value
      )
    );
  };

  return {
    children: publicChildren,
    linkChildren
  };
}
