<template>
  <div>
    <h1>服务端数据:{{project}}</h1>
    <h2>普通函数修改数据: {{number}}</h2>
    <h2>修改state数据: {{stateCount}}</h2>
    <button @click="count">执行vue方法</button>
    <button @click="changeState">mution修改state</button>
    <button @click="handleAction">action修改state</button>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator';
import { Action, State, Getter, Mutation } from 'vuex-class';
@Component
export default class Auth extends Vue {
  private number: number = 0;
  private obj: any = {};
  @State(state => state.test.count)
  private stateCount!: any;
  public async asyncData(context: any) {
    // console.log(context);
    return { project: 'this is server data' };
  }
  public created() {
    fetch('/api/get')
      .then(res => res.json())
      .then(d => {
        // console.log(d);
      })
      .catch(e => {});
  }

  @Mutation('test/changeState')
  private changeState!: () => void;

  @Action('test/action')
  private handleAction!: () => void;

  private count() {
    this.number++;
  }
}
</script>