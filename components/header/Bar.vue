<template>
  <header id="header" class="d-flex jc-center">
    <div class="site-header d-flex ai-center jc-between">
      <div class="left d-flex ai-center">
        <HeaderLogo />
        <HeaderDesktopNav class="desktop-only" />
      </div>
      <div class="d-flex jc-end ai-center gap-1 right">
        <HeaderProfile class="desktop-only" />
        <HeaderMobileNav class="mobile-only" />
      </div>
    </div>
  </header>
</template>

<script>
export default {
  setup() {
    const user = useSupabaseUser();

    return {
      user,
    };
  },
};
</script>

<style>
header {
  background-color: var(--color-primary);
  border-radius: 0 0 var(--border-radius-2) var(--border-radius-2);
}
.site-header {
  position: relative;
  height: var(--header-height);
  width: 100%;
  max-width: var(--content-max-width);
  padding: 0 var(--spacing-root);
}
.site-header .right {
  flex: 1;
}

@media (min-width: 768px) {
  .site-header {
    padding: 0 var(--spacing-size-4);
  }
}
</style>
