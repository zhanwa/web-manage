import Vue from 'vue'
import {
  Button,
  Row,
  Col,
  Carousel,
  CarouselItem,
  Container,
  Card,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Switch,
  Input,
  Table,
  TableColumn,
  Dialog,
  Form,
  FormItem,
  Tooltip,
  Select,
  Option,
  Message,
  MessageBox,
  Popover,
  Upload,
  Popconfirm
} from 'element-ui'
Vue.use(Button)

  .use(Row)
  .use(Popconfirm)
  .use(Upload)
  .use(Col)
  .use(Carousel)
  .use(CarouselItem)
  .use(Container)
  .use(Card)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Footer)
  .use(Menu)
  .use(Submenu)
  .use(MenuItemGroup)
  .use(MenuItem)
  .use(Switch)
  .use(Input)
  .use(Table)
  .use(TableColumn)
  .use(Dialog)
  .use(Form)
  .use(FormItem)
  .use(Tooltip)
  .use(Select)
  .use(Option)
  .use(Popover)
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
