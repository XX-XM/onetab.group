<template>
  <div>
    <ClientOnly>
      <SiteHeader />
    </ClientOnly>

    <main class="max-w-screen-xl pt-12 2xl:pt-16 my-12 m-auto sm:rounded">
      <article class="prose text-shark-800 dark:text-shark-100 max-w-none">
        <slot />
      </article>
      <Divider between />
    </main>
    <SiteFooter />
    <ClientOnly>
      <Chatwoot />
    </ClientOnly>
  </div>
</template>
