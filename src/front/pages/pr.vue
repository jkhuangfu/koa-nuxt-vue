<template>
  <div class="home">
    <Layout class="layout">
      <Sider :collapsed-width="0" :width="250" collapsible hide-trigger v-model="isCollapsed">
        <div class="logo">This is Big logo</div>
        <Tree :data="project" @on-select-change="handleSelect"></Tree>
      </Sider>
      <Layout>
        <Header class="layout-header-bar">
          <Icon :class="rotateIcon" @click.native="collapsedSider" size="24" title="收起侧边栏和头部" type="md-menu"></Icon>
          <Select @on-change="handleSearch" filterable v-model="search">
            <Option :key="index" :value="option.title" v-for="(option, index) in list">{{ option.title }}</Option>
          </Select>
          <Icon @click="handleOpenNewTag" size="24" title="新标签页打开" type="ios-photos" />
          <Icon :class="rotateIcon" @click.native="handleFull" size="24" title="全屏" type="md-expand"></Icon>
          <Upload :show-upload-list="false" action>
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </Header>
        <Content
          :style="{
            margin: isFull ? 0 : '20px',
            background: '#fff',
            minHeight: '260px'
          }"
        >
          <iframe :src="selected" frameborder="0" height="100%" ref="frame" v-if="selected" width="100%"></iframe>
          <div v-else>
            <h3>最近更新</h3>
            <li
              :key="index"
              @click="handleOpen(value.id)"
              class="latelyData"
              v-for="(value, index) in latelyData"
            >{{value.title}}</li>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<style lang="stylus">
.home {
  width: 100%;
  height: 100%;

  .hidden {
    height: 0;
  }

  .ivu-upload {
    display: inline-block;
  }

  .ivu-layout-sider {
    background: #fff;
  }

  .ivu-layout-sider-children {
    overflow: auto;
  }

  .layout {
    width: 100%;
    height: 100%;
    border: 1px solid #d7dde4;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 25px 0 0;
    transition: 1s;
    overflow: hidden;

    i {
      margin: 0 20px;
      cursor: pointer;
    }
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    // background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }

  .menu-icon {
    transition: all 0.3s;
  }

  .rotate-icon {
    transform: rotate(-90deg);
  }

  .latelyData {
    margin: 10px auto;
    cursor: pointer;
    list-style: decimal;
  }
}
</style>

<script lang="ts">
import * as moment from 'moment';
import { Vue, Component, Watch, Ref } from 'nuxt-property-decorator';
import axios from 'axios';
Component.registerHooks([
  'beforeRouteEnter', // 进入路由之前
  'beforeRouteLeave', // 离开路由之前
  'beforeRouteUpdate'
]);
@Component
export default class Home extends Vue {
  private isCollapsed: boolean = false;

  private isFull: boolean = false;

  private selected: string = '';

  private project: any[] = [];

  private list: any = [];

  private search: string = '';

  private latelyData: any[] = [];

  @Ref('frame')
  private frame!: HTMLIFrameElement;

  public async mounted() {
    const data = await this.handleGetList();
    this.list = data.data.data;
    this.project = await this.handleTree(this.list);
    this.handleLately();
    this.project.unshift({
      title: '最近',
      expand: false,
      selected: false,
      children: this.latelyData
    });
    this.project = [...this.project];
  }

  public beforeRouteUpdate(to: any, from: any, next: any) {
    // this.handleOpen(to.params.id, true)
    next();
  }

  private get rotateIcon() {
    return ['menu-icon', this.isCollapsed ? 'rotate-icon' : ''];
  }

  private async handleGetList() {
    return await axios.get('/api/get');
  }

  private async handleTree(list: any[]) {
    const tree: any[] = [];
    list.forEach((value, index) => {
      const [name, version, ...date] = value.title.split('_');
      const l1 = tree.findIndex(v => v.title === name);
      const inx1 = l1 === -1 ? tree.length : l1;
      tree[inx1] = {
        title: name,
        id: name,
        expand: false,
        selected: false,
        children: [...((tree[inx1] && tree[inx1].children) || [])]
      };
      const l2 = tree[inx1].children.findIndex((v: any) => v.title === version);
      const inx2 = l2 === -1 ? tree[inx1].children.length : l2;
      tree[inx1].children[inx2] = {
        title: version,
        id: name + '_' + version,
        expand: false,
        selected: false,
        children: [
          ...((tree[inx1].children[inx2] && tree[inx1].children[inx2].children) || []),
          {
            title: date.join('_'),
            id: value.title,
            expand: false,
            selected: false,
            src: value.src
          }
        ]
      };
    });
    return tree;
  }

  private handleOpen(
    // @ts-ignore
    name: string,
    accordion: boolean = false
  ) {
    if (!name) return;
    const [cname, cversion, ...cdate] = name.split('_');
    const c1 = this.project.find(v => v.title === cname) || {};
    const c2 = (c1.children || []).find((v: any) => v.title === cversion) || {};
    const c3 = (c2.children || []).find((v: any) => v.title === cdate.join('_')) || {};
    if (accordion) {
      this.project.forEach((v: any) => (v.expand = false));
      (c1.children || []).forEach((v: any) => (v.expand = false));
      (c2.children || []).forEach((v: any) => (v.expand = false));
    }
    (c2.children || []).forEach((v: any) => (v.selected = false));
    c1.expand = true;
    c2.expand = true;
    c3.selected = true;
    this.selected = c3.src;
    this.project = [...this.project];
  }

  private collapsedSider() {
    this.isCollapsed = !this.isCollapsed;
    this.isFull = !this.isFull;
  }

  private handleSelect(_: any, data: any) {
    data.expand = !data.expand;
    if (!data.src) return;
    this.handleOpen(data.id, true);
  }

  private handleOpenNewTag() {
    window.open(this.selected);
  }

  private handleFull() {
    this.frame.requestFullscreen();
  }

  private handleSearch(id: string) {
    if (!id) return;
    this.handleOpen(id, true);
    // const path = encodeURIComponent(id);
    // this.$route.path !== path && this.$router.push(path);
    this.$nextTick(() => {
      this.search = '';
    });
  }

  private handleLately() {
    const fil = this.list
      .filter((v: any) => {
        let t = v.title.split('_').slice(-1)[0];
        t = t.length <= 4 ? `2018${t}` : t;
        t = t.length <= 6 ? `20${t}` : t;
        v.time = t;
        v.id = v.title;
        return moment(t).isAfter(moment().subtract(30, 'day'));
      })
      .sort((a: any, b: any) => moment(b.time).unix() - moment(a.time).unix());
    this.latelyData = fil;
  }
}
</script>
