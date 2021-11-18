<script context="module">
  const lightIcon = "white-balance-sunny";
  const darkIcon = "moon-waxing-crescent";
  const matchMedia = typeof window === 'undefined'
    ? () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
    : window.matchMedia;
  const prefersDarkMode = matchMedia("(prefers-color-scheme: dark)");
</script>

<script>
  import { onMount, onDestroy } from "svelte";

  import mode from "../stores/mode";
  import theme from "../stores/theme";

  let isDark = prefersDarkMode.matches;
  const updateDark = e => {
    isDark = e.matches;
  };

  onMount(() => {
    prefersDarkMode.addEventListener("change", updateDark);
  });

  onDestroy(() => {
    prefersDarkMode.removeEventListener("change", updateDark);
  });

  $: iconName = $theme === "light"
              ? lightIcon
              : $theme === "dark"
              ? darkIcon
              : isDark ? darkIcon : lightIcon;

  function switchTheme() {
    if ($theme === "light") {
      $theme = "dark";
    } else if ($theme === "dark") {
      $theme = "light";
    } else {
      $theme = isDark ? "light" : "dark";
    }
  }
</script>

<header>
  <h1>
    <a href="https://esbuild.github.io" target="_blank" rel="noreferrer">esbuild</a>
    <span>.</span>
    <a href="https://github.com/hyrious/esbuild-repl" target="_blank" rel="noreferrer">repl</a>
  </h1>
  <nav on:change={(ev) => ($mode = ev.target.value)}>
    <input name="mode" id="mode-transform" value="transform" type="radio" checked={$mode === "transform"} />
    <label for="mode-transform">Transform</label>
    <input name="mode" id="mode-build" value="build" type="radio" checked={$mode === "build"} />
    <label for="mode-build">Build</label>
  </nav>
  <i on:click={switchTheme} class="i mdi:{iconName}" title="theme: {$theme}"></i>
</header>

<style>
  header {
    padding: calc(var(--gap) * 2) var(--gap) var(--gap);
    display: flex;
    align-items: center;
  }
  header a {
    text-decoration: none;
  }
  header a:hover {
    color: var(--fg-on);
    text-decoration: underline;
  }
  h1 {
    margin: 0;
    padding: 0 var(--gap) 0 calc(var(--gap) * 2);
    display: inline-flex;
    font-size: 16px;
  }
  nav {
    flex-grow: 1;
    display: inline-flex;
  }
  label {
    position: relative;
    text-align: center;
    user-select: none;
    cursor: pointer;
  }
  label:hover {
    text-decoration: underline;
  }
  label[for="mode-transform"] {
    min-width: 90px;
  }
  label[for="mode-build"] {
    min-width: 50px;
  }
  input[type="radio"] {
    display: none;
  }
  input[type="radio"]:checked + label {
    color: var(--fg-on);
    font-weight: bold;
  }
  i {
    color: currentColor;
    padding: 0 calc(var(--gap) * 2) 0 var(--gap);
    cursor: pointer;
  }
  @media screen and (max-width: 720px) {
    header {
      padding: var(--gap) var(--gap) 0;
    }
    h1 {
      display: none;
    }
  }
</style>
