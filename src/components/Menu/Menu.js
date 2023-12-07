import React, { useEffect } from 'react';
import { useState } from 'react';
import arrowPng from '../../static/arrow.png';
import filePng from '../../static/file.png';
import folderOpenPng from '../../static/folder_open.png';
import folderClosePng from '../../static/folder_close.png';
import './Menu.css';

/**
 * @description: 选择菜单
 * @param {Array} keys
 * @param {Object} menuItems
 * @return {*}
 */
function selectMenuGroup(keys, menuItems) {
  cancelSelect(menuItems);
  let nextMenuItem = menuItems;
  let keysLen = keys.length;
  keys.forEach((key, index) => {
    if (index === keysLen - 1) {
      nextMenuItem[key].isSelect = true;
    } else {
      nextMenuItem = nextMenuItem[key].children;
    }
  });
}

/**
 * @description: 打开菜单
 * @param {Array} keys
 * @param {Object} menuItems
 * @return {*}
 */
function openMenuGroup(keys, menuItems) {
  let nextMenuItem = menuItems;
  let keysLen = keys.length;
  keys.forEach((key, index) => {
    if (index === keysLen - 1) {
      nextMenuItem[key].isOpen = !nextMenuItem[key].isOpen;
    } else {
      nextMenuItem[key].isOpen = true;
      nextMenuItem = nextMenuItem[key].children;
    }
  });
}

/**
 * @description: 取消选择，用于显示最终被选择的item
 * @param {Object} menuItems
 * @return {*}
 */
function cancelSelect(menuItems) {
  for (let item in menuItems) {
    menuItems[item].isSelect = false;
    if (menuItems[item].children) {
      cancelSelect(menuItems[item].children);
    }
  }
}

function Menu({ menuItems, selectKeys, getSelectKeys }) {
  let [showMenuItems, setShowMenuItems] = useState(menuItems);
  let showMenuItemKeys = Object.keys(showMenuItems).sort();

  useEffect(() => {
    let allMenuItems = { ...showMenuItems };
    openMenuGroup(selectKeys, allMenuItems);
    selectMenuGroup(selectKeys, allMenuItems);
    setShowMenuItems(allMenuItems);
  }, [selectKeys]);
  /**
   * @description: 触发选择菜单
   * @param {Array} keys
   * @return {null}
   */
  const selectMenuGroupTrigger = (keys) => {
    return (e) => {
      getSelectlabel(keys);
    };
  };

  /**
   * @description: 获得被选择的树状内容的label，并传回父组件
   * @param {Array} keys
   * @return {string}
   */
  const getSelectlabel = (keys) => {
    let allMenuItems = showMenuItems;
    let labels = keys.map((key) => {
      const label = allMenuItems[key].label;
      allMenuItems = allMenuItems[key].children;
      return label;
    });
    getSelectKeys(keys, labels);
  };

  const subMenuIcon = (subMenuItem) => {
    if (subMenuItem.type === 'menuItem') {
      return <img src={filePng} alt='file' />;
    } else {
      return <img src={subMenuItem.isOpen ? folderOpenPng : folderClosePng} alt='folder' />;
    }
  };

  const subMenu = (subMenuItems, upperKeys) => {
    let subMenuItemKeys = Object.keys(subMenuItems).sort();
    return (
      <div className='sub-menu-wrapper'>
        {subMenuItemKeys.map((key) => {
          return (
            <div key={key}>
              <div>
                <div
                  className={`sub-menu-label ${subMenuItems[key].isSelect ? 'sub-menu-selected' : ''}`}
                  onClick={selectMenuGroupTrigger([...upperKeys, key])}
                  style={{
                    paddingLeft: `${(upperKeys.length - 1) * 20}px`,
                  }}
                >
                  {subMenuItems[key].type === 'menuGroup' ? (
                    <div className='sub-menu-arrow'>
                      <img
                        className={subMenuItems[key].isOpen ? 'menu-arrow-open' : 'menu-arrow-close'}
                        src={arrowPng}
                        alt='arrow'
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  <div className='sub-menu-icon'>{subMenuIcon(subMenuItems[key])}</div>
                  <div className='sub-menu-label-name'>{subMenuItems[key].label}</div>
                </div>
              </div>
              {subMenuItems[key].children ? (
                <div className={`sub-menu ${subMenuItems[key].isOpen ? 'sub-menu-open' : 'sub-menu-close'}`}>
                  {subMenu(subMenuItems[key].children, [...upperKeys, key])}
                </div>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {showMenuItemKeys.map((key) => {
        return (
          <div className='menu-group-wrapper' key={key}>
            <div className={`${key}${showMenuItems[key].isOpen ? '-menu-open' : ''}`}>
              <div
                className={`menu-label ${showMenuItems[key].isSelect ? 'menu-label-selected' : ''}`}
                onClick={selectMenuGroupTrigger([key])}
              >
                {showMenuItems[key].label}
              </div>
            </div>
            {showMenuItems[key].children ? (
              <div className={`sub-menu ${showMenuItems[key].isOpen ? 'sub-menu-open' : 'sub-menu-close'}`}>
                {subMenu(showMenuItems[key].children, [key], showMenuItems[key].isOpen)}
              </div>
            ) : (
              ''
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Menu;
