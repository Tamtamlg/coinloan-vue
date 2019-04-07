<template>
  <div class="budgets container">
    <div class="row">
      <div class="col col-md-8">
        <app-panel title="Budgets" :footer="false">
          <ul class="budgets__list" slot="body" v-if="budgetList.length">
            <li class="budgets__item" v-for="(item, index) in budgetList" :key="index">
              <div class="budgets__index">#{{index + 1}}</div>
              <div class="budgets__name">
                <router-link
                  :to="`/budgets/${item.id}/`"
                >{{item.name}} - {{item.balance.toFixed(2)}} {{item.currency}}</router-link>
              </div>
              <div class="budgets__actions">
                <button class="btn btn--reset" @click="resetBudget(item.id)">Reset</button>
                <button class="btn btn--del" @click="deleteBudget(item.id)">Delete</button>
              </div>
            </li>
          </ul>
          <div slot="body" v-else>Please create a budget to see it in the list.</div>
        </app-panel>
      </div>

      <div class="col col-md-4">
        <app-panel title="Сreate a new budget" :footer="false">
          <div slot="body">
            <form class="form" @submit.prevent="createBudget">
              <div class="form__item" :class="{'is-invalid': errors.first('name')}">
                <label for="budgetName">Name</label>
                <input type="text" class="form__control" id="budgetName" v-model="name" v-validate="'required'" name="name">
                <span class="invalid-text">{{ errors.first('name') }}</span>
              </div>
              <div class="form__item" :class="{'is-invalid': errors.first('selectedCurrency')}">
                <label for="budgetCurrency">Currency</label>
                <select class="form__control" id="budgetCurrency" v-model="selectedCurrency" v-validate="'required'" name="selectedCurrency">
                  <option
                    v-for="(item, index) in currency"
                    :value="item"
                    :key="index"
                  >{{item}}</option>
                </select>
                <span class="invalid-text">{{ errors.first('selectedCurrency') }}</span>
              </div>
              <div class="form__item" :class="{'is-invalid': errors.first('amount')}">
                <label for="budgetAmount">Amount</label>
                <input type="number" step="any"  class="form__control" id="budgetAmount" v-model="amount" v-validate="'required'" name="amount">
                <span class="invalid-text">{{ errors.first('amount') }}</span>
              </div>
              <div class="form__item">
                <button type="submit" class="btn btn--create form__btn" :disabled="!isFormValid">Create</button>
              </div>
            </form>
          </div>
        </app-panel>
      </div>
    </div>
  </div>
</template>

<script>
import AppPanel from "@/components/AppPanel.vue";

export default {
  name: "budgets",
  components: {
    AppPanel
  },
  data() {
    return {
      selectedCurrency: "",
      name: "",
      amount: ""
    };
  },
  computed: {
    isFormValid() {
      return this.selectedCurrency && this.name.trim() && this.amount;
    },
    currency() {
      return this.$store.state.currency;
    },
    budgetList() {
      return this.$store.state.budgetList;
    }
  },
  methods: {
    createBudget() {
      const formData = {
        currency: this.selectedCurrency,
        name: this.name,
        amount: +this.amount
      };
      this.$store.dispatch("createBudget", formData);
      this.resetForm();
    },
    resetForm() {
      this.selectedCurrency = "";
      this.name = "";
      this.amount = "";
      this.$validator.reset();
    },
    deleteBudget(id) {
      const newBudgetList = this.budgetList.filter(item => {
        return item.id !== +id;
      });
      this.$store.dispatch("updateBudget", newBudgetList);
    },
    resetBudget(id) {
      this.budgetList.filter(item => {
        return item.id === +id;
      })[0].transactions = [];
      this.budgetList.filter(item => {
        return item.id === +id;
      })[0].balance = this.budgetList.filter(item => {
        return item.id === +id;
      })[0].amount;
      this.$store.dispatch("updateBudget", this.budgetList);
    }
  }
};
</script>

<style lang="scss">
.budgets__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.budgets__item {
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #dedede;
  }
}
.budgets__actions {
  margin-left: auto;
  .btn:not(:last-child) {
    margin-right: 10px;
  }
  .btn {
    min-width: 75px;
  }
  @media (max-width: 575px) {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .btn:not(:last-child) {
      margin-bottom: 5px;
      margin-right: 0;
    }
  }
}
.budgets__index,
.budgets__name {
  margin-right: 20px;
}
</style>
