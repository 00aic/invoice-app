<script setup lang="ts"></script>
<template>
  <div class="layout">
    <nav class="layout__nav">
      <div class="logo">
        <div class="logo__wrapper">
          <div class="logo__wrapper-bg1"></div>
          <div class="logo__wrapper-bg2"></div>
          <img class="logo__wrapper-img" src="@/assets/images/logo.svg" alt="Logo" />
        </div>
      </div>
      <div class="nav__theme">
        <img src="@/assets/images/icon-moon.svg" alt="Theme" />
      </div>
      <div class="nav__avatar">
        <img class="nav__avatar-img" src="@/assets/images/image-avatar.jpg" alt="Avatar" />
      </div>
    </nav>
    <main class="layout__main">
      <RouterView />
    </main>
  </div>
</template>
<style lang="scss" scoped>
.layout {
  display: flex;
  flex: 1;

  &__nav {
    display: flex;
    flex-direction: column;
    background-color: #373b53;
    width: 103px;
    min-height: 100vh;
    align-items: center;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;

    .logo {
      flex: 1;
      width: 100%;

      &__wrapper {
        height: 103px;
        position: relative;
        display: flex;
        flex-direction: column;

        &-bg1 {
          height: 65%;
          background-color: var(--color-01);
          border-top-right-radius: 20px;
        }
        &-bg2 {
          height: 50%;
          width: 100%;
          background-color: var(--color-02);
          border-bottom-right-radius: 20px;
          border-top-left-radius: 20px;
          position: absolute;
          top: 52px;
        }

        &-img {
          position: absolute;
          top: 33.29px;
          left: 32px;
          width: 40px;
          height: 40px;
        }
      }
    }

    &__theme {
    }

    &__avatar {
      padding: 24px 0;
      border-top: 1px solid #494e6e;
      margin-top: 32px;
      width: 100%;
      display: flex;
      justify-content: center;

      &-img {
        display: block;
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }
    }
  }
  &__main {
    flex: 1;
    padding: 77px 355px 0 252px;
    background-color: var(--color-11);
  }
}
</style>
