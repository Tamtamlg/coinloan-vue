import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    exchangeRatesApi: 'https://api.exchangeratesapi.io/latest?base=USD&symbols=',
    rates: {},
    currency: ["EUR","USD","GBP","RUB"],
    budgetList: []
  },
  mutations: {
    setBudgetList(state, payload) {
      state.budgetList = payload;
    },
    setRates(state, payload) {
      state.rates = payload;
    }
  },
  actions: {
    async getExchangeRates({
      state,
      commit
    }) {
      try {
        await axios.get(`${state.exchangeRatesApi}${state.currency.join(',')}`).then(response => {
          commit('setRates', response.data.rates);
        }).catch(error => {
          Vue.prototype.$flashStorage.flash(error.message, 'error', {
            timeout: 3000
          });
        });
      } catch (error) {
        Vue.prototype.$flashStorage.flash(error.message, 'error', {
          timeout: 3000
        });
      }
    },
    getBudgetList({
      commit
    }) {
      const budgetList = JSON.parse(localStorage.getItem('budgetList'));
      if (budgetList) {
        commit('setBudgetList', budgetList);
      } else {
        localStorage.setItem('budgetList', JSON.stringify([]));
      }
    },
    createBudget({
      commit
    }, payload) {
      const budgetList = JSON.parse(localStorage.getItem('budgetList'));
      budgetList.push({
        id: Date.now(),
        name: payload.name,
        currency: payload.currency,
        amount: payload.amount,
        balance: payload.amount,
        transactions: []
      });
      localStorage.setItem('budgetList', JSON.stringify(budgetList));
      commit('setBudgetList', budgetList);
    },
    updateBudget({
      commit
    }, payload) {
      const budgetList = payload;
      localStorage.setItem('budgetList', JSON.stringify(budgetList));
      commit('setBudgetList', budgetList);
      Vue.prototype.$flashStorage.flash('Data successfully updated', 'success', {
        timeout: 3000
      });
    },
    async createTransaction({
      commit
    }, payload) {
      const budgetList = JSON.parse(localStorage.getItem('budgetList'));
      budgetList.find(item => {
        return item.id === payload.id;
      }).transactions.push({
        id: Date.now(),
        target: payload.target,
        currency: payload.currency,
        sum: payload.sum
      });
      budgetList.find(item => {
        return item.id === payload.id;
      }).balance = payload.balance;
      localStorage.setItem('budgetList', JSON.stringify(budgetList));
      commit('setBudgetList', budgetList);
    },
    updateBudgetAfterTransaction({
      commit
    }, payload) {
      const budgetList = JSON.parse(localStorage.getItem('budgetList'));
      budgetList.find(item => {
        return item.id === payload.id;
      }).balance = payload.balance;
      localStorage.setItem('budgetList', JSON.stringify(budgetList));
      commit('setBudgetList', budgetList);
    },
    async deleteTransaction({
      commit
    }, payload) {
      const budgetList = JSON.parse(localStorage.getItem('budgetList'));
      budgetList.find(item => {
        return item.id === payload.id;
      }).transactions = payload.transactions;
      budgetList.find(item => {
        return item.id === payload.id;
      }).balance = payload.balance;
      localStorage.setItem('budgetList', JSON.stringify(budgetList));
      commit('setBudgetList', budgetList);
      Vue.prototype.$flashStorage.flash('Data successfully updated', 'success', {
        timeout: 3000
      });
    }
  }
})