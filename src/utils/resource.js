
export const flattenResourceTreeFilterTypeGroup = (tree, listType = 'sheet', path = '', folderIdPath = []) => {
  const list = [];
  const listTypes = {
    sheet: {
      icon: 'workspace',
      keys: ['database', 'table']
    },
    folder: {
      icon: 'folder',
      keys: ['room', 'folder']
    }
  };
  const listTypeInfo = listTypes[listType];
  for (const item of tree) {
    const {name, id, children, type, ownerId} = item;
    const copyFolderIdPath = [...folderIdPath];
    copyFolderIdPath.push(id);
    if (listTypeInfo.keys.includes(type)) {
      const icon = listTypeInfo.icon;
      list.push({name, id, path, type, icon, ownerId, folderIdPath: copyFolderIdPath});
    }
    if (listTypes.folder.keys.includes(type) && children.length) {
      const newPath = path.length ? `${path}/${name}` : name;
      list.push(...flattenResourceTreeFilterTypeGroup(children, listType, newPath, copyFolderIdPath));
    }
  }
  return list;
};

export const processAndAnalyzeSheetData = (data) => {
  const values = {};

  Object.entries(data.values).forEach(([rowIndex, rowValues]) => {
    const rowId = data.rows[rowIndex].id;
    const rowValueObj = {};
    Object.entries(rowValues).forEach(([fieldIndex, cellValue]) => {
      const fieldId = data.fields[fieldIndex].id;
      rowValueObj[fieldId] = cellValue;
    });

    values[rowId] = rowValueObj;
  });

  return {
    ...data,
    values
  };
};
