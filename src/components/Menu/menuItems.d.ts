type menuItems = Array<MenuItem>;

type MenuItem = {
  key: string,
  label: string,
  type: MenuItemType,
  isOpen: boolean,
  isSelect: boolean,
  Icon?: string,
  chlidren?: Array<MenuItem>
}

enum MenuItemType = {
  MENUGROUP = 'menuGroup',
  MENUITEM = 'menuItem'
}