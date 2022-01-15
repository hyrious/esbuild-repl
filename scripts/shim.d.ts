declare module "*.svelte?ssr" {
  class SvelteComponentSSR {
    render(): { html: string; css: { code: string }; head: string };
  }
  export default new SvelteComponentSSR();
}
