import mutations from './mutations';
import actions from './actions';
import state from './state';
export default {
  namespaced: true, // 命名空间
  state,
  actions,
  mutations
};
