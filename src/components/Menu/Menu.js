import React from 'react';
import { useState } from 'react';
import './Menu.css';
/**
 * @description: 初始化菜单信息，添加type, isOpen, isSelect字段
 * @param {Array} menuItems
 * @return {Array}
 */
function initMenuItems(menuItems) {
  let resetMenuItems = {};
  for (let itemIndex in menuItems) {
    if (menuItems[itemIndex].children) {
      resetMenuItems[menuItems[itemIndex].key] = {
        ...menuItems[itemIndex],
        type: 'menuGroup',
        isOpen: false,
        isSelect: false,
        children: initMenuItems(menuItems[itemIndex].children),
      }
    } else {
      resetMenuItems[menuItems[itemIndex].key] = {
        ...menuItems[itemIndex],
        type: 'menuItem',
        isOpen: false,
        isSelect: false,
      }
    }
  }
  return resetMenuItems;
}

function Menu({menuItems, selectKeys, openKeys, getSelectKeys}) {
  let [resetMenuItems, setResetMenuItems] = useState(initMenuItems(menuItems, selectKeys, openKeys));
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
   * @description: 选择菜单
   * @param {Array} keys
   * @param {Object} menuItems
   * @return {boolean}
   */  
  const selectMenuGroup = (keys, menuItems) => {
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
  const cancelSelect = (menuItems) => {
    for (let item in menuItems) {
      menuItems[item].isSelect = false;
      if (menuItems[item].children) {
        cancelSelect(menuItems[item].children);
      }
    }
    return menuItems;
  }

  /**
   * @description: 获得被选择的树状内容的label
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