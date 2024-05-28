import {
  CircleIcon,
  PackageIcon,
  Home2Icon,
  UserIcon,
  ShoppingCartIcon,
  TableIcon
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
  {
    title: 'Home',
    icon: Home2Icon,
    to: '/home'
  },
  { divider: true },
  {
    title: 'Produto',
    icon: PackageIcon,
    to: '/product',
    children: [
      {
        title: 'Cadastrar',
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
    title: 'Cliente',
    icon: UserIcon,
    to: '/customer',
    children: [
      {
        title: 'Cadastrar',
        icon: CircleIcon,
        to: '/customer/create'
      },
      {
        title: 'Listar',
        icon: CircleIcon,
        to: '/customer/list'
      }
    ]
  },
  {
    title: 'Orçamento',
    icon: ShoppingCartIcon,
    to: '/order',
    children: [
      {
        title: 'Novo Orçamento',
        icon: CircleIcon,
        to: '/order/create'
      },
      {
        title: 'Listar',
        icon: CircleIcon,
        to: '/order/list'
      }
    ]
  },
  {
    title: 'Tabela de Preço',
    icon: TableIcon,
    to: '/product/downloadTabela/1',    
  },
  // {
  //   title: 'Icons',
  //   icon: WindmillIcon,
  //   to: '/forms/radio',
  //   children: [
  //     {
  //       title: 'Tabler Icons',
  //       icon: CircleIcon,
  //       to: '/icons/tabler'
  //     },
  //     {
  //       title: 'Material Icons',
  //       icon: CircleIcon,
  //       to: '/icons/material'
  //     }
  //   ]
  // }
];

export default sidebarItem;
