import React from 'react';
import { useState } from 'react';
import './Menu.css';
/**
 * @description: 初始化菜单信息，获得默认选择菜单
 * @param {Array} menuItems
 * @return {Array}
 */
function initMenuItems(menuItems, selectKeys) {
  let resetMenuItems = getResetMenu(menuItems);
  selectMenuGroup([...selectKeys], resetMenuItems);
  return resetMenuItems;
}

/**
 * @description: 添加必需的菜单信息，添加type, isOpen, isSelect字段
 * @param {*} menuItems
 * @return {*}
 */
function getResetMenu (menuItems) {
  let resetMenuItems = {};
  if (!menuItems || !Array.isArray(menuItems)) {
    console.warn('传入菜单信息为空，或不为数组\n', menuItems);
    return {};
  }
  // 以menuItem的key属性为menuItem的索引
  for (let itemIndex in menuItems) {
    if (menuItems[itemIndex].children) {
      resetMenuItems[menuItems[itemIndex].key] = {
        ...menuItems[itemIndex],
        type: 'menuGroup',
        isOpen: false,
        isSelect: false,
        children: getResetMenu(menuItems[itemIndex].children),
      }
    } else {
      resetMenuItems[menuItems[itemIndex].key] = {
        ...menuItems[itemIndex],
        type: 'menuItem',
        isOpen: false,
        isSelect: false,
      }
    }
    // 默认打开工程目录的第一项
    if (menuItems[itemIndex].key === 'projectDirectory' || itemIndex === '0') {
      resetMenuItems[menuItems[itemIndex].key].isOpen = true
    }
  }
  return resetMenuItems;
}

/**
 * @description: 选择菜单
 * @param {Array} keys
 * @param {Object} menuItems
 * @return {boolean}
 */
function selectMenuGroup(keys, menuItems) {
  if (keys.length === 0) {
    return false;
  }
  const key = keys.shift();
  if (keys.length) {
    const lastMenuItemIsOpen = selectMenuGroup(keys, menuItems[key].children);
    if (!menuItems[key].isOpen) {
      menuItems[key].isOpen = lastMenuItemIsOpen;
    }
  } else {
    menuItems[key].isSelect = true;
    if (menuItems[key].children) {
      menuItems[key].isOpen = !menuItems[key].isOpen;
    } else {
      menuItems[key].isOpen = true;
    }
  }
  return menuItems[key].isOpen;
}

/**
 * @description: 取消选择，用于显示最终被选择的item
 * @param {Object} menuItems
 * @return {Object}
 */  
function cancelSelect (menuItems) {
  for (let item in menuItems) {
    menuItems[item].isSelect = false;
    if (menuItems[item].children) {
      cancelSelect(menuItems[item].children);
    }
  }
  return menuItems;
}

function Menu({menuItems, selectKeys, getSelectKeys}) {
  let [resetMenuItems, setResetMenuItems] = useState(initMenuItems(menuItems, selectKeys));
  let resetMenuItemKeys = Object.keys(resetMenuItems);

  /**
   * @description: 触发选择菜单
   * @param {Array} keys
   * @return {null}
   */
  const selectMenuGroupTrigger = (keys) => {
    return (e) => {
      getSelectlabel(keys);
      let allMenuItems = cancelSelect({...resetMenuItems});
      selectMenuGroup(keys, allMenuItems);
      setResetMenuItems(allMenuItems);
    }
  }

  /**
   * @description: 获得被选择的树状内容的label，并传回父组件
   * @param {Array} keys
   * @return {string}
   */  
  const getSelectlabel = (keys) => {
    let allMenuItems = resetMenuItems;
    let labels = keys.map((key) => {
      const label = allMenuItems[key].label;
      allMenuItems = allMenuItems[key].children;
      return label;
    })
    getSelectKeys(keys, labels);
  }

  const subMenu = (subMenuItems, upperKeys) => {
    let subMenuItemKeys = Object.keys(subMenuItems);
    return (
      <div className='sub-menu-wrapper'>
        {
          subMenuItemKeys.map((key) => {
            return (
              <div key={key}>
                <div>
                  <div
                    className={`sub-menu-label ${subMenuItems[key].isSelect ? 'sub-menu-selected' : ''}`}
                    onClick={selectMenuGroupTrigger([...upperKeys, key])}
                    style={{
                      paddingLeft: `${(upperKeys.length - 1) * 20}px`
                    }}
                  >
                    {subMenuItems[key].label}
                  </div>
                </div>
                  {
                    subMenuItems[key].children ? 
                    <div className={`sub-menu ${subMenuItems[key].isOpen ? 'sub-menu-open': 'sub-menu-close'}`}>
                      {subMenu(subMenuItems[key].children, [...upperKeys, key])}
                    </div> :
                    ''
                  }
              </div>
            )
          })
        }
      </div>
    );
  }

  return (
    <div>
      {
        resetMenuItemKeys.map((key) => {
          return (
            <div className='menu-group-wrapper' key={key}>
              <div>
                <div
                  className={`menu-label ${resetMenuItems[key].isSelect ? 'menu-label-selected': ''}`}
                  onClick={selectMenuGroupTrigger([key])}
                >
                  {resetMenuItems[key].label}
                </div>
              </div>
              {
                resetMenuItems[key].children ?
                  <div className={`sub-menu ${resetMenuItems[key].isOpen ? 'sub-menu-open' : 'sub-menu-close'}`}>
                    {subMenu(resetMenuItems[key].children, [key], resetMenuItems[key].isOpen)}
                  </div> :
                  ''
              }
            </div>
          )
        })
      }
    </div>
  );
}

export default Menu;