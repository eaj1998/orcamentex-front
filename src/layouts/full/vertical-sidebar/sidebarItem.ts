import {
  CircleIcon,
  WindmillIcon,
  TypographyIcon,
  ShadowIcon,
  PaletteIcon,
  BugIcon,
  DashboardIcon,
  BrandChromeIcon,
  HelpIcon,
  PackageIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Dashboard' },
  {
    title: 'Default',
    icon: DashboardIcon,
    to: '/dashboard/default'
  },
  { divider: true },
  {
    title: 'Produto',
    icon: PackageIcon,
    to: '/product',
    children: [
      {
        title: 'Criar',
        icon: CircleIcon,
        to: '/product/create'
      },
      {
        title: 'Listar',
        icon: CircleIcon,
        to: '/product/list'
      }
    ]
  },
  {
    title: 'Icons',
    icon: WindmillIcon,
    to: '/forms/radio',
    children: [
      {
        title: 'Tabler Icons',
        icon: CircleIcon,
        to: '/icons/tabler'
      },
      {
        title: 'Material Icons',
        icon: CircleIcon,
        to: '/icons/material'
      }
    ]
  }
];

export default sidebarItem;
