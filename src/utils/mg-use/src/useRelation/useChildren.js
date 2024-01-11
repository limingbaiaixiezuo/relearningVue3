/*
 * @Author: wuyifan wuyifan@max-optics.com
 * @Date: 2022-06-07 13:48:48
 * @LastEditors: wuyifan wuyifan@max-optics.com
 * @LastEditTime: 2022-06-20 18:03:21
 * @FilePath: /aquaman/packages/mg-use/src/useRelation/useChildren.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  isVNode,
  provide,
  reactive,
  getCurrentInstance
} from 'vue';

function flattenVNode(children) {
  const result = [];

  const traverse = (children) => {
    if (!Array.isArray(children)) return;

    children.forEach(child => {
      if (!isVNode(child)) return;
      result.push(child);

      if (child.component?.subtree) {
        result.push(child.component?.subtree);
        traverse(child.component.subTree.children);
      }

      if (child.children) {
        traverse(child.children);
      }
    });
  };

  traverse(children);

  return result;
}

const sortChildren = (parent, publickChildren, internalChildren) => {
  const vnodes = flattenVNode(parent.subTree.children);

  internalChildren.sort(
    (a, b) => vnodes.indexOf(a.vnode) - vnodes.indexOf(b.vnode)
  );

  const orderedPublicChildren = internalChildren.map(item => item.proxy);

  publickChildren.sort((a, b) => {
    const indexA = orderedPublicChildren.indexOf(a);
    const indexB = orderedPublicChildren.indexOf(b);
    return indexA - indexB;
  });
};

export function useChildren(key) {
  const publickChildren = reactive([]);
  const internalChildren = reactive([]);
  const parent = getCurrentInstance();

  const linkChildren = (value) => {
    const link = (child) => {
      if (child.proxy) {
        internalChildren.push(child);
        publickChildren.push(child.proxy);
        sortChildren(parent, publickChildren, internalChildren);
      }
    };

    const unlink = (child) => {
      const index = internalChildren.indexOf(child);
      publickChildren.splice(index, 1);
      internalChildren.splice(index, 1);
    };

    provide(
      key,
      Object.assign(
        {
          link,
          unlink,
          child: publickChildren,
          internalChildren
        },
        value
      )
    );
  };
  return {
    children: publickChildren,
    linkChildren
  };
}
