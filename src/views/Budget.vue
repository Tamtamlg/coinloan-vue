<template>
  <div class="budget" v-if="budget">
    <div class="container">
      <div class="row">
        <div class="col col-md-12">
          <app-back></app-back>
        </div>
      </div>

      <div class="row">
        <div class="col col-md-12">
          <app-panel :title="budget.name" :footer="false">
            <div class="budget__info" slot="body">
              <p>Balance: {{balance.toFixed(2)}} {{budget.currency}}</p>
              <div v-if="budget.transactions && budget.transactions.length">
                <p>Average transaction amount: {{avgTransactionAmount.toFixed(2)}} {{budget.currency}}</p>
                <p>Maximum transaction amount: {{maxTransactionAmount.toFixed(2)}} {{budget.currency}}</p>
                <p>Minimum transaction amount: {{minTransactionAmount.toFixed(2)}} {{budget.currency}}</p>
              </div>
            </div>
          </app-panel>
        </div>
      </div>

      <div class="row">
        <div class="col col-md-8">
          <app-panel title="Transactions" :footer="false">
            <ul
              class="budgets__list"
              slot="body"
              v-if="budget.transactions && budget.transactions.length"
            >
              <li class="budgets__item" v-for="(item, index) in budget.transactions" :key="index">
                <div class="budgets__index">#{{index + 1}}</div>
                <div class="budgets__name">
                  <strong>{{item.target}} - {{item.sum.toFixed(2)}} {{item.currency}}</strong>
                </div>
                <div class="budgets__actions">
                  <button class="btn btn--del" @click="deleteTransaction(item.id)">Delete</button>
                </div>
              </li>
            </ul>
            <div slot="body" v-else>Please create a transaction to see it in the list.</div>
          </app-panel>
        </div>

        <div class="col col-md-4">
          <app-panel title="Сreate a new transaction" :footer="false">
            <div slot="body">
              <form class="form" @submit.prevent="createTransuction">
                <div class="form__item" :class="{'is-invalid': errors.first('target')}">
                  <label for="budgetTarget">Target</label>
                  <input
                    type="text"
                    class="form__control"
                    id="budgetTarget"
                    v-model="target"
                    v-validate="'required'"
                    name="target"
                  >
                  <span class="invalid-text">{{ errors.first('target') }}</span>
                </div>
                <div class="form__item" :class="{'is-invalid': errors.first('selectedCurrency')}">
                  <label for="budgetCurrency">Currency</label>
                  <select
                    class="form__control"
                    id="budgetCurrency"
                    v-model="selectedCurrency"
                    v-validate="'required'"
                    name="selectedCurrency"
                  >
                    <option v-for="(item, index) in currency" :value="item" :key="index">{{item}}</option>
                  </select>
                  <span class="invalid-text">{{ errors.first('selectedCurrency') }}</span>
                </div>
                <div class="form__item" :class="{'is-invalid': errors.first('sum')}">
                  <label for="budgetSum">Sum</label>
                  <input
                    type="number"
                    step="any"
                    class="form__control"
                    id="budgetSum"
                    v-model="sum"
                    v-validate="'required'"
                    name="sum"
                  >
                  <span class="invalid-text">{{ errors.first('sum') }}</span>
                </div>
                <div class="form__item">
                  <button
                    type="submit"
                    class="btn btn--create form__btn"
                    :disabled="!isFormValid"
                  >Create</button>
                </div>
              </form>
            </div>
          </app-panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppPanel from "@/components/AppPanel.vue";
import AppBack from "@/components/AppBack.vue";

export default {
  name: "budget",
  components: {
    AppPanel,
    AppBack
  },
  data() {
    return {
      id: this.$route.params.id,
      selectedCurrency: "",
      target: "",
      sum: ""
    };
  },
  computed: {
    allBudgetIds() {
      return this.$store.state.budgetList.map(item => item.id);
    },
    isFormValid() {
      return this.selectedCurrency && this.target.trim() && this.sum;
    },
    currency() {
      return this.$store.state.currency;
    },
    budget() {
      return this.$store.state.budgetList.filter(item => {
        return item.id === +this.id;
      })[0];
    },
    rates() {
      return this.$store.state.rates;
    },
    transactionsToUSD() {
      const newTransactions = [];
      this.budget.transactions.forEach(item => {
        newTransactions.push(+(item.sum / this.rates[item.currency]));
      });
      return newTransactions;
    },
    amountUSD() {
      return this.amount / this.budgetRate;
    },
    sumToUSD() {
      return this.sum / this.rates[this.selectedCurrency];
    },
    allTransactionSumToUSD() {
      return this.transactionsToUSD.reduce((result, item) => {
        return result + item;
      }, 0);
    },
    balance() {
      return (this.amountUSD - this.allTransactionSumToUSD) * this.budgetRate;
    },
    avgTransactionAmount() {
      return (
        (this.allTransactionSumToUSD / this.transactionsToUSD.length) *
        this.budgetRate
      );
    },
    maxTransactionAmount() {
      return this.transactionsToUSD.sort((a, b) => b - a)[0] * this.budgetRate;
    },
    minTransactionAmount() {
      return this.transactionsToUSD.sort((a, b) => a - b)[0] * this.budgetRate;
    },

    amount() {
      return this.budget.amount;
    },

    budgetRate() {
      return this.rates[this.budget.currency];
    },

    limitOverflow() {
      return (
        (this.amountUSD - this.allTransactionSumToUSD - this.sumToUSD) *
        this.budgetRate
      ).toFixed(2);
    }
  },
  methods: {
    createTransuction() {
      if (this.limitOverflow >= 0) {
        const formData = {
          currency: this.selectedCurrency,
          target: this.target,
          sum: +this.sum,
          id: +this.id,
          balance: this.balance
        };
        this.$store.dispatch("createTransaction", formData).then(
          this.$store.dispatch("updateBudgetAfterTransaction", {
            id: +this.id,
            balance: this.balance
          })
        );

        this.resetForm();
      } else {
        this.$flashStorage.flash(
          `transaction exceeds the limit by ${Math.abs(this.limitOverflow)} ${
            this.budget.currency
          }`,
          "error",
          {
            timeout: 3000
          }
        );
      }
    },
    resetForm() {
      this.selectedCurrency = "";
      this.target = "";
      this.sum = "";
      this.$validator.reset();
    },
    deleteTransaction(id) {
      const transactions = this.budget.transactions.filter(item => {
        return item.id !== id;
      });
      const data = {
        id: +this.id,
        transactions: transactions,
        balance: this.balance
      };
      this.$store.dispatch("deleteTransaction", data).then(
        this.$store.dispatch("updateBudgetAfterTransaction", {
          id: +this.id,
          balance: this.balance
        })
      );
    },
    goHome() {
      const isId = this.allBudgetIds.find(item => {
        return item === +this.id;
      });

      if (!isId) {
        this.$router.push("/budgets/");
      }
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.goHome();
    }
  },
  created() {
    this.goHome();
  }
};
</script>

<style>
</style>
