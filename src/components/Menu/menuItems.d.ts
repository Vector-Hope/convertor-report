type menuItems = Array<MenuItem>;

type MenuItem = {
  key: string,
  label: string,
  type: MenuItemType,
  isOpen: boolean,
  isSelect: boolean,
  chlidren?: Array<MenuItem>
}

enum MenuItemType = {
  MENUGROUP = 'menuGroup',
  MENUITEM = 'menuItem'
}