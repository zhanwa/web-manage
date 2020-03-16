import Vue from 'vue'
import {
  Button,
  Row,
  Col,
  Carousel,
  CarouselItem,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Message
} from 'element-ui'
Vue.use(Button)
  .use(Row)
  .use(Col)
  .use(Carousel)
  .use(CarouselItem)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Footer)
  .use(Menu)
  .use(Submenu)
  .use(MenuItemGroup)
  .use(MenuItem)
Vue.prototype.$message = Message
