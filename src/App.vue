<template>
  <div id="app">
    <router-view/>
    <flash-message class="flash-message"></flash-message>
  </div>
</template>

<script>
import { setInterval, clearInterval } from "timers";
export default {
  data() {
    return {
      ratesInterval: null
    };
  },
  created() {
    this.$store.dispatch("getBudgetList");
    this.$store.dispatch("getExchangeRates");
    this.ratesInterval = setInterval(() => {
      this.$store.dispatch("getExchangeRates");
    }, 30000);
  },
  destroyed() {
    clearInterval(this.ratesInterval);
  }
};
</script>


<style lang="scss">
@import "../node_modules/vue-flash-message/dist/vue-flash-message.min.css";

* {
  box-sizing: border-box;
}

*::after,
*::before {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-size: 16px;
  color: #252525;
  font-family: "Roboto", sans-serif;
}

//grid
$col-count: 12 !default;
$col-spacing: 20px !default;
$row-spacing: 20px !default;

$bp-small: 425px !default;
$bp-medium: 769px !default;
$bp-large: 1025px !default;
$bp-xlarge: 1440px !default;

$container-sizes: (
  "small": 768px,
  "large": 1440px
) !default;

@mixin breakpoint-min($bp) {
  @media (min-width: $bp) {
    @content;
  }
}

@mixin breakpoint-max($bp) {
  @media (max-width: $bp) {
    @content;
  }
}

@mixin breakpoint-min-max($bp1, $bp2) {
  @media (min-width: $bp1) and (max-width: $bp2) {
    @content;
  }
}

.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 30px 0;
}

@each $name, $size in $container-sizes {
  .container-#{$name} {
    max-width: $size;
  }
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  &.row-reverse {
    flex-direction: row-reverse;
  }

  .col {
    flex-grow: 1;
    flex-basis: 100%;
    max-width: 100%;
    padding: $row-spacing/2 $col-spacing/2;

    &.col-reverse {
      flex-direction: column-reverse;
    }
  }

  @for $i from 1 through $col-count {
    .col-xs-#{$i} {
      flex-basis: ($i / $col-count) * 100%;
      max-width: ($i / $col-count) * 100%;
    }
  }
  @for $i from 1 through $col-count {
    .col-xs-offset-#{$i} {
      margin-left: ($i / $col-count) * 100%;
    }
  }

  @include breakpoint-min($bp-small) {
    @for $i from 1 through $col-count {
      .col-sm-#{$i} {
        flex-basis: ($i / $col-count) * 100%;
        max-width: ($i / $col-count) * 100%;
      }
    }
    @for $i from 1 through $col-count {
      .col-sm-offset-#{$i} {
        margin-left: ($i / $col-count) * 100%;
      }
    }
  }

  @include breakpoint-min($bp-medium) {
    @for $i from 1 through $col-count {
      .col-md-#{$i} {
        flex-basis: ($i / $col-count) * 100%;
        max-width: ($i / $col-count) * 100%;
      }
    }
    @for $i from 1 through $col-count {
      .col-md-offset-#{$i} {
        margin-left: ($i / $col-count) * 100%;
      }
    }
  }

  @include breakpoint-min($bp-large) {
    @for $i from 1 through $col-count {
      .col-lg-#{$i} {
        flex-basis: ($i / $col-count) * 100%;
        max-width: ($i / $col-count) * 100%;
      }
    }
    @for $i from 1 through $col-count {
      .col-lg-offset-#{$i} {
        margin-left: ($i / $col-count) * 100%;
      }
    }
  }

  @include breakpoint-min($bp-xlarge) {
    @for $i from 1 through $col-count {
      .col-xlg-#{$i} {
        flex-basis: ($i / $col-count) * 100%;
        max-width: ($i / $col-count) * 100%;
      }
    }
    @for $i from 1 through $col-count {
      .col-xlg-offset-#{$i} {
        margin-left: ($i / $col-count) * 100%;
      }
    }
  }
}

//btn
.btn {
  display: inline-block;
  font-family: inherit;
  font-weight: 400;
  font-size: inherit;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  opacity: 0.8;
  padding: 7px 15px;

  &:hover {
    color: #fff;
    text-decoration: none;
    opacity: 1;
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    box-shadow: none;
  }

  &:disabled {
    background: #9e9e9e;
    opacity: 1;
    cursor: default;
  }
}

.btn--view {
  background: #00f;
}
.btn--reset {
  background: #ffb300;
}
.btn--del {
  background: #f00;
}
.btn--create {
  background: #4caf50;
}

.form__control {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 3px;
}

.form__item {
  display: flex;
  flex-direction: column;
  position: relative;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
}
.form__btn {
  margin-left: auto;
}

a {
  color: #252525;
  &:hover {
    color: #00f;
  }
}

.flash-message {
  display: flex;
  position: fixed;
  top: 10px;
  right: 10px;
}
.flash__message {
  width: 260px;
  transition: all 0.5s;
  font-size: 13px;
  line-height: 130%;
}

.is-invalid {
  input {
    border-color: #f00;
    &:focus {
      border-color: #f00;
    }
  }
}
.invalid-text {
  color: #f00;
  display: inline-block;
  font-size: 12px;
}
</style>
